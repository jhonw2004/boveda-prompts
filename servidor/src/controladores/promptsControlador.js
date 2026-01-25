import pool from '../config/baseDatos.js';

const MAX_PROMPTS_POR_USUARIO = 1000;
const MAX_ETIQUETAS = 10;
const MAX_LONGITUD_ETIQUETA = 50;

// Validar etiquetas
const validarEtiquetas = (etiquetas) => {
  if (!Array.isArray(etiquetas)) {
    return { valido: false, error: 'Etiquetas debe ser un array' };
  }
  
  if (etiquetas.length > MAX_ETIQUETAS) {
    return { valido: false, error: `Máximo ${MAX_ETIQUETAS} etiquetas permitidas` };
  }
  
  for (const etiqueta of etiquetas) {
    if (typeof etiqueta !== 'string') {
      return { valido: false, error: 'Cada etiqueta debe ser un string' };
    }
    
    if (etiqueta.trim().length === 0) {
      return { valido: false, error: 'Las etiquetas no pueden estar vacías' };
    }
    
    if (etiqueta.length > MAX_LONGITUD_ETIQUETA) {
      return { valido: false, error: `Cada etiqueta debe tener máximo ${MAX_LONGITUD_ETIQUETA} caracteres` };
    }
  }
  
  // Eliminar duplicados
  const etiquetasUnicas = [...new Set(etiquetas.map(e => e.trim().toLowerCase()))];
  
  return { valido: true, etiquetas: etiquetasUnicas };
};

// Crear prompt
export const crearPrompt = async (req, res) => {
  try {
    const { titulo, contenido, descripcion, categoria, etiquetas, es_favorito } = req.body;
    
    // Validaciones
    if (!titulo || titulo.trim().length === 0) {
      return res.status(400).json({ 
        error: 'TITULO_REQUERIDO',
        mensaje: 'El título es requerido' 
      });
    }
    
    if (titulo.length > 255) {
      return res.status(400).json({ 
        error: 'TITULO_MUY_LARGO',
        mensaje: 'El título debe tener máximo 255 caracteres' 
      });
    }
    
    if (!contenido || contenido.trim().length === 0) {
      return res.status(400).json({ 
        error: 'CONTENIDO_REQUERIDO',
        mensaje: 'El contenido es requerido' 
      });
    }
    
    if (contenido.length > 50000) {
      return res.status(400).json({ 
        error: 'CONTENIDO_MUY_LARGO',
        mensaje: 'El contenido debe tener máximo 50,000 caracteres' 
      });
    }
    
    // Validar etiquetas
    let etiquetasValidadas = [];
    if (etiquetas) {
      const validacionEtiquetas = validarEtiquetas(etiquetas);
      if (!validacionEtiquetas.valido) {
        return res.status(400).json({ 
          error: 'ETIQUETAS_INVALIDAS',
          mensaje: validacionEtiquetas.error 
        });
      }
      etiquetasValidadas = validacionEtiquetas.etiquetas;
    }
    
    // Verificar límite de prompts
    const resultadoConteo = await pool.query(
      'SELECT COUNT(*) FROM prompts WHERE usuario_id = $1',
      [req.usuario.id]
    );
    
    if (parseInt(resultadoConteo.rows[0].count) >= MAX_PROMPTS_POR_USUARIO) {
      return res.status(429).json({ 
        error: 'LIMITE_ALCANZADO',
        mensaje: `Has alcanzado el límite de ${MAX_PROMPTS_POR_USUARIO} prompts` 
      });
    }
    
    // Crear prompt
    const resultado = await pool.query(
      `INSERT INTO prompts (usuario_id, titulo, contenido, descripcion, categoria, etiquetas, es_favorito)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.usuario.id,
        titulo.trim(),
        contenido.trim(),
        descripcion?.trim() || null,
        categoria?.trim() || null,
        etiquetasValidadas,
        es_favorito || false
      ]
    );
    
    res.status(201).json({
      mensaje: 'Prompt creado exitosamente',
      prompt: resultado.rows[0]
    });
    
  } catch (error) {
    console.error('Error en crearPrompt:', error);
    res.status(500).json({ 
      error: 'CREACION_FALLO',
      mensaje: 'Error al crear prompt' 
    });
  }
};

// Obtener todos los prompts del usuario (con paginación y filtros)
export const obtenerPrompts = async (req, res) => {
  try {
    const pagina = Math.max(1, parseInt(req.query.pagina) || 1);
    const limite = Math.min(100, Math.max(1, parseInt(req.query.limite) || 20));
    const desplazamiento = (pagina - 1) * limite;
    
    const { busqueda, categoria, es_favorito, ordenar } = req.query;
    
    let consulta = 'SELECT * FROM prompts WHERE usuario_id = $1';
    let consultaConteo = 'SELECT COUNT(*) FROM prompts WHERE usuario_id = $1';
    const parametros = [req.usuario.id];
    let indiceParam = 2;
    
    // Filtro de búsqueda
    if (busqueda) {
      consulta += ` AND (titulo ILIKE $${indiceParam} OR contenido ILIKE $${indiceParam} OR descripcion ILIKE $${indiceParam})`;
      consultaConteo += ` AND (titulo ILIKE $${indiceParam} OR contenido ILIKE $${indiceParam} OR descripcion ILIKE $${indiceParam})`;
      parametros.push(`%${busqueda}%`);
      indiceParam++;
    }
    
    // Filtro de categoría
    if (categoria) {
      consulta += ` AND categoria = $${indiceParam}`;
      consultaConteo += ` AND categoria = $${indiceParam}`;
      parametros.push(categoria);
      indiceParam++;
    }
    
    // Filtro de favoritos
    if (es_favorito === 'true') {
      consulta += ` AND es_favorito = true`;
      consultaConteo += ` AND es_favorito = true`;
    }
    
    // Ordenamiento
    const ordenamientosValidos = {
      'creado_desc': 'creado_en DESC',
      'creado_asc': 'creado_en ASC',
      'actualizado_desc': 'actualizado_en DESC',
      'actualizado_asc': 'actualizado_en ASC',
      'titulo_asc': 'titulo ASC',
      'titulo_desc': 'titulo DESC'
    };
    
    const ordenarPor = ordenamientosValidos[ordenar] || 'creado_en DESC';
    consulta += ` ORDER BY ${ordenarPor}`;
    
    // Paginación
    consulta += ` LIMIT $${indiceParam} OFFSET $${indiceParam + 1}`;
    parametros.push(limite, desplazamiento);
    
    // Ejecutar queries en paralelo
    const [prompts, conteo] = await Promise.all([
      pool.query(consulta, parametros),
      pool.query(consultaConteo, parametros.slice(0, indiceParam - 1))
    ]);
    
    res.json({
      prompts: prompts.rows,
      paginacion: {
        pagina,
        limite,
        total: parseInt(conteo.rows[0].count),
        totalPaginas: Math.ceil(parseInt(conteo.rows[0].count) / limite)
      }
    });
    
  } catch (error) {
    console.error('Error en obtenerPrompts:', error);
    res.status(500).json({ 
      error: 'OBTENCION_FALLO',
      mensaje: 'Error al obtener prompts' 
    });
  }
};

// Obtener un prompt por ID
export const obtenerPromptPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resultado = await pool.query(
      'SELECT * FROM prompts WHERE id = $1 AND usuario_id = $2',
      [id, req.usuario.id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ 
        error: 'PROMPT_NO_ENCONTRADO',
        mensaje: 'Prompt no encontrado' 
      });
    }
    
    res.json({ prompt: resultado.rows[0] });
    
  } catch (error) {
    console.error('Error en obtenerPromptPorId:', error);
    res.status(500).json({ 
      error: 'OBTENCION_FALLO',
      mensaje: 'Error al obtener prompt' 
    });
  }
};

// Actualizar prompt (con optimistic locking)
export const actualizarPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, descripcion, categoria, etiquetas, es_favorito, actualizado_en } = req.body;
    
    // Validaciones
    if (titulo !== undefined && titulo.trim().length === 0) {
      return res.status(400).json({ 
        error: 'TITULO_REQUERIDO',
        mensaje: 'El título no puede estar vacío' 
      });
    }
    
    if (titulo !== undefined && titulo.length > 255) {
      return res.status(400).json({ 
        error: 'TITULO_MUY_LARGO',
        mensaje: 'El título debe tener máximo 255 caracteres' 
      });
    }
    
    if (contenido !== undefined && contenido.trim().length === 0) {
      return res.status(400).json({ 
        error: 'CONTENIDO_REQUERIDO',
        mensaje: 'El contenido no puede estar vacío' 
      });
    }
    
    if (contenido !== undefined && contenido.length > 50000) {
      return res.status(400).json({ 
        error: 'CONTENIDO_MUY_LARGO',
        mensaje: 'El contenido debe tener máximo 50,000 caracteres' 
      });
    }
    
    // Validar etiquetas
    let etiquetasValidadas = undefined;
    if (etiquetas !== undefined) {
      const validacionEtiquetas = validarEtiquetas(etiquetas);
      if (!validacionEtiquetas.valido) {
        return res.status(400).json({ 
          error: 'ETIQUETAS_INVALIDAS',
          mensaje: validacionEtiquetas.error 
        });
      }
      etiquetasValidadas = validacionEtiquetas.etiquetas;
    }
    
    // Construir query dinámicamente
    const actualizaciones = [];
    const parametros = [];
    let indiceParam = 1;
    
    if (titulo !== undefined) {
      actualizaciones.push(`titulo = $${indiceParam++}`);
      parametros.push(titulo.trim());
    }
    
    if (contenido !== undefined) {
      actualizaciones.push(`contenido = $${indiceParam++}`);
      parametros.push(contenido.trim());
    }
    
    if (descripcion !== undefined) {
      actualizaciones.push(`descripcion = $${indiceParam++}`);
      parametros.push(descripcion?.trim() || null);
    }
    
    if (categoria !== undefined) {
      actualizaciones.push(`categoria = $${indiceParam++}`);
      parametros.push(categoria?.trim() || null);
    }
    
    if (etiquetasValidadas !== undefined) {
      actualizaciones.push(`etiquetas = $${indiceParam++}`);
      parametros.push(etiquetasValidadas);
    }
    
    if (es_favorito !== undefined) {
      actualizaciones.push(`es_favorito = $${indiceParam++}`);
      parametros.push(es_favorito);
    }
    
    if (actualizaciones.length === 0) {
      return res.status(400).json({ 
        error: 'SIN_ACTUALIZACIONES',
        mensaje: 'No hay campos para actualizar' 
      });
    }
    
    actualizaciones.push(`actualizado_en = NOW()`);
    
    // Agregar condiciones WHERE
    parametros.push(id, req.usuario.id);
    let clausulaWhere = `WHERE id = $${indiceParam++} AND usuario_id = $${indiceParam++}`;
    
    // Optimistic locking
    if (actualizado_en) {
      clausulaWhere += ` AND actualizado_en = $${indiceParam++}`;
      parametros.push(actualizado_en);
    }
    
    const consulta = `
      UPDATE prompts 
      SET ${actualizaciones.join(', ')}
      ${clausulaWhere}
      RETURNING *
    `;
    
    const resultado = await pool.query(consulta, parametros);
    
    if (resultado.rows.length === 0) {
      // Verificar si existe
      const existe = await pool.query(
        'SELECT actualizado_en FROM prompts WHERE id = $1 AND usuario_id = $2',
        [id, req.usuario.id]
      );
      
      if (existe.rows.length === 0) {
        return res.status(404).json({ 
          error: 'PROMPT_NO_ENCONTRADO',
          mensaje: 'Prompt no encontrado' 
        });
      }
      
      // Conflicto de versión
      return res.status(409).json({ 
        error: 'CONFLICTO',
        mensaje: 'El prompt fue modificado recientemente. Recarga y vuelve a intentar',
        datosActuales: existe.rows[0]
      });
    }
    
    res.json({
      mensaje: 'Prompt actualizado exitosamente',
      prompt: resultado.rows[0]
    });
    
  } catch (error) {
    console.error('Error en actualizarPrompt:', error);
    res.status(500).json({ 
      error: 'ACTUALIZACION_FALLO',
      mensaje: 'Error al actualizar prompt' 
    });
  }
};

// Eliminar prompt
export const eliminarPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resultado = await pool.query(
      'DELETE FROM prompts WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [id, req.usuario.id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ 
        error: 'PROMPT_NO_ENCONTRADO',
        mensaje: 'Prompt no encontrado' 
      });
    }
    
    res.json({ mensaje: 'Prompt eliminado exitosamente' });
    
  } catch (error) {
    console.error('Error en eliminarPrompt:', error);
    res.status(500).json({ 
      error: 'ELIMINACION_FALLO',
      mensaje: 'Error al eliminar prompt' 
    });
  }
};

// Obtener estadísticas
export const obtenerEstadisticas = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT 
        COUNT(*) as total_prompts,
        COUNT(CASE WHEN es_favorito THEN 1 END) as prompts_favoritos,
        COUNT(DISTINCT categoria) as total_categorias,
        MAX(creado_en) as ultimo_prompt_creado
       FROM prompts 
       WHERE usuario_id = $1`,
      [req.usuario.id]
    );
    
    res.json({ estadisticas: resultado.rows[0] });
    
  } catch (error) {
    console.error('Error en obtenerEstadisticas:', error);
    res.status(500).json({ 
      error: 'ESTADISTICAS_FALLO',
      mensaje: 'Error al obtener estadísticas' 
    });
  }
};
