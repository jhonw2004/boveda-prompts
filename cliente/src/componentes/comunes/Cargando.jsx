const Cargando = ({ mensaje = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-obsidian-800 border-t-white mb-4"></div>
      <p className="text-obsidian-400 text-sm">{mensaje}</p>
    </div>
  );
};

export default Cargando;
