

export default function InternetError() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-bounce">
      
      <span>No Internet Connection</span>
      <button
        className="bg-white text-red-600 px-3 py-1 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Retry
      </button>
    </div>
  );
}
