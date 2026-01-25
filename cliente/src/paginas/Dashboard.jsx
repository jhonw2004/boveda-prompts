import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { promptsServicio } from '../servicios/promptsServicio';
import BarraNavegacion from '../componentes/layout/BarraNavegacion';
import Cargando from '../componentes/comunes/Cargando';
import { FileText, Star, FolderOpen, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [promptsRecientes, setPromptsRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    cargarDatos();
  }, []);
  
  const cargarDatos = async () => {
    try {
      const [stats, prompts] = await Promise.all([
        promptsServicio.obtenerEstadisticas(),
        promptsServicio.obtenerPrompts({ limite: 5, ordenar: 'creado_desc' })
      ]);
      
      setEstadisticas(stats.estadisticas);
      setPromptsRecientes(prompts.prompts);
    } catch (error) {
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setCargando(false);
    }
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BarraNavegacion />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Cargando mensaje="Cargando dashboard..." />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BarraNavegacion />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen de tu bóveda de prompts</p>
        </div>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Prompts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {estadisticas?.total_prompts || 0}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favoritos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {estadisticas?.prompts_favoritos || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {estadisticas?.total_categorias || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FolderOpen className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actividad</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {estadisticas?.ultimo_prompt_creado 
                    ? new Date(estadisticas.ultimo_prompt_creado).toLocaleDateString('es-ES')
                    : 'Sin actividad'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Prompts Recientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Prompts Recientes
            </h2>
            <Link
              to="/prompts"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Ver todos →
            </Link>
          </div>
          
          {promptsRecientes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Aún no tienes prompts</p>
              <Link
                to="/prompts"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Crear tu Primer Prompt
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {promptsRecientes.map((prompt) => (
                <div
                  key={prompt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {prompt.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {prompt.contenido}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        {prompt.categoria && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {prompt.categoria}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(prompt.creado_en).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                    {prompt.es_favorito && (
                      <Star className="text-yellow-500 fill-yellow-500" size={20} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
