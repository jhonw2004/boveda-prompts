import React, { useState } from 'react';
import {
    Table, LayoutGrid, List, MoreHorizontal,
    Search, Filter, ChevronDown, Database, Star, Copy, Trash2
} from 'lucide-react';
import MenuDropdown from '../comunes/MenuDropdown';
import ModalConfirmacion from '../comunes/ModalConfirmacion';
import { useConfirmacion } from '../../hooks/useConfirmacion';
import { promptsServicio } from '../../servicios/promptsServicio';
import toast from 'react-hot-toast';

const PromptDatabase = ({ prompts, onSelect, onPromptsChange }) => {
    const [view, setView] = useState('gallery'); // list, table, gallery
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const confirmacion = useConfirmacion();

    // Extract unique categories and tags for filter options
    const categories = [...new Set(prompts.map(p => p.categoria).filter(Boolean))];
    const tags = [...new Set(prompts.flatMap(p => p.etiquetas ? p.etiquetas : []).filter(Boolean))];

    // Filter Logic
    const filteredPrompts = prompts.filter(prompt => {
        const matchesSearch = (prompt.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prompt.contenido?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory ? prompt.categoria === filterCategory : true;
        const matchesTag = filterTag ? (prompt.etiquetas && prompt.etiquetas.includes(filterTag)) : true;

        return matchesSearch && matchesCategory && matchesTag;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const handleCopyContent = (e, prompt) => {
        e.stopPropagation();
        if (prompt.contenido) {
            navigator.clipboard.writeText(prompt.contenido);
            toast.success('Contenido copiado al portapapeles');
        }
    };

    const handleDelete = async (e, prompt) => {
        e.stopPropagation();
        await confirmacion.mostrar({
            titulo: 'Mover a la papelera',
            mensaje: `¿Mover "${prompt.titulo || 'Sin título'}" a la papelera? Podrás recuperarlo más tarde.`,
            tipo: 'warning',
            textoConfirmar: 'Mover a papelera',
            textoCancelar: 'Cancelar',
            onConfirmar: async () => {
                await promptsServicio.eliminarPrompt(prompt.id, false);
                toast.success('Movido a la papelera');
                if (onPromptsChange) onPromptsChange();
            }
        });
    };

    const getMenuOpciones = (prompt) => [
        {
            label: 'Copiar contenido',
            icono: <Copy size={14} />,
            onClick: (e) => handleCopyContent(e, prompt),
            shortcut: '⌘C'
        },
        {
            label: 'Mover a papelera',
            icono: <Trash2 size={14} />,
            onClick: (e) => handleDelete(e, prompt),
            danger: true
        }
    ];

    return (
        <div className="flex flex-col h-full bg-obsidian-950 font-grotesk">

            {/* Database Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-obsidian-900">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-obsidian-900 flex items-center justify-center border border-obsidian-800">
                        <Database size={20} className="sm:w-6 sm:h-6 text-obsidian-200" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Biblioteca</h1>
                        <p className="text-xs sm:text-sm text-obsidian-500 font-medium">{filteredPrompts.length} documentos</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    {/* Top Control Bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex w-full md:w-auto items-center gap-2">
                            {/* View Switcher */}
                            <div className="flex items-center bg-obsidian-900/50 p-1 rounded-lg border border-obsidian-800 shrink-0">
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-obsidian-700 text-white shadow-sm' : 'text-obsidian-400 hover:text-white'}`}
                                    title="Lista"
                                >
                                    <List size={16} />
                                </button>
                                <button
                                    onClick={() => setView('table')}
                                    className={`p-2 rounded-md transition-all hidden sm:block ${view === 'table' ? 'bg-obsidian-700 text-white shadow-sm' : 'text-obsidian-400 hover:text-white'}`}
                                    title="Tabla"
                                >
                                    <Table size={16} />
                                </button>
                                <button
                                    onClick={() => setView('gallery')}
                                    className={`p-2 rounded-md transition-all ${view === 'gallery' ? 'bg-obsidian-700 text-white shadow-sm' : 'text-obsidian-400 hover:text-white'}`}
                                    title="Galería"
                                >
                                    <LayoutGrid size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex w-full md:w-auto gap-3 flex-1 justify-end">
                            {/* Quick Search */}
                            <div className="relative flex-1 md:max-w-md group">
                                <Search className="absolute left-3 top-2.5 text-obsidian-500 group-focus-within:text-white transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-obsidian-900/30 hover:bg-obsidian-900/50 focus:bg-obsidian-900 border border-obsidian-800 focus:border-obsidian-600 rounded-lg py-2 pl-10 pr-4 text-sm text-obsidian-200 placeholder-obsidian-600 outline-none transition-all"
                                />
                            </div>

                            {/* Toggle Filters */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all shrink-0 ${showFilters ? 'bg-obsidian-800 text-white border-obsidian-700' : 'bg-transparent text-obsidian-400 border-transparent hover:bg-obsidian-900 hover:text-white'}`}
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filtros</span>
                                {(filterCategory || filterTag) && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            </button>
                        </div>
                    </div>

                    {/* Expandable Filter Area */}
                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3 p-4 bg-obsidian-900/20 border border-obsidian-800/50 rounded-xl animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 text-sm text-obsidian-500 mr-2">
                                <Filter size={12} />
                                <span className="uppercase tracking-wider text-[10px] font-bold">Filtrar por:</span>
                            </div>

                            {/* Category Select */}
                            <div className="relative">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="appearance-none bg-obsidian-950 border border-obsidian-800 text-obsidian-300 text-xs rounded-md pl-3 pr-8 py-1.5 hover:border-obsidian-600 focus:outline-none focus:border-obsidian-600 cursor-pointer"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-2 text-obsidian-500 pointer-events-none" />
                            </div>

                            {/* Tag Select */}
                            <div className="relative">
                                <select
                                    value={filterTag}
                                    onChange={(e) => setFilterTag(e.target.value)}
                                    className="appearance-none bg-obsidian-950 border border-obsidian-800 text-obsidian-300 text-xs rounded-md pl-3 pr-8 py-1.5 hover:border-obsidian-600 focus:outline-none focus:border-obsidian-600 cursor-pointer"
                                >
                                    <option value="">Todas las etiquetas</option>
                                    {tags.map(t => <option key={t} value={t}>#{t}</option>)}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-2 text-obsidian-500 pointer-events-none" />
                            </div>

                            {/* Clear Filters */}
                            {(filterCategory || filterTag) && (
                                <button
                                    onClick={() => { setFilterCategory(''); setFilterTag(''); }}
                                    className="text-xs text-obsidian-400 hover:text-white ml-auto hover:underline"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">

                {filteredPrompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-obsidian-600 opacity-60">
                        <Search size={32} className="mb-3 opacity-50" />
                        <p className="text-lg">No se encontraron resultados</p>
                        <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                    </div>
                ) : (
                    <>
                        {/*--- LIST VIEW ---*/}
                        {view === 'list' && (
                            <div className="space-y-1.5">
                                {filteredPrompts.map(prompt => (
                                    <div
                                        key={prompt.id}
                                        className="group flex items-center justify-between px-4 py-3.5 rounded-lg border border-transparent hover:bg-obsidian-900 hover:border-obsidian-800 cursor-pointer transition-all"
                                    >
                                        <div 
                                            className="flex items-center gap-4 flex-1 min-w-0"
                                            onClick={() => onSelect(prompt)}
                                        >
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-obsidian-200 group-hover:text-white transition-colors truncate">
                                                        {prompt.titulo || 'Sin título'}
                                                    </span>
                                                    {prompt.es_favorito && (
                                                        <Star size={12} className="fill-yellow-500 text-yellow-500 shrink-0" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs text-obsidian-600 font-mono">
                                                        {formatDate(prompt.actualizado_en)}
                                                    </span>
                                                    {prompt.categoria && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-obsidian-700" />
                                                            <span className="text-xs px-2 py-0.5 rounded-md bg-obsidian-900 text-obsidian-400 border border-obsidian-800">
                                                                {prompt.categoria}
                                                            </span>
                                                        </>
                                                    )}
                                                    {prompt.etiquetas && prompt.etiquetas.slice(0, 2).map((tag, i) => (
                                                        <span key={i} className="text-xs text-obsidian-500">#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <MenuDropdown opciones={getMenuOpciones(prompt)} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/*--- TABLE VIEW ---*/}
                        {view === 'table' && (
                            <div className="border border-obsidian-800 rounded-lg overflow-hidden bg-obsidian-900/20">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-obsidian-900/50 text-obsidian-400 font-medium border-b border-obsidian-800">
                                        <tr>
                                            <th className="px-4 py-3 font-normal">Nombre</th>
                                            <th className="px-4 py-3 font-normal hidden md:table-cell">Categoría</th>
                                            <th className="px-4 py-3 font-normal hidden lg:table-cell">Etiquetas</th>
                                            <th className="px-4 py-3 font-normal hidden sm:table-cell">Fecha</th>
                                            <th className="px-4 py-3 font-normal w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-obsidian-800/50">
                                        {filteredPrompts.map(prompt => (
                                            <tr
                                                key={prompt.id}
                                                className="hover:bg-obsidian-900/40 cursor-pointer transition-colors group"
                                            >
                                                <td 
                                                    className="px-4 py-3.5 text-obsidian-200 font-medium group-hover:text-white"
                                                    onClick={() => onSelect(prompt)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate">{prompt.titulo || 'Sin título'}</span>
                                                        {prompt.es_favorito && (
                                                            <Star size={12} className="fill-yellow-500 text-yellow-500 shrink-0" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 hidden md:table-cell" onClick={() => onSelect(prompt)}>
                                                    {prompt.categoria ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-obsidian-800 text-obsidian-300">
                                                            {prompt.categoria}
                                                        </span>
                                                    ) : <span className="text-obsidian-700">-</span>}
                                                </td>
                                                <td className="px-4 py-3.5 hidden lg:table-cell" onClick={() => onSelect(prompt)}>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {prompt.etiquetas && prompt.etiquetas.length > 0 ? (
                                                            prompt.etiquetas.slice(0, 3).map((t, i) => (
                                                                <span key={i} className="text-xs bg-obsidian-800/50 px-1.5 py-0.5 rounded text-obsidian-400">
                                                                    {t}
                                                                </span>
                                                            ))
                                                        ) : <span className="text-obsidian-700 font-light text-xs">-</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-obsidian-500 text-xs font-mono hidden sm:table-cell" onClick={() => onSelect(prompt)}>
                                                    {formatDate(prompt.actualizado_en)}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <MenuDropdown opciones={getMenuOpciones(prompt)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/*--- GALLERY VIEW ---*/}
                        {view === 'gallery' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                                {filteredPrompts.map(prompt => (
                                    <div
                                        key={prompt.id}
                                        className="group bg-obsidian-900/30 border border-obsidian-800 hover:border-obsidian-600 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 relative"
                                    >
                                        {/* Menu en esquina superior derecha */}
                                        <div className="absolute top-2 right-2 z-10">
                                            <MenuDropdown opciones={getMenuOpciones(prompt)} />
                                        </div>

                                        <div 
                                            onClick={() => onSelect(prompt)}
                                            className="h-full"
                                        >
                                            <div className="h-20 sm:h-24 bg-gradient-to-br from-obsidian-800 to-obsidian-900 border-b border-obsidian-800 p-3 sm:p-4 relative">
                                                {prompt.categoria && (
                                                    <span className="absolute top-2 sm:top-3 left-2 sm:left-3 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-obsidian-400 bg-obsidian-950/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded backdrop-blur-sm">
                                                        {prompt.categoria}
                                                    </span>
                                                )}
                                                {prompt.es_favorito && (
                                                    <Star size={12} className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 fill-yellow-500 text-yellow-500" />
                                                )}
                                            </div>
                                            <div className="p-3 sm:p-4">
                                                <h3 className="font-semibold text-sm sm:text-base text-obsidian-200 mb-1.5 sm:mb-2 truncate group-hover:text-white transition-colors">
                                                    {prompt.titulo || 'Sin título'}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-obsidian-500 line-clamp-2 h-8 sm:h-10 leading-relaxed font-light mb-3">
                                                    {prompt.contenido || 'Sin contenido...'}
                                                </p>
                                                <div className="pt-2 sm:pt-3 border-t border-obsidian-800/50 flex items-center justify-between">
                                                    <span className="text-[10px] sm:text-xs text-obsidian-500 font-mono">
                                                        {formatDate(prompt.actualizado_en)}
                                                    </span>
                                                    {prompt.etiquetas && prompt.etiquetas.length > 0 && (
                                                        <span className="text-[10px] text-obsidian-600">
                                                            {prompt.etiquetas.length} {prompt.etiquetas.length === 1 ? 'etiqueta' : 'etiquetas'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Modal de Confirmación */}
            <ModalConfirmacion
                abierto={confirmacion.estado.abierto}
                onCerrar={confirmacion.cerrar}
                onConfirmar={confirmacion.confirmar}
                titulo={confirmacion.estado.titulo}
                mensaje={confirmacion.estado.mensaje}
                tipo={confirmacion.estado.tipo}
                textoConfirmar={confirmacion.estado.textoConfirmar}
                textoCancelar={confirmacion.estado.textoCancelar}
                cargando={confirmacion.estado.cargando}
            />
        </div>
    );
};

export default PromptDatabase;
