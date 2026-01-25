import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProveedorAutenticacion, useAutenticacion } from './contexto/AutenticacionContexto';

// Páginas
import Inicio from './paginas/Inicio';
import IniciarSesion from './paginas/IniciarSesion';
import Registrarse from './paginas/Registrarse';
import VerificarEmail from './paginas/VerificarEmail';
import Dashboard from './paginas/Dashboard';
import Prompts from './paginas/Prompts';

// Componente para rutas protegidas
const RutaProtegida = ({ children }) => {
  const { estaAutenticado, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return estaAutenticado ? children : <Navigate to="/iniciar-sesion" />;
};

// Componente para rutas públicas (redirige si ya está autenticado)
const RutaPublica = ({ children }) => {
  const { estaAutenticado, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian-500"></div>
      </div>
    );
  }

  // Changed redirect from /dashboard to /prompts
  return !estaAutenticado ? children : <Navigate to="/prompts" />;
};

function App() {
  return (
    <ProveedorAutenticacion>
      <Router>
        <div className="min-h-screen bg-obsidian-950 text-obsidian-200 font-grotesk">
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/"
              element={
                <RutaPublica>
                  <Inicio />
                </RutaPublica>
              }
            />
            <Route
              path="/iniciar-sesion"
              element={
                <RutaPublica>
                  <IniciarSesion />
                </RutaPublica>
              }
            />
            <Route
              path="/registrarse"
              element={
                <RutaPublica>
                  <Registrarse />
                </RutaPublica>
              }
            />
            <Route path="/verificar-email" element={<VerificarEmail />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={<Navigate to="/prompts" replace />}
            />
            <Route
              path="/prompts"
              element={
                <RutaProtegida>
                  <Prompts />
                </RutaProtegida>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Notificaciones toast */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#27272a', /* obsidian-800 */
                color: '#fff',
                border: '1px solid #3f3f46',
                fontFamily: 'Space Grotesk, sans-serif',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#fff',
                  secondary: '#27272a',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ProveedorAutenticacion>
  );
}

export default App;
