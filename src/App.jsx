import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import AuthCallback from './pages/AuthCallback';
import LoginButton from './components/LoginButton';
import { revokeToken } from './services/auth';

// Componente para manejar redirección con doble slash y tokens
const DoubleSlashRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    // Normalizar doble slash en el pathname
    const normalizedPath = location.pathname.replace(/^\/+/, '/');
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userParam = searchParams.get("user");

    // Si hay tokens, guardarlos primero
    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      if (userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.warn("No se pudo parsear el usuario de la URL");
        }
      }
    }

    // Redirigir a la ruta normalizada sin parámetros
    navigate(normalizedPath, { replace: true });
  }, [location.pathname, navigate, searchParams]);

  return null;
};

// Componente para manejar tokens en la URL de /chat
const ChatWithTokenHandler = ({ onLogout }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const userParam = searchParams.get("user");

  useEffect(() => {
    // Si hay tokens en la URL, guardarlos y limpiar la URL
    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      if (userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.warn("No se pudo parsear el usuario de la URL");
        }
      }
      // Limpiar los parámetros de la URL
      setSearchParams({}, { replace: true });
    }
  }, [accessToken, refreshToken, userParam, setSearchParams]);

  const token = localStorage.getItem("access_token");
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Inicia sesión para continuar</h2>
          <LoginButton />
        </div>
      </div>
    );
  }
  return <ChatInterface onLogout={onLogout} />;
};

function App() {
  // Función de logout
  const handleLogout = async () => {
    await revokeToken();
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/chat" element={<ChatWithTokenHandler onLogout={handleLogout} />} />
        <Route path="//*" element={<DoubleSlashRedirect />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;