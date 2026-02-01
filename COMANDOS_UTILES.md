# 🛠️ Comandos Útiles

## 🚀 Inicio Rápido

### Primera vez
```bash
# 1. Instalar dependencias
cd servidor && npm install
cd ../cliente && npm install

# 2. Migrar base de datos
cd ../servidor && npm run migrar

# 3. Verificar sistema
npm run verificar

# 4. Iniciar servicios
npm run dev
# En otra terminal:
cd ../cliente && npm run dev
```

### Uso diario
```bash
# Terminal 1 - Servidor
cd servidor && npm run dev

# Terminal 2 - Cliente
cd cliente && npm run dev
```

---

## 📦 NPM Scripts

### Servidor
```bash
cd servidor

# Desarrollo con hot-reload
npm run dev

# Producción
npm start

# Migrar base de datos
npm run migrar

# Verificar sistema
npm run verificar
```

### Cliente
```bash
cd cliente

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

---

## 🗄️ Base de Datos

### Conexión
```bash
# Conectar a PostgreSQL
psql -U tu_usuario -d boveda_prompts

# Conectar con URL
psql postgresql://usuario:password@localhost:5432/boveda_prompts
```

### Migraciones
```bash
# Ejecutar migración inicial
psql -U tu_usuario -d boveda_prompts -f base-datos/migraciones/001_schema_inicial.sql

# Ejecutar migración de papelera
psql -U tu_usuario -d boveda_prompts -f base-datos/migraciones/002_agregar_papelera.sql

# O usar el script automatizado
cd servidor && npm run migrar
```

### Consultas Útiles
```sql
-- Ver todas las tablas
\dt

-- Ver estructura de tabla
\d prompts

-- Contar prompts activos
SELECT COUNT(*) FROM prompts WHERE eliminado = false;

-- Contar prompts en papelera
SELECT COUNT(*) FROM prompts WHERE eliminado = true;

-- Ver prompts recientes
SELECT id, titulo, creado_en FROM prompts 
WHERE eliminado = false 
ORDER BY creado_en DESC 
LIMIT 10;

-- Limpiar papelera (más de 30 días)
DELETE FROM prompts 
WHERE eliminado = true 
AND eliminado_en < NOW() - INTERVAL '30 days';

-- Restaurar todos los prompts de papelera
UPDATE prompts 
SET eliminado = false, eliminado_en = NULL 
WHERE eliminado = true;

-- Ver estadísticas por usuario
SELECT 
  u.email,
  COUNT(p.id) as total_prompts,
  COUNT(CASE WHEN p.eliminado = false THEN 1 END) as activos,
  COUNT(CASE WHEN p.eliminado = true THEN 1 END) as en_papelera
FROM usuarios u
LEFT JOIN prompts p ON u.id = p.usuario_id
GROUP BY u.email;
```

### Backup y Restore
```bash
# Backup completo
pg_dump -U tu_usuario boveda_prompts > backup_$(date +%Y%m%d).sql

# Backup solo datos
pg_dump -U tu_usuario --data-only boveda_prompts > backup_data_$(date +%Y%m%d).sql

# Restore
psql -U tu_usuario boveda_prompts < backup_20260201.sql

# Backup de tabla específica
pg_dump -U tu_usuario -t prompts boveda_prompts > backup_prompts.sql
```

---

## 🐛 Debugging

### Ver logs del servidor
```bash
cd servidor
npm run dev
# Los logs aparecerán en la terminal
```

### Ver logs de PostgreSQL
```bash
# Linux/Mac
tail -f /var/log/postgresql/postgresql-14-main.log

# Windows
# Ver en: C:\Program Files\PostgreSQL\14\data\log\
```

### Limpiar caché
```bash
# Cliente
cd cliente
rm -rf node_modules .vite dist
npm install

# Servidor
cd servidor
rm -rf node_modules
npm install
```

### Reiniciar PostgreSQL
```bash
# Linux
sudo systemctl restart postgresql

# Mac
brew services restart postgresql

# Windows
# Services → PostgreSQL → Restart
```

---

## 🧪 Testing

### Probar endpoints con curl
```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/registrarse \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","nombre":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/iniciar-sesion \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Obtener prompts (requiere token)
curl http://localhost:5000/api/prompts \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Crear prompt
curl -X POST http://localhost:5000/api/prompts \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Test","contenido":"Contenido de prueba"}'

# Obtener papelera
curl http://localhost:5000/api/prompts?eliminado=true \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔧 Mantenimiento

### Limpiar papelera automáticamente
```bash
# Crear cron job (Linux/Mac)
crontab -e

# Agregar línea (ejecuta diariamente a las 2 AM):
0 2 * * * psql -U tu_usuario -d boveda_prompts -c "DELETE FROM prompts WHERE eliminado = true AND eliminado_en < NOW() - INTERVAL '30 days';"
```

### Optimizar base de datos
```sql
-- Analizar tablas
ANALYZE prompts;
ANALYZE usuarios;

-- Vacuum
VACUUM ANALYZE prompts;

-- Reindexar
REINDEX TABLE prompts;

-- Ver tamaño de tablas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitorear performance
```sql
-- Ver queries lentas
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Ver conexiones activas
SELECT * FROM pg_stat_activity;

-- Ver índices no utilizados
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE 'pg_%';
```

---

## 📊 Estadísticas

### Ver estadísticas del sistema
```bash
cd servidor
npm run verificar
```

### Estadísticas en base de datos
```sql
-- Prompts por categoría
SELECT 
  categoria,
  COUNT(*) as total
FROM prompts
WHERE eliminado = false
GROUP BY categoria
ORDER BY total DESC;

-- Prompts por mes
SELECT 
  DATE_TRUNC('month', creado_en) as mes,
  COUNT(*) as total
FROM prompts
WHERE eliminado = false
GROUP BY mes
ORDER BY mes DESC;

-- Usuarios más activos
SELECT 
  u.email,
  COUNT(p.id) as total_prompts
FROM usuarios u
LEFT JOIN prompts p ON u.id = p.usuario_id
WHERE p.eliminado = false
GROUP BY u.email
ORDER BY total_prompts DESC
LIMIT 10;

-- Etiquetas más usadas
SELECT 
  UNNEST(etiquetas) as etiqueta,
  COUNT(*) as veces_usada
FROM prompts
WHERE eliminado = false
GROUP BY etiqueta
ORDER BY veces_usada DESC
LIMIT 20;
```

---

## 🔐 Seguridad

### Cambiar JWT secret
```bash
# Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Actualizar en servidor/.env
JWT_SECRET=nuevo_secret_generado
```

### Rotar contraseña de base de datos
```sql
-- En PostgreSQL
ALTER USER tu_usuario WITH PASSWORD 'nueva_contraseña';

-- Actualizar en servidor/.env
DB_PASSWORD=nueva_contraseña
```

### Ver intentos de login fallidos
```sql
-- Agregar tabla de logs (opcional)
CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  ip_address VARCHAR(45),
  success BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ver intentos fallidos
SELECT * FROM login_attempts 
WHERE success = false 
ORDER BY created_at DESC 
LIMIT 50;
```

---

## 🚀 Deployment

### Build para producción
```bash
# Cliente
cd cliente
npm run build
# Output en: cliente/dist/

# Servidor (no requiere build)
cd servidor
npm start
```

### Variables de entorno para producción
```bash
# servidor/.env
NODE_ENV=production
PUERTO=5000
DB_HOST=tu-servidor-db.com
FRONTEND_URL=https://tu-dominio.com
```

### Nginx config (ejemplo)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /var/www/boveda-prompts/cliente/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 Desarrollo Móvil

### Probar en dispositivo móvil
```bash
# 1. Obtener IP local
# Windows
ipconfig
# Linux/Mac
ifconfig

# 2. Actualizar cliente/.env
VITE_API_URL=http://TU_IP_LOCAL:5000/api

# 3. Iniciar servicios
cd servidor && npm run dev
cd cliente && npm run dev

# 4. Abrir en móvil
# http://TU_IP_LOCAL:5173
```

---

## 💡 Tips

### Desarrollo más rápido
```bash
# Usar concurrently para iniciar ambos servicios
npm install -g concurrently

# Crear script en package.json raíz
{
  "scripts": {
    "dev": "concurrently \"cd servidor && npm run dev\" \"cd cliente && npm run dev\""
  }
}

# Ejecutar
npm run dev
```

### Hot reload de base de datos
```bash
# Usar nodemon para reiniciar en cambios de SQL
nodemon --watch base-datos/migraciones --exec "npm run migrar"
```

---

**Última actualización**: Febrero 2026
