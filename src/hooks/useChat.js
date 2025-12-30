import { useState } from 'react';

export const useChat = (endpoint) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text, threadId) => {
    if (!text.trim()) return;

    // 1. Agregar mensaje del usuario a la UI
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Petición POST al endpoint /query
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          text: text, 
          thread_id: threadId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(`Error ${response.status}`);
      }

      // 3. Procesar respuesta JSON única
      const data = await response.json();

      const botMsg = {
        role: 'assistant',
        content: data.response, // El texto con formato Markdown
        sources: data.sources || [], // Array de nombres de archivos
        intention: data.intention
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error("Chat Error:", err.message);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};