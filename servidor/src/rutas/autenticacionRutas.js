import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  registrar, 
  iniciarSesion, 
  verificarEmail, 
  reenviarVerificacion, 
  obtenerUsuarioActual 
} from '../controladores/autenticacionControlador.js';
import { autenticacionMiddleware } from '../middleware/autenticacionMiddleware.js';

const router = express.Router();

// Rate limiters
const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: { 
    error: 'DEMASIADAS_SOLICITUDES', 
    mensaje: 'Demasiados intentos, intenta en 15 minutos' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Configuración para Render
  skip: (req) => false,
  validate: { xForwardedForHeader: false }
});

const limitadorVerificacion = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // Aumentado de 3 a 10
  message: { 
    error: 'DEMASIADAS_SOLICITUDES', 
    mensaje: 'Demasiados intentos, intenta en 5 minutos' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Configuración para Render
  skip: (req) => false,
  validate: { xForwardedForHeader: false },
  handler: (req, res) => {
    res.status(429).json({
      error: 'DEMASIADAS_SOLICITUDES',
      mensaje: 'Demasiados intentos de verificación. Espera 5 minutos.'
    });
  }
});

// Rutas públicas
router.post('/registrar', limitadorAuth, registrar);
router.post('/iniciar-sesion', limitadorAuth, iniciarSesion);
router.post('/verificar-email', limitadorVerificacion, verificarEmail);
router.post('/reenviar-verificacion', limitadorVerificacion, reenviarVerificacion);

// Rutas protegidas
router.get('/yo', autenticacionMiddleware, obtenerUsuarioActual);

export default router;
