import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUsuario } = useAutenticacion();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Error al iniciar sesión con Google');
      navigate('/iniciar-sesion');
      return;
    }

    if (token) {
      // Guardar token
      localStorage.setItem('token', token);
      setToken(token);

      // Obtener datos del usuario
      fetch(`${import.meta.env.VITE_API_URL}/auth/yo`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.usuario) {
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            setUsuario(data.usuario);
            toast.success('¡Bienvenido!');
            navigate('/prompts');
          } else {
            throw new Error('No se pudo obtener usuario');
          }
        })
        .catch(err => {
          console.error('Error:', err);
          toast.error('Error al obtener datos del usuario');
          navigate('/iniciar-sesion');
        });
    } else {
      toast.error('No se recibió token de autenticación');
      navigate('/iniciar-sesion');
    }
  }, [searchParams, navigate, setToken, setUsuario]);

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-medium">Iniciando sesión...</p>
        <p className="text-obsidian-400 text-sm mt-2">Espera un momento</p>
      </div>
    </div>
  );
};

export default AuthCallback;
