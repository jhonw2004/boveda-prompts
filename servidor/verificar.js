import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function verificarSistema() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verificando sistema...\n');
    
    // 1. Verificar conexión
    console.log('✓ Conexión a base de datos: OK');
    
    // 2. Verificar columnas de papelera
    const columnas = await client.query(`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_name = 'prompts' 
      AND column_name IN ('eliminado', 'eliminado_en')
    `);
    
    if (columnas.rows.length === 2) {
      console.log('✓ Columnas de papelera: OK');
    } else {
      console.log('✗ Columnas de papelera: FALTA MIGRACIÓN');
      console.log('  Ejecuta: npm run migrar');
      process.exit(1);
    }
    
    // 3. Verificar índices
    const indices = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'prompts' 
      AND indexname = 'idx_prompts_eliminado'
    `);
    
    if (indices.rows.length > 0) {
      console.log('✓ Índices optimizados: OK');
    } else {
      console.log('⚠ Índices: FALTA idx_prompts_eliminado');
    }
    
    // 4. Contar prompts
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN eliminado = false THEN 1 END) as activos,
        COUNT(CASE WHEN eliminado = true THEN 1 END) as eliminados
      FROM prompts
    `);
    
    const { total, activos, eliminados } = stats.rows[0];
    
    console.log('\n📊 Estadísticas:');
    console.log(`   Total de prompts: ${total}`);
    console.log(`   Activos: ${activos}`);
    console.log(`   En papelera: ${eliminados}`);
    
    // 5. Verificar usuarios
    const usuarios = await client.query('SELECT COUNT(*) as total FROM usuarios');
    console.log(`   Usuarios registrados: ${usuarios.rows[0].total}`);
    
    console.log('\n✅ Sistema verificado correctamente');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Inicia el servidor: npm run dev');
    console.log('   2. Inicia el cliente: cd ../cliente && npm run dev');
    console.log('   3. Abre http://localhost:5173');
    
  } catch (error) {
    console.error('\n❌ Error durante la verificación:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

verificarSistema();
