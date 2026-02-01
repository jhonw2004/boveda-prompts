import express from 'express';
import { 
  crearPrompt, 
  obtenerPrompts, 
  obtenerPromptPorId, 
  actualizarPrompt, 
  eliminarPrompt,
  restaurarPrompt,
  vaciarPapelera,
  obtenerEstadisticas 
} from '../controladores/promptsControlador.js';
import { autenticacionMiddleware } from '../middleware/autenticacionMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(autenticacionMiddleware);

router.post('/', crearPrompt);
router.get('/', obtenerPrompts);
router.get('/estadisticas', obtenerEstadisticas);
router.get('/:id', obtenerPromptPorId);
router.put('/:id', actualizarPrompt);
router.patch('/:id', actualizarPrompt);
router.delete('/:id', eliminarPrompt);
router.post('/:id/restaurar', restaurarPrompt);
router.delete('/papelera/vaciar', vaciarPapelera);

export default router;
