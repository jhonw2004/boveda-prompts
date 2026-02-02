# 🔐 Bóveda de Prompts

Sistema de gestión de prompts para IA con autenticación OAuth 2.0, gestión avanzada y papelera de recuperación.

## ✨ Características

### Core
- ✅ **Autenticación con Google OAuth 2.0**: Login rápido y seguro
- ✅ **Autenticación local**: Registro tradicional con email/contraseña
- ✅ **JWT**: Tokens seguros para sesiones
- ✅ **Gestión de prompts (CRUD)**: Crea, edita, elimina y organiza
- ✅ **Categorización y etiquetado**: Organiza tus prompts
- ✅ **Exportación**: JSON, Markdown, TXT

### v3.0 (OAuth 2.0)
- 🔐 **Google OAuth 2.0**: Inicia sesión con tu cuenta de Google
- 👤 **Foto de perfil**: Avatar automático desde Google
- ⚡ **Sin verificación de email**: Login instantáneo con OAuth
- 🔄 **Migración automática**: Vincula cuentas locales con Google

### v2.0
- 🎨 **UI estilo Notion**: Diseño limpio y moderno
- 🗑️ **Sistema de papelera**: Recupera prompts eliminados
- 📱 **Totalmente responsivo**: Móvil, tablet y desktop
- ⌨️ **Atajos de teclado**: Cmd+S para guardar, Cmd+K para metadatos
- 🎭 **Animaciones suaves**: Transiciones fluidas
- 👁️ **Tres vistas**: Lista, Tabla y Galería
- 🔍 **Búsqueda avanzada**: Filtros por categoría y etiquetas

## 🛠️ Tecnologías

### Frontend
- React 19
- React Router
- Tailwind CSS v4
- Axios
- @react-oauth/google
- Lucide Icons
- React Hot Toast

### Backend
- Node.js + Express
- PostgreSQL
- Passport.js + Google OAuth 2.0
- JWT
- Bcrypt

## 📦 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior) o Neon
- npm o yarn
- Cuenta de Google Cloud (para OAuth)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jhonw2004/boveda-prompts.git
cd boveda-prompts
```

### 2. Instalar dependencias

```bash
# Backend
cd servidor
npm install

# Frontend
cd ../cliente
npm install
```

### 3. Configurar la base de datos

#### Opción A: PostgreSQL local

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE boveda_prompts;
\q

# Ejecutar schema completo
psql -U postgres -d boveda_prompts -f base-datos/schema.sql
```

#### Opción B: Neon (recomendado para producción)

1. Crea una base de datos en [Neon](https://neon.tech)
2. Copia la connection string
3. En el SQL Editor de Neon, pega el contenido de `base-datos/schema.sql`
4. Ejecuta

### 4. Configurar Google OAuth 2.0

**Sigue la guía completa:** [CONFIGURAR_OAUTH.md](CONFIGURAR_OAUTH.md)

**Resumen rápido:**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Configura OAuth Consent Screen
4. Crea credenciales OAuth 2.0
5. Agrega Authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://tu-frontend.onrender.com`
6. Agrega Authorized redirect URIs:
   - `http://localhost:5000/api/oauth/google/callback`
   - `https://tu-backend.onrender.com/api/oauth/google/callback`
7. Copia Client ID y Client Secret

### 5. Configurar variables de entorno

**Backend** (`servidor/.env`):
```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos (Neon o PostgreSQL local)
DATABASE_URL=postgresql://usuario:password@host:5432/boveda_prompts

# JWT
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion
JWT_EXPIRE=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`cliente/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

## 🎯 Uso

### Desarrollo

```bash
# Iniciar backend
cd servidor
npm run dev

# Iniciar frontend (en otra terminal)
cd cliente
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Producción

```bash
# Backend
cd servidor
npm start

# Frontend
cd cliente
npm run build
npm run preview
```

## 📁 Estructura del Proyecto

```
boveda-prompts/
├── cliente/                    # Frontend (React)
│   ├── src/
│   │   ├── componentes/       # Componentes reutilizables
│   │   │   ├── auth/         # Componentes de autenticación
│   │   │   ├── comunes/      # Componentes comunes
│   │   │   └── prompts/      # Componentes de prompts
│   │   ├── contexto/         # Context API
│   │   ├── paginas/          # Páginas
│   │   ├── servicios/        # Servicios API
│   │   └── hooks/            # Custom hooks
│   └── package.json
│
├── servidor/                  # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/           # Configuración (DB, Passport)
│   │   ├── controladores/    # Controladores (Auth, OAuth, Prompts)
│   │   ├── middleware/       # Middleware (Auth)
│   │   ├── rutas/            # Rutas API
│   │   └── utilidades/       # Utilidades
│   └── package.json
│
├── base-datos/               # Scripts SQL
│   ├── schema.sql           # Schema completo (con OAuth)
│   └── migraciones/         # Migraciones incrementales
│       └── 003_agregar_oauth.sql
│
├── CONFIGURAR_OAUTH.md       # Guía de configuración OAuth
└── README.md                 # Este archivo
```

## 🔐 Autenticación

### OAuth 2.0 con Google (Recomendado)

- Login con un clic
- Sin necesidad de verificación de email
- Foto de perfil automática
- Más seguro

### Autenticación Local

- Registro con email/contraseña
- Contraseña hasheada con bcrypt
- Auto-verificado (sin emails)
- Compatible con OAuth (puedes vincular después)

## 🔒 Seguridad

- OAuth 2.0 con Google
- Contraseñas hasheadas con bcrypt (auth local)
- Tokens JWT con expiración
- Validación de entrada en frontend y backend
- CORS configurado
- Helmet para headers de seguridad
- Rate limiting
- SQL injection prevention
- XSS protection
- Trust proxy para Render

## 🚀 Deploy en Render

### Backend (Web Service)

1. Conecta tu repositorio de GitHub
2. Root Directory: `servidor`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Variables de entorno:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=tu-url-de-neon
   JWT_SECRET=tu-secret
   JWT_EXPIRE=7d
   GOOGLE_CLIENT_ID=tu-client-id
   GOOGLE_CLIENT_SECRET=tu-secret
   GOOGLE_CALLBACK_URL=https://tu-backend.onrender.com/api/oauth/google/callback
   FRONTEND_URL=https://tu-frontend.onrender.com
   ```

### Frontend (Static Site)

1. Conecta tu repositorio de GitHub
2. Root Directory: `cliente`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=tu-client-id
   ```

## 📚 Documentación

- [Configurar OAuth 2.0](CONFIGURAR_OAUTH.md) - Guía completa de Google OAuth
- [Schema SQL](base-datos/schema.sql) - Estructura de la base de datos
- [Migración OAuth](base-datos/migraciones/003_agregar_oauth.sql) - Para actualizar BD existentes

## 🎨 Funcionalidades

### Sistema de Papelera
- Eliminación suave (soft delete)
- Restauración de prompts
- Eliminación permanente
- Vaciar papelera completa

### Atajos de Teclado
- `Cmd/Ctrl + S`: Guardar prompt
- `Cmd/Ctrl + K`: Mostrar/ocultar metadatos
- `Esc`: Cerrar modales

### Vistas de Biblioteca
- **Lista**: Vista compacta
- **Tabla**: Vista detallada con columnas
- **Galería**: Vista de tarjetas con preview

### Exportación
- JSON (estructura completa)
- Markdown (formato legible)
- TXT (texto plano)

## 🐛 Solución de Problemas

### OAuth no funciona

1. Verifica que las URLs en Google Console coincidan exactamente
2. Revisa que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
3. Verifica que `GOOGLE_CALLBACK_URL` apunte al backend
4. Revisa los logs del backend

### Base de datos no conecta

1. Verifica `DATABASE_URL` en las variables de entorno
2. Para Neon, asegúrate de incluir `?sslmode=require`
3. Revisa que ejecutaste el schema.sql

### Error 404 en producción

1. Verifica que `FRONTEND_URL` en el backend apunte al frontend
2. Verifica que `VITE_API_URL` en el frontend apunte al backend
3. Asegúrate de que ambos servicios estén desplegados

## 🚀 Roadmap

- [ ] GitHub OAuth
- [ ] Sistema de versiones de prompts
- [ ] Compartir prompts entre usuarios
- [ ] Exportación a PDF
- [ ] Plantillas de prompts
- [ ] Colaboración en tiempo real
- [ ] Integración con APIs de IA (OpenAI, Claude)
- [ ] PWA support
- [ ] Modo offline

## 👤 Autor

**Jhon W**
- GitHub: [@jhonw2004](https://github.com/jhonw2004)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- Google OAuth 2.0 por la autenticación segura
- Neon por el hosting de PostgreSQL
- Render por el hosting gratuito
- Notion, Linear y Obsidian por la inspiración de diseño

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

**Versión**: 3.0.0 (OAuth 2.0) | **Última actualización**: Febrero 2026
