import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const Registrarse = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [cargando, setCargando] = useState(false);

  const { registrar } = useAutenticacion();
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.contrasena) {
      toast.error('Completa todos los campos');
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (formData.contrasena.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setCargando(true);

    try {
      await registrar(formData.email, formData.contrasena, formData.nombre);
      toast.success('Cuenta creada. Revisa tu email para verificar.');
      navigate('/iniciar-sesion');
    } catch (error) {
      toast.error('Error al registrarse. Intenta con otro email.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-grotesk">

      {/* Background Decor Minimal */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-obsidian-900)_0%,_transparent_100%)] opacity-40 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-[fade-in_0.5s_ease-out]">

        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-obsidian-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors duration-300">
              <Sparkles size={20} className="text-obsidian-950" />
            </div>
            <span className="font-bold text-2xl text-white">Bóveda.ai</span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Crea tu cuenta</h2>
          <p className="text-obsidian-400 text-sm">Únete a miles de creadores de prompts</p>
        </div>

        <div className="card-minimal p-8 shadow-2xl bg-obsidian-900/80 backdrop-blur-xl">
          <form onSubmit={manejarEnvio} className="space-y-4">

            <div className="space-y-2">
              <label className="text-xs font-medium text-obsidian-400 ml-1">Nombre</label>
              <div className="relative group">
                <User className="absolute left-3 top-3 text-obsidian-500 group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={manejarCambio}
                  placeholder="Tu nombre"
                  className="input-minimal pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-obsidian-400 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-obsidian-500 group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={manejarCambio}
                  placeholder="nombre@ejemplo.com"
                  className="input-minimal pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-obsidian-400 ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-obsidian-500 group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={manejarCambio}
                  placeholder="••••••••"
                  className="input-minimal pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-obsidian-400 ml-1">Confirmar</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-obsidian-500 group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={manejarCambio}
                  placeholder="••••••••"
                  className="input-minimal pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              {cargando ? (
                <span className="w-5 h-5 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 pt-6 border-t border-obsidian-800 text-center">
            <p className="text-sm text-obsidian-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/iniciar-sesion" className="text-white hover:underline font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <Link to="/" className="flex items-center justify-center gap-2 mt-8 text-sm text-obsidian-500 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Registrarse;
