import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertTriangle, X } from 'lucide-react';
import { promptsServicio } from '../../servicios/promptsServicio';
import toast from 'react-hot-toast';
import Modal from '../comunes/Modal';
import ModalConfirmacion from '../comunes/ModalConfirmacion';
import { useConfirmacion } from '../../hooks/useConfirmacion';

const Papelera = ({ abierto, onCerrar, onRestaurar }) => {
    const [prompts, setPrompts] = useState([]);
    const [cargando, setCargando] = useState(true);
    const confirmacion = useConfirmacion();

    useEffect(() => {
        if (abierto) {
            cargarPromptsEliminados();
        }
    }, [abierto]);

    const cargarPromptsEliminados = async () => {
        try {
            setCargando(true);
            const respuesta = await promptsServicio.obtenerPrompts({ 
                eliminado: 'true',
                limite: 100 
            });
            setPrompts(respuesta.prompts);
        } catch (error) {
            toast.error('Error al cargar papelera');
        } finally {
            setCargando(false);
        }
    };

    const handleRestaurar = async (id) => {
        try {
            await promptsServicio.restaurarPrompt(id);
            toast.success('Prompt restaurado');
            setPrompts(prompts.filter(p => p.id !== id));
            onRestaurar?.();
        } catch (error) {
            toast.error('Error al restaurar');
        }
    };

    const handleEliminarPermanente = async (id) => {
        await confirmacion.mostrar({
            titulo: 'Eliminar permanentemente',
            mensaje: '¿Estás seguro? Esta acción no se puede deshacer y el prompt se eliminará para siempre.',
            tipo: 'danger',
            textoConfirmar: 'Eliminar permanentemente',
            textoCancelar: 'Cancelar',
            onConfirmar: async () => {
                await promptsServicio.eliminarPrompt(id, true);
                toast.success('Eliminado permanentemente');
                setPrompts(prompts.filter(p => p.id !== id));
            }
        });
    };

    const handleVaciarPapelera = async () => {
        await confirmacion.mostrar({
            titulo: 'Vaciar papelera',
            mensaje: `¿Estás seguro de que deseas vaciar toda la papelera? Se eliminarán ${prompts.length} ${prompts.length === 1 ? 'prompt' : 'prompts'} permanentemente. Esta acción no se puede deshacer.`,
            tipo: 'danger',
            textoConfirmar: 'Vaciar papelera',
            textoCancelar: 'Cancelar',
            onConfirmar: async () => {
                await promptsServicio.vaciarPapelera();
                toast.success('Papelera vaciada');
                setPrompts([]);
                onCerrar();
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Modal abierto={abierto} onCerrar={onCerrar} titulo="Papelera" tamano="grande">
            <div className="space-y-4">
                {/* Header Actions */}
                {prompts.length > 0 && (
                    <div className="flex items-center justify-between pb-4 border-b border-obsidian-800">
                        <p className="text-sm text-obsidian-400">
                            {prompts.length} {prompts.length === 1 ? 'elemento' : 'elementos'}
                        </p>
                        <button
                            onClick={handleVaciarPapelera}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            Vaciar papelera
                        </button>
                    </div>
                )}

                {/* Content */}
                {cargando ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : prompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-obsidian-500">
                        <Trash2 size={48} className="mb-4 opacity-30" />
                        <p className="text-lg font-medium">La papelera está vacía</p>
                        <p className="text-sm mt-1">Los prompts eliminados aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {prompts.map(prompt => (
                            <div
                                key={prompt.id}
                                className="group flex items-start justify-between p-4 bg-obsidian-900/30 hover:bg-obsidian-900/50 border border-obsidian-800 rounded-lg transition-all"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="font-semibold text-obsidian-200 truncate mb-1">
                                        {prompt.titulo}
                                    </h4>
                                    <p className="text-sm text-obsidian-500 line-clamp-2 mb-2">
                                        {prompt.contenido}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-obsidian-600">
                                        <span>Eliminado: {formatDate(prompt.eliminado_en)}</span>
                                        {prompt.categoria && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-obsidian-700" />
                                                <span>{prompt.categoria}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleRestaurar(prompt.id)}
                                        className="p-2 text-obsidian-400 hover:text-green-400 hover:bg-green-950/30 rounded-lg transition-all"
                                        title="Restaurar"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleEliminarPermanente(prompt.id)}
                                        className="p-2 text-obsidian-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                                        title="Eliminar permanentemente"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Warning */}
                {prompts.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-950/20 border border-yellow-900/30 rounded-lg mt-4">
                        <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200/80">
                            <p className="font-medium mb-1">Los elementos en la papelera se eliminarán automáticamente después de 30 días.</p>
                            <p className="text-xs text-yellow-300/60">Puedes restaurarlos o eliminarlos permanentemente antes de ese tiempo.</p>
                        </div>
                    </div>
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
        </Modal>
    );
};

export default Papelera;
