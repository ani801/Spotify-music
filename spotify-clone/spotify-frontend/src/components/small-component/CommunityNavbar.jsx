import { FiHome, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0B0F19] text-[#EDEDED] px-5 py-4 shadow-md border-b border-[#1F2C34]">
      <div className="flex justify-between items-center">
        {/* Left: Back Button + Logo + Name */}
        <div className="flex items-center gap-4">
          {/* Back Button with highlight */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-[#1F2C34] hover:bg-[#25D366] hover:text-black transition duration-200"
            title="Go Back"
          >
            <FiArrowLeft className="text-xl" />
          </button>

          {/* Logo + App Name */}
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎧</div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-[#25D366]">
              BeatSync Chat
            </h1>
          </div>
        </div>

        {/* Right: Home + Profile */}
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm sm:text-base hover:text-[#25D366] transition"
          >
            <FiHome className="text-lg" />
            <span>Home</span>
          </Link>

          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-[#25D366] object-cover"
          />
        </div>
      </div>
    </header>
  );
}
