import jwt from 'jsonwebtoken';

// Callback de Google OAuth
export const googleCallback = (req, res) => {
  try {
    const usuario = req.user;

    if (!usuario) {
      return res.redirect(`${process.env.FRONTEND_URL}/iniciar-sesion?error=auth_failed`);
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        usuarioId: usuario.id, 
        email: usuario.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Redirigir al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Error en googleCallback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/iniciar-sesion?error=server_error`);
  }
};

// Obtener usuario actual (reutilizable)
export const obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = {
      id: req.usuario.id,
      email: req.usuario.email,
      nombre: req.usuario.nombre,
      avatarUrl: req.usuario.avatar_url,
      proveedorAuth: req.usuario.proveedor_auth
    };

    res.json({ usuario });
  } catch (error) {
    console.error('Error en obtenerUsuarioActual:', error);
    res.status(500).json({
      error: 'OBTENER_USUARIO_FALLO',
      mensaje: 'Error al obtener usuario'
    });
  }
};
