import api from './api';

export const promptsServicio = {
  obtenerPrompts: async (parametros = {}) => {
    const respuesta = await api.get('/prompts', { params: parametros });
    return respuesta.data;
  },
  
  obtenerPromptPorId: async (id) => {
    const respuesta = await api.get(`/prompts/${id}`);
    return respuesta.data;
  },
  
  crearPrompt: async (datos) => {
    const respuesta = await api.post('/prompts', datos);
    return respuesta.data;
  },
  
  actualizarPrompt: async (id, datos) => {
    const respuesta = await api.put(`/prompts/${id}`, datos);
    return respuesta.data;
  },
  
  eliminarPrompt: async (id) => {
    const respuesta = await api.delete(`/prompts/${id}`);
    return respuesta.data;
  },
  
  obtenerEstadisticas: async () => {
    const respuesta = await api.get('/prompts/estadisticas');
    return respuesta.data;
  },
  
  exportarPrompts: async (formato, ids = null) => {
    const parametros = { formato };
    if (ids) parametros.ids = ids.join(',');
    
    const respuesta = await api.get('/exportar', { 
      params: parametros,
      responseType: 'blob'
    });
    
    // Crear descarga
    const url = window.URL.createObjectURL(new Blob([respuesta.data]));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.setAttribute('download', `prompts_${new Date().toISOString().split('T')[0]}.${formato}`);
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    
    return { exito: true };
  }
};
