import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

// Usando la lógica segura que ya implementamos
let config = {
    connectionTimeoutMillis: 5000,
};

if (process.env.DATABASE_URL) {
    try {
        const url = new URL(process.env.DATABASE_URL);
        config.user = url.username;
        config.password = String(url.password);
        config.host = url.hostname;
        config.port = url.port;
        config.database = url.pathname.split('/')[1];
    } catch (e) {
        config.connectionString = process.env.DATABASE_URL;
    }
}

const pool = new Pool(config);

async function inspeccionarUsuarios() {
    console.log('--- INSPECCIONANDO USUARIOS ---');
    try {
        const res = await pool.query('SELECT id, email, token_verificacion, esta_verificado, expira_token_verificacion FROM usuarios ORDER BY id DESC LIMIT 5');

        if (res.rows.length === 0) {
            console.log('No hay usuarios registrados.');
        } else {
            console.log('Últimos usuarios registrados:');
            res.rows.forEach(u => {
                console.log(`\nID: ${u.id}`);
                console.log(`Email: ${u.email}`);
                console.log(`Verificado: ${u.esta_verificado}`);
                console.log(`Token: ${u.token_verificacion}`);
                console.log(`Expira: ${u.expira_token_verificacion}`);
            });
        }
    } catch (err) {
        console.error('Error consultando:', err);
    } finally {
        pool.end();
    }
}

inspeccionarUsuarios();
