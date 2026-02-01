import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/baseDatos.js';
import { enviarEmailVerificacion, enviarEmailReseteoContrasena } from '../servicios/emailServicio.js';

const RONDAS_SALT = 12;

// Registro de usuario
export const registrar = async (req, res) => {
  const cliente = await pool.connect();

  try {
    const { email, contrasena, nombre } = req.body;

    // Validar formato de email
    const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!regexEmail.test(email)) {
      return res.status(400).json({
        error: 'EMAIL_INVALIDO',
        mensaje: 'Formato de email inválido'
      });
    }

    // Validar nombre de usuario
    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({
        error: 'NOMBRE_REQUERIDO',
        mensaje: 'El nombre de usuario es requerido'
      });
    }

    const regexNombreUsuario = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    if (!regexNombreUsuario.test(nombre)) {
      if (nombre.length < 3) {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario debe tener al menos 3 caracteres'
        });
      } else if (nombre.length > 20) {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario no puede tener más de 20 caracteres'
        });
      } else if (!/^[a-zA-Z]/.test(nombre)) {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario debe comenzar con una letra'
        });
      } else {
        return res.status(400).json({
          error: 'NOMBRE_INVALIDO',
          mensaje: 'El nombre de usuario solo puede contener letras, números, guiones (-) y guiones bajos (_)'
        });
      }
    }

    // Validar contraseña
    if (contrasena.length < 8) {
      return res.status(400).json({
        error: 'CONTRASENA_DEBIL',
        mensaje: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    if (!/[A-Z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      return res.status(400).json({
        error: 'CONTRASENA_DEBIL',
        mensaje: 'La contraseña debe contener al menos una mayúscula y un número'
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await cliente.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'EMAIL_EXISTE',
        mensaje: 'Este email ya está registrado'
      });
    }

    // Hashear contraseña
    const hashContrasena = await bcrypt.hash(contrasena, RONDAS_SALT);

    // Generar token de verificación
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    const expiraToken = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Iniciar transacción
    await cliente.query('BEGIN');

    // Crear usuario
    const resultado = await cliente.query(
      `INSERT INTO usuarios (email, hash_contrasena, nombre, token_verificacion, expira_token_verificacion)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, nombre, creado_en`,
      [email.toLowerCase(), hashContrasena, nombre, tokenVerificacion, expiraToken]
    );

    const nuevoUsuario = resultado.rows[0];

    // Enviar email de verificación
    const resultadoEmail = await enviarEmailVerificacion(email, tokenVerificacion);

    if (!resultadoEmail.exito) {
      // Si falla el email, hacer rollback
      await cliente.query('ROLLBACK');
      return res.status(500).json({
        error: 'ENVIO_EMAIL_FALLO',
        mensaje: 'Error al enviar email de verificación. Intenta nuevamente.'
      });
    }

    // Commit de la transacción
    await cliente.query('COMMIT');

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.',
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre
      }
    });

  } catch (error) {
    await cliente.query('ROLLBACK');
    console.error('Error en registrar:', error);

    // Manejar error de constraint único (race condition)
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'EMAIL_EXISTE',
        mensaje: 'Este email ya está registrado'
      });
    }

    res.status(500).json({
      error: 'REGISTRO_FALLO',
      mensaje: 'Error al registrar usuario'
    });
  } finally {
    cliente.release();
  }
};

// Verificar email
export const verificarEmail = async (req, res) => {
  try {
    const { token } = req.body;

    console.log('📧 Intento de verificación de email:', { 
      tokenRecibido: token ? 'Sí' : 'No',
      longitudToken: token?.length 
    });

    if (!token) {
      console.log('❌ Token no proporcionado');
      return res.status(400).json({
        error: 'TOKEN_REQUERIDO',
        mensaje: 'Token de verificación requerido'
      });
    }

    const resultado = await pool.query(
      `UPDATE usuarios 
       SET esta_verificado = true, 
           token_verificacion = NULL, 
           expira_token_verificacion = NULL
       WHERE token_verificacion = $1 
         AND expira_token_verificacion > NOW()
         AND esta_verificado = false
       RETURNING id, email`,
      [token]
    );

    if (resultado.rows.length === 0) {
      console.log('⚠️ No se pudo verificar, buscando razón...');
      
      // Verificar por qué falló
      const usuario = await pool.query(
        'SELECT esta_verificado, expira_token_verificacion FROM usuarios WHERE token_verificacion = $1',
        [token]
      );

      if (usuario.rows.length === 0) {
        console.log('❌ Token no encontrado en BD');
        return res.status(404).json({
          error: 'TOKEN_INVALIDO',
          mensaje: 'Token de verificación inválido'
        });
      }

      if (usuario.rows[0].esta_verificado) {
        console.log('✅ Usuario ya verificado');
        return res.status(400).json({
          error: 'YA_VERIFICADO',
          mensaje: 'Este email ya está verificado'
        });
      }

      console.log('⏰ Token expirado');
      return res.status(410).json({
        error: 'TOKEN_EXPIRADO',
        mensaje: 'Token expirado. Solicita uno nuevo',
        accion: 'REENVIAR_VERIFICACION'
      });
    }

    console.log('✅ Email verificado exitosamente:', resultado.rows[0].email);
    res.json({
      mensaje: 'Email verificado exitosamente. Ya puedes iniciar sesión.',
      email: resultado.rows[0].email
    });

  } catch (error) {
    console.error('❌ Error en verificarEmail:', error);
    res.status(500).json({
      error: 'VERIFICACION_FALLO',
      mensaje: 'Error al verificar email'
    });
  }
};

// Login
export const iniciarSesion = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({
        error: 'CREDENCIALES_FALTANTES',
        mensaje: 'Email y contraseña son requeridos'
      });
    }

    const resultado = await pool.query(
      'SELECT id, email, hash_contrasena, esta_verificado, nombre FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        error: 'CREDENCIALES_INVALIDAS',
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    const usuario = resultado.rows[0];

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.hash_contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({
        error: 'CREDENCIALES_INVALIDAS',
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    if (!usuario.esta_verificado) {
      return res.status(403).json({
        error: 'EMAIL_NO_VERIFICADO',
        mensaje: 'Debes verificar tu email antes de iniciar sesión',
        accion: 'REENVIAR_VERIFICACION'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { usuarioId: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    });

  } catch (error) {
    console.error('Error en iniciarSesion:', error);
    res.status(500).json({
      error: 'LOGIN_FALLO',
      mensaje: 'Error al iniciar sesión'
    });
  }
};

// Reenviar email de verificación
export const reenviarVerificacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'EMAIL_REQUERIDO',
        mensaje: 'Email es requerido'
      });
    }

    const resultado = await pool.query(
      'SELECT id, esta_verificado, expira_token_verificacion FROM usuarios WHERE email = $1',
      [email.toLowerCase()]
    );

    if (resultado.rows.length === 0) {
      // No revelar si el email existe
      return res.status(200).json({
        mensaje: 'Si el email existe, recibirás un nuevo enlace de verificación'
      });
    }

    const usuario = resultado.rows[0];

    if (usuario.esta_verificado) {
      return res.status(400).json({
        error: 'YA_VERIFICADO',
        mensaje: 'Este email ya está verificado'
      });
    }

    // Rate limiting: no más de 1 email cada 5 minutos
    const ultimoEnviado = usuario.expira_token_verificacion;
    if (ultimoEnviado) {
      const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);
      const tokenCreado = new Date(ultimoEnviado.getTime() - 24 * 60 * 60 * 1000);

      if (tokenCreado > cincoMinutosAtras) {
        return res.status(429).json({
          error: 'DEMASIADAS_SOLICITUDES',
          mensaje: 'Espera 5 minutos antes de solicitar otro email'
        });
      }
    }

    // Generar nuevo token
    const nuevoToken = crypto.randomBytes(32).toString('hex');
    const expiraEn = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      'UPDATE usuarios SET token_verificacion = $1, expira_token_verificacion = $2 WHERE id = $3',
      [nuevoToken, expiraEn, usuario.id]
    );

    await enviarEmailVerificacion(email, nuevoToken);

    res.json({ mensaje: 'Email de verificación enviado' });

  } catch (error) {
    console.error('Error en reenviarVerificacion:', error);
    res.status(500).json({
      error: 'REENVIO_FALLO',
      mensaje: 'Error al reenviar email'
    });
  }
};

// Obtener usuario actual
export const obtenerUsuarioActual = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, email, nombre, creado_en FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'USUARIO_NO_ENCONTRADO',
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({ usuario: resultado.rows[0] });

  } catch (error) {
    console.error('Error en obtenerUsuarioActual:', error);
    res.status(500).json({
      error: 'OBTENER_USUARIO_FALLO',
      mensaje: 'Error al obtener usuario'
    });
  }
};
