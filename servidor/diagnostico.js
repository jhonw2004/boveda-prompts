import pg from 'pg';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

console.log('--- INICIANDO DIAGNÓSTICO ---');
console.log(`DATABASE_URL detectada: ${process.env.DATABASE_URL ? 'DEFINIDA' : 'NO DEFINIDA'}`);

// 1. Probar Conexión a Base de Datos
async function probarBaseDatos() {
    console.log('\n1. Probando conexión a Base de Datos...');

    let config = {
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000,
    };

    // Aplicar el mismo parche que en el código principal
    if (process.env.DATABASE_URL) {
        try {
            const url = new URL(process.env.DATABASE_URL);
            if (url.password && !isNaN(url.password)) {
                config.password = String(url.password);
                console.log('   (Parche de contraseña numérica aplicado)');
            }
        } catch (e) {
            console.log('   (No se pudo analizar la URL para el parche)');
        }
    }

    const pool = new Pool(config);

    try {
        const client = await pool.connect();
        console.log('   ✅ Conexión exitosa a PostgreSQL');

        // Verificar tabla usuarios
        try {
            const res = await client.query("SELECT to_regclass('public.usuarios')");
            if (res.rows[0].to_regclass) {
                console.log('   ✅ Tabla "usuarios" existe');
            } else {
                console.log('   ❌ ERROR: La tabla "usuarios" NO existe. Debes ejecutar las migraciones.');
            }
        } catch (err) {
            console.log('   ❌ Error verificando tablas:', err.message);
        }

        client.release();
    } catch (err) {
        console.log('   ❌ ERROR DE CONEXIÓN A BD:', err.message);
        if (err.message.includes('password')) {
            console.log('   💡 SUGERENCIA: Verifica tu contraseña en .env');
        }
        if (err.message.includes('database')) {
            console.log('   💡 SUGERENCIA: Verifica que la base de datos "boveda_prompts" exista');
        }
    } finally {
        await pool.end();
    }
}

// 2. Probar Configuración de Email
async function probarEmail() {
    console.log('\n2. Probando configuración de Email...');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        await transporter.verify();
        console.log('   ✅ Conexión SMTP exitosa (Credenciales correctas)');
    } catch (err) {
        console.log('   ❌ ERROR SMTP:', err.message);
        console.log('   💡 SUGERENCIA: Verifica tu EMAIL_USER y EMAIL_PASSWORD.');
        if (err.message.includes('Username and Password not accepted')) {
            console.log('      Asegúrate de usar la "Contraseña de Aplicación" de Google, no tu contraseña normal.');
        }
    }
}

async function ejecutar() {
    await probarBaseDatos();
    await probarEmail();
    console.log('\n--- DIAGNÓSTICO FINALIZADO ---');
    process.exit(0);
}

ejecutar();
