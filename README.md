# 🔐 Bóveda de Prompts

Sistema moderno de gestión de prompts para IA con autenticación OAuth 2.0 de Google, gestión avanzada y papelera de recuperación.

## ✨ Características Principales

### Autenticación y Seguridad
- 🔐 **Google OAuth 2.0**: Autenticación segura con un clic
- 👤 **Perfil automático**: Avatar y datos desde Google
- 🔒 **JWT**: Tokens seguros con expiración configurable
- 🛡️ **Seguridad robusta**: Helmet, CORS, Rate Limiting, SQL Injection prevention

### Gestión de Prompts
- ✅ **CRUD completo**: Crea, edita, elimina y organiza prompts
- 🏷️ **Categorización**: Organiza por categorías personalizadas
- 🔖 **Etiquetas**: Sistema de tags flexible (hasta 10 por prompt)
- ⭐ **Favoritos**: Marca tus prompts más usados
- 🗑️ **Papelera**: Recuperación de prompts eliminados
- 🔍 **Búsqueda avanzada**: Filtros por categoría, etiquetas y texto
- 📤 **Exportación**: JSON, Markdown y TXT

### Interfaz de Usuario
- 🎨 **Diseño Notion-style**: UI limpia y moderna
- 📱 **Totalmente responsivo**: Optimizado para móvil, tablet y desktop
- 👁️ **Tres vistas**: Lista, Tabla y Galería
- ⌨️ **Atajos de teclado**: Cmd+S guardar, Cmd+K metadatos, Esc cerrar
- 🎭 **Animaciones suaves**: Transiciones fluidas con Tailwind CSS v4

## 🛠️ Stack Tecnológico

### Frontend
- **React 19**: Framework UI moderno
- **React Router v7**: Navegación client-side
- **Tailwind CSS v4**: Estilos utility-first
- **Axios**: Cliente HTTP
- **React Hot Toast**: Notificaciones
- **Lucide Icons**: Iconografía
- **React Hook Form + Zod**: Validación de formularios

### Backend
- **Node.js + Express 5**: Servidor HTTP
- **PostgreSQL**: Base de datos relacional
- **Passport.js**: Middleware de autenticación
- **passport-google-oauth20**: Estrategia OAuth de Google
- **JWT (jsonwebtoken)**: Tokens de sesión
- **Bcrypt**: Hash de contraseñas (auth local legacy)
- **Helmet**: Headers de seguridad
- **express-rate-limit**: Protección contra ataques

### Infraestructura
- **Neon**: PostgreSQL serverless
- **Render**: Hosting (Web Service + Static Site)
- **Google Cloud Platform**: OAuth 2.0

## 📦 Requisitos Previos

- Node.js v18 o superior
- npm o yarn
- Cuenta de Google Cloud (para OAuth)
- Base de datos PostgreSQL (local o Neon)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jhonw2004/boveda-prompts.git
cd boveda-prompts
```

### 2. Instalar Dependencias

```bash
# Backend
cd servidor
npm install

# Frontend
cd ../cliente
npm install
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE boveda_prompts;
\q

# Ejecutar schema
psql -U postgres -d boveda_prompts -f base-datos/schema.sql
```

#### Opción B: Neon (Recomendado para Producción)

1. Crea una cuenta en [Neon](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la **Connection String**
4. En el **SQL Editor** de Neon:
   - Pega el contenido de `base-datos/schema.sql`
   - Ejecuta el script

### 4. Configurar Google OAuth 2.0

#### 4.1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto: **"Bóveda de Prompts"**
3. Selecciona el proyecto

#### 4.2. Configurar OAuth Consent Screen

1. Ve a: **APIs & Services** → **OAuth consent screen**
2. Selecciona: **External**
3. Completa el formulario:
   - **App name**: Bóveda de Prompts
   - **User support email**: tu-email@gmail.com
   - **Developer contact**: tu-email@gmail.com
4. En **Scopes**, agrega:
   - `email`
   - `profile`
   - `openid`
5. En **Test users**, agrega tu email (para testing)
6. Guarda y continúa

#### 4.3. Crear Credenciales OAuth 2.0

1. Ve a: **APIs & Services** → **Credentials**
2. Clic en: **Create Credentials** → **OAuth client ID**
3. **Application type**: Web application
4. **Name**: Bóveda Prompts Web Client

5. **Authorized JavaScript origins** (agrega ambas):
   ```
   http://localhost:5173
   https://tu-frontend.onrender.com
   ```

6. **Authorized redirect URIs** (agrega ambas):
   ```
   http://localhost:5000/api/oauth/google/callback
   https://tu-backend.onrender.com/api/oauth/google/callback
   ```

7. Clic en **Create**

8. **Copia las credenciales**:
   - **Client ID**: `123456789-abc.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-abc123xyz`

> **Nota**: Puedes ver las credenciales después en la sección Credentials.

### 5. Configurar Variables de Entorno

#### Backend (`servidor/.env`)

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/boveda_prompts

# JWT
JWT_SECRET=genera-una-clave-secreta-super-segura-aqui
JWT_EXPIRE=7d

# Google OAuth 2.0
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
GOOGLE_CALLBACK_URL=http://localhost:5000/api/oauth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`cliente/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

> **Importante**: El frontend solo necesita el Client ID, NO el Secret.

### 6. Ejecutar en Desarrollo

```bash
# Terminal 1: Backend
cd servidor
npm run dev

# Terminal 2: Frontend
cd cliente
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 🌐 Deploy en Render

### Configuración del Backend (Web Service)

1. **Conecta tu repositorio** de GitHub
2. **Configuración**:
   - **Name**: boveda-prompts-backend
   - **Region**: Oregon (o el más cercano)
   - **Branch**: main
   - **Root Directory**: `servidor`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Variables de entorno**:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://usuario:pass@host.neon.tech/db?sslmode=require
   JWT_SECRET=tu-clave-secreta-super-segura
   JWT_EXPIRE=7d
   GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
   GOOGLE_CALLBACK_URL=https://tu-backend.onrender.com/api/oauth/google/callback
   FRONTEND_URL=https://tu-frontend.onrender.com
   ```

4. **Crea el servicio**

### Configuración del Frontend (Static Site)

1. **Conecta tu repositorio** de GitHub
2. **Configuración**:
   - **Name**: boveda-prompts-frontend
   - **Region**: Oregon
   - **Branch**: main
   - **Root Directory**: `cliente`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Variables de entorno**:
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   ```

4. **Configurar Redirects/Rewrites** (IMPORTANTE):
   - Ve a **Settings** → **Redirects/Rewrites**
   - Agrega una regla:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: Rewrite

5. **Crea el servicio**

### Actualizar URLs en Google Cloud Console

Una vez desplegado, actualiza las URLs en Google Cloud Console:

**Authorized JavaScript origins**:
```
https://tu-frontend.onrender.com
```

**Authorized redirect URIs**:
```
https://tu-backend.onrender.com/api/oauth/google/callback
```

## 🔐 Flujo de Autenticación OAuth 2.0

```
1. Usuario → Clic en "Continuar con Google"
   ↓
2. Frontend → Redirige a: /api/oauth/google
   ↓
3. Backend → Redirige a Google OAuth
   ↓
4. Google → Usuario autoriza la aplicación
   ↓
5. Google → Redirige a: /api/oauth/google/callback
   ↓
6. Backend → Passport.js procesa la respuesta
   ↓
7. Backend → Busca/crea usuario en PostgreSQL
   ↓
8. Backend → Genera JWT
   ↓
9. Backend → Redirige a: /auth/callback?token=JWT
   ↓
10. Frontend → AuthCallback.jsx procesa el token
   ↓
11. Frontend → Guarda token en localStorage
   ↓
12. Frontend → Obtiene datos del usuario (/api/auth/yo)
   ↓
13. Frontend → Redirige a /prompts
   ↓
14. Usuario autenticado ✅
```

## 📁 Estructura del Proyecto

```
boveda-prompts/
├── cliente/                          # Frontend (React)
│   ├── public/
│   │   └── _redirects               # Configuración SPA routing
│   ├── src/
│   │   ├── componentes/
│   │   │   ├── auth/               # Componentes de autenticación
│   │   │   ├── comunes/            # Componentes reutilizables
│   │   │   └── prompts/            # Componentes de prompts
│   │   ├── contexto/
│   │   │   └── AutenticacionContexto.jsx
│   │   ├── paginas/
│   │   │   ├── AuthCallback.jsx    # Procesa respuesta OAuth
│   │   │   ├── IniciarSesion.jsx   # Login con Google
│   │   │   ├── Registrarse.jsx     # Registro con Google
│   │   │   ├── Prompts.jsx         # Gestión de prompts
│   │   │   └── ...
│   │   ├── servicios/
│   │   │   ├── api.js              # Cliente Axios
│   │   │   ├── autenticacionServicio.js
│   │   │   └── promptsServicio.js
│   │   └── App.jsx
│   ├── netlify.toml                # Config alternativa routing
│   ├── package.json
│   └── vite.config.js
│
├── servidor/                         # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/
│   │   │   ├── baseDatos.js        # Conexión PostgreSQL
│   │   │   └── passport.js         # Configuración OAuth
│   │   ├── controladores/
│   │   │   ├── autenticacionControlador.js
│   │   │   ├── oauthControlador.js # Callback OAuth
│   │   │   └── promptsControlador.js
│   │   ├── middleware/
│   │   │   └── autenticacionMiddleware.js  # Verificación JWT
│   │   ├── rutas/
│   │   │   ├── autenticacionRutas.js
│   │   │   ├── oauthRutas.js       # /oauth/google
│   │   │   ├── promptsRutas.js
│   │   │   └── exportacionRutas.js
│   │   ├── utilidades/
│   │   │   └── formatosExportacion.js
│   │   └── servidor.js             # Entry point
│   └── package.json
│
├── base-datos/
│   ├── schema.sql                   # Schema completo con OAuth
│   └── migraciones/
│       └── 003_agregar_oauth.sql   # Migración para BD existentes
│
├── render.yaml                      # Configuración Render
├── CONFIGURAR_OAUTH.md             # Guía detallada OAuth
└── README.md                        # Este archivo
```

## 🔒 Seguridad

### Implementaciones de Seguridad

- **OAuth 2.0**: Autenticación delegada a Google
- **JWT**: Tokens firmados con expiración
- **Bcrypt**: Hash de contraseñas (legacy auth local)
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para frontend específico
- **Rate Limiting**: Protección contra fuerza bruta
- **SQL Injection**: Queries parametrizadas con pg
- **XSS Protection**: Sanitización de inputs
- **Trust Proxy**: Configurado para Render

### Buenas Prácticas

- Variables de entorno para secretos
- Tokens con expiración (7 días por defecto)
- Validación en frontend y backend
- Constraints en base de datos
- Logging de eventos importantes
- Manejo de errores robusto

## 🎨 Funcionalidades Avanzadas

### Sistema de Papelera
- **Soft delete**: Los prompts no se eliminan permanentemente
- **Restauración**: Recupera prompts eliminados
- **Eliminación permanente**: Opción para borrar definitivamente
- **Auto-limpieza**: Función SQL para limpiar papelera antigua (30+ días)

### Atajos de Teclado
- `Cmd/Ctrl + S`: Guardar prompt
- `Cmd/Ctrl + K`: Mostrar/ocultar metadatos
- `Esc`: Cerrar modales

### Vistas de Biblioteca
- **Lista**: Vista compacta con información esencial
- **Tabla**: Vista detallada con todas las columnas
- **Galería**: Vista de tarjetas con preview del contenido

### Exportación
- **JSON**: Estructura completa con metadatos
- **Markdown**: Formato legible para documentación
- **TXT**: Texto plano simple

## 🐛 Solución de Problemas

### OAuth no funciona

**Error: `invalid_client`**
- Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
- Asegúrate de no tener espacios al inicio/final
- Verifica que las URLs en Google Console coincidan exactamente

**Error: `redirect_uri_mismatch`**
- Las URLs en Google Console deben coincidir EXACTAMENTE
- Formato correcto: `https://backend.onrender.com/api/oauth/google/callback`
- No olvides `/api/oauth/google/callback`

**Error 404 en `/auth/callback`**
- Configura Redirects/Rewrites en Render Static Site
- Verifica que el archivo `_redirects` esté en `cliente/public/`
- Asegúrate de que el build incluya el archivo

### Base de datos no conecta

**Error: `connection refused`**
- Verifica `DATABASE_URL` en variables de entorno
- Para Neon, incluye `?sslmode=require` al final
- Verifica que ejecutaste el schema.sql

**Error: `password authentication failed`**
- Verifica usuario y contraseña en la connection string
- En Neon, usa la connection string completa del dashboard

### Frontend no carga después de OAuth

**Error: `Cannot read properties of undefined`**
- Verifica que `setToken` y `setUsuario` estén en el contexto
- Asegúrate de que `AuthCallback.jsx` esté importado en `App.jsx`

**Token no se guarda**
- Verifica que `localStorage` esté disponible
- Revisa la consola del navegador para errores
- Verifica que el token sea válido (no expirado)

## 📚 Documentación Adicional

- [Configurar OAuth 2.0](CONFIGURAR_OAUTH.md) - Guía paso a paso completa
- [Schema SQL](base-datos/schema.sql) - Estructura de la base de datos
- [Migración OAuth](base-datos/migraciones/003_agregar_oauth.sql) - Para actualizar BD existentes

## 🚀 Roadmap

- [ ] GitHub OAuth (autenticación alternativa)
- [ ] Microsoft OAuth (Azure AD)
- [ ] Sistema de versiones de prompts
- [ ] Compartir prompts entre usuarios
- [ ] Exportación a PDF
- [ ] Plantillas de prompts predefinidas
- [ ] Colaboración en tiempo real
- [ ] Integración con APIs de IA (OpenAI, Claude, Gemini)
- [ ] PWA support (modo offline)
- [ ] Temas personalizables (dark/light)
- [ ] Búsqueda full-text avanzada
- [ ] Estadísticas de uso

## 👤 Autor

**Jhon W**
- GitHub: [@jhonw2004](https://github.com/jhonw2004)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- **Google OAuth 2.0** por la autenticación segura y confiable
- **Neon** por el hosting de PostgreSQL serverless
- **Render** por el hosting gratuito de aplicaciones
- **Notion**, **Linear** y **Obsidian** por la inspiración de diseño
- **Passport.js** por simplificar la autenticación
- **React** y **Tailwind CSS** por las herramientas modernas de desarrollo

## 🔗 Enlaces Útiles

- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Neon Documentation](https://neon.tech/docs)
- [Render Documentation](https://render.com/docs)
- [React Router v7](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

**Versión**: 3.0.0 (OAuth 2.0) | **Última actualización**: Febrero 2026
