import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleGoogleCallback } from "../services/auth";

export default function AuthCallback() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const run = async () => {
      try {
        // Caso 1: Tokens vienen directamente en la URL (backend redirige con tokens)
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const userParam = searchParams.get("user");

        if (accessToken && refreshToken) {
          // Guardar tokens directamente
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
          // Limpiar URL y redirigir
          navigate("/chat", { replace: true });
          return;
        }

        // Caso 2: Código de autorización (flujo OAuth estándar)
        const code = searchParams.get("code");
        if (!code) {
          setError("No se recibió el código de autorización ni los tokens");
          return;
        }

        const data = await handleGoogleCallback(code);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/chat", { replace: true });
      } catch (err) {
        console.error("Error en callback:", err);
        setError(err instanceof Error ? err.message : "Error al autenticar");
      }
    };
    run();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error de autenticación</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = "/chat"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
}
