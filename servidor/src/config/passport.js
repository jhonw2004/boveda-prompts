import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import pool from './baseDatos.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const nombre = profile.displayName;
        const avatarUrl = profile.photos[0]?.value || null;

        // Buscar usuario existente por google_id
        let resultado = await pool.query(
          'SELECT * FROM usuarios WHERE google_id = $1',
          [googleId]
        );

        let usuario;

        if (resultado.rows.length > 0) {
          // Usuario existe, actualizar datos si es necesario
          usuario = resultado.rows[0];
          
          await pool.query(
            `UPDATE usuarios 
             SET nombre = $1, avatar_url = $2, actualizado_en = NOW()
             WHERE id = $3`,
            [nombre, avatarUrl, usuario.id]
          );
        } else {
          // Verificar si existe usuario con ese email (migración de local a OAuth)
          resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
          );

          if (resultado.rows.length > 0) {
            // Usuario existe con email, vincular con Google
            usuario = resultado.rows[0];
            
            await pool.query(
              `UPDATE usuarios 
               SET google_id = $1, 
                   proveedor_auth = 'google', 
                   avatar_url = $2,
                   esta_verificado = true,
                   actualizado_en = NOW()
               WHERE id = $3`,
              [googleId, avatarUrl, usuario.id]
            );
          } else {
            // Crear nuevo usuario
            resultado = await pool.query(
              `INSERT INTO usuarios (
                email, 
                nombre, 
                google_id, 
                avatar_url, 
                proveedor_auth, 
                esta_verificado
              )
              VALUES ($1, $2, $3, $4, 'google', true)
              RETURNING *`,
              [email, nombre, googleId, avatarUrl]
            );
            
            usuario = resultado.rows[0];
          }
        }

        return done(null, usuario);
      } catch (error) {
        console.error('Error en estrategia de Google:', error);
        return done(error, null);
      }
    }
  )
);

// Serializar usuario (guardar en sesión)
passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

// Deserializar usuario (recuperar de sesión)
passport.deserializeUser(async (id, done) => {
  try {
    const resultado = await pool.query(
      'SELECT id, email, nombre, avatar_url, proveedor_auth FROM usuarios WHERE id = $1',
      [id]
    );
    done(null, resultado.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
