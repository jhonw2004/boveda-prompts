import React from 'react';
import {
    Search, Plus, Hash, Clock, Star, LogOut,
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
    setIsOpen
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
                {/* Workspace Header */}
                <div className={`h-16 flex items-center justify-between px-6 border-b border-obsidian-900 shrink-0 ${!isOpen && 'lg:hidden'}`}>
                    <div className="flex items-center gap-3 opacity-100 transition-opacity cursor-default whitespace-nowrap">
                        <div className="w-8 h-8 rounded-lg bg-obsidian-100 flex items-center justify-center">
                            <FileText size={16} className="text-obsidian-950" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-white">
                            Bóveda de Prompts
                        </span>
                    </div>

                    {/* Collapse Button (Both Mobile & Desktop inside sidebar) */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-obsidian-400 hover:text-white bg-obsidian-900 rounded-md hover:bg-obsidian-800 transition-colors"
                        title="Ocultar barra lateral"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                {/* Content Container - needed to prevent layout shift during width transition on desktop */}
                <div className={`flex-1 flex flex-col min-h-0 w-80 ${!isOpen && 'lg:invisible'}`}>

                    {/* Search & Global Actions */}
                    <div className="px-4 py-6 space-y-6 shrink-0">

                        {/* Main Nav */}
                        <div className="space-y-1">
                            <button
                                onClick={onNew}
                                className="group w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-obsidian-400 hover:text-white hover:bg-obsidian-900 rounded-lg transition-colors"
                            >
                                <div className="w-5 h-5 rounded-full border border-obsidian-700 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all">
                                    <Plus size={12} className="group-hover:text-obsidian-950" />
                                </div>
                                <span>Nueva Nota</span>
                            </button>

                            <button
                                onClick={() => onSelect('database')}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${selectedId === 'database' ? 'bg-obsidian-900 text-white' : 'text-obsidian-400 hover:text-white hover:bg-obsidian-900'}`}
                            >
                                <Hash size={16} />
                                <span>Biblioteca</span>
                            </button>
                        </div>

                        <div className="h-px bg-obsidian-900/50 mx-2"></div>

                        {/* Search Input */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-2.5 text-obsidian-600 group-focus-within:text-white transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full bg-obsidian-900/30 hover:bg-obsidian-900 focus:bg-obsidian-900 border border-transparent focus:border-obsidian-800 text-xs py-2 pl-9 pr-3 rounded-md text-obsidian-300 placeholder-obsidian-700 transition-all font-medium"
                            />
                        </div>

                        {/* Filters */}
                        <div className="space-y-0.5">
                            <button
                                onClick={() => setSoloFavoritos(false)}
                                className={`nav-item ${!soloFavoritos ? 'active' : ''}`}
                            >
                                <Clock size={16} />
                                <span>Recientes</span>
                            </button>
                            <button
                                onClick={() => setSoloFavoritos(true)}
                                className={`nav-item ${soloFavoritos ? 'active' : ''}`}
                            >
                                <Star size={16} />
                                <span>Favoritos</span>
                            </button>
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                        <div className="px-3 py-2 text-[10px] font-bold text-obsidian-600 uppercase tracking-widest">
                            Documentos
                        </div>

                        {cargando ? (
                            <div className="space-y-3 px-2 mt-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex gap-3 p-2">
                                        <div className="w-8 h-8 bg-obsidian-900 rounded-md"></div>
                                        <div className="space-y-2 flex-1 pt-1">
                                            <div className="h-2 bg-obsidian-900 rounded w-3/4"></div>
                                            <div className="h-2 bg-obsidian-900 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : prompts.length === 0 ? (
                            <div className="px-4 py-8 text-center opacity-50">
                                <p className="text-sm text-obsidian-500">No se encontraron prompts</p>
                            </div>
                        ) : (
                            prompts.map((prompt) => (
                                <button
                                    key={prompt.id}
                                    onClick={() => {
                                        onSelect(prompt);
                                        if (window.innerWidth < 1024) setIsOpen(false);
                                    }}
                                    className={`prompt-card group ${selectedId === prompt.id ? 'active' : ''}`}
                                >
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium truncate transition-colors ${selectedId === prompt.id ? 'text-white' : 'text-obsidian-400 group-hover:text-obsidian-200'}`}>
                                                {prompt.titulo || 'Sin título'}
                                            </span>
                                            {prompt.es_favorito && <Star size={10} className="fill-white text-white shrink-0 opacity-80" />}
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] text-obsidian-600 group-hover:text-obsidian-500 transition-colors font-mono">
                                            <span>{formatDate(prompt.actualizado_en)}</span>

                                            {prompt.categoria && (
                                                <>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-obsidian-700" />
                                                    <span className="truncate max-w-[80px]">{prompt.categoria}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}

                        {paginacion && paginacion.pagina < paginacion.totalPaginas && (
                            <button
                                onClick={() => onPaginaCambiar(paginacion.pagina + 1)}
                                className="w-full text-xs text-obsidian-500 hover:text-white py-4 mt-2 border-t border-obsidian-900 border-dashed transition-colors"
                            >
                                Cargar más...
                            </button>
                        )}
                    </div>

                    {/* User Footer */}
                    <div className="p-4 border-t border-obsidian-900 shrink-0 bg-obsidian-950">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-obsidian-900/50 border border-obsidian-800/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-obsidian-800 text-white flex items-center justify-center text-sm font-bold border border-obsidian-700 shrink-0">
                                    {usuario?.nombre?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-white truncate">
                                        {usuario?.nombre}
                                    </span>
                                    <span className="text-[10px] text-obsidian-500 truncate">
                                        Conectado
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 text-obsidian-400 hover:text-red-400 hover:bg-obsidian-800 rounded-lg transition-all shrink-0"
                                title="Cerrar sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default PromptSidebar;
