import { MdWifiOff } from "react-icons/md";

export default function InternetError() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white px-6">
      {/* Icon */}
      <MdWifiOff className="text-red-500 text-6xl animate-pulse" />
      
      {/* Message */}
      <h2 className="text-2xl font-semibold mt-4">No Internet Connection</h2>
      <p className="text-gray-400 text-sm mt-2">
        Please check your network and try again.
      </p>

      {/* Retry Button */}
      <button
        onClick={() => window.location.reload()}
        className="mt-6 bg-red-500 text-white px-5 py-2 rounded-full shadow-lg font-semibold text-lg transition hover:bg-red-600 active:scale-95"
      >
        Retry
      </button>

      {/* Bottom Floating Alert */}
      <div className="fixed bottom-6 flex items-center space-x-3 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
        <MdWifiOff className="text-xl" />
        <span>Internet Disconnected</span>
      </div>
    </div>
  );
}
