import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/baseDatos.js';

dotenv.config();

const app = express();
const PUERTO = process.env.PUERTO || 5000;

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Middlewares de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    estado: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Importar rutas
import rutasAutenticacion from './rutas/autenticacionRutas.js';
import rutasPrompts from './rutas/promptsRutas.js';
import rutasExportacion from './rutas/exportacionRutas.js';

// Rutas
app.use('/api/auth', rutasAutenticacion);
app.use('/api/prompts', rutasPrompts);
app.use('/api/exportar', rutasExportacion);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PUERTO, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV}`);
});

export default app;
