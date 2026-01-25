import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contexto/AutenticacionContexto';
import { LogOut, User, FileText, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const BarraNavegacion = () => {
  const { usuario, cerrarSesion, estaAutenticado } = useAutenticacion();
  const navigate = useNavigate();

  const manejarCerrarSesion = () => {
    cerrarSesion();
    toast.success('Sesión cerrada exitosamente');
    navigate('/');
  };

  return (
    <nav className="bg-obsidian-950 border-b border-obsidian-900 font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 bg-obsidian-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                <FileText className="h-4 w-4 text-obsidian-950" />
              </div>
              <span className="ml-3 text-lg font-bold text-white group-hover:text-obsidian-200 transition-colors">
                Bóveda de Prompts
              </span>
            </Link>

            {estaAutenticado && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-obsidian-400 hover:text-white transition-colors"
                >
                  <LayoutDashboard size={18} className="mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/prompts"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-obsidian-400 hover:text-white transition-colors"
                >
                  <FileText size={18} className="mr-2" />
                  Mis Prompts
                </Link>
              </div>
            )}
          </div>

          {/* Menú de usuario */}
          <div className="flex items-center space-x-4">
            {estaAutenticado ? (
              <>
                <div className="flex items-center text-sm text-obsidian-300">
                  <User size={18} className="mr-2" />
                  <span className="hidden sm:block">{usuario?.nombre || usuario?.email}</span>
                </div>
                <button
                  onClick={manejarCerrarSesion}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-obsidian-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} className="mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/iniciar-sesion"
                  className="text-obsidian-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registrarse"
                  className="bg-white hover:bg-obsidian-200 text-obsidian-950 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-white/5"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacion;
