import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptsServicio } from '../servicios/promptsServicio';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import PromptSidebar from '../componentes/prompts/PromptSidebar';
import PromptEditor from '../componentes/prompts/PromptEditor';
import PromptDatabase from '../componentes/prompts/PromptDatabase';
import toast from 'react-hot-toast';
import { Menu, FileText } from 'lucide-react';

const Prompts = () => {
    // Context & Hooks
    const { usuario, cerrarSesion } = useAutenticacion();
    const navigate = useNavigate();

    // Data State
    const [prompts, setPrompts] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Selection & Editing State
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        contenido: '',
        descripcion: '',
        categoria: '',
        etiquetas: '',
        es_favorito: false
    });

    // Dirty Checking
    const [originalData, setOriginalData] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // Filters (Sidebar)
    const [busqueda, setBusqueda] = useState('');
    const [soloFavoritos, setSoloFavoritos] = useState(false);
    const [paginacion, setPaginacion] = useState({ pagina: 1, totalPaginas: 1 });

    // Mobile / UI State
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

    // Initial Load
    useEffect(() => {
        cargarPrompts(1);
    }, [busqueda, soloFavoritos]);

    // Check for changes
    useEffect(() => {
        if (!originalData) {
            setHasChanges(false);
            return;
        }

        const isDirty =
            formData.titulo !== originalData.titulo ||
            formData.contenido !== originalData.contenido ||
            formData.descripcion !== originalData.descripcion ||
            formData.categoria !== originalData.categoria ||
            formData.etiquetas !== originalData.etiquetas ||
            formData.es_favorito !== originalData.es_favorito;

        setHasChanges(isDirty);
    }, [formData, originalData]);

    const cargarPrompts = async (pagina = 1) => {
        try {
            const parametros = {
                pagina,
                ordenar: 'actualizado_desc',
                limite: 20
            };

            if (busqueda) parametros.busqueda = busqueda;
            if (soloFavoritos) parametros.es_favorito = 'true';

            const respuesta = await promptsServicio.obtenerPrompts(parametros);
            setPrompts(respuesta.prompts);
            setPaginacion(respuesta.paginacion || { pagina: 1, totalPaginas: 1 });
            setCargando(false);
        } catch (error) {
            console.error(error);
            toast.error('Error sincronizando prompts');
            setCargando(false);
        }
    };

    /* MODIFIED: Handle specific string commands like 'database' */
    const handleSelect = (promptOrId) => {
        // Check for changes (dirty state checking)
        if (selectedId && selectedId !== 'database' && hasChanges) {
            if (!window.confirm('Tienes cambios sin guardar. ¿Deseas descartarlos?')) {
                return;
            }
        }

        /* Logic to handle switching to Database View */
        if (promptOrId === 'database') {
            setSelectedId('database');
            if (window.innerWidth < 1024) setSidebarOpen(false);
            return;
        }

        /* Logic to handle switching to Editor View with a Prompt */
        const prompt = promptOrId; // It's an object
        setSelectedId(prompt.id);
        const newData = {
            titulo: prompt.titulo,
            contenido: prompt.contenido,
            descripcion: prompt.descripcion || '',
            categoria: prompt.categoria || '',
            etiquetas: prompt.etiquetas?.join(', ') || '',
            es_favorito: prompt.es_favorito
        };
        setFormData(newData);
        setOriginalData(newData);

        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const handleNew = () => {
        if (selectedId && selectedId !== 'database' && hasChanges) {
            if (!window.confirm('Tienes cambios sin guardar. ¿Deseas descartarlos?')) {
                return;
            }
        }

        setSelectedId('new');
        const blankData = {
            titulo: '',
            contenido: '',
            descripcion: '',
            categoria: '',
            etiquetas: '',
            es_favorito: false
        };
        setFormData(blankData);
        setOriginalData(blankData);
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        if (!formData.titulo.trim() || !formData.contenido.trim()) {
            toast.error('Título y contenido son requeridos');
            return;
        }

        setSaving(true);

        const datos = {
            ...formData,
            etiquetas: formData.etiquetas
                .split(',')
                .map(e => e.trim())
                .filter(e => e.length > 0)
        };

        try {
            if (selectedId === 'new') {
                const nuevo = await promptsServicio.crearPrompt(datos);
                toast.success('Prompt creado');
                await cargarPrompts();
                handleNew(); // Reset to new for next
            } else {
                await promptsServicio.actualizarPrompt(selectedId, datos);
                toast.success('Guardado');
                await cargarPrompts();
                setOriginalData(formData);
            }
        } catch (error) {
            toast.error('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (selectedId === 'new') return;
        if (!window.confirm('¿Eliminar este prompt para siempre?')) return;

        try {
            await promptsServicio.eliminarPrompt(selectedId);
            toast.success('Eliminado');
            await cargarPrompts();
            handleSelect('database'); // Return to Library
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const handleToggleFavorito = () => {
        setFormData(prev => ({ ...prev, es_favorito: !prev.es_favorito }));
    };

    const handleLogout = () => {
        cerrarSesion();
        navigate('/');
    };

    return (
        <div className="flex h-screen w-full bg-obsidian-950 overflow-hidden font-grotesk">

            <PromptSidebar
                prompts={prompts}
                cargando={cargando}
                selectedId={selectedId}
                onSelect={handleSelect}
                onNew={handleNew}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                soloFavoritos={soloFavoritos}
                setSoloFavoritos={setSoloFavoritos}
                paginacion={paginacion}
                onPaginaCambiar={(p) => cargarPrompts(p)}
                usuario={usuario}
                onLogout={handleLogout}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col h-full min-w-0 bg-obsidian-950 relative transition-all duration-300">

                {/* Top Navigation Bar - Visible when sidebar is closed */}
                {!sidebarOpen && (
                    <header className="flex items-center justify-between px-4 py-3 border-b border-obsidian-900 bg-obsidian-950/80 backdrop-blur-md shrink-0 animate-in slide-in-from-top-2 duration-200 z-30">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2.5 text-obsidian-400 hover:text-white bg-obsidian-900 border border-obsidian-800 rounded-lg transition-all shadow-sm active:scale-95 group"
                                title="Abrir menú"
                                aria-label="Abrir menú lateral"
                            >
                                <Menu size={20} className="group-hover:scale-105 transition-transform" />
                            </button>

                            <div className="flex items-center gap-2 select-none">
                                <div className="w-8 h-8 rounded-lg bg-obsidian-100 flex items-center justify-center shadow-inner shadow-obsidian-200/50">
                                    <FileText size={16} className="text-obsidian-950" />
                                </div>
                                <span className="font-bold text-sm tracking-tight text-white leading-none">
                                    Bóveda<span className="text-obsidian-500">.ai</span>
                                </span>
                            </div>
                        </div>
                    </header>
                )}

                {/* View Container */}
                <div className="flex-1 min-h-0 relative overflow-hidden">
                    {/* View Switcher Logic */}
                    {(selectedId === 'database' || !selectedId) ? (
                        <PromptDatabase
                            prompts={prompts}
                            onSelect={handleSelect}
                        />
                    ) : (
                        <PromptEditor
                            formData={formData}
                            onChange={handleChange}
                            onSave={handleSave}
                            onDelete={handleDelete}
                            onToggleFavorito={handleToggleFavorito}
                            hasChanges={hasChanges}
                            saving={saving}
                            isNew={selectedId === 'new'}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Prompts;
