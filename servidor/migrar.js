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
    console.log('🚀 Iniciando creación de base de datos...\n');
    
    // Leer archivo de schema
    const schemaPath = path.join(__dirname, '..', 'base-datos', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Ejecutando schema completo: schema.sql');
    console.log('⏳ Esto puede tomar unos segundos...\n');
    
    // Ejecutar schema
    await client.query(sql);
    
    console.log('✅ Schema creado exitosamente\n');
    
    // Verificar tablas creadas
    const tablas = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);
    
    console.log('📊 Tablas creadas:');
    tablas.rows.forEach(row => {
      console.log(`   ✓ ${row.tablename}`);
    });
    
    // Verificar vistas
    const vistas = await client.query(`
      SELECT viewname 
      FROM pg_views 
      WHERE schemaname = 'public'
      ORDER BY viewname;
    `);
    
    if (vistas.rows.length > 0) {
      console.log('\n📈 Vistas creadas:');
      vistas.rows.forEach(row => {
        console.log(`   ✓ ${row.viewname}`);
      });
    }
    
    // Verificar funciones
    const funciones = await client.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_type = 'FUNCTION'
      ORDER BY routine_name;
    `);
    
    if (funciones.rows.length > 0) {
      console.log('\n⚙️  Funciones creadas:');
      funciones.rows.forEach(row => {
        console.log(`   ✓ ${row.routine_name}()`);
      });
    }
    
    // Verificar índices
    const indices = await client.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('usuarios', 'prompts', 'categorias')
      ORDER BY indexname;
    `);
    
    console.log(`\n🔍 Índices creados: ${indices.rows.length}`);
    
    console.log('\n✨ ¡Base de datos lista para usar!');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Configura las variables de entorno en servidor/.env');
    console.log('   2. Inicia el servidor: cd servidor && npm run dev');
    console.log('   3. Inicia el cliente: cd cliente && npm run dev');
    
  } catch (error) {
    console.error('❌ Error durante la creación del schema:', error.message);
    console.error('\n📋 Detalles del error:');
    console.error(error);
    console.error('\n💡 Sugerencias:');
    console.error('   - Verifica que PostgreSQL esté corriendo');
    console.error('   - Verifica las credenciales en servidor/.env');
    console.error('   - Verifica que la base de datos exista');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar
ejecutarMigracion();
