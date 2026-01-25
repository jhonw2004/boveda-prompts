// Exportar a JSON
export const exportarAJSON = (prompts) => {
  return JSON.stringify({
    exportado_en: new Date().toISOString(),
    total: prompts.length,
    prompts: prompts.map(p => ({
      titulo: p.titulo,
      contenido: p.contenido,
      descripcion: p.descripcion,
      categoria: p.categoria,
      etiquetas: p.etiquetas,
      es_favorito: p.es_favorito,
      creado_en: p.creado_en,
      actualizado_en: p.actualizado_en
    }))
  }, null, 2);
};

// Exportar a Markdown
export const exportarAMarkdown = (prompts) => {
  let md = `# Mis Prompts\n\n`;
  md += `Exportado el: ${new Date().toLocaleString('es-ES')}\n`;
  md += `Total de prompts: ${prompts.length}\n\n`;
  md += `---\n\n`;
  
  prompts.forEach((p, indice) => {
    md += `## ${indice + 1}. ${p.titulo}\n\n`;
    
    if (p.descripcion) {
      md += `**Descripción**: ${p.descripcion}\n\n`;
    }
    
    if (p.categoria) {
      md += `**Categoría**: ${p.categoria}\n\n`;
    }
    
    if (p.etiquetas && p.etiquetas.length > 0) {
      md += `**Etiquetas**: ${p.etiquetas.join(', ')}\n\n`;
    }
    
    if (p.es_favorito) {
      md += `⭐ **Favorito**\n\n`;
    }
    
    md += `**Fecha de creación**: ${new Date(p.creado_en).toLocaleString('es-ES')}\n\n`;
    
    md += `### Contenido\n\n`;
    md += `${p.contenido}\n\n`;
    md += `---\n\n`;
  });
  
  return md;
};

// Exportar a CSV
export const exportarACSV = (prompts) => {
  const escaparCSV = (str) => {
    if (str === null || str === undefined) return '';
    const s = String(str);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  
  let csv = 'Título,Contenido,Descripción,Categoría,Etiquetas,Favorito,Fecha de Creación,Última Actualización\n';
  
  prompts.forEach(p => {
    csv += [
      escaparCSV(p.titulo),
      escaparCSV(p.contenido),
      escaparCSV(p.descripcion),
      escaparCSV(p.categoria),
      escaparCSV(p.etiquetas?.join('; ')),
      p.es_favorito ? 'Sí' : 'No',
      new Date(p.creado_en).toLocaleString('es-ES'),
      new Date(p.actualizado_en).toLocaleString('es-ES')
    ].join(',') + '\n';
  });
  
  return csv;
};

// Exportar a TXT
export const exportarATXT = (prompts) => {
  let txt = `MIS PROMPTS\n`;
  txt += `${'='.repeat(50)}\n\n`;
  txt += `Exportado el: ${new Date().toLocaleString('es-ES')}\n`;
  txt += `Total de prompts: ${prompts.length}\n\n`;
  txt += `${'='.repeat(50)}\n\n`;
  
  prompts.forEach((p, indice) => {
    txt += `[${indice + 1}] ${p.titulo}\n`;
    txt += `${'-'.repeat(50)}\n`;
    
    if (p.descripcion) {
      txt += `Descripción: ${p.descripcion}\n`;
    }
    
    if (p.categoria) {
      txt += `Categoría: ${p.categoria}\n`;
    }
    
    if (p.etiquetas && p.etiquetas.length > 0) {
      txt += `Etiquetas: ${p.etiquetas.join(', ')}\n`;
    }
    
    if (p.es_favorito) {
      txt += `★ FAVORITO\n`;
    }
    
    txt += `Creado: ${new Date(p.creado_en).toLocaleString('es-ES')}\n`;
    txt += `\nContenido:\n${p.contenido}\n\n`;
    txt += `${'='.repeat(50)}\n\n`;
  });
  
  return txt;
};
