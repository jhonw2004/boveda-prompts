#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verificando instalación del proyecto Bóveda de Prompts...\n');

const verificaciones = [];

// Verificar estructura de carpetas
const carpetasRequeridas = [
  'servidor/src/config',
  'servidor/src/controladores',
  'servidor/src/middleware',
  'servidor/src/rutas',
  'servidor/src/servicios',
  'servidor/src/utilidades',
  'cliente/src/componentes',
  'cliente/src/servicios',
  'cliente/src/contexto',
  'base-datos/migraciones'
];

console.log('📁 Verificando estructura de carpetas...');
carpetasRequeridas.forEach(carpeta => {
  const existe = existsSync(carpeta);
  verificaciones.push({ nombre: carpeta, estado: existe });
  console.log(`  ${existe ? '✅' : '❌'} ${carpeta}`);
});

// Verificar archivos clave del servidor
console.log('\n📄 Verificando archivos del servidor...');
const archivosServidor = [
  'servidor/package.json',
  'servidor/.env',
  'servidor/src/servidor.js',
  'servidor/src/config/baseDatos.js',
  'servidor/src/controladores/autenticacionControlador.js',
  'servidor/src/controladores/promptsControlador.js',
  'servidor/src/controladores/exportacionControlador.js'
];

archivosServidor.forEach(archivo => {
  const existe = existsSync(archivo);
  verificaciones.push({ nombre: archivo, estado: existe });
  console.log(`  ${existe ? '✅' : '❌'} ${archivo}`);
});

// Verificar archivos clave del cliente
console.log('\n📄 Verificando archivos del cliente...');
const archivosCliente = [
  'cliente/package.json',
  'cliente/.env',
  'cliente/vite.config.js',
  'cliente/src/servicios/api.js',
  'cliente/src/servicios/autenticacionServicio.js',
  'cliente/src/contexto/AutenticacionContexto.jsx'
];

archivosCliente.forEach(archivo => {
  const existe = existsSync(archivo);
  verificaciones.push({ nombre: archivo, estado: existe });
  console.log(`  ${existe ? '✅' : '❌'} ${archivo}`);
});

// Verificar dependencias del servidor
console.log('\n📦 Verificando dependencias del servidor...');
try {
  const packageJson = JSON.parse(readFileSync('servidor/package.json', 'utf8'));
  const dependenciasRequeridas = [
    'express',
    'pg',
    'bcrypt',
    'jsonwebtoken',
    'dotenv',
    'cors',
    'helmet',
    'express-rate-limit',
    'nodemailer'
  ];
  
  dependenciasRequeridas.forEach(dep => {
    const instalada = packageJson.dependencies && packageJson.dependencies[dep];
    verificaciones.push({ nombre: `servidor: ${dep}`, estado: !!instalada });
    console.log(`  ${instalada ? '✅' : '❌'} ${dep}`);
  });
} catch (error) {
  console.log('  ❌ Error leyendo package.json del servidor');
}

// Verificar dependencias del cliente
console.log('\n📦 Verificando dependencias del cliente...');
try {
  const packageJson = JSON.parse(readFileSync('cliente/package.json', 'utf8'));
  const dependenciasRequeridas = [
    'react',
    'react-dom',
    'react-router-dom',
    'axios',
    'tailwindcss',
    '@tailwindcss/vite'
  ];
  
  dependenciasRequeridas.forEach(dep => {
    const instalada = (packageJson.dependencies && packageJson.dependencies[dep]) ||
                      (packageJson.devDependencies && packageJson.devDependencies[dep]);
    verificaciones.push({ nombre: `cliente: ${dep}`, estado: !!instalada });
    console.log(`  ${instalada ? '✅' : '❌'} ${dep}`);
  });
} catch (error) {
  console.log('  ❌ Error leyendo package.json del cliente');
}

// Verificar archivos de base de datos
console.log('\n🗄️  Verificando archivos de base de datos...');
const archivosBD = [
  'base-datos/migraciones/001_schema_inicial.sql'
];

archivosBD.forEach(archivo => {
  const existe = existsSync(archivo);
  verificaciones.push({ nombre: archivo, estado: existe });
  console.log(`  ${existe ? '✅' : '❌'} ${archivo}`);
});

// Resumen
console.log('\n' + '='.repeat(60));
const total = verificaciones.length;
const exitosos = verificaciones.filter(v => v.estado).length;
const fallidos = total - exitosos;

console.log(`\n📊 Resumen:`);
console.log(`  Total de verificaciones: ${total}`);
console.log(`  ✅ Exitosas: ${exitosos}`);
console.log(`  ❌ Fallidas: ${fallidos}`);

if (fallidos === 0) {
  console.log('\n🎉 ¡Instalación completa! Todo está correctamente configurado.');
  console.log('\n📝 Próximos pasos:');
  console.log('  1. Configurar PostgreSQL y crear la base de datos');
  console.log('  2. Ejecutar la migración SQL');
  console.log('  3. Configurar las variables de entorno (.env)');
  console.log('  4. Iniciar el servidor: cd servidor && npm run dev');
  console.log('  5. Iniciar el cliente: cd cliente && npm run dev');
} else {
  console.log('\n⚠️  Hay algunos problemas con la instalación.');
  console.log('Revisa los elementos marcados con ❌ arriba.');
}

console.log('\n' + '='.repeat(60));
