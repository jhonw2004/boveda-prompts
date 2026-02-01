# 🚀 Inicio Rápido - Actualización v2.0

## ⚡ Migración en 3 Pasos

### 1️⃣ Migrar Base de Datos
```bash
cd servidor
npm run migrar
```

### 2️⃣ Reiniciar Servidor
```bash
# Terminal 1
cd servidor
npm run dev
```

### 3️⃣ Reiniciar Cliente
```bash
# Terminal 2
cd cliente
npm run dev
```

## ✅ Verificación

Abre tu navegador en `http://localhost:5173` y verifica:

- ✅ El sidebar tiene un botón "Papelera"
- ✅ Las animaciones son suaves
- ✅ El diseño es responsivo
- ✅ Los atajos de teclado funcionan (Cmd+S, Cmd+K)

## 🎯 Nuevas Funcionalidades

### Papelera
1. Elimina un prompt → Se mueve a la papelera
2. Click en "Papelera" en el sidebar
3. Restaura o elimina permanentemente

### Atajos de Teclado
- `Cmd/Ctrl + S`: Guardar
- `Cmd/Ctrl + K`: Mostrar/ocultar metadatos
- `Esc`: Cerrar modales

### Vistas de Biblioteca
- **Lista**: Vista compacta
- **Tabla**: Vista detallada
- **Galería**: Vista de tarjetas

## 🐛 Solución de Problemas

### Error de migración
```bash
# Verifica la conexión a la base de datos
psql -U tu_usuario -d nombre_base_datos -c "SELECT version();"
```

### Columnas no aparecen
```bash
# Ejecuta manualmente la migración
psql -U tu_usuario -d nombre_base_datos -f base-datos/migraciones/002_agregar_papelera.sql
```

### Estilos no se aplican
```bash
# Limpia caché y reinstala
cd cliente
rm -rf node_modules .vite
npm install
npm run dev
```

## 📚 Documentación Completa

- `ACTUALIZACION.md` - Guía detallada de actualización
- `MEJORAS_IMPLEMENTADAS.md` - Lista completa de mejoras

## 💡 Tips

1. **Backup**: Haz backup de tu base de datos antes de migrar
2. **Navegador**: Limpia caché si ves estilos antiguos
3. **Consola**: Revisa la consola del navegador para errores
4. **Logs**: Revisa logs del servidor para problemas de API

## 🎉 ¡Listo!

Tu aplicación ahora tiene:
- ✨ UI mejorada estilo Notion
- 🗑️ Sistema de papelera funcional
- 📱 Diseño totalmente responsivo
- ⌨️ Atajos de teclado
- 🎨 Animaciones suaves

---

**¿Problemas?** Revisa `ACTUALIZACION.md` para más detalles.
