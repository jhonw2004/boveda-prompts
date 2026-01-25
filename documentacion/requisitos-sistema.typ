#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 2.5cm),
  numbering: "1",
)

#set text(
  font: "New Computer Modern",
  size: 11pt,
  lang: "es",
)

#set par(
  justify: true,
  leading: 0.65em,
)

#set heading(numbering: "1.1")

// Portada
#align(center)[
  #v(3cm)
  #text(size: 24pt, weight: "bold")[
    Especificación de Requisitos del Sistema
  ]
  
  #v(1cm)
  #text(size: 18pt)[
    Bóveda de Prompts
  ]
  
  #v(0.5cm)
  #text(size: 14pt)[
    Sistema de Gestión Personal de Prompts de IA
  ]
  
  #v(2cm)
  #text(size: 12pt)[
    *Versión:* 1.0 \
    *Fecha:* 13 de enero de 2026 \
    *Estado:* Aprobado
  ]
  
  #v(3cm)
  #text(size: 11pt)[
    _Documento de Planificación y Análisis de Requisitos_
  ]
]

#pagebreak()

// Tabla de contenidos
#outline(
  title: [Tabla de Contenidos],
  indent: auto,
)

#pagebreak()

= Introducción

== Propósito del Documento

Este documento especifica los requisitos funcionales y no funcionales del sistema "Bóveda de Prompts", una aplicación web diseñada para la gestión personal de prompts de inteligencia artificial. El documento está dirigido a desarrolladores, diseñadores y stakeholders del proyecto, proporcionando una visión completa de las funcionalidades, restricciones técnicas y criterios de calidad del sistema.

== Alcance del Proyecto

La Bóveda de Prompts es una aplicación web de tipo CRUD (Create, Read, Update, Delete) que permite a usuarios individuales almacenar, organizar, buscar y exportar sus prompts de IA de manera segura y eficiente. El sistema está diseñado como proyecto de aprendizaje personal, enfocándose en buenas prácticas de desarrollo, seguridad y experiencia de usuario.

=== Objetivos Principales

- Proporcionar una interfaz intuitiva para gestionar prompts de IA
- Garantizar la seguridad y privacidad de los datos del usuario
- Implementar funcionalidades avanzadas de búsqueda y filtrado
- Permitir la exportación de datos en múltiples formatos
- Demostrar implementación de transacciones ACID y manejo de casos borde

=== Fuera del Alcance

- Compartir prompts entre usuarios
- Funcionalidades colaborativas o sociales
- Integración directa con APIs de IA (GPT, Claude, etc.)
- Aplicación móvil nativa
- Monetización o funcionalidades comerciales

== Contexto del Sistema

El sistema opera como una aplicación web cliente-servidor, donde el frontend React se comunica con un backend Express.js mediante una API RESTful. Los datos se almacenan en una base de datos PostgreSQL, garantizando persistencia y consistencia mediante transacciones ACID.

= Stack Tecnológico

== Frontend
- *React 18*: Librería de interfaz de usuario
- *Tailwind CSS v4*: Framework de estilos
- *React Router*: Navegación y rutas
- *Axios*: Cliente HTTP
- *React Hook Form + Zod*: Gestión y validación de formularios
- *Lucide React*: Iconos
- *React Hot Toast*: Notificaciones

== Backend
- *Node.js*: Entorno de ejecución
- *Express.js*: Framework web
- *PostgreSQL*: Base de datos relacional
- *JWT*: Autenticación basada en tokens
- *Bcrypt*: Hash de contraseñas
- *NodeMailer*: Envío de correos electrónicos
- *Express Validator*: Validación de datos
- *Express Rate Limit*: Limitación de peticiones
- *Helmet*: Seguridad de headers HTTP

== Herramientas de Desarrollo
- *Vite*: Build tool y dev server
- *ESLint*: Linter de código
- *Nodemon*: Auto-reload del servidor

= Requisitos Funcionales

== RF-001: Registro de Usuario

*Prioridad:* Alta \
*Descripción:* El sistema debe permitir a nuevos usuarios crear una cuenta proporcionando información básica.

*Criterios de Aceptación:*
- El usuario proporciona email, contraseña y nombre
- El email debe ser único en el sistema
- La contraseña debe cumplir requisitos de seguridad:
  - Mínimo 8 caracteres
  - Al menos una letra mayúscula
  - Al menos un número
- El sistema hashea la contraseña con bcrypt (12 rounds)
- Se genera un token de verificación único
- Se envía email de verificación automáticamente
- El usuario recibe confirmación de registro exitoso

*Casos Borde:*
- Email duplicado (constraint de BD + validación)
- Formato de email inválido
- Contraseña débil
- Fallo en envío de email (no bloquea registro)
- Race condition en creación simultánea

== RF-002: Verificación de Email

*Prioridad:* Alta \
*Descripción:* El sistema debe verificar la dirección de email del usuario mediante un token enviado por correo.

*Criterios de Aceptación:*
- El usuario recibe email con enlace de verificación
- El enlace contiene token único de 32 bytes
- El token expira en 24 horas
- Al hacer clic, el sistema valida el token
- La cuenta se marca como verificada
- El usuario puede iniciar sesión después de verificar

*Casos Borde:*
- Token expirado (mensaje específico)
- Token inválido o no existente
- Usuario ya verificado
- Múltiples intentos de verificación

== RF-003: Reenvío de Verificación

*Prioridad:* Media \
*Descripción:* El sistema debe permitir reenviar el email de verificación si el usuario no lo recibió o expiró.

*Criterios de Aceptación:*
- Usuario puede solicitar nuevo email de verificación
- Se genera nuevo token con nueva expiración
- Rate limiting: máximo 1 email cada 5 minutos
- No revela si el email existe en el sistema (seguridad)
- Funciona solo para usuarios no verificados

*Casos Borde:*
- Usuario ya verificado
- Demasiadas solicitudes (429 Too Many Requests)
- Email no existe (respuesta genérica)

== RF-004: Inicio de Sesión

*Prioridad:* Alta \
*Descripción:* El sistema debe autenticar usuarios registrados y proporcionar acceso mediante JWT.

*Criterios de Aceptación:*
- Usuario proporciona email y contraseña
- Sistema valida credenciales contra BD
- Contraseña se compara con hash almacenado
- Solo usuarios verificados pueden iniciar sesión
- Se genera JWT con expiración de 7 días
- El token incluye ID y email del usuario
- Rate limiting: 5 intentos cada 15 minutos

*Casos Borde:*
- Credenciales incorrectas (mensaje genérico)
- Usuario no verificado (mensaje específico + acción)
- Cuenta bloqueada por intentos fallidos
- Email no existe (mismo mensaje que contraseña incorrecta)

== RF-005: Obtener Usuario Actual

*Prioridad:* Alta \
*Descripción:* El sistema debe permitir obtener información del usuario autenticado.

*Criterios de Aceptación:*
- Requiere JWT válido en header Authorization
- Retorna ID, email, nombre y fecha de creación
- No retorna información sensible (contraseña, tokens)
- Valida expiración del JWT

*Casos Borde:*
- JWT expirado
- JWT inválido o manipulado
- Usuario eliminado pero token válido


== RF-006: Crear Prompt

*Prioridad:* Alta \
*Descripción:* El sistema debe permitir a usuarios autenticados crear nuevos prompts con información detallada.

*Criterios de Aceptación:*
- Usuario proporciona título (requerido, máx 255 caracteres)
- Usuario proporciona contenido (requerido, máx 50,000 caracteres)
- Campos opcionales: descripción, categoría, etiquetas, favorito
- Validación de etiquetas: máximo 10, cada una máximo 50 caracteres
- Límite de 1,000 prompts por usuario
- Se registra fecha de creación automáticamente
- Retorna el prompt creado con ID asignado

*Casos Borde:*
- Título vacío o solo espacios
- Contenido vacío o solo espacios
- Título o contenido exceden límites
- Más de 10 etiquetas
- Etiquetas con caracteres especiales
- Límite de 1,000 prompts alcanzado
- Etiquetas duplicadas (se eliminan)

== RF-007: Listar Prompts con Paginación

*Prioridad:* Alta \
*Descripción:* El sistema debe listar los prompts del usuario con soporte para paginación, búsqueda y filtros.

*Criterios de Aceptación:*
- Paginación: parámetros `pagina` y `limite`
- Límite máximo: 100 prompts por página
- Límite por defecto: 20 prompts por página
- Búsqueda por texto en título, contenido y descripción
- Filtro por categoría
- Filtro por favoritos
- Ordenamiento múltiple:
  - Fecha de creación (ascendente/descendente)
  - Fecha de actualización (ascendente/descendente)
  - Título (alfabético ascendente/descendente)
- Retorna metadatos de paginación (total, páginas, página actual)

*Casos Borde:*
- Página negativa o cero (usar página 1)
- Límite mayor a 100 (usar 100)
- Límite menor a 1 (usar 1)
- Búsqueda con caracteres especiales
- Sin resultados (array vacío)
- Combinación de múltiples filtros

== RF-008: Obtener Prompt por ID

*Prioridad:* Alta \
*Descripción:* El sistema debe permitir obtener un prompt específico por su identificador.

*Criterios de Aceptación:*
- Usuario proporciona ID del prompt
- Sistema valida que el prompt pertenece al usuario
- Retorna todos los campos del prompt
- Incluye fechas de creación y actualización

*Casos Borde:*
- ID no existe
- ID pertenece a otro usuario (404, no 403 por seguridad)
- ID con formato inválido
- Prompt eliminado recientemente

== RF-009: Actualizar Prompt

*Prioridad:* Alta \
*Descripción:* El sistema debe permitir actualizar prompts existentes con control de concurrencia.

*Criterios de Aceptación:*
- Usuario puede actualizar cualquier campo excepto ID y fechas
- Validaciones iguales a creación
- Implementa optimistic locking con campo `actualizado_en`
- Si hay conflicto, retorna datos actuales
- Actualiza automáticamente campo `actualizado_en`
- Permite actualizaciones parciales (solo campos enviados)

*Casos Borde:*
- Prompt no existe
- Prompt pertenece a otro usuario
- Conflicto de versión (actualización concurrente)
- Sin campos para actualizar
- Validaciones fallan (igual que creación)
- Timestamp de versión inválido

== RF-010: Eliminar Prompt

*Prioridad:* Alta \
*Descripción:* El sistema debe permitir eliminar prompts de forma permanente.

*Criterios de Aceptación:*
- Usuario proporciona ID del prompt
- Sistema valida propiedad del prompt
- Eliminación permanente (no soft delete)
- Retorna confirmación de eliminación

*Casos Borde:*
- Prompt no existe
- Prompt pertenece a otro usuario
- Eliminación concurrente (idempotente)

== RF-011: Obtener Estadísticas

*Prioridad:* Media \
*Descripción:* El sistema debe proporcionar estadísticas sobre los prompts del usuario.

*Criterios de Aceptación:*
- Total de prompts
- Total de prompts favoritos
- Total de categorías únicas
- Fecha del último prompt creado
- Cálculo en tiempo real desde BD

*Casos Borde:*
- Usuario sin prompts (valores en cero)
- Categorías nulas (no cuentan)

== RF-012: Exportar Prompts

*Prioridad:* Media \
*Descripción:* El sistema debe permitir exportar prompts en múltiples formatos.

*Criterios de Aceptación:*
- Formatos soportados: JSON, Markdown, CSV, TXT
- Exportación completa (todos los prompts)
- Exportación selectiva (por IDs específicos)
- Límite: 500 prompts por exportación
- Headers apropiados según formato
- Nombres de archivo descriptivos con timestamp

*Casos Borde:*
- Formato inválido (400 Bad Request)
- Sin prompts para exportar
- IDs inválidos en exportación selectiva
- Más de 500 prompts solicitados
- Timeout en exportaciones grandes
- Caracteres especiales en contenido (escape apropiado)

== RF-013: Búsqueda Full-Text

*Prioridad:* Media \
*Descripción:* El sistema debe soportar búsqueda de texto completo en prompts.

*Criterios de Aceptación:*
- Búsqueda en título, contenido y descripción
- Insensible a mayúsculas/minúsculas
- Búsqueda parcial (ILIKE con wildcards)
- Índice GIN para búsqueda eficiente
- Soporte para idioma español

*Casos Borde:*
- Búsqueda vacía (retorna todos)
- Caracteres especiales en búsqueda
- Búsqueda muy larga
- Sin resultados

== RF-014: Gestión de Favoritos

*Prioridad:* Baja \
*Descripción:* El sistema debe permitir marcar prompts como favoritos.

*Criterios de Aceptación:*
- Campo booleano `es_favorito`
- Actualizable mediante RF-009
- Filtrable en listado (RF-007)
- Incluido en estadísticas (RF-011)

== RF-015: Gestión de Categorías

*Prioridad:* Baja \
*Descripción:* El sistema debe soportar categorización de prompts.

*Criterios de Aceptación:*
- Campo texto libre (máx 100 caracteres)
- Filtrable en listado
- Conteo en estadísticas
- Tabla opcional de categorías predefinidas

*Casos Borde:*
- Categoría vacía (permitido, null)
- Categoría muy larga
- Caracteres especiales

== RF-016: Gestión de Etiquetas

*Prioridad:* Media \
*Descripción:* El sistema debe soportar etiquetado múltiple de prompts.

*Criterios de Aceptación:*
- Array de strings
- Máximo 10 etiquetas por prompt
- Máximo 50 caracteres por etiqueta
- Índice GIN para búsqueda eficiente
- Eliminación automática de duplicados

*Casos Borde:*
- Etiquetas duplicadas (normalizar)
- Etiquetas vacías (rechazar)
- Más de 10 etiquetas
- Etiquetas muy largas
- Array vacío (permitido)

= Requisitos No Funcionales

== RNF-001: Seguridad de Contraseñas

*Categoría:* Seguridad \
*Prioridad:* Crítica

*Descripción:* Las contraseñas deben almacenarse de forma segura y cumplir estándares de la industria.

*Criterios:*
- Hash con bcrypt usando 12 rounds (factor de trabajo)
- Nunca almacenar contraseñas en texto plano
- Nunca retornar hashes en respuestas API
- Validación de fortaleza en frontend y backend
- Requisitos mínimos:
  - 8 caracteres
  - 1 mayúscula
  - 1 número

*Métricas:*
- 100% de contraseñas hasheadas
- Tiempo de hash: < 500ms
- 0 exposiciones de contraseñas en logs o respuestas

== RNF-002: Autenticación JWT

*Categoría:* Seguridad \
*Prioridad:* Crítica

*Descripción:* El sistema debe usar JWT para autenticación stateless y segura.

*Criterios:*
- Tokens firmados con HS256
- Secret key de al menos 32 caracteres
- Expiración de 7 días
- Payload mínimo (solo ID y email)
- Validación en cada petición protegida
- Header Authorization con formato Bearer

*Métricas:*
- Validación de token: < 10ms
- 0 tokens sin expiración
- 100% de rutas protegidas validadas

== RNF-003: Prevención de SQL Injection

*Categoría:* Seguridad \
*Prioridad:* Crítica

*Descripción:* El sistema debe prevenir ataques de inyección SQL.

*Criterios:*
- 100% de queries parametrizadas
- Uso de placeholders ($1, $2, etc.)
- Nunca concatenar strings en queries
- Validación de tipos de datos
- Escape automático por pg library

*Métricas:*
- 0 queries con concatenación de strings
- 100% de queries parametrizadas
- Auditoría de código exitosa

== RNF-004: Rate Limiting

*Categoría:* Seguridad \
*Prioridad:* Alta

*Descripción:* El sistema debe limitar peticiones para prevenir abuso.

*Criterios:*
- Login: 5 intentos cada 15 minutos por IP
- Registro: 3 intentos cada hora por IP
- Reenvío de verificación: 1 cada 5 minutos por email
- Respuesta 429 Too Many Requests cuando se excede
- Headers informativos (X-RateLimit-*)

*Métricas:*
- Bloqueo efectivo de ataques de fuerza bruta
- < 1% de falsos positivos
- Tiempo de respuesta 429: < 50ms

== RNF-005: CORS y Headers de Seguridad

*Categoría:* Seguridad \
*Prioridad:* Alta

*Descripción:* El sistema debe configurar CORS y headers de seguridad apropiadamente.

*Criterios:*
- CORS configurado para frontend específico
- Helmet para headers de seguridad:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security
- Content-Type validation

*Métricas:*
- Score A en securityheaders.com
- 0 vulnerabilidades de CORS


== RNF-006: Transacciones ACID

*Categoría:* Integridad de Datos \
*Prioridad:* Crítica

*Descripción:* El sistema debe garantizar propiedades ACID en operaciones críticas.

*Criterios:*
- *Atomicidad:* Uso de BEGIN/COMMIT/ROLLBACK
- *Consistencia:* Constraints de BD + validaciones
- *Aislamiento:* Optimistic locking con `actualizado_en`
- *Durabilidad:* Configuración PostgreSQL apropiada
- Transacciones en:
  - Registro de usuario + envío de email
  - Actualizaciones de prompts
  - Operaciones batch

*Métricas:*
- 0 estados inconsistentes
- 100% de rollback en errores
- Detección de conflictos: 100%

== RNF-007: Optimistic Locking

*Categoría:* Concurrencia \
*Prioridad:* Alta

*Descripción:* El sistema debe manejar actualizaciones concurrentes sin pérdida de datos.

*Criterios:*
- Campo `actualizado_en` como versión
- Validación en UPDATE con WHERE
- Respuesta 409 Conflict si hay conflicto
- Retorno de datos actuales en conflicto
- Cliente debe recargar y reintentar

*Métricas:*
- 100% de conflictos detectados
- 0 pérdidas de datos por concurrencia
- Tiempo de detección: < 5ms

== RNF-008: Validación de Datos

*Categoría:* Integridad de Datos \
*Prioridad:* Alta

*Descripción:* El sistema debe validar todos los datos de entrada en múltiples capas.

*Criterios:*
- Validación en frontend (UX)
- Validación en backend (seguridad)
- Validación en BD (constraints)
- Mensajes de error descriptivos
- Códigos de error consistentes
- Validación de tipos, longitudes, formatos

*Métricas:*
- 100% de endpoints con validación
- 0 datos inválidos en BD
- Tiempo de validación: < 10ms

== RNF-009: Manejo de Errores

*Categoría:* Confiabilidad \
*Prioridad:* Alta

*Descripción:* El sistema debe manejar errores de forma consistente y segura.

*Criterios:*
- Códigos HTTP apropiados
- Estructura de error consistente (ver Apéndice A)
- No exponer stack traces en producción
- Logging de errores en servidor
- Mensajes amigables al usuario
- Acciones sugeridas cuando aplique

*Métricas:*
- 100% de errores manejados
- 0 crashes no controlados
- Tiempo de respuesta de error: < 100ms

== RNF-010: Rendimiento de Consultas

*Categoría:* Rendimiento \
*Prioridad:* Alta

*Descripción:* Las consultas a base de datos deben ser eficientes y escalables.

*Criterios:*
- 12 índices optimizados:
  - B-tree para búsquedas exactas
  - GIN para arrays y full-text
  - Índices parciales para condiciones específicas
- Queries con EXPLAIN ANALYZE
- Paginación obligatoria en listados
- Límites máximos configurados
- Uso de vistas para queries complejas

*Métricas:*
- Listado de prompts: < 100ms
- Búsqueda: < 200ms
- Creación/actualización: < 50ms
- Uso de índices: > 95%

== RNF-011: Paginación

*Categoría:* Rendimiento \
*Prioridad:* Alta

*Descripción:* Los listados deben implementar paginación para evitar sobrecarga.

*Criterios:*
- Límite por defecto: 20 items
- Límite máximo: 100 items
- Offset-based pagination
- Metadatos de paginación en respuesta
- Validación de parámetros

*Métricas:*
- 100% de listados paginados
- Tiempo de respuesta independiente del total
- Memoria constante por petición

== RNF-012: Límites de Recursos

*Categoría:* Escalabilidad \
*Prioridad:* Media

*Descripción:* El sistema debe imponer límites para prevenir abuso de recursos.

*Criterios:*
- Máximo 1,000 prompts por usuario
- Máximo 50,000 caracteres por contenido
- Máximo 10 etiquetas por prompt
- Máximo 500 prompts por exportación
- Timeout de 30 segundos en operaciones largas

*Métricas:*
- 100% de límites aplicados
- 0 operaciones sin timeout
- Uso de memoria predecible

== RNF-013: Envío de Emails

*Categoría:* Comunicación \
*Prioridad:* Media

*Descripción:* El sistema debe enviar emails de forma confiable y segura.

*Criterios:*
- SMTP con TLS (puerto 587)
- Autenticación con App Password
- Templates HTML profesionales
- Fallback a texto plano
- Retry logic (3 intentos)
- Timeout de 10 segundos
- No bloquear registro si falla email

*Métricas:*
- Tasa de entrega: > 95%
- Tiempo de envío: < 5 segundos
- 0 contraseñas en logs

== RNF-014: Usabilidad

*Categoría:* Experiencia de Usuario \
*Prioridad:* Alta

*Descripción:* La interfaz debe ser intuitiva y fácil de usar.

*Criterios:*
- Diseño responsive (móvil, tablet, desktop)
- Estados de carga visibles
- Notificaciones toast para feedback
- Mensajes de error claros
- Confirmaciones para acciones destructivas
- Navegación intuitiva
- Accesibilidad básica (contraste, tamaños)

*Métricas:*
- Tiempo de aprendizaje: < 10 minutos
- Tasa de error de usuario: < 5%
- Satisfacción subjetiva: > 4/5

== RNF-015: Diseño Responsive

*Categoría:* Compatibilidad \
*Prioridad:* Alta

*Descripción:* La aplicación debe funcionar en diferentes tamaños de pantalla.

*Criterios:*
- Breakpoints: móvil (< 640px), tablet (640-1024px), desktop (> 1024px)
- Layout adaptativo con Tailwind
- Touch-friendly en móviles
- Menú hamburguesa en móvil
- Tablas scrollables en móvil

*Métricas:*
- Funcional en 100% de breakpoints
- Score móvil en Lighthouse: > 90
- Sin scroll horizontal

== RNF-016: Tiempo de Respuesta

*Categoría:* Rendimiento \
*Prioridad:* Alta

*Descripción:* El sistema debe responder rápidamente a las peticiones.

*Criterios:*
- Operaciones CRUD: < 200ms (p95)
- Búsqueda: < 300ms (p95)
- Login: < 500ms (p95)
- Exportación: < 5 segundos (p95)
- Carga inicial: < 2 segundos

*Métricas:*
- Medición con herramientas de monitoreo
- 95% de peticiones dentro de límites
- Identificación de cuellos de botella

== RNF-017: Disponibilidad

*Categoría:* Confiabilidad \
*Prioridad:* Media

*Descripción:* El sistema debe estar disponible y recuperarse de fallos.

*Criterios:*
- Manejo graceful de errores de BD
- Reconexión automática a BD
- Health check endpoint
- Logging de errores críticos
- Mensajes de error amigables

*Métricas:*
- Uptime objetivo: > 99% (desarrollo)
- MTTR (Mean Time To Recovery): < 5 minutos
- 0 pérdidas de datos

== RNF-018: Mantenibilidad

*Categoría:* Calidad de Código \
*Prioridad:* Alta

*Descripción:* El código debe ser fácil de entender, modificar y mantener.

*Criterios:*
- Convención de nombres en español:
  - Variables/funciones: camelCase
  - Componentes: PascalCase
  - BD: snake_case
- Estructura modular y organizada
- Separación de responsabilidades
- Comentarios en código complejo
- Documentación completa
- README con instrucciones claras

*Métricas:*
- Complejidad ciclomática: < 10
- Duplicación de código: < 5%
- Cobertura de documentación: 100%

== RNF-019: Escalabilidad

*Categoría:* Escalabilidad \
*Prioridad:* Media

*Descripción:* El sistema debe soportar crecimiento de usuarios y datos.

*Criterios:*
- Arquitectura stateless (JWT)
- Queries optimizadas con índices
- Paginación en todos los listados
- Límites de recursos configurables
- Preparado para caching (futuro)
- Preparado para load balancing (futuro)

*Métricas:*
- Soportar 100 usuarios concurrentes
- Soportar 100,000 prompts totales
- Degradación graceful bajo carga

== RNF-020: Compatibilidad de Navegadores

*Categoría:* Compatibilidad \
*Prioridad:* Media

*Descripción:* La aplicación debe funcionar en navegadores modernos.

*Criterios:*
- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- No soporte para IE11
- Detección de features con graceful degradation

*Métricas:*
- 100% funcional en navegadores soportados
- Mensaje amigable en navegadores no soportados

== RNF-021: Logging

*Categoría:* Observabilidad \
*Prioridad:* Media

*Descripción:* El sistema debe registrar eventos importantes para debugging.

*Criterios:*
- Logs estructurados con niveles (error, warn, info)
- Timestamp en todos los logs
- No loggear información sensible
- Logs de errores con stack trace
- Logs de operaciones críticas
- Rotación de logs (futuro)

*Métricas:*
- 100% de errores loggeados
- 0 datos sensibles en logs
- Logs útiles para debugging


= Modelo de Datos

== Entidades Principales

=== Tabla: usuarios

*Descripción:* Almacena información de usuarios registrados.

*Campos:*
- `id` (SERIAL, PK): Identificador único
- `email` (VARCHAR(255), UNIQUE, NOT NULL): Email del usuario
- `hash_contrasena` (VARCHAR(255), NOT NULL): Hash bcrypt de contraseña
- `nombre` (VARCHAR(100)): Nombre del usuario
- `esta_verificado` (BOOLEAN, DEFAULT FALSE): Estado de verificación
- `token_verificacion` (VARCHAR(255)): Token para verificación de email
- `expira_token_verificacion` (TIMESTAMP): Expiración del token
- `token_reseteo_contrasena` (VARCHAR(255)): Token para reseteo (futuro)
- `expira_reseteo_contrasena` (TIMESTAMP): Expiración del token de reseteo
- `creado_en` (TIMESTAMP, DEFAULT NOW()): Fecha de creación
- `actualizado_en` (TIMESTAMP, DEFAULT NOW()): Fecha de última actualización

*Constraints:*
- Email con formato válido (regex)
- Hash de contraseña mínimo 60 caracteres (bcrypt)
- Nombre no vacío si se proporciona

*Índices:*
- `idx_usuarios_email`: B-tree en email
- `idx_usuarios_token_verificacion`: B-tree parcial en token_verificacion
- `idx_usuarios_token_reseteo`: B-tree parcial en token_reseteo_contrasena

=== Tabla: prompts

*Descripción:* Almacena los prompts creados por usuarios.

*Campos:*
- `id` (SERIAL, PK): Identificador único
- `usuario_id` (INTEGER, FK, NOT NULL): Referencia a usuarios
- `titulo` (VARCHAR(255), NOT NULL): Título del prompt
- `contenido` (TEXT, NOT NULL): Contenido del prompt
- `descripcion` (TEXT): Descripción opcional
- `categoria` (VARCHAR(100)): Categoría del prompt
- `etiquetas` (TEXT[], DEFAULT '{}'): Array de etiquetas
- `es_favorito` (BOOLEAN, DEFAULT FALSE): Marcador de favorito
- `creado_en` (TIMESTAMP, DEFAULT NOW()): Fecha de creación
- `actualizado_en` (TIMESTAMP, DEFAULT NOW()): Fecha de última actualización

*Constraints:*
- Título no vacío, máximo 255 caracteres
- Contenido no vacío, máximo 50,000 caracteres
- Descripción máximo 1,000 caracteres
- Categoría no vacía si se proporciona, máximo 100 caracteres
- Máximo 10 etiquetas
- ON DELETE CASCADE (eliminar prompts si se elimina usuario)

*Índices:*
- `idx_prompts_usuario_id`: B-tree en usuario_id
- `idx_prompts_creado_en`: B-tree descendente en creado_en
- `idx_prompts_actualizado_en`: B-tree descendente en actualizado_en
- `idx_prompts_categoria`: B-tree parcial en categoria
- `idx_prompts_es_favorito`: B-tree parcial en es_favorito
- `idx_prompts_etiquetas`: GIN en etiquetas
- `idx_prompts_busqueda`: GIN para full-text search

=== Tabla: categorias

*Descripción:* Almacena categorías predefinidas por usuario (opcional).

*Campos:*
- `id` (SERIAL, PK): Identificador único
- `usuario_id` (INTEGER, FK, NOT NULL): Referencia a usuarios
- `nombre` (VARCHAR(100), NOT NULL): Nombre de la categoría
- `color` (VARCHAR(7), DEFAULT '\#6366f1'): Color en formato hex
- `creado_en` (TIMESTAMP, DEFAULT NOW()): Fecha de creación

*Constraints:*
- Nombre no vacío
- Color en formato hex (\#RRGGBB)
- Combinación usuario_id + nombre única

*Índices:*
- `idx_categorias_usuario_id`: B-tree en usuario_id

== Relaciones

- *usuarios → prompts*: 1:N (un usuario tiene muchos prompts)
- *usuarios → categorias*: 1:N (un usuario tiene muchas categorías)
- Eliminación en cascada: al eliminar usuario se eliminan sus prompts y categorías

== Triggers

=== actualizar_columna_actualizado_en()

*Descripción:* Actualiza automáticamente el campo `actualizado_en` en cada UPDATE.

*Aplicado a:*
- Tabla usuarios (BEFORE UPDATE)
- Tabla prompts (BEFORE UPDATE)

== Vistas

=== estadisticas_usuario

*Descripción:* Vista materializada con estadísticas agregadas por usuario.

*Campos:*
- `usuario_id`: ID del usuario
- `email`: Email del usuario
- `total_prompts`: Conteo total de prompts
- `prompts_favoritos`: Conteo de prompts favoritos
- `total_categorias`: Conteo de categorías únicas
- `ultimo_prompt_creado`: Fecha del último prompt

= Casos de Uso Principales

== CU-001: Registro y Verificación

*Actor:* Usuario nuevo

*Flujo Principal:*
1. Usuario accede a página de registro
2. Usuario completa formulario (email, contraseña, nombre)
3. Sistema valida datos
4. Sistema crea cuenta con estado no verificado
5. Sistema envía email de verificación
6. Usuario recibe email
7. Usuario hace clic en enlace de verificación
8. Sistema verifica token y marca cuenta como verificada
9. Usuario puede iniciar sesión

*Flujos Alternativos:*
- 3a. Datos inválidos → mostrar errores
- 3b. Email ya existe → mostrar error
- 5a. Fallo en envío de email → permitir reenvío
- 8a. Token expirado → permitir solicitar nuevo token
- 8b. Token inválido → mostrar error

== CU-002: Gestión de Prompts

*Actor:* Usuario autenticado

*Flujo Principal:*
1. Usuario inicia sesión
2. Usuario accede a página de prompts
3. Sistema muestra listado paginado
4. Usuario crea nuevo prompt
5. Sistema valida y guarda prompt
6. Usuario busca prompts por texto
7. Sistema filtra resultados
8. Usuario edita prompt existente
9. Sistema valida y actualiza con optimistic locking
10. Usuario marca prompt como favorito
11. Usuario exporta prompts seleccionados

*Flujos Alternativos:*
- 4a. Límite de 1,000 prompts alcanzado → mostrar error
- 5a. Validación falla → mostrar errores
- 9a. Conflicto de versión → recargar datos actuales
- 11a. Más de 500 prompts → mostrar error

== CU-003: Búsqueda y Filtrado

*Actor:* Usuario autenticado

*Flujo Principal:*
1. Usuario accede a listado de prompts
2. Usuario ingresa término de búsqueda
3. Sistema busca en título, contenido y descripción
4. Usuario aplica filtro de categoría
5. Usuario aplica filtro de favoritos
6. Usuario selecciona ordenamiento
7. Sistema retorna resultados paginados
8. Usuario navega entre páginas

*Flujos Alternativos:*
- 3a. Sin resultados → mostrar mensaje
- 7a. Página fuera de rango → mostrar última página

== CU-004: Exportación de Datos

*Actor:* Usuario autenticado

*Flujo Principal:*
1. Usuario accede a página de prompts
2. Usuario selecciona prompts a exportar (o todos)
3. Usuario selecciona formato (JSON/Markdown/CSV/TXT)
4. Sistema valida límite de 500 prompts
5. Sistema genera archivo en formato solicitado
6. Sistema inicia descarga automática
7. Usuario guarda archivo localmente

*Flujos Alternativos:*
- 4a. Más de 500 prompts → mostrar error
- 5a. Error en generación → mostrar error

= Restricciones y Consideraciones

== Restricciones Técnicas

=== Backend
- Node.js versión 18 o superior
- PostgreSQL versión 14 o superior
- Cuenta de Gmail con App Password para emails
- Puerto 5000 disponible para servidor

=== Frontend
- Navegador moderno con soporte ES6+
- JavaScript habilitado
- Puerto 5173 disponible para dev server

=== Base de Datos
- PostgreSQL con extensión uuid-ossp
- Configuración de encoding UTF-8
- Permisos para crear tablas, índices y triggers

== Consideraciones de Seguridad

=== Almacenamiento de Credenciales
- Variables de entorno para secretos
- Archivos .env excluidos de control de versiones
- JWT_SECRET de al menos 32 caracteres aleatorios
- App Password de Gmail (no contraseña normal)

=== Comunicación
- HTTPS en producción (no implementado en desarrollo)
- CORS restringido a frontend específico
- Headers de seguridad con Helmet

=== Datos Sensibles
- Nunca loggear contraseñas o tokens
- Nunca retornar hashes en API
- Sanitización de datos en logs

== Consideraciones de Rendimiento

=== Optimizaciones Implementadas
- 12 índices en base de datos
- Paginación obligatoria
- Queries parametrizadas
- Conexión pool a PostgreSQL
- Validación temprana de datos

=== Limitaciones Conocidas
- Offset-based pagination (no cursor-based)
- Sin caching implementado
- Sin CDN para assets estáticos
- Sin compresión de respuestas

== Consideraciones de Escalabilidad

=== Preparado Para
- Múltiples instancias de servidor (stateless)
- Load balancing (sin sesiones en servidor)
- Caching de queries frecuentes
- CDN para frontend

=== No Preparado Para
- Millones de usuarios concurrentes
- Petabytes de datos
- Distribución geográfica
- Alta disponibilidad (99.99%+)

= Dependencias Externas

== Servicios de Terceros

=== Gmail SMTP
- *Propósito:* Envío de emails de verificación
- *Dependencia:* Crítica para registro
- *Alternativas:* SendGrid, Mailgun, AWS SES
- *Configuración:* App Password requerido

=== PostgreSQL
- *Propósito:* Almacenamiento persistente
- *Dependencia:* Crítica para todo el sistema
- *Alternativas:* MySQL, MariaDB (requiere migración)
- *Configuración:* Instalación local o servicio cloud

== Librerías de Terceros

=== Backend
- express: Framework web
- pg: Cliente PostgreSQL
- bcrypt: Hash de contraseñas
- jsonwebtoken: Generación y validación JWT
- nodemailer: Envío de emails
- helmet: Headers de seguridad
- cors: Configuración CORS
- express-rate-limit: Rate limiting
- express-validator: Validación de datos

=== Frontend
- react: Librería UI
- react-router-dom: Routing
- axios: Cliente HTTP
- react-hook-form: Gestión de formularios
- zod: Validación de esquemas
- tailwindcss: Framework CSS
- lucide-react: Iconos
- react-hot-toast: Notificaciones

= Plan de Pruebas

== Pruebas Funcionales

=== Autenticación
- Registro con datos válidos
- Registro con email duplicado
- Registro con contraseña débil
- Verificación con token válido
- Verificación con token expirado
- Login con credenciales correctas
- Login con credenciales incorrectas
- Login sin verificar email
- Reenvío de verificación

=== CRUD de Prompts
- Crear prompt válido
- Crear prompt con datos inválidos
- Crear prompt excediendo límite
- Listar prompts con paginación
- Buscar prompts por texto
- Filtrar por categoría y favoritos
- Obtener prompt por ID
- Actualizar prompt
- Actualización concurrente (conflicto)
- Eliminar prompt

=== Exportación
- Exportar en formato JSON
- Exportar en formato Markdown
- Exportar en formato CSV
- Exportar en formato TXT
- Exportar prompts específicos
- Exportar más de 500 prompts (error)

== Pruebas No Funcionales

=== Seguridad
- SQL Injection attempts
- XSS attempts
- CSRF protection
- Rate limiting efectivo
- JWT expiration
- Password strength enforcement

=== Rendimiento
- Tiempo de respuesta bajo carga
- Queries con EXPLAIN ANALYZE
- Uso de índices
- Memoria bajo carga
- Concurrencia (100 usuarios)

=== Usabilidad
- Navegación intuitiva
- Mensajes de error claros
- Estados de carga visibles
- Responsive en diferentes dispositivos

= Glosario

- *ACID:* Atomicity, Consistency, Isolation, Durability - propiedades de transacciones
- *App Password:* Contraseña específica de aplicación generada por Gmail
- *Bcrypt:* Algoritmo de hash de contraseñas con salt
- *CORS:* Cross-Origin Resource Sharing - política de seguridad
- *CRUD:* Create, Read, Update, Delete - operaciones básicas
- *JWT:* JSON Web Token - estándar de autenticación
- *Optimistic Locking:* Control de concurrencia basado en versiones
- *Rate Limiting:* Limitación de peticiones por tiempo
- *Salt:* Datos aleatorios añadidos antes de hashear
- *SQL Injection:* Ataque mediante inyección de código SQL
- *Stateless:* Sin estado en servidor (toda info en token)
- *XSS:* Cross-Site Scripting - ataque de inyección de scripts

= Apéndices

== Apéndice A: Estructura de Respuestas API

=== Respuesta Exitosa
#raw(block: true, lang: "json", "{\n  \"mensaje\": \"Operación exitosa\",\n  \"datos\": { }\n}")

=== Respuesta de Error
#raw(block: true, lang: "json", "{\n  \"error\": \"CODIGO_ERROR\",\n  \"mensaje\": \"Descripción legible del error\",\n  \"accion\": \"ACCION_SUGERIDA\"\n}")

=== Respuesta con Paginación
#raw(block: true, lang: "json", "{\n  \"datos\": [ ],\n  \"paginacion\": {\n    \"pagina\": 1,\n    \"limite\": 20,\n    \"total\": 150,\n    \"totalPaginas\": 8\n  }\n}")

== Apéndice B: Códigos de Error

=== Autenticación
- `EMAIL_INVALIDO`: Formato de email incorrecto
- `EMAIL_EXISTE`: Email ya registrado
- `CONTRASENA_DEBIL`: Contraseña no cumple requisitos
- `CREDENCIALES_INVALIDAS`: Email o contraseña incorrectos
- `EMAIL_NO_VERIFICADO`: Cuenta no verificada
- `TOKEN_INVALIDO`: Token de verificación inválido
- `TOKEN_EXPIRADO`: Token de verificación expirado
- `YA_VERIFICADO`: Email ya verificado
- `DEMASIADAS_SOLICITUDES`: Rate limit excedido

=== Prompts
- `TITULO_REQUERIDO`: Título vacío
- `CONTENIDO_REQUERIDO`: Contenido vacío
- `TITULO_MUY_LARGO`: Título excede 255 caracteres
- `CONTENIDO_MUY_LARGO`: Contenido excede 50,000 caracteres
- `ETIQUETAS_INVALIDAS`: Etiquetas no válidas
- `LIMITE_ALCANZADO`: Límite de 1,000 prompts alcanzado
- `PROMPT_NO_ENCONTRADO`: Prompt no existe o no pertenece al usuario
- `CONFLICTO`: Actualización concurrente detectada
- `SIN_ACTUALIZACIONES`: No hay campos para actualizar

=== Exportación
- `FORMATO_INVALIDO`: Formato de exportación no soportado
- `LIMITE_EXPORTACION`: Más de 500 prompts solicitados

== Apéndice C: Variables de Entorno

=== Backend (.env)
#raw(block: true, "PUERTO=5000\nNODE_ENV=development\nDATABASE_URL=postgresql://user:pass@localhost:5432/boveda_prompts\nJWT_SECRET=secret-key-minimo-32-caracteres\nJWT_EXPIRE=7d\nEMAIL_HOST=smtp.gmail.com\nEMAIL_PORT=587\nEMAIL_USER=email@gmail.com\nEMAIL_PASSWORD=app-password-16-chars\nEMAIL_FROM=Boveda de Prompts\nFRONTEND_URL=http://localhost:5173")

=== Frontend (.env)
#raw(block: true, "VITE_API_URL=http://localhost:5000/api")

== Apéndice D: Comandos Útiles

=== Base de Datos
#raw(block: true, lang: "bash", "# Crear base de datos\ncreatedb boveda_prompts\n\n# Ejecutar migración\npsql -d boveda_prompts -f base-datos/migraciones/001_schema_inicial.sql\n\n# Conectar a BD\npsql -d boveda_prompts\n\n# Ver tablas\n\\dt\n\n# Describir tabla\n\\d usuarios")

=== Desarrollo
#raw(block: true, lang: "bash", "# Instalar dependencias backend\ncd servidor && npm install\n\n# Instalar dependencias frontend\ncd cliente && npm install\n\n# Iniciar backend\ncd servidor && npm run dev\n\n# Iniciar frontend\ncd cliente && npm run dev")

= Conclusiones

Este documento ha especificado de manera exhaustiva los requisitos funcionales y no funcionales del sistema "Bóveda de Prompts". El proyecto implementa:

- *16 requisitos funcionales* cubriendo autenticación, CRUD completo, búsqueda, filtrado y exportación
- *21 requisitos no funcionales* enfocados en seguridad, rendimiento, usabilidad y mantenibilidad
- *Modelo de datos robusto* con 3 tablas, 12 índices, triggers y vistas
- *Manejo de 32+ casos borde* garantizando robustez
- *Transacciones ACID* y optimistic locking para integridad de datos
- *Arquitectura escalable* preparada para crecimiento

El sistema está diseñado como proyecto de aprendizaje, demostrando buenas prácticas de desarrollo web moderno, seguridad, y manejo de casos complejos de concurrencia e integridad de datos.

#v(2cm)

#align(center)[
  *Fin del Documento*
  
  #v(0.5cm)
  
  _Este documento sirve como especificación completa para la implementación del sistema Bóveda de Prompts._
]

