import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Inyectamos el componente principal del chat. 
        Tailwind se encargará de que se vea centrado y elegante.
      */}
      <ChatInterface />
    </div>
  )
}

export default App;