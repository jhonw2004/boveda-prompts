import { X } from 'lucide-react';

const Modal = ({
  abierto,
  onCerrar,
  titulo,
  children,
  tamano = 'mediano'
}) => {
  if (!abierto) return null;

  const tamanos = {
    pequeno: 'max-w-md',
    mediano: 'max-w-2xl',
    grande: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-grotesk">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm transition-opacity"
        onClick={onCerrar}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-obsidian-900 border border-obsidian-800 rounded-xl shadow-2xl ${tamanos[tamano]} w-full animate-in zoom-in-95 duration-200`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
            <h3 className="text-xl font-bold text-white">{titulo}</h3>
            <button
              onClick={onCerrar}
              className="text-obsidian-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-obsidian-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
