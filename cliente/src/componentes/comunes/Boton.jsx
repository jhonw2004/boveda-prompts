const Boton = ({
  children,
  tipo = 'button',
  variante = 'primario',
  tamano = 'mediano',
  deshabilitado = false,
  cargando = false,
  onClick,
  className = ''
}) => {
  const variantes = {
    primario: 'bg-white text-obsidian-950 hover:bg-obsidian-200 shadow-lg shadow-white/5 font-semibold',
    secundario: 'bg-obsidian-800 text-obsidian-200 hover:bg-obsidian-700 hover:text-white',
    peligro: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
    exito: 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20',
    outline: 'border border-obsidian-700 text-obsidian-400 hover:text-white hover:border-obsidian-500 bg-transparent'
  };

  const tamanos = {
    pequeno: 'px-3 py-1.5 text-xs',
    mediano: 'px-4 py-2 text-sm',
    grande: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado || cargando}
      className={`
        ${variantes[variante]}
        ${tamanos[tamano]}
        rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        active:scale-[0.98]
        ${className}
      `}
    >
      {cargando && (
        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      )}
      {children}
    </button>
  );
};

export default Boton;
