import React from 'react';
import {
    Search, Plus, Hash, Clock, Star, LogOut, Trash2,
    FileText, PanelLeftClose, PanelLeft
} from 'lucide-react';

const PromptSidebar = ({
    prompts,
    cargando,
    selectedId,
    onSelect,
    onNew,
    busqueda,
    setBusqueda,
    soloFavoritos,
    setSoloFavoritos,
    paginacion,
    onPaginaCambiar,
    usuario,
    onLogout,
    isOpen,
    setIsOpen,
    onAbrirPapelera
}) => {

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`
                    fixed lg:relative inset-y-0 left-0 z-50
                    bg-obsidian-950 border-r border-obsidian-900
                    flex flex-col h-full transform transition-all duration-300 ease-in-out
                    shadow-2xl lg:shadow-none
                    ${isOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0 w-80 lg:w-0 lg:border-none lg:overflow-hidden'}
                `}
            >
                {/* Workspace Header - Compacto */}
                <div className={`h-12 flex items-center justify-between px-4 border-b border-obsidian-900 shrink-0 ${!isOpen && 'lg:hidden'}`}>
                    <div className="flex items-center gap-2 opacity-100 transition-opacity cursor-default whitespace-nowrap">
                        <div className="w-6 h-6 rounded-md bg-obsidian-100 flex items-center justify-center">
                            <FileText size={13} className="text-obsidian-950" />
                        </div>
                        <span className="font-bold text-xs tracking-tight text-white">
                            Bóveda
                        </span>
                    </div>

                    {/* Collapse Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 text-obsidian-400 hover:text-white bg-obsidian-900 rounded-md hover:bg-obsidian-800 transition-colors"
                        title="Ocultar barra lateral"
                    >
                        <PanelLeftClose size={16} />
                    </button>
                </div>

                {/* Content Container - needed to prevent layout shift during width transition on desktop */}
                <div className={`flex-1 flex flex-col min-h-0 w-80 ${!isOpen && 'lg:invisible'}`}>

                    {/* Search & Global Actions - Optimizado */}
                    <div className="px-3 py-3 space-y-3 shrink-0">

                        {/* Botón Nueva Nota - Destacado */}
                        <button
                            onClick={onNew}
                            className="group w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-obsidian-950 bg-white hover:bg-obsidian-100 rounded-lg transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={16} />
                            <span>Nueva Nota</span>
                        </button>

                        {/* Search Input - Compacto */}
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-2 text-obsidian-600 group-focus-within:text-white transition-colors pointer-events-none" size={13} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full bg-obsidian-900/30 hover:bg-obsidian-900 focus:bg-obsidian-900 border border-transparent focus:border-obsidian-800 text-xs py-1.5 pl-8 pr-2.5 rounded-md text-obsidian-300 placeholder-obsidian-700 transition-all"
                            />
                        </div>

                        {/* Filters - Compactos */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onSelect('database')}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${selectedId === 'database' ? 'bg-obsidian-900 text-white' : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900/50'}`}
                                title="Biblioteca"
                            >
                                <Hash size={13} />
                                <span className="hidden sm:inline">Todo</span>
                            </button>
                            <button
                                onClick={() => setSoloFavoritos(!soloFavoritos)}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all ${soloFavoritos ? 'bg-obsidian-900 text-white' : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900/50'}`}
                                title="Favoritos"
                            >
                                <Star size={13} className={soloFavoritos ? 'fill-white' : ''} />
                                <span className="hidden sm:inline">Fav</span>
                            </button>
                            <button
                                onClick={onAbrirPapelera}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium text-obsidian-400 hover:text-white hover:bg-obsidian-900/50 rounded-md transition-all"
                                title="Papelera"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable List - Optimizado */}
                    <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
                        {/* Header con contador */}
                        <div className="sticky top-0 bg-obsidian-950 z-10 pb-2 pt-1">
                            <div className="flex items-center justify-between px-2 py-1">
                                <span className="text-[10px] font-bold text-obsidian-600 uppercase tracking-wider">
                                    Notas
                                </span>
                                {!cargando && prompts.length > 0 && (
                                    <span className="text-[10px] font-mono text-obsidian-700 bg-obsidian-900 px-1.5 py-0.5 rounded">
                                        {prompts.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        {cargando ? (
                            <div className="space-y-2 mt-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="animate-pulse p-2 rounded-lg bg-obsidian-900/30">
                                        <div className="h-3 bg-obsidian-900 rounded w-3/4 mb-2"></div>
                                        <div className="h-2 bg-obsidian-900 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : prompts.length === 0 ? (
                            <div className="px-3 py-12 text-center">
                                <FileText size={32} className="mx-auto mb-3 text-obsidian-800 opacity-50" />
                                <p className="text-xs text-obsidian-600">No hay notas</p>
                            </div>
                        ) : (
                            <div className="space-y-0.5">
                                {prompts.map((prompt) => (
                                    <button
                                        key={prompt.id}
                                        onClick={() => {
                                            onSelect(prompt);
                                            if (window.innerWidth < 1024) setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-2 py-2 rounded-lg transition-all duration-150 group ${
                                            selectedId === prompt.id 
                                                ? 'bg-obsidian-900 border border-obsidian-800' 
                                                : 'border border-transparent hover:bg-obsidian-900/40 hover:border-obsidian-800/50'
                                        }`}
                                    >
                                        {/* Título y favorito */}
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <span className={`text-xs font-medium leading-tight line-clamp-2 transition-colors ${
                                                selectedId === prompt.id ? 'text-white' : 'text-obsidian-300 group-hover:text-obsidian-200'
                                            }`}>
                                                {prompt.titulo || 'Sin título'}
                                            </span>
                                            {prompt.es_favorito && (
                                                <Star size={10} className="fill-yellow-500 text-yellow-500 shrink-0 mt-0.5 opacity-80" />
                                            )}
                                        </div>

                                        {/* Metadata compacta */}
                                        <div className="flex items-center gap-1.5 text-[9px] text-obsidian-600 group-hover:text-obsidian-500 transition-colors">
                                            <span className="font-mono">{formatDate(prompt.actualizado_en)}</span>
                                            
                                            {prompt.categoria && (
                                                <>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-obsidian-700" />
                                                    <span className="truncate max-w-[100px] bg-obsidian-900/50 px-1.5 py-0.5 rounded">
                                                        {prompt.categoria}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Preview del contenido - solo si está seleccionado */}
                                        {selectedId === prompt.id && prompt.contenido && (
                                            <p className="text-[10px] text-obsidian-500 line-clamp-2 mt-1.5 leading-relaxed">
                                                {prompt.contenido}
                                            </p>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Cargar más - Compacto */}
                        {paginacion && paginacion.pagina < paginacion.totalPaginas && (
                            <button
                                onClick={() => onPaginaCambiar(paginacion.pagina + 1)}
                                className="w-full text-[10px] text-obsidian-500 hover:text-white py-3 mt-2 border-t border-obsidian-900 border-dashed transition-colors font-medium"
                            >
                                Cargar más ({paginacion.totalPaginas - paginacion.pagina} páginas)
                            </button>
                        )}
                    </div>

                    {/* User Footer - Compacto */}
                    <div className="p-3 border-t border-obsidian-900 shrink-0 bg-obsidian-950">
                        <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-obsidian-900/30 hover:bg-obsidian-900/50 transition-colors group">
                            <div className="flex items-center gap-2 overflow-hidden min-w-0">
                                <div className="w-7 h-7 rounded-md bg-obsidian-800 text-white flex items-center justify-center text-xs font-bold border border-obsidian-700 shrink-0">
                                    {usuario?.nombre?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-medium text-white truncate">
                                        {usuario?.nombre}
                                    </span>
                                    <span className="text-[9px] text-obsidian-600 truncate">
                                        En línea
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-1.5 text-obsidian-500 hover:text-red-400 hover:bg-obsidian-800 rounded-md transition-all shrink-0 opacity-0 group-hover:opacity-100"
                                title="Cerrar sesión"
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default PromptSidebar;
