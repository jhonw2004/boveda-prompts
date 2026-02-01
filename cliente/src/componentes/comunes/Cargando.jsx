const Cargando = ({ mensaje = 'Cargando...', tamano = 'mediano' }) => {
  const tamanos = {
    pequeno: 'h-6 w-6',
    mediano: 'h-10 w-10',
    grande: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <div className={`animate-spin rounded-full ${tamanos[tamano]} border-2 border-obsidian-800 border-t-white mb-4`}></div>
      {mensaje && <p className="text-obsidian-400 text-sm font-medium">{mensaje}</p>}
    </div>
  );
};

export default Cargando;
