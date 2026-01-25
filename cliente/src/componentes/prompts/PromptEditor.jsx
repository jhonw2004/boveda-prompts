import React, { useState } from 'react';
import {
    Star, Trash2, Tag, LayoutTemplate,
    ChevronRight, Save, Copy, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import TagInput from '../comunes/TagInput';

const PromptEditor = ({
    formData,
    onChange,
    onSave,
    onDelete,
    onToggleFavorito,
    hasChanges,
    saving,
    isNew
}) => {
    const [showMeta, setShowMeta] = useState(true);
    const [copied, setCopied] = useState(false);

    const adjustHeight = (el) => {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };

    const handleCopy = () => {
        if (!formData.contenido) return;
        navigator.clipboard.writeText(formData.contenido);
        setCopied(true);
        toast.success("Contenido copiado");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-obsidian-950 font-grotesk relative">

            {/* Dynamic Header - Floating Effect */}
            <div className="absolute top-0 right-0 left-0 z-20 px-6 py-6 flex items-center justify-between pointer-events-none">

                {/* Left: Breadcrumbs / Status */}
                <div className="pointer-events-auto flex items-center gap-2 text-xs text-obsidian-500 bg-obsidian-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-obsidian-900/50">
                    <span className="opacity-70">Prompts</span>
                    <ChevronRight size={12} className="opacity-50" />
                    <span className="truncate max-w-[150px] font-medium text-obsidian-300">
                        {formData.titulo || 'Sin título'}
                    </span>
                    {hasChanges && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" title="Sin guardar" />
                    )}
                </div>

                {/* Right: Actions Toolbar */}
                <div className="pointer-events-auto flex items-center gap-1 bg-obsidian-900/80 backdrop-blur-md p-1 rounded-xl border border-obsidian-800 shadow-xl shadow-black/20">
                    <button
                        onClick={onToggleFavorito}
                        className={`btn-icon ${formData.es_favorito ? 'text-white' : 'text-obsidian-400 hover:text-white'}`}
                        title="Favorito"
                    >
                        <Star size={18} className={formData.es_favorito ? 'fill-white' : ''} />
                    </button>

                    <button
                        onClick={() => setShowMeta(!showMeta)}
                        className={`btn-icon ${showMeta ? 'text-white bg-obsidian-800' : 'text-obsidian-400 hover:text-white'}`}
                        title="Detalles"
                    >
                        <LayoutTemplate size={18} />
                    </button>

                    <button
                        onClick={handleCopy}
                        className="btn-icon text-obsidian-400 hover:text-white transition-colors"
                        title="Copiar contenido"
                    >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>

                    <div className="w-px h-4 bg-obsidian-800 mx-1"></div>

                    {!isNew && (
                        <button onClick={onDelete} className="btn-icon text-obsidian-400 hover:text-red-400 transition-colors" title="Eliminar">
                            <Trash2 size={18} />
                        </button>
                    )}

                    <button
                        onClick={onSave}
                        disabled={!hasChanges && !isNew}
                        className={`
               flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
               ${hasChanges || isNew
                                ? 'bg-white text-obsidian-950 hover:bg-obsidian-200'
                                : 'text-obsidian-600 cursor-not-allowed'}
            `}
                    >
                        <Save size={16} />
                        <span className="hidden sm:inline">Guardar</span>
                    </button>
                </div>
            </div>

            {/* Main Surface - Centered Document */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-6 md:px-12 w-full animate-in fade-in duration-500 slide-in-from-bottom-2">

                    {/* Metadata Area (Notion Style) */}
                    {showMeta && (
                        <div className="mb-10 border-b border-obsidian-900 pb-8 space-y-2 animate-in slide-in-from-top-2 duration-300">

                            {/* Property: Category */}
                            <div className="flex items-start text-sm group hover:bg-obsidian-900/30 -mx-2 px-2 py-1.5 rounded transition-colors">
                                <div className="w-32 flex items-center gap-2 text-obsidian-500 shrink-0 select-none">
                                    <LayoutTemplate size={14} className="opacity-70" />
                                    <span>Categoría</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={onChange}
                                        placeholder="Sin categoría"
                                        className="w-full bg-transparent border-none outline-none text-obsidian-200 placeholder-obsidian-700 hover:placeholder-obsidian-600 focus:placeholder-obsidian-500 transition-all cursor-text font-medium"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            {/* Property: Tags */}
                            <div className="flex items-start text-sm group hover:bg-obsidian-900/30 -mx-2 px-2 py-1.5 rounded transition-colors">
                                <div className="w-32 flex items-center gap-2 text-obsidian-500 shrink-0 select-none pt-1.5">
                                    <Tag size={14} className="opacity-70" />
                                    <span>Etiquetas</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <TagInput
                                        value={formData.etiquetas}
                                        onChange={onChange}
                                        placeholder="Añadir etiquetas..."
                                    />
                                </div>
                            </div>

                            {/* Property: Description */}
                            <div className="flex items-start text-sm group hover:bg-obsidian-900/30 -mx-2 px-2 py-1.5 rounded transition-colors">
                                <div className="w-32 flex items-center gap-2 text-obsidian-500 shrink-0 pt-0.5 select-none">
                                    <ChevronRight size={14} className="opacity-70" />
                                    <span>Descripción</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion || ''}
                                        onChange={(e) => {
                                            onChange(e);
                                            adjustHeight(e.target);
                                        }}
                                        placeholder="Añadir una descripción breve..."
                                        rows={1}
                                        className="w-full bg-transparent border-none outline-none text-obsidian-200 placeholder-obsidian-700 hover:placeholder-obsidian-600 focus:placeholder-obsidian-500 resize-none overflow-hidden block transition-all leading-relaxed font-medium"
                                    />
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Document Title */}
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={onChange}
                        placeholder="Título del Prompt"
                        className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder-obsidian-800 mb-8 focus:outline-none leading-tight tracking-tight border-none p-0"
                        autoComplete="off"
                    />

                    {/* Editor Body */}
                    <textarea
                        name="contenido"
                        value={formData.contenido}
                        onChange={(e) => {
                            onChange(e);
                            adjustHeight(e.target);
                        }}
                        onFocus={(e) => adjustHeight(e.target)}
                        placeholder="Comienza a escribir..."
                        className="w-full bg-transparent text-lg md:text-xl text-obsidian-300 placeholder-obsidian-800 resize-none min-h-[50vh] focus:outline-none leading-relaxed font-normal border-none p-0"
                        spellCheck={false}
                    />

                </div>
            </div>
        </div>
    );
};

export default PromptEditor;
