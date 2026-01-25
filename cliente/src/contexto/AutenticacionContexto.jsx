import { createContext, useState, useEffect, useContext } from 'react';
import { autenticacionServicio } from '../servicios/autenticacionServicio';

const AutenticacionContexto = createContext(null);

export const ProveedorAutenticacion = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
    setCargando(false);
  }, []);
  
  const iniciarSesion = async (email, contrasena) => {
    const datos = await autenticacionServicio.iniciarSesion(email, contrasena);
    setUsuario(datos.usuario);
    return datos;
  };
  
  const registrar = async (email, contrasena, nombre) => {
    return await autenticacionServicio.registrar(email, contrasena, nombre);
  };
  
  const cerrarSesion = () => {
    autenticacionServicio.cerrarSesion();
    setUsuario(null);
  };
  
  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    registrar,
    cerrarSesion,
    estaAutenticado: !!usuario
  };
  
  return (
    <AutenticacionContexto.Provider value={valor}>
      {children}
    </AutenticacionContexto.Provider>
  );
};

export const useAutenticacion = () => {
  const contexto = useContext(AutenticacionContexto);
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de ProveedorAutenticacion');
  }
  return contexto;
};
