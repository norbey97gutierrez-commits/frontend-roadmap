import React from 'react';

/**
 * Componente de encabezado para la interfaz de chat.
 * @param {boolean} loading - Indica si la IA está procesando una respuesta.
 * @param {function} onLogout - Función para cerrar sesión.
 */
const ChatHeader = ({ loading, onLogout }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Lado Izquierdo: Logo y Título */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
          <span className="text-white font-bold text-xs">AZ</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-gray-900">
            Azure Architect 
            <span className="text-gray-400 font-normal ml-2">v1.0</span>
          </h1>
        </div>
      </div>

      {/* Lado Derecho: Indicador de Estado y Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 transition-all duration-300">
          <div className={`relative flex h-2 w-2`}>
            {/* Efecto de pulso cuando está cargando */}
            {loading && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              loading ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></span>
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
            {loading ? 'Pensando...' : 'Listo'}
          </span>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;