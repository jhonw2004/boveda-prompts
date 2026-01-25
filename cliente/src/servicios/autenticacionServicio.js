import api from './api';

export const autenticacionServicio = {
  registrar: async (email, contrasena, nombre) => {
    const respuesta = await api.post('/auth/registrar', { email, contrasena, nombre });
    return respuesta.data;
  },
  
  iniciarSesion: async (email, contrasena) => {
    const respuesta = await api.post('/auth/iniciar-sesion', { email, contrasena });
    if (respuesta.data.token) {
      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));
    }
    return respuesta.data;
  },
  
  verificarEmail: async (token) => {
    const respuesta = await api.post('/auth/verificar-email', { token });
    return respuesta.data;
  },
  
  reenviarVerificacion: async (email) => {
    const respuesta = await api.post('/auth/reenviar-verificacion', { email });
    return respuesta.data;
  },
  
  obtenerUsuarioActual: async () => {
    const respuesta = await api.get('/auth/yo');
    return respuesta.data;
  },
  
  cerrarSesion: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
};
