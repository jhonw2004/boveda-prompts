-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hash_contrasena VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  esta_verificado BOOLEAN DEFAULT FALSE,
  token_verificacion VARCHAR(255),
  expira_token_verificacion TIMESTAMP,
  token_reseteo_contrasena VARCHAR(255),
  expira_reseteo_contrasena TIMESTAMP,
  creado_en TIMESTAMP DEFAULT NOW(),
  actualizado_en TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT email_formato CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT longitud_contrasena CHECK (LENGTH(hash_contrasena) >= 60),
  CONSTRAINT longitud_nombre CHECK (nombre IS NULL OR LENGTH(TRIM(nombre)) > 0)
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_token_verificacion ON usuarios(token_verificacion) WHERE token_verificacion IS NOT NULL;
CREATE INDEX idx_usuarios_token_reseteo ON usuarios(token_reseteo_contrasena) WHERE token_reseteo_contrasena IS NOT NULL;

-- Tabla de prompts
CREATE TABLE prompts (
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
CREATE INDEX idx_prompts_usuario_id ON prompts(usuario_id);
CREATE INDEX idx_prompts_creado_en ON prompts(creado_en DESC);
CREATE INDEX idx_prompts_actualizado_en ON prompts(actualizado_en DESC);
CREATE INDEX idx_prompts_categoria ON prompts(categoria) WHERE categoria IS NOT NULL;
CREATE INDEX idx_prompts_es_favorito ON prompts(es_favorito) WHERE es_favorito = TRUE;
CREATE INDEX idx_prompts_eliminado ON prompts(eliminado) WHERE eliminado = FALSE;
CREATE INDEX idx_prompts_etiquetas ON prompts USING GIN(etiquetas);

-- Índice para búsqueda full-text
CREATE INDEX idx_prompts_busqueda ON prompts USING GIN(
  to_tsvector('spanish', COALESCE(titulo, '') || ' ' || COALESCE(contenido, '') || ' ' || COALESCE(descripcion, ''))
);

-- Tabla de categorías (opcional pero recomendada)
CREATE TABLE categorias (
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
CREATE INDEX idx_categorias_usuario_id ON categorias(usuario_id);

-- Trigger para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_columna_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER actualizar_usuarios_actualizado_en
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_columna_actualizado_en();

CREATE TRIGGER actualizar_prompts_actualizado_en
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_columna_actualizado_en();

-- Vista para estadísticas de usuario
CREATE VIEW estadisticas_usuario AS
SELECT 
  u.id as usuario_id,
  u.email,
  COUNT(p.id) as total_prompts,
  COUNT(CASE WHEN p.es_favorito THEN 1 END) as prompts_favoritos,
  COUNT(DISTINCT p.categoria) as total_categorias,
  MAX(p.creado_en) as ultimo_prompt_creado
FROM usuarios u
LEFT JOIN prompts p ON u.id = p.usuario_id
GROUP BY u.id, u.email;
