import express from 'express';
import { exportarPrompts } from '../controladores/exportacionControlador.js';
import { autenticacionMiddleware } from '../middleware/autenticacionMiddleware.js';

const router = express.Router();

router.use(autenticacionMiddleware);
router.get('/', exportarPrompts);

export default router;
