import pool from '../config/baseDatos.js';
import { exportarAJSON, exportarAMarkdown, exportarACSV, exportarATXT } from '../utilidades/formatosExportacion.js';

const MAX_TAMANO_EXPORTACION = 500;
const FORMATOS_VALIDOS = ['json', 'markdown', 'csv', 'txt'];

export const exportarPrompts = async (req, res) => {
  try {
    const formato = req.query.formato?.toLowerCase() || 'json';
    const idsPrompts = req.query.ids ? req.query.ids.split(',').map(Number) : null;
    
    // Validar formato
    if (!FORMATOS_VALIDOS.includes(formato)) {
      return res.status(400).json({ 
        error: 'FORMATO_INVALIDO',
        mensaje: `Formato inválido. Formatos válidos: ${FORMATOS_VALIDOS.join(', ')}` 
      });
    }
    
    let consulta, parametros;
    
    if (idsPrompts) {
      // Exportar prompts específicos
      if (idsPrompts.length > MAX_TAMANO_EXPORTACION) {
        return res.status(400).json({ 
          error: 'EXPORTACION_MUY_GRANDE',
          mensaje: `Máximo ${MAX_TAMANO_EXPORTACION} prompts por exportación` 
        });
      }
      
      consulta = `SELECT * FROM prompts WHERE usuario_id = $1 AND id = ANY($2) ORDER BY creado_en DESC`;
      parametros = [req.usuario.id, idsPrompts];
    } else {
      // Exportar todos
      const conteo = await pool.query(
        'SELECT COUNT(*) FROM prompts WHERE usuario_id = $1',
        [req.usuario.id]
      );
      
      if (parseInt(conteo.rows[0].count) > MAX_TAMANO_EXPORTACION) {
        return res.status(400).json({ 
          error: 'EXPORTACION_MUY_GRANDE',
          mensaje: `Tienes ${conteo.rows[0].count} prompts. Máximo ${MAX_TAMANO_EXPORTACION} por exportación. Usa filtros o selecciona prompts específicos.` 
        });
      }
      
      consulta = `SELECT * FROM prompts WHERE usuario_id = $1 ORDER BY creado_en DESC`;
      parametros = [req.usuario.id];
    }
    
    const resultado = await pool.query(consulta, parametros);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ 
        error: 'SIN_PROMPTS',
        mensaje: 'No hay prompts para exportar' 
      });
    }
    
    // Generar archivo según formato
    let contenido, tipoContenido, extension;
    
    switch (formato) {
      case 'json':
        contenido = exportarAJSON(resultado.rows);
        tipoContenido = 'application/json';
        extension = 'json';
        break;
      case 'markdown':
        contenido = exportarAMarkdown(resultado.rows);
        tipoContenido = 'text/markdown';
        extension = 'md';
        break;
      case 'csv':
        contenido = exportarACSV(resultado.rows);
        tipoContenido = 'text/csv';
        extension = 'csv';
        break;
      case 'txt':
        contenido = exportarATXT(resultado.rows);
        tipoContenido = 'text/plain';
        extension = 'txt';
        break;
    }
    
    const nombreArchivo = `prompts_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    res.setHeader('Content-Type', tipoContenido);
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    res.send(contenido);
    
  } catch (error) {
    console.error('Error en exportarPrompts:', error);
    res.status(500).json({ 
      error: 'EXPORTACION_FALLO',
      mensaje: 'Error al exportar prompts' 
    });
  }
};
