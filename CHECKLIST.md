# ✅ Checklist de Actualización

## Pre-Migración

- [ ] Hacer backup de la base de datos
- [ ] Verificar que el servidor esté funcionando
- [ ] Verificar que el cliente esté funcionando
- [ ] Anotar la versión actual

## Migración

- [ ] Ejecutar `cd servidor && npm run migrar`
- [ ] Verificar que la migración fue exitosa
- [ ] Verificar que las columnas `eliminado` y `eliminado_en` existen
- [ ] Reiniciar el servidor

## Verificación Backend

- [ ] El servidor inicia sin errores
- [ ] Endpoint `GET /api/prompts` funciona
- [ ] Endpoint `GET /api/prompts?eliminado=true` funciona
- [ ] Endpoint `POST /api/prompts/:id/restaurar` funciona
- [ ] Endpoint `DELETE /api/prompts/papelera/vaciar` funciona
- [ ] Endpoint `DELETE /api/prompts/:id?permanente=true` funciona

## Verificación Frontend

### UI General
- [ ] El diseño se ve limpio y moderno
- [ ] Las animaciones son suaves
- [ ] No hay errores en la consola
- [ ] Los colores son consistentes
- [ ] La tipografía es legible

### Responsividad
- [ ] Mobile (< 640px): Sidebar en overlay
- [ ] Tablet (640-1024px): Sidebar colapsable
- [ ] Desktop (> 1024px): Sidebar fijo
- [ ] Todos los elementos son accesibles en móvil

### Sidebar
- [ ] Botón "Nueva Nota" funciona
- [ ] Botón "Biblioteca" funciona
- [ ] Botón "Recientes" funciona
- [ ] Botón "Favoritos" funciona
- [ ] Botón "Papelera" funciona
- [ ] Búsqueda funciona en tiempo real
- [ ] Lista de prompts se carga correctamente
- [ ] Paginación funciona
- [ ] Perfil de usuario se muestra
- [ ] Botón de cerrar sesión funciona

### Editor
- [ ] Crear nuevo prompt funciona
- [ ] Editar prompt existente funciona
- [ ] Guardar cambios funciona
- [ ] Indicador de cambios sin guardar aparece
- [ ] Botón de favorito funciona
- [ ] Botón de copiar funciona
- [ ] Botón de eliminar funciona
- [ ] Panel de metadatos se puede ocultar/mostrar
- [ ] Auto-resize de textareas funciona
- [ ] Breadcrumbs se muestran correctamente

### Biblioteca
- [ ] Vista de lista funciona
- [ ] Vista de tabla funciona
- [ ] Vista de galería funciona
- [ ] Búsqueda global funciona
- [ ] Filtro por categoría funciona
- [ ] Filtro por etiqueta funciona
- [ ] Click en prompt abre el editor
- [ ] Contador de documentos es correcto

### Papelera
- [ ] Modal de papelera se abre
- [ ] Lista de prompts eliminados se carga
- [ ] Botón de restaurar funciona
- [ ] Botón de eliminar permanente funciona
- [ ] Botón de vaciar papelera funciona
- [ ] Advertencia de auto-limpieza se muestra
- [ ] Modal se cierra con Esc
- [ ] Modal se cierra con X

### Atajos de Teclado
- [ ] `Cmd/Ctrl + S` guarda el prompt
- [ ] `Cmd/Ctrl + K` muestra/oculta metadatos
- [ ] `Esc` cierra modales

### Animaciones
- [ ] Fade-in al cargar componentes
- [ ] Slide-in en sidebar
- [ ] Zoom-in en modales
- [ ] Hover effects en botones
- [ ] Hover effects en cards
- [ ] Transiciones suaves entre vistas

## Pruebas de Flujo

### Flujo 1: Crear Prompt
- [ ] Click en "Nueva Nota"
- [ ] Escribir título
- [ ] Escribir contenido
- [ ] Agregar categoría
- [ ] Agregar etiquetas
- [ ] Marcar como favorito
- [ ] Guardar (Cmd+S)
- [ ] Verificar que aparece en la lista

### Flujo 2: Editar Prompt
- [ ] Seleccionar prompt de la lista
- [ ] Modificar contenido
- [ ] Ver indicador de cambios sin guardar
- [ ] Guardar cambios
- [ ] Verificar que se actualizó

### Flujo 3: Eliminar y Restaurar
- [ ] Seleccionar prompt
- [ ] Click en eliminar
- [ ] Confirmar eliminación
- [ ] Verificar que desaparece de la lista
- [ ] Abrir papelera
- [ ] Verificar que está en la papelera
- [ ] Click en restaurar
- [ ] Verificar que vuelve a la lista

### Flujo 4: Búsqueda y Filtros
- [ ] Escribir en búsqueda
- [ ] Ver resultados filtrados
- [ ] Limpiar búsqueda
- [ ] Filtrar por favoritos
- [ ] Filtrar por categoría
- [ ] Filtrar por etiqueta
- [ ] Limpiar filtros

### Flujo 5: Vistas de Biblioteca
- [ ] Cambiar a vista de lista
- [ ] Cambiar a vista de tabla
- [ ] Cambiar a vista de galería
- [ ] Click en prompt en cada vista
- [ ] Verificar que abre el editor

## Pruebas de Responsividad

### Mobile
- [ ] Abrir en móvil o DevTools mobile
- [ ] Sidebar se oculta por defecto
- [ ] Botón de menú aparece
- [ ] Click en menú abre sidebar
- [ ] Click fuera cierra sidebar
- [ ] Todos los botones son accesibles
- [ ] Texto es legible
- [ ] No hay scroll horizontal

### Tablet
- [ ] Abrir en tablet o DevTools tablet
- [ ] Sidebar es colapsable
- [ ] Grid de 2 columnas en galería
- [ ] Toolbar completo visible
- [ ] Touch targets son adecuados

### Desktop
- [ ] Abrir en desktop
- [ ] Sidebar fijo visible
- [ ] Grid de 3-4 columnas en galería
- [ ] Atajos de teclado visibles
- [ ] Hover effects funcionan

## Pruebas de Accesibilidad

- [ ] Navegación completa con Tab
- [ ] Focus visible en todos los elementos
- [ ] Screen reader puede leer contenido
- [ ] Contraste de colores adecuado
- [ ] Tooltips en iconos
- [ ] ARIA labels presentes

## Pruebas de Performance

- [ ] Carga inicial < 3 segundos
- [ ] Búsqueda responde instantáneamente
- [ ] Scroll es suave
- [ ] Animaciones no causan lag
- [ ] No hay memory leaks (DevTools)

## Post-Migración

- [ ] Documentar cualquier problema encontrado
- [ ] Verificar logs del servidor
- [ ] Verificar logs del navegador
- [ ] Hacer commit de cambios
- [ ] Actualizar documentación si es necesario

## Opcional: Configurar Auto-Limpieza

- [ ] Instalar `node-cron`
- [ ] Crear archivo de tarea
- [ ] Configurar cron job
- [ ] Probar ejecución manual
- [ ] Verificar logs

---

## 🎉 ¡Completado!

Si todos los items están marcados, la actualización fue exitosa.

**Fecha de verificación**: _______________  
**Verificado por**: _______________  
**Notas adicionales**: 

_______________________________________________
_______________________________________________
_______________________________________________
