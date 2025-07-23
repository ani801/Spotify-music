import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import { toast } from 'react-toastify';
import axios from 'axios';
const url=import.meta.env.VITE_API_URL

export default function DropdownMenu() {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, setUserDetails,useUserDetails } = useContext(PlayerContext);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${url}/api/user/logout`, {}, { withCredentials: true });
      if (response.data.success) {
        toast.success("Logged out successfully");
        navigate('/login');
        setUserDetails({});
      } else {
        toast.error("Logout failed: " + (response.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed due to server error");
    }
  };

  return (
    <div className="relative inline-block text-left">
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-xl bg-black ring-1 ring-green-700 ring-opacity-80 focus:outline-none z-50 transition-all duration-200"
        >
          <div className="py-1 text-white">
            <button
              onClick={() => {
                navigate(`/profile/${useUserDetails?._id}`);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-green-700 transition"
            >
              Profile
            </button>
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-green-700 transition"
            >
              Signup
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-green-700 transition"
            >
              Logout
            </button>
            <a
              href="https://spotify-music-admin.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm hover:bg-green-700 transition"
            >
              Admin Panel Login
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
