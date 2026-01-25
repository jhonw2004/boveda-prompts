import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Layout,
  Search,
  Database
} from 'lucide-react';

const Inicio = () => {
  return (
    <div className="min-h-screen bg-obsidian-950 font-grotesk selection:bg-obsidian-200/20 selection:text-white overflow-x-hidden">

      {/* Simplified Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-obsidian-900)_0%,_transparent_100%)] opacity-40" />
      </div>

      {/* Navbar Minimal */}
      <nav className="fixed w-full z-50 top-0 px-6 py-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-obsidian-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors duration-300">
              <Sparkles size={16} className="text-obsidian-950" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-obsidian-200 transition-colors">
              Bóveda<span className="text-obsidian-500">.ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/iniciar-sesion" className="text-obsidian-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link to="/registrarse" className="btn-primary py-2 px-5 text-sm">
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section Minimal */}
      <section className="relative pt-48 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl space-y-8 animate-[fade-in_1s_ease-out]">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-obsidian-800 bg-obsidian-900/50 text-xs font-medium text-obsidian-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-obsidian-200"></span>
            v2.0 Minimal
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            Domina tu <br className="hidden md:block" />
            <span className="text-obsidian-400">Inteligencia Artificial.</span>
          </h1>

          <p className="text-xl text-obsidian-400 max-w-xl mx-auto leading-relaxed">
            Un entorno de escritura profesional para tus prompts.
            Sin distracciones. Solo tú y tus ideas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/registrarse"
              className="btn-primary flex items-center gap-2"
            >
              Crear cuenta
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/iniciar-sesion"
              className="btn-secondary"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Interface Preview - Clean */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto transform transition-all hover:scale-[1.005] duration-700">
          <div className="rounded-xl border border-obsidian-800 bg-obsidian-900/50 shadow-2xl p-1">
            <div className="rounded-lg bg-obsidian-950 overflow-hidden border border-obsidian-900 aspect-[16/10] relative">
              {/* Header UI */}
              <div className="h-10 border-b border-obsidian-900 flex items-center px-4 justify-between bg-obsidian-950">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-obsidian-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-obsidian-800" />
                </div>
                <div className="text-[10px] text-obsidian-600 font-mono tracking-wider">PROMPTS / DATABASE</div>
                <div className="w-8" />
              </div>

              <div className="flex h-full">
                {/* Sidebar UI */}
                <div className="w-56 border-r border-obsidian-900 p-4 hidden md:block bg-obsidian-950/50">
                  <div className="h-4 w-24 bg-obsidian-900 rounded mb-6" />
                  {[1, 2, 3].map(i => (
                    <div key={i} className="mb-3">
                      <div className="h-3 w-full bg-obsidian-900/50 rounded mb-2" />
                    </div>
                  ))}
                </div>
                {/* Main Content UI */}
                <div className="flex-1 p-8 space-y-6">
                  <div className="h-8 w-1/3 bg-obsidian-900 rounded" />
                  <div className="space-y-3 pt-4">
                    <div className="h-3 w-full bg-obsidian-900/30 rounded" />
                    <div className="h-3 w-full bg-obsidian-900/30 rounded" />
                    <div className="h-3 w-2/3 bg-obsidian-900/30 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features Minimal */}
      <section className="py-24 px-6 border-t border-obsidian-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="card-minimal p-8 md:col-span-2 group">
              <div className="w-10 h-10 rounded-lg bg-obsidian-800 flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-300">
                <Layout className="text-white group-hover:text-obsidian-950" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Workspace Centralizado</h3>
              <p className="text-obsidian-400">
                Diseño pensado para reducir la carga cognitiva. Todo lo que necesitas está a un atajo de teclado de distancia.
              </p>
            </div>

            <div className="space-y-6">
              <div className="card-minimal p-6 group">
                <Search className="text-obsidian-500 group-hover:text-white mb-4 transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2">Búsqueda Rápida</h3>
                <p className="text-sm text-obsidian-400">Filtros instantáneos por etiquetas.</p>
              </div>
              <div className="card-minimal p-6 group">
                <Database className="text-obsidian-500 group-hover:text-white mb-4 transition-colors" />
                <h3 className="text-lg font-bold text-white mb-2">Local First</h3>
                <p className="text-sm text-obsidian-400">Velocidad nativa en la web.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="border-t border-obsidian-900 bg-obsidian-950 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Organiza tu mente.</h2>
        <div className="flex justify-center gap-8 text-sm text-obsidian-500">
          <Link to="#" className="hover:text-white transition-colors">Privacidad</Link>
          <Link to="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link to="#" className="hover:text-white transition-colors">GitHub</Link>
        </div>
        <p className="mt-8 text-xs text-obsidian-700">© 2026 Bóveda.ai</p>
      </footer>

    </div>
  );
};

export default Inicio;
