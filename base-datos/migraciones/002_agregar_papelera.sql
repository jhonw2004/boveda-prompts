-- Migración para agregar funcionalidad de papelera (soft delete)
-- Fecha: 2026-02-01

-- Agregar columnas para soft delete
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS eliminado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS eliminado_en TIMESTAMP;

-- Crear índice para prompts no eliminados (mejora performance)
CREATE INDEX IF NOT EXISTS idx_prompts_eliminado ON prompts(eliminado) WHERE eliminado = FALSE;

-- Actualizar prompts existentes para asegurar que no estén marcados como eliminados
UPDATE prompts SET eliminado = FALSE WHERE eliminado IS NULL;

-- Comentarios
COMMENT ON COLUMN prompts.eliminado IS 'Indica si el prompt ha sido movido a la papelera';
COMMENT ON COLUMN prompts.eliminado_en IS 'Fecha y hora en que el prompt fue movido a la papelera';
