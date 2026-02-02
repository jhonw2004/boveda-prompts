import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  registrar, 
  iniciarSesion, 
  obtenerUsuarioActual 
} from '../controladores/autenticacionControlador.js';
import { autenticacionMiddleware } from '../middleware/autenticacionMiddleware.js';

const router = express.Router();

// Rate limiters
const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { 
    error: 'DEMASIADAS_SOLICITUDES', 
    mensaje: 'Demasiados intentos, intenta en 15 minutos' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => false,
  validate: { xForwardedForHeader: false }
});

// Rutas públicas
router.post('/registrar', limitadorAuth, registrar);
router.post('/iniciar-sesion', limitadorAuth, iniciarSesion);

// Rutas protegidas
router.get('/yo', autenticacionMiddleware, obtenerUsuarioActual);

export default router;
