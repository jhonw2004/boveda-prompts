# 🔐 Bóveda de Prompts

Sistema de gestión de prompts para IA con autenticación de usuarios, verificación por email y papelera de recuperación.

## ✨ Características

### Core
- ✅ Registro de usuarios con validación
- ✅ Verificación de email
- ✅ Autenticación JWT
- ✅ Gestión de prompts (CRUD)
- ✅ Categorización y etiquetado
- ✅ Exportación de prompts (JSON, Markdown, TXT)

### Nuevas (v2.0)
- 🎨 **UI mejorada estilo Notion**: Diseño limpio y moderno
- 🗑️ **Sistema de papelera**: Recupera prompts eliminados
- 📱 **Totalmente responsivo**: Optimizado para móvil, tablet y desktop
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
- Lucide Icons
- React Hot Toast

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

# Ejecutar schema inicial
psql -U postgres -d boveda_prompts -f base-datos/migraciones/001_schema_inicial.sql

# Ejecutar migración de papelera
psql -U postgres -d boveda_prompts -f base-datos/migraciones/002_agregar_papelera.sql
```

**O usa el script automatizado:**

```bash
cd servidor
npm run migrar
```

### 4. Configurar variables de entorno

**Backend** (`servidor/.env`):
```env
PUERTO=5000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boveda_prompts
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña

# JWT
JWT_SECRET=tu-secret-key-super-segura
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-de-gmail
EMAIL_FROM=Bóveda de Prompts <noreply@bovedaprompts.com>

# Frontend
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

### Verificar Sistema

```bash
cd servidor
npm run verificar
```

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
│   │   └── servicios/        # Servicios API
│   ├── tailwind.config.js    # Configuración Tailwind
│   └── package.json
│
├── servidor/                  # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/           # Configuración
│   │   ├── controladores/    # Controladores
│   │   ├── middleware/       # Middleware
│   │   ├── rutas/            # Rutas API
│   │   └── servicios/        # Servicios
│   ├── migrar.js             # Script de migración
│   ├── verificar.js          # Script de verificación
│   └── package.json
│
├── base-datos/               # Scripts SQL
│   └── migraciones/
│       ├── 001_schema_inicial.sql
│       └── 002_agregar_papelera.sql
│
├── INICIO_RAPIDO.md          # Guía de inicio rápido
├── ACTUALIZACION.md          # Guía de actualización
├── MEJORAS_IMPLEMENTADAS.md  # Lista de mejoras
└── CHECKLIST.md              # Checklist de verificación
```

## 🎨 Nuevas Funcionalidades (v2.0)

### Sistema de Papelera
- **Eliminación suave**: Los prompts se mueven a la papelera
- **Restauración**: Recupera prompts eliminados
- **Eliminación permanente**: Opción para eliminar definitivamente
- **Vaciar papelera**: Limpia toda la papelera de una vez

### Atajos de Teclado
- `Cmd/Ctrl + S`: Guardar prompt
- `Cmd/Ctrl + K`: Mostrar/ocultar metadatos
- `Esc`: Cerrar modales

### Vistas de Biblioteca
- **Lista**: Vista compacta con información básica
- **Tabla**: Vista detallada con columnas
- **Galería**: Vista de tarjetas con preview

### Mejoras de UI
- Diseño responsivo optimizado
- Animaciones suaves
- Sidebar colapsable
- Indicadores de estado
- Feedback visual mejorado

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de entrada en frontend y backend
- CORS configurado
- Helmet para headers de seguridad
- Rate limiting
- SQL injection prevention
- XSS protection

## 📚 Documentación

- [Inicio Rápido](INICIO_RAPIDO.md) - Guía de 3 pasos
- [Actualización](ACTUALIZACION.md) - Guía detallada de migración
- [Mejoras Implementadas](MEJORAS_IMPLEMENTADAS.md) - Lista completa de cambios
- [Checklist](CHECKLIST.md) - Verificación paso a paso

## 🐛 Solución de Problemas

### Error de migración
```bash
cd servidor
npm run verificar
```

### Estilos no se aplican
```bash
cd cliente
rm -rf node_modules .vite
npm install
npm run dev
```

### Base de datos no conecta
Verifica las variables de entorno en `servidor/.env`

## 🚀 Próximas Mejoras

- [ ] Sistema de versiones de prompts
- [ ] Compartir prompts entre usuarios
- [ ] Exportación avanzada (PDF)
- [ ] Plantillas de prompts
- [ ] Colaboración en tiempo real
- [ ] Integración con APIs de IA
- [ ] PWA support

## 👤 Autor

**Jhon W**
- GitHub: [@jhonw2004](https://github.com/jhonw2004)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

Inspiración de diseño:
- Notion (UI/UX patterns)
- Linear (Animaciones)
- Obsidian (Color palette)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

**Versión**: 2.0.0 | **Última actualización**: Febrero 2026
