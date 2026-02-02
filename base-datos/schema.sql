-- ============================================
-- BÓVEDA DE PROMPTS - SCHEMA COMPLETO
-- Versión: 3.0.0 (con OAuth 2.0)
-- Fecha: Febrero 2026
-- ============================================

-- Eliminar tablas existentes si existen (para desarrollo)
-- ADVERTENCIA: Esto eliminará todos los datos
-- DROP TABLE IF EXISTS prompts CASCADE;
-- DROP TABLE IF EXISTS categorias CASCADE;
-- DROP TABLE IF EXISTS usuarios CASCADE;

-- ============================================
-- EXTENSIONES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: USUARIOS (con soporte OAuth)
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hash_contrasena VARCHAR(255),  -- Nullable para usuarios OAuth
  nombre VARCHAR(100),
  
  -- Campos OAuth
  google_id VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  proveedor_auth VARCHAR(50) DEFAULT 'local',  -- 'local', 'google', etc.
  
  -- Verificación (solo para auth local)
  esta_verificado BOOLEAN DEFAULT FALSE,
  token_verificacion VARCHAR(255),
  expira_token_verificacion TIMESTAMP,
  
  -- Reseteo de contraseña (solo para auth local)
  token_reseteo_contrasena VARCHAR(255),
  expira_reseteo_contrasena TIMESTAMP,
  
  -- Timestamps
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT email_formato CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT longitud_nombre CHECK (nombre IS NULL OR LENGTH(TRIM(nombre)) > 0),
  -- Contraseña requerida solo para auth local
  CONSTRAINT contrasena_requerida_local CHECK (
    (proveedor_auth = 'local' AND hash_contrasena IS NOT NULL AND LENGTH(hash_contrasena) >= 60) OR
    (proveedor_auth != 'local')
  )
);

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_google_id ON usuarios(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_proveedor ON usuarios(proveedor_auth);
CREATE INDEX IF NOT EXISTS idx_usuarios_token_verificacion ON usuarios(token_verificacion) WHERE token_verificacion IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_token_reseteo ON usuarios(token_reseteo_contrasena) WHERE token_reseteo_contrasena IS NOT NULL;

-- Comentarios
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con soporte para OAuth 2.0';
COMMENT ON COLUMN usuarios.google_id IS 'ID único del usuario en Google (para OAuth)';
COMMENT ON COLUMN usuarios.avatar_url IS 'URL de la foto de perfil del usuario';
COMMENT ON COLUMN usuarios.proveedor_auth IS 'Proveedor de autenticación: local, google, github, etc.';
COMMENT ON COLUMN usuarios.esta_verificado IS 'Indica si el email del usuario ha sido verificado (auto true para OAuth)';
COMMENT ON COLUMN usuarios.token_verificacion IS 'Token para verificación de email (solo auth local)';
COMMENT ON COLUMN usuarios.token_reseteo_contrasena IS 'Token para reseteo de contraseña (solo auth local)';

-- ============================================
-- TABLA: PROMPTS
-- ============================================

CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  etiquetas TEXT[] DEFAULT '{}',
  es_favorito BOOLEAN DEFAULT FALSE,
  eliminado BOOLEAN DEFAULT FALSE,
  eliminado_en TIMESTAMP,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT titulo_no_vacio CHECK (LENGTH(TRIM(titulo)) > 0 AND LENGTH(titulo) <= 255),
  CONSTRAINT contenido_no_vacio CHECK (LENGTH(TRIM(contenido)) > 0 AND LENGTH(contenido) <= 50000),
  CONSTRAINT longitud_descripcion CHECK (descripcion IS NULL OR LENGTH(descripcion) <= 1000),
  CONSTRAINT categoria_valida CHECK (categoria IS NULL OR (LENGTH(TRIM(categoria)) > 0 AND LENGTH(categoria) <= 100)),
  CONSTRAINT limite_etiquetas CHECK (array_length(etiquetas, 1) IS NULL OR array_length(etiquetas, 1) <= 10)
);

-- Índices para prompts
CREATE INDEX IF NOT EXISTS idx_prompts_usuario_id ON prompts(usuario_id);
CREATE INDEX IF NOT EXISTS idx_prompts_creado_en ON prompts(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_actualizado_en ON prompts(actualizado_en DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_categoria ON prompts(categoria) WHERE categoria IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prompts_es_favorito ON prompts(es_favorito) WHERE es_favorito = TRUE;
CREATE INDEX IF NOT EXISTS idx_prompts_eliminado ON prompts(eliminado) WHERE eliminado = FALSE;
CREATE INDEX IF NOT EXISTS idx_prompts_etiquetas ON prompts USING GIN(etiquetas);

-- Índice para búsqueda full-text
CREATE INDEX IF NOT EXISTS idx_prompts_busqueda ON prompts USING GIN(
  to_tsvector('spanish', COALESCE(titulo, '') || ' ' || COALESCE(contenido, '') || ' ' || COALESCE(descripcion, ''))
);

-- Comentarios
COMMENT ON TABLE prompts IS 'Tabla de prompts de IA';
COMMENT ON COLUMN prompts.eliminado IS 'Indica si el prompt ha sido movido a la papelera (soft delete)';
COMMENT ON COLUMN prompts.eliminado_en IS 'Fecha y hora en que el prompt fue movido a la papelera';
COMMENT ON COLUMN prompts.es_favorito IS 'Indica si el prompt está marcado como favorito';
COMMENT ON COLUMN prompts.etiquetas IS 'Array de etiquetas para categorización adicional';

-- ============================================
-- TABLA: CATEGORIAS (Opcional)
-- ============================================

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1',
  creado_en TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT nombre_categoria_no_vacio CHECK (LENGTH(TRIM(nombre)) > 0),
  CONSTRAINT formato_color CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT categoria_unica_por_usuario UNIQUE(usuario_id, nombre)
);

-- Índices para categorías
CREATE INDEX IF NOT EXISTS idx_categorias_usuario_id ON categorias(usuario_id);

-- Comentarios
COMMENT ON TABLE categorias IS 'Tabla de categorías personalizadas por usuario';
COMMENT ON COLUMN categorias.color IS 'Color en formato hexadecimal para la categoría';

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar automáticamente la columna actualizado_en
CREATE OR REPLACE FUNCTION actualizar_columna_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para usuarios
DROP TRIGGER IF EXISTS actualizar_usuarios_actualizado_en ON usuarios;
CREATE TRIGGER actualizar_usuarios_actualizado_en
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_columna_actualizado_en();

-- Trigger para prompts
DROP TRIGGER IF EXISTS actualizar_prompts_actualizado_en ON prompts;
CREATE TRIGGER actualizar_prompts_actualizado_en
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_columna_actualizado_en();

-- ============================================
-- VISTAS
-- ============================================

-- Vista para estadísticas de usuario
CREATE OR REPLACE VIEW estadisticas_usuario AS
SELECT 
  u.id as usuario_id,
  u.email,
  u.nombre,
  u.proveedor_auth,
  COUNT(p.id) as total_prompts,
  COUNT(CASE WHEN p.es_favorito AND NOT p.eliminado THEN 1 END) as prompts_favoritos,
  COUNT(CASE WHEN p.eliminado THEN 1 END) as prompts_en_papelera,
  COUNT(DISTINCT p.categoria) as total_categorias,
  MAX(p.creado_en) as ultimo_prompt_creado,
  MAX(p.actualizado_en) as ultimo_prompt_actualizado
FROM usuarios u
LEFT JOIN prompts p ON u.id = p.usuario_id
GROUP BY u.id, u.email, u.nombre, u.proveedor_auth;

-- Comentarios
COMMENT ON VIEW estadisticas_usuario IS 'Vista con estadísticas agregadas por usuario';

-- ============================================
-- FUNCIÓN DE LIMPIEZA AUTOMÁTICA DE PAPELERA
-- ============================================

-- Función para limpiar prompts eliminados hace más de 30 días
CREATE OR REPLACE FUNCTION limpiar_papelera_antigua()
RETURNS INTEGER AS $$
DECLARE
  prompts_eliminados INTEGER;
BEGIN
  DELETE FROM prompts 
  WHERE eliminado = true 
  AND eliminado_en < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS prompts_eliminados = ROW_COUNT;
  
  RETURN prompts_eliminados;
END;
$$ LANGUAGE plpgsql;

-- Comentarios
COMMENT ON FUNCTION limpiar_papelera_antigua() IS 'Elimina permanentemente prompts que llevan más de 30 días en la papelera';

-- ============================================
-- DATOS INICIALES (Opcional)
-- ============================================

-- Puedes descomentar esto para crear un usuario de prueba
/*
INSERT INTO usuarios (email, nombre, proveedor_auth, esta_verificado)
VALUES ('test@example.com', 'Usuario de Prueba', 'google', true)
ON CONFLICT (email) DO NOTHING;
*/
