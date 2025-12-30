import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import EmptyState from './chat/EmptyState';

const ChatInterface = () => {
  // Generamos el threadId solo una vez al montar el componente
  const threadId = useMemo(() => `session-${Math.random().toString(36).substr(2, 9)}`, []);
  
  const { messages, sendMessage, loading } = useChat("http://127.0.0.1:8000/api/v1/chat/stream");
  const scrollRef = useRef(null);

  // Auto-scroll al final cuando hay mensajes nuevos
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = (text) => {
    sendMessage(text, threadId);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white border-x border-gray-100">
      <ChatHeader loading={loading} />

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))
        )}
        <div ref={scrollRef} />
      </main>

      <ChatInput onSend={handleSendMessage} loading={loading} />
    </div>
  );
};

export default ChatInterface;