const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
    <p className="text-xl font-medium">How can I help you with Azure today?</p>
  </div>
);

export default EmptyState;