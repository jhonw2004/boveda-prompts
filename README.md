# 🔐 Bóveda de Prompts

Sistema de gestión de prompts para IA con autenticación de usuarios y verificación por email.

## ✨ Características

- ✅ Registro de usuarios con validación
- ✅ Verificación de email
- ✅ Autenticación JWT
- ✅ Gestión de prompts (CRUD)
- ✅ Categorización y etiquetado
- ✅ Exportación de prompts (JSON, Markdown, TXT)
- ✅ Interfaz moderna y responsiva

## 🛠️ Tecnologías

### Frontend
- React 19
- React Router
- Tailwind CSS
- Axios
- React Hook Form + Zod

### Backend
- Node.js + Express
- PostgreSQL
- JWT
- Bcrypt
- Nodemailer

## 📦 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn
- Cuenta de Gmail (para envío de emails)

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

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE boveda_prompts;
\q

# Ejecutar schema
psql -U postgres -d boveda_prompts -f base-datos/migraciones/001_schema_inicial.sql
```

### 4. Configurar variables de entorno

**Backend** (`servidor/.env`):
```env
PUERTO=5000
NODE_ENV=development
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/boveda_prompts"
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-de-gmail
EMAIL_FROM=Bóveda de Prompts <noreply@bovedaprompts.com>
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`cliente/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Configurar Gmail

Para usar Gmail como servidor SMTP:

1. Ve a [Google Account](https://myaccount.google.com/)
2. Seguridad → Verificación en 2 pasos (activar)
3. Seguridad → Contraseñas de aplicaciones
4. Genera una contraseña de aplicación
5. Copia la contraseña en `EMAIL_PASSWORD`

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
├── cliente/                 # Frontend (React)
│   ├── src/
│   │   ├── componentes/    # Componentes reutilizables
│   │   ├── contexto/       # Context API
│   │   ├── paginas/        # Páginas
│   │   └── servicios/      # Servicios API
│   └── package.json
│
├── servidor/               # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/        # Configuración
│   │   ├── controladores/ # Controladores
│   │   ├── middleware/    # Middleware
│   │   ├── rutas/         # Rutas API
│   │   └── servicios/     # Servicios
│   └── package.json
│
└── base-datos/            # Scripts SQL
    └── migraciones/
        └── 001_schema_inicial.sql
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de entrada en frontend y backend
- CORS configurado
- Helmet para headers de seguridad
- Rate limiting

## 👤 Autor

**Jhon W**
- GitHub: [@jhonw2004](https://github.com/jhonw2004)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
