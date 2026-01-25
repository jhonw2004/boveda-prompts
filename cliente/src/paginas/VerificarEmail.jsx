import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { autenticacionServicio } from '../servicios/autenticacionServicio';
import { CheckCircle, XCircle, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const VerificarEmail = () => {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState('verificando'); // verificando, exito, error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setEstado('error');
      setMensaje('Token de verificación no encontrado');
      return;
    }
    verificarEmail(token);
  }, [searchParams]);

  const verificarEmail = async (token) => {
    try {
      const respuesta = await autenticacionServicio.verificarEmail(token);
      setEstado('exito');
      setMensaje(respuesta.mensaje || 'Email verificado exitosamente');
    } catch (error) {
      setEstado('error');
      setMensaje(error.response?.data?.mensaje || 'Error al verificar email');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-grotesk">

      {/* Simplified Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-obsidian-900)_0%,_transparent_100%)] opacity-40" />
      </div>

      <div className="w-full max-w-md relative z-10 text-center animate-[fade-in_0.5s_ease-out]">

        <Link to="/" className="inline-flex items-center gap-3 mb-10 group hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-obsidian-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors duration-300">
            <Sparkles size={20} className="text-obsidian-950" />
          </div>
          <span className="font-bold text-2xl text-white">Bóveda.ai</span>
        </Link>

        <div className="card-minimal p-8 shadow-2xl bg-obsidian-900/80 backdrop-blur-xl">

          {estado === 'verificando' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-10 w-10 text-white animate-spin mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Verificando...</h3>
              <p className="text-obsidian-400 text-sm">Estamos validando tu enlace de confirmación.</p>
            </div>
          )}

          {estado === 'exito' && (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Email Verificado!</h3>
              <p className="text-obsidian-400 mb-8">{mensaje}</p>

              <Link
                to="/iniciar-sesion"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Iniciar Sesión
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {estado === 'error' && (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enlace inválido o expirado</h3>
              <p className="text-obsidian-400 mb-8 max-w-xs mx-auto">{mensaje}</p>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Link
                  to="/registrarse"
                  className="btn-secondary w-full flex items-center justify-center text-sm"
                >
                  Registrarse
                </Link>
                <Link
                  to="/"
                  className="btn-ghost w-full flex items-center justify-center text-sm border border-obsidian-800"
                >
                  Ir al Inicio
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerificarEmail;
