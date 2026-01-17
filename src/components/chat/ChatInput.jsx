import { useState } from 'react';

const ChatInput = ({ onSend, loading }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!onSend || typeof onSend !== 'function') {
      console.error("onSend no es una función válida");
      return;
    }
    
    const trimmedText = text.trim();
    if (trimmedText && !loading) {
      try {
        onSend(trimmedText);
        setText("");
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      }
    }
  };

  return (
    <footer className="p-6 bg-white border-t border-gray-50">
      <div className="relative max-w-3xl mx-auto">
        <input
          autoFocus
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] placeholder:text-gray-400 shadow-sm"
          placeholder="Pregunte sobre VNets, SQL o escalabilidad..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button 
          disabled={loading || !text.trim()}
          onClick={handleSubmit}
          className={`absolute right-2.5 top-2.5 p-2.5 rounded-xl transition-all ${
            loading || !text.trim() ? 'text-gray-300' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-4 tracking-tight">
        La IA puede cometer errores. Verifique información técnica importante con la documentación de Azure.
      </p>
    </footer>
  );
};

export default ChatInput;