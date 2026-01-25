import pg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno inmediatamente
dotenv.config();

const { Pool } = pg;

// Parsear manualmente para asegurar que la contraseña sea string
// Esto soluciona el error "client password must be a string" con contraseñas numéricas
// Parche robusto: Descomponer la URL para evitar que 'pg' interprete la contraseña como número
let config = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);

    config.user = url.username;
    // FORZAR CONTRASEÑA A STRING AQUÍ:
    config.password = String(url.password);
    config.host = url.hostname;
    config.port = url.port;
    config.database = url.pathname.split('/')[1];

    console.log('🔧 Configuración de BD parseada manual correctamentee');
  } catch (e) {
    console.warn('⚠️ Falló el parseo manual, usando connectionString directa');
    config.connectionString = process.env.DATABASE_URL;
  }
} else {
  console.error('❌ FATAL: DATABASE_URL no está definida');
}

const pool = new Pool(config);

// Test de conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err);
  process.exit(-1);
});

export default pool;
