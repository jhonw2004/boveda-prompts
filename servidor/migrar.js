import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function ejecutarMigracion() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando migración de base de datos...\n');
    
    // Leer archivo de migración
    const migracionPath = path.join(__dirname, '..', 'base-datos', 'migraciones', '002_agregar_papelera.sql');
    const sql = fs.readFileSync(migracionPath, 'utf8');
    
    console.log('📄 Ejecutando migración: 002_agregar_papelera.sql');
    
    // Ejecutar migración
    await client.query(sql);
    
    console.log('✅ Migración completada exitosamente\n');
    
    // Verificar cambios
    const resultado = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'prompts' 
      AND column_name IN ('eliminado', 'eliminado_en')
      ORDER BY column_name;
    `);
    
    console.log('📊 Columnas agregadas:');
    resultado.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    // Contar prompts
    const conteo = await client.query('SELECT COUNT(*) as total FROM prompts WHERE eliminado = false');
    console.log(`\n📈 Total de prompts activos: ${conteo.rows[0].total}`);
    
    console.log('\n✨ ¡Migración completada! Tu base de datos está lista.');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar
ejecutarMigracion();
