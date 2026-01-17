import { useState } from 'react';
import { apiFetch } from '../services/api';
import { refreshToken } from '../services/auth';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text, threadId) => {
    // Validaciones iniciales
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.warn("Intento de enviar mensaje vacío o inválido");
      return;
    }

    if (!threadId || typeof threadId !== 'string') {
      console.warn("threadId no válido, generando uno nuevo");
      threadId = `session-${Math.random().toString(36).slice(2, 11)}`;
    }

    // 1. Agregar mensaje del usuario al estado local
    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Petición al endpoint con timeout usando apiFetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout

      let response;
      try {
        response = await apiFetch('/api/v1/chat/query', {
          method: 'POST',
          body: JSON.stringify({ 
            text: text.trim(), 
            thread_id: threadId 
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error("La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.");
        }
        throw fetchError;
      }

      // Manejar 401 - token expirado, intentar refrescar
      if (response.status === 401) {
        try {
          const tokenData = await refreshToken();
          localStorage.setItem("access_token", tokenData.access_token);
          localStorage.setItem("refresh_token", tokenData.refresh_token);
          
          // Reintentar la petición con el nuevo token
          response = await apiFetch('/api/v1/chat/query', {
            method: 'POST',
            body: JSON.stringify({ 
              text: text.trim(), 
              thread_id: threadId 
            }),
            signal: controller.signal
          });
        } catch (refreshError) {
          // Si el refresh falla, redirigir al login
          localStorage.clear();
          window.location.href = '/';
          return;
        }
      }

      if (!response.ok) {
        let errorText = '';
        let errorMessage = `Error del servidor: ${response.status}`;
        
        try {
          errorText = await response.text();
        } catch (textError) {
          console.error("Error al leer el texto de error:", textError);
          // Si no podemos leer el texto, usar el código de estado
          if (response.status === 500) {
            errorMessage = "Error interno del servidor. El backend está experimentando problemas.";
          } else if (response.status === 400) {
            errorMessage = "Error en la solicitud. Por favor, verifica tu pregunta e intenta de nuevo.";
          } else if (response.status === 404) {
            errorMessage = "Endpoint no encontrado. Verifica la configuración del servidor.";
          } else if (response.status === 503) {
            errorMessage = "Servicio no disponible temporalmente. Por favor, intenta más tarde.";
          }
          throw new Error(errorMessage);
        }

        let errorData;
        try {
          errorData = JSON.parse(errorText);
          
          // Intentar extraer el mensaje de error de diferentes estructuras posibles
          if (errorData.error) {
            if (typeof errorData.error === 'string') {
              errorMessage = errorData.error;
            } else if (errorData.error.message) {
              errorMessage = errorData.error.message;
            } else if (errorData.error.detail) {
              errorMessage = errorData.error.detail;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
          
          // Si el mensaje contiene información sobre tool_calls, simplificarlo para el usuario
          if (errorMessage.includes('tool_calls') || errorMessage.includes('tool_call_id')) {
            errorMessage = "Error interno del servidor: Problema con la ejecución de herramientas de la IA. Por favor, intenta reformular tu pregunta o contacta al administrador.";
          }
          
        } catch (parseError) {
          // Si no es JSON, intentar extraer información útil del texto
          if (errorText.includes('tool_calls') || errorText.includes('tool_call_id')) {
            errorMessage = "Error interno del servidor: Problema con la ejecución de herramientas de la IA. Por favor, intenta reformular tu pregunta.";
          } else if (errorText) {
            // Intentar extraer un mensaje útil del texto de error
            const match = errorText.match(/"message":\s*"([^"]+)"/);
            if (match && match[1]) {
              errorMessage = match[1];
            } else {
              // Limitar la longitud del mensaje de error
              errorMessage = errorText.substring(0, 200).trim();
              if (!errorMessage) {
                errorMessage = `Error del servidor: ${response.status}`;
              }
            }
          }
        }
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        let text = '';
        try {
          text = await response.text();
        } catch (textError) {
          console.error("Error al leer respuesta no-JSON:", textError);
        }
        throw new Error(`Respuesta inesperada del servidor (tipo: ${contentType || 'desconocido'}): ${text.substring(0, 100)}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error al parsear JSON:", parseError);
        throw new Error("El servidor devolvió una respuesta inválida (no es JSON válido)");
      }

      // Validar que data sea un objeto
      if (!data || typeof data !== 'object') {
        console.error("Respuesta del servidor no es un objeto válido:", data);
        throw new Error("El servidor devolvió una respuesta en formato inesperado");
      }
      
      // Log para verificar la llegada de 'sources' desde el grafo (solo en desarrollo)
      if (import.meta.env.DEV) {
        console.log("Respuesta completa del backend:", data);
        console.log("Sources recibidos:", data.sources);
        console.log("Tipo de sources:", typeof data.sources, Array.isArray(data.sources));
      }

      // 3. Procesar sources para asegurar formato consistente
      let processedSources = [];
      try {
        if (data.sources) {
          if (Array.isArray(data.sources)) {
            processedSources = data.sources
              .filter(src => src !== null && src !== undefined) // Filtrar valores nulos
              .map(src => {
                // Si es un string, convertirlo a objeto
                if (typeof src === 'string') {
                  return { title: src.trim() || 'Documento sin título', url: '#' };
                }
                // Si es un objeto, asegurar que tenga title
                if (typeof src === 'object') {
                  return {
                    title: (src.title || src.name || src.filename || 'Documento sin título').toString().trim(),
                    url: (src.url || src.link || '#').toString()
                  };
                }
                return { title: 'Documento sin título', url: '#' };
              });
          } else if (typeof data.sources === 'object' && data.sources !== null) {
            // Si es un objeto único, convertirlo a array
            processedSources = [{
              title: (data.sources.title || data.sources.name || data.sources.filename || 'Documento sin título').toString().trim(),
              url: (data.sources.url || data.sources.link || '#').toString()
            }];
          } else if (typeof data.sources === 'string') {
            // Si es un string, convertirlo a objeto en array
            processedSources = [{ title: data.sources.trim() || 'Documento sin título', url: '#' }];
          }
        }
      } catch (sourcesError) {
        console.error("Error al procesar sources:", sourcesError);
        processedSources = [];
      }

      if (import.meta.env.DEV) {
        console.log("Sources procesados:", processedSources);
      }

      // 4. Validar y crear mensaje del asistente con las fuentes procesadas
      const responseContent = data.response || data.message || data.content || "";
      if (typeof responseContent !== 'string') {
        console.warn("El contenido de la respuesta no es un string:", responseContent);
      }

      const botMsg = {
        role: 'assistant',
        content: typeof responseContent === 'string' ? responseContent : String(responseContent) || "No se pudo obtener una respuesta.",
        sources: Array.isArray(processedSources) ? processedSources : [],
        intention: data.intention || "UNKNOWN"
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error("Chat Error:", err);
      let errorMessage = "Error desconocido";
      
      if (err instanceof TypeError) {
        if (err.message.includes("fetch") || err.message.includes("Failed to fetch")) {
          errorMessage = "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://127.0.0.1:8000";
        } else if (err.message.includes("NetworkError") || err.message.includes("network")) {
          errorMessage = "Error de red. Verifica tu conexión a internet.";
        } else {
          errorMessage = `Error de tipo: ${err.message || "Error desconocido"}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message || "Error desconocido";
        
        // Limpiar mensajes de error muy técnicos para el usuario final
        if (errorMessage.includes("Error interno del servidor")) {
          // Ya está formateado, mantenerlo
        } else if (errorMessage.includes("Internal Server Error") || errorMessage.includes("500")) {
          errorMessage = "Error interno del servidor. Por favor, intenta de nuevo o contacta al administrador si el problema persiste.";
        } else if (errorMessage.includes("Error del servidor: 400") || errorMessage.includes("400")) {
          errorMessage = "Error en la solicitud. Por favor, verifica tu pregunta e intenta de nuevo.";
        } else if (errorMessage.includes("timeout") || errorMessage.includes("tardó demasiado")) {
          errorMessage = "La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.";
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Asegurar que el mensaje de error no esté vacío
      if (!errorMessage || errorMessage.trim() === '') {
        errorMessage = "Ocurrió un error inesperado. Por favor, intenta de nuevo.";
      }
      
      try {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: `Lo siento, hubo un error de conexión con el servicio de arquitectura Azure. ${errorMessage}`,
          sources: [] 
        }]);
      } catch (stateError) {
        console.error("Error al actualizar el estado de mensajes:", stateError);
      }
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};