# 🎯 Sistema de Confirmación Moderno

## Descripción

Se ha implementado un sistema de confirmación moderno y reutilizable que reemplaza completamente los métodos legacy de JavaScript (`window.confirm()`, `window.alert()`, `window.prompt()`).

---

## 🚀 Componentes Creados

### 1. ModalConfirmacion.jsx
Modal de confirmación personalizable con diferentes tipos y estados.

**Ubicación**: `cliente/src/componentes/comunes/ModalConfirmacion.jsx`

**Props**:
- `abierto` (boolean): Controla la visibilidad del modal
- `onCerrar` (function): Callback al cerrar
- `onConfirmar` (function): Callback al confirmar
- `titulo` (string): Título del modal
- `mensaje` (string): Mensaje descriptivo
- `tipo` (string): Tipo de confirmación ('warning', 'danger', 'info', 'success')
- `textoConfirmar` (string): Texto del botón de confirmar
- `textoCancelar` (string): Texto del botón de cancelar
- `cargando` (boolean): Estado de carga durante la acción

**Características**:
- ✅ Cierre con tecla Escape
- ✅ Overlay con blur
- ✅ Animaciones suaves
- ✅ Prevención de scroll del body
- ✅ Estados de carga
- ✅ Iconos contextuales según tipo
- ✅ Colores adaptativos

### 2. useConfirmacion Hook
Hook personalizado para manejar el estado y lógica de confirmaciones.

**Ubicación**: `cliente/src/hooks/useConfirmacion.js`

**API**:
```javascript
const confirmacion = useConfirmacion();

// Mostrar confirmación
await confirmacion.mostrar({
  titulo: 'Título',
  mensaje: 'Mensaje descriptivo',
  tipo: 'warning', // 'warning', 'danger', 'info', 'success'
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  onConfirmar: async () => {
    // Acción a ejecutar
  }
});

// Cerrar manualmente
confirmacion.cerrar();

// Confirmar manualmente
confirmacion.confirmar();

// Estado actual
confirmacion.estado
```

---

## 🎨 Tipos de Confirmación

### 1. Warning (Advertencia)
- **Color**: Amarillo
- **Icono**: AlertTriangle
- **Uso**: Cambios sin guardar, acciones reversibles

```javascript
await confirmacion.mostrar({
  titulo: 'Cambios sin guardar',
  mensaje: 'Tienes cambios sin guardar. ¿Deseas descartarlos?',
  tipo: 'warning',
  textoConfirmar: 'Descartar',
  textoCancelar: 'Cancelar'
});
```

### 2. Danger (Peligro)
- **Color**: Rojo
- **Icono**: Trash2
- **Uso**: Eliminaciones permanentes, acciones irreversibles

```javascript
await confirmacion.mostrar({
  titulo: 'Eliminar permanentemente',
  mensaje: 'Esta acción no se puede deshacer.',
  tipo: 'danger',
  textoConfirmar: 'Eliminar',
  textoCancelar: 'Cancelar'
});
```

### 3. Info (Información)
- **Color**: Azul
- **Icono**: Info
- **Uso**: Información general, confirmaciones neutras

```javascript
await confirmacion.mostrar({
  titulo: 'Información',
  mensaje: 'Esto es un mensaje informativo.',
  tipo: 'info',
  textoConfirmar: 'Entendido',
  textoCancelar: 'Cerrar'
});
```

### 4. Success (Éxito)
- **Color**: Verde
- **Icono**: CheckCircle
- **Uso**: Confirmaciones de éxito, acciones completadas

```javascript
await confirmacion.mostrar({
  titulo: 'Operación exitosa',
  mensaje: 'La acción se completó correctamente.',
  tipo: 'success',
  textoConfirmar: 'Continuar',
  textoCancelar: 'Cerrar'
});
```

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Confirmación Simple
```javascript
import { useConfirmacion } from '../hooks/useConfirmacion';
import ModalConfirmacion from '../componentes/comunes/ModalConfirmacion';

function MiComponente() {
  const confirmacion = useConfirmacion();

  const handleDelete = async () => {
    const confirmar = await confirmacion.mostrar({
      titulo: 'Eliminar elemento',
      mensaje: '¿Estás seguro?',
      tipo: 'danger',
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar'
    });

    if (confirmar) {
      // Ejecutar eliminación
    }
  };

  return (
    <>
      <button onClick={handleDelete}>Eliminar</button>
      
      <ModalConfirmacion
        abierto={confirmacion.estado.abierto}
        onCerrar={confirmacion.cerrar}
        onConfirmar={confirmacion.confirmar}
        titulo={confirmacion.estado.titulo}
        mensaje={confirmacion.estado.mensaje}
        tipo={confirmacion.estado.tipo}
        textoConfirmar={confirmacion.estado.textoConfirmar}
        textoCancelar={confirmacion.estado.textoCancelar}
        cargando={confirmacion.estado.cargando}
      />
    </>
  );
}
```

### Ejemplo 2: Con Acción Asíncrona
```javascript
const handleDelete = async () => {
  await confirmacion.mostrar({
    titulo: 'Eliminar prompt',
    mensaje: '¿Mover a la papelera?',
    tipo: 'warning',
    textoConfirmar: 'Mover',
    textoCancelar: 'Cancelar',
    onConfirmar: async () => {
      // Esta función se ejecuta automáticamente
      await api.delete(`/prompts/${id}`);
      toast.success('Eliminado');
      recargarLista();
    }
  });
};
```

### Ejemplo 3: Sin Callback (Solo Confirmación)
```javascript
const handleAction = async () => {
  const confirmar = await confirmacion.mostrar({
    titulo: 'Continuar',
    mensaje: '¿Deseas continuar con esta acción?',
    tipo: 'info'
  });

  if (confirmar) {
    // Hacer algo
  } else {
    // Cancelado
  }
};
```

---

## 🔄 Migración desde window.confirm()

### Antes (Legacy)
```javascript
const handleDelete = () => {
  if (!window.confirm('¿Eliminar este elemento?')) return;
  
  // Ejecutar eliminación
  api.delete(`/items/${id}`);
};
```

### Después (Moderno)
```javascript
const handleDelete = async () => {
  await confirmacion.mostrar({
    titulo: 'Eliminar elemento',
    mensaje: '¿Estás seguro de que deseas eliminar este elemento?',
    tipo: 'danger',
    textoConfirmar: 'Eliminar',
    textoCancelar: 'Cancelar',
    onConfirmar: async () => {
      await api.delete(`/items/${id}`);
    }
  });
};
```

---

## 🎨 Personalización

### Colores por Tipo
```javascript
const coloresFondo = {
  warning: 'bg-yellow-950/20 border-yellow-900/30',
  danger: 'bg-red-950/20 border-red-900/30',
  info: 'bg-blue-950/20 border-blue-900/30',
  success: 'bg-green-950/20 border-green-900/30'
};

const coloresBoton = {
  warning: 'bg-yellow-600 hover:bg-yellow-700',
  danger: 'bg-red-600 hover:bg-red-700',
  info: 'bg-blue-600 hover:bg-blue-700',
  success: 'bg-green-600 hover:bg-green-700'
};
```

### Iconos por Tipo
```javascript
const iconos = {
  warning: <AlertTriangle size={24} className="text-yellow-500" />,
  danger: <Trash2 size={24} className="text-red-500" />,
  info: <Info size={24} className="text-blue-500" />,
  success: <CheckCircle size={24} className="text-green-500" />
};
```

---

## 🔧 Características Técnicas

### Estados de Carga
El modal muestra automáticamente un spinner cuando `cargando` es `true`:

```javascript
{cargando ? (
  <>
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    <span>Procesando...</span>
  </>
) : (
  textoConfirmar
)}
```

### Prevención de Cierre
Cuando está cargando, el modal no se puede cerrar:
- Click en overlay: Deshabilitado
- Botón X: Oculto
- Tecla Escape: Deshabilitada
- Botón Cancelar: Deshabilitado

### Animaciones
- **Entrada**: `animate-in zoom-in-95 duration-200`
- **Overlay**: `fade-in duration-200`
- **Transiciones**: Suaves en todos los elementos

---

## 📊 Comparación

| Característica | window.confirm() | ModalConfirmacion |
|----------------|------------------|-------------------|
| Personalizable | ❌ | ✅ |
| Animaciones | ❌ | ✅ |
| Estados de carga | ❌ | ✅ |
| Tipos visuales | ❌ | ✅ |
| Accesibilidad | ⚠️ | ✅ |
| Responsive | ⚠️ | ✅ |
| Async/await | ⚠️ | ✅ |
| Callbacks | ❌ | ✅ |
| Estilo consistente | ❌ | ✅ |

---

## 🎯 Casos de Uso Implementados

### 1. Cambios sin Guardar
```javascript
// En Prompts.jsx - handleSelect y handleNew
await confirmacion.mostrar({
  titulo: 'Cambios sin guardar',
  mensaje: 'Tienes cambios sin guardar. ¿Deseas descartarlos?',
  tipo: 'warning',
  textoConfirmar: 'Descartar',
  textoCancelar: 'Cancelar'
});
```

### 2. Mover a Papelera
```javascript
// En Prompts.jsx - handleDelete
await confirmacion.mostrar({
  titulo: 'Mover a la papelera',
  mensaje: 'Podrás recuperarlo más tarde.',
  tipo: 'warning',
  textoConfirmar: 'Mover a papelera',
  textoCancelar: 'Cancelar',
  onConfirmar: async () => {
    await promptsServicio.eliminarPrompt(id, false);
    toast.success('Movido a la papelera');
  }
});
```

### 3. Eliminar Permanentemente
```javascript
// En Papelera.jsx - handleEliminarPermanente
await confirmacion.mostrar({
  titulo: 'Eliminar permanentemente',
  mensaje: 'Esta acción no se puede deshacer.',
  tipo: 'danger',
  textoConfirmar: 'Eliminar permanentemente',
  textoCancelar: 'Cancelar',
  onConfirmar: async () => {
    await promptsServicio.eliminarPrompt(id, true);
    toast.success('Eliminado permanentemente');
  }
});
```

### 4. Vaciar Papelera
```javascript
// En Papelera.jsx - handleVaciarPapelera
await confirmacion.mostrar({
  titulo: 'Vaciar papelera',
  mensaje: `Se eliminarán ${count} prompts permanentemente.`,
  tipo: 'danger',
  textoConfirmar: 'Vaciar papelera',
  textoCancelar: 'Cancelar',
  onConfirmar: async () => {
    await promptsServicio.vaciarPapelera();
    toast.success('Papelera vaciada');
  }
});
```

---

## 🚀 Ventajas

### Para el Usuario
1. **Mejor UX**: Modales consistentes y profesionales
2. **Feedback visual**: Iconos y colores contextuales
3. **Estados claros**: Loading states durante acciones
4. **Accesibilidad**: Cierre con Escape, focus management
5. **Responsive**: Funciona en todos los dispositivos

### Para el Desarrollador
1. **Reutilizable**: Un solo componente para todas las confirmaciones
2. **Type-safe ready**: Fácil de tipar con TypeScript
3. **Async/await**: Sintaxis moderna y limpia
4. **Mantenible**: Lógica centralizada
5. **Testeable**: Fácil de probar unitariamente

---

## 📝 Archivos Modificados

### Nuevos
- `cliente/src/componentes/comunes/ModalConfirmacion.jsx`
- `cliente/src/hooks/useConfirmacion.js`
- `SISTEMA_CONFIRMACION.md`

### Modificados
- `cliente/src/paginas/Prompts.jsx`
- `cliente/src/componentes/prompts/Papelera.jsx`

---

## ✅ Checklist de Implementación

- [x] Componente ModalConfirmacion creado
- [x] Hook useConfirmacion creado
- [x] Reemplazados todos los window.confirm()
- [x] Implementados 4 tipos de confirmación
- [x] Estados de carga funcionando
- [x] Animaciones suaves
- [x] Cierre con Escape
- [x] Prevención de scroll
- [x] Callbacks async
- [x] Sin errores de diagnóstico
- [x] Documentación completa

---

## 🎉 Resultado

El sistema de confirmación está completamente implementado y funcionando. Todos los `window.confirm()` han sido reemplazados por modales modernos y personalizables que mejoran significativamente la experiencia del usuario.

**Versión**: 2.2.0  
**Fecha**: Febrero 2026  
**Mejora**: Sistema de confirmación moderno
