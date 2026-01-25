import jwt from 'jsonwebtoken';
import pool from '../config/baseDatos.js';

export const autenticacionMiddleware = async (req, res, next) => {
  try {
    const encabezadoAuth = req.headers.authorization;
    
    if (!encabezadoAuth || !encabezadoAuth.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'SIN_TOKEN',
        mensaje: 'Token de autenticación requerido' 
      });
    }
    
    const token = encabezadoAuth.split(' ')[1];
    
    let decodificado;
    try {
      decodificado = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'TOKEN_EXPIRADO',
          mensaje: 'Sesión expirada. Inicia sesión nuevamente' 
        });
      }
      
      return res.status(401).json({ 
        error: 'TOKEN_INVALIDO',
        mensaje: 'Token inválido' 
      });
    }
    
    // Verificar que el usuario existe y está verificado
    const resultado = await pool.query(
      'SELECT id, email, esta_verificado FROM usuarios WHERE id = $1',
      [decodificado.usuarioId]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(401).json({ 
        error: 'USUARIO_NO_ENCONTRADO',
        mensaje: 'Usuario no encontrado' 
      });
    }
    
    if (!resultado.rows[0].esta_verificado) {
      return res.status(403).json({ 
        error: 'USUARIO_NO_VERIFICADO',
        mensaje: 'Usuario no verificado' 
      });
    }
    
    req.usuario = resultado.rows[0];
    next();
  } catch (error) {
    console.error('Error en autenticacionMiddleware:', error);
    return res.status(500).json({ 
      error: 'ERROR_AUTENTICACION',
      mensaje: 'Error de autenticación' 
    });
  }
};
