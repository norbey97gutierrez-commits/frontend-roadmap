import React, { useEffect, useRef, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import EmptyState from './chat/EmptyState';

const ChatInterface = ({ onLogout }) => {
  // Generar un ID de hilo único para la sesión actual
  const threadId = useMemo(() => `session-${Math.random().toString(36).slice(2, 11)}`, []);
  
  const { messages, sendMessage, loading } = useChat();
  const scrollRef = useRef(null);

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white border-x border-gray-100 shadow-sm">
      <ChatHeader loading={loading} onLogout={onLogout} />

      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-8 space-y-8">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages
            .filter(msg => msg && typeof msg === 'object' && msg.role && msg.content)
            .map((msg, idx) => (
              // ChatMessage debe estar preparado para recibir y mapear msg.sources
              <ChatMessage key={`chat-msg-${idx}-${msg.role}`} msg={msg} />
            ))
        )}
        <div ref={scrollRef} className="h-4" />
      </main>

      <div className="p-4 bg-gray-50/50 border-t border-gray-100">
        <ChatInput 
          onSend={(text) => sendMessage(text, threadId)} 
          loading={loading} 
        />
        <footer className="mt-2 text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Arquitecto Azure AI • Azure AI Search & LangGraph • 2026
        </footer>
      </div>
    </div>
  );
};

export default ChatInterface;