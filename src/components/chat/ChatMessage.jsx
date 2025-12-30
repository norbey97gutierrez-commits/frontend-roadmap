import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ msg }) => {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`group relative max-w-[80%] ${isUser ? 'bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md' : 'flex gap-4'}`}>
        
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className={!isUser ? 'pt-1 overflow-hidden' : ''}>
          {/* Renderizado de Markdown para el Bot, Texto plano para el Usuario */}
          <div className={`text-[15px] leading-relaxed ${isUser ? 'text-white' : 'text-gray-700'}`}>
            {isUser ? (
              <p>{msg.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-slate">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Renderizado de etiquetas de fuentes (Sources) */}
          {!isUser && msg.sources?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
              {msg.sources.map((src, i) => (
                <div 
                  key={i} 
                  title="Documento fuente"
                  className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-semibold transition-colors cursor-default border border-blue-100"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {src}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;