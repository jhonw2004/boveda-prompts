import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

const MenuDropdown = ({ opciones, children, align = 'right' }) => {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setAbierto(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setAbierto(false);
      }
    };

    if (abierto) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [abierto]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setAbierto(!abierto);
  };

  const handleOpcionClick = (e, opcion) => {
    e.stopPropagation();
    opcion.onClick(e);
    setAbierto(false);
  };

  const alignmentClasses = {
    right: 'right-0',
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1.5 text-obsidian-400 hover:text-white hover:bg-obsidian-800 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Más opciones"
      >
        {children || <MoreHorizontal size={16} />}
      </button>

      {abierto && (
        <div
          ref={menuRef}
          className={`absolute ${alignmentClasses[align]} top-full mt-1 z-50 min-w-[160px] bg-obsidian-900 border border-obsidian-800 rounded-lg shadow-xl shadow-black/30 py-1 animate-in fade-in zoom-in-95 duration-150`}
        >
          {opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={(e) => handleOpcionClick(e, opcion)}
              disabled={opcion.disabled}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                opcion.danger
                  ? 'text-red-400 hover:bg-red-950/30 hover:text-red-300'
                  : 'text-obsidian-300 hover:bg-obsidian-800 hover:text-white'
              } ${opcion.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {opcion.icono && <span className="shrink-0">{opcion.icono}</span>}
              <span className="flex-1 text-left">{opcion.label}</span>
              {opcion.shortcut && (
                <span className="text-[10px] text-obsidian-600 font-mono">{opcion.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
