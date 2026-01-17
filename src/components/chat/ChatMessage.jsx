import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ msg }) => {
  // Validaciones defensivas
  if (!msg || typeof msg !== 'object') {
    console.warn("ChatMessage recibió un mensaje inválido:", msg);
    return null;
  }

  const isUser = msg.role === 'user';
  const content = msg.content || '';
  const sources = Array.isArray(msg.sources) ? msg.sources : [];

  // Si no hay contenido y no es un mensaje del usuario, no renderizar
  if (!isUser && !content) {
    return null;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 px-4`}>
      <div className={`max-w-[85%] ${isUser ? 'bg-blue-600 text-white p-4 rounded-2xl' : 'flex gap-4'}`}>
        
        {!isUser && (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center border border-blue-100">
             <span className="text-blue-500 font-bold text-xs">AI</span>
          </div>
        )}

        <div className={`flex flex-col gap-3 min-w-0 ${isUser ? 'w-full' : ''}`}>
          <div className={isUser ? 'prose prose-sm prose-invert max-w-none' : 'text-gray-800 text-sm'}>
            {isUser ? (
              <div className="text-white">{content}</div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* RENDER DE FUENTES CORREGIDO */}
          {!isUser && sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Fuentes consultadas:</p>
              <div className="flex flex-wrap gap-2">
                {sources
                  .filter(src => src !== null && src !== undefined) // Filtrar valores nulos
                  .map((src, i) => {
                    try {
                      // Manejar diferentes formatos de source
                      let sourceTitle = 'Documento sin título';
                      let sourceUrl = '#';
                      
                      if (typeof src === 'string') {
                        sourceTitle = src.trim() || 'Documento sin título';
                      } else if (typeof src === 'object' && src !== null) {
                        sourceTitle = (src.title || src.name || src.filename || 'Documento sin título').toString().trim();
                        sourceUrl = (src.url || src.link || '#').toString();
                      }
                      
                      const hasValidUrl = sourceUrl && sourceUrl !== '#' && sourceUrl.startsWith('http');
                      const safeKey = `source-${i}-${sourceTitle.substring(0, 20)}-${Date.now()}`;
                      
                      return hasValidUrl ? (
                        <a
                          key={safeKey}
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all no-underline shadow-sm cursor-pointer"
                        >
                          <span className="text-xs">📄</span>
                          <span className="text-[11px] font-medium leading-none">{sourceTitle}</span>
                        </a>
                      ) : (
                        <span
                          key={safeKey}
                          className="inline-flex items-center gap-2 px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded shadow-sm"
                        >
                          <span className="text-xs">📄</span>
                          <span className="text-[11px] font-medium leading-none">{sourceTitle}</span>
                        </span>
                      );
                    } catch (sourceError) {
                      console.error("Error al renderizar source:", sourceError, src);
                      return null;
                    }
                  })
                  .filter(Boolean) // Filtrar nulls que puedan venir de errores
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;