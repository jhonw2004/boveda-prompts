import { AlertTriangle, Trash2, Info, CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

const ModalConfirmacion = ({
  abierto,
  onCerrar,
  onConfirmar,
  titulo,
  mensaje,
  tipo = 'warning', // 'warning', 'danger', 'info', 'success'
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  cargando = false
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && abierto && !cargando) {
        onCerrar();
      }
    };

    if (abierto) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [abierto, onCerrar, cargando]);

  if (!abierto) return null;

  const iconos = {
    warning: <AlertTriangle size={24} className="text-yellow-500" />,
    danger: <Trash2 size={24} className="text-red-500" />,
    info: <Info size={24} className="text-blue-500" />,
    success: <CheckCircle size={24} className="text-green-500" />
  };

  const coloresFondo = {
    warning: 'bg-yellow-950/20 border-yellow-900/30',
    danger: 'bg-red-950/20 border-red-900/30',
    info: 'bg-blue-950/20 border-blue-900/30',
    success: 'bg-green-950/20 border-green-900/30'
  };

  const coloresBoton = {
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-grotesk">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-obsidian-950/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={cargando ? undefined : onCerrar}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-obsidian-900 border border-obsidian-800 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
          
          {/* Icon & Close Button */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl border ${coloresFondo[tipo]}`}>
              {iconos[tipo]}
            </div>
            {!cargando && (
              <button
                onClick={onCerrar}
                className="text-obsidian-500 hover:text-white transition-colors p-1 hover:bg-obsidian-800 rounded-lg"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {titulo}
            </h3>
            <p className="text-sm text-obsidian-300 leading-relaxed">
              {mensaje}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 pb-6">
            <button
              onClick={onCerrar}
              disabled={cargando}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-obsidian-300 hover:text-white bg-obsidian-800 hover:bg-obsidian-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {textoCancelar}
            </button>
            <button
              onClick={onConfirmar}
              disabled={cargando}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${coloresBoton[tipo]}`}
            >
              {cargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                textoConfirmar
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
