const Input = ({
  etiqueta,
  tipo = 'text',
  nombre,
  valor,
  onChange,
  placeholder,
  error,
  requerido = false,
  deshabilitado = false,
  className = ''
}) => {
  return (
    <div className="w-full">
      {etiqueta && (
        <label htmlFor={nombre} className="block text-xs font-medium text-obsidian-400 mb-1.5 ml-1">
          {etiqueta}
          {requerido && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={tipo}
        id={nombre}
        name={nombre}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        required={requerido}
        disabled={deshabilitado}
        className={`
          w-full px-4 py-2.5 bg-obsidian-900/50 border rounded-lg
          focus:outline-none focus:border-obsidian-500 focus:ring-1 focus:ring-obsidian-500
          text-obsidian-200 placeholder-obsidian-600 text-sm transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-obsidian-800'}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
