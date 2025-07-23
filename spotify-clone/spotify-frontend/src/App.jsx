import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Player from "./components/Player";
import Display from "./components/Display";
import Signup from "./components/Signup";
import Login from "./components/Login";
import InternetError from "./components/InternetError";
import { PlayerContext } from "./context/PlayerContext";
import Community from "./components/Community";
import Sidebar from "./components/Sidebar";
import ManageGroup from "./components/ManageGroup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const url=import.meta.env.VITE_API_URL

const App = () => {
  const { audioRef, track, isLoggedIn, setIsLoggedIn } = useContext(PlayerContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  console.log("uRL ", url)

  // ✅ Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${url}/api/userauth`, {
          withCredentials: true,
        });
        setIsLoggedIn(response.data.success);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = ["/login", "/signup"].includes(location.pathname);
      if (!isLoggedIn && !isAuthPage) {
        navigate("/login");
      }
    }
  }, [isLoggedIn, isLoading, location.pathname, navigate]);

  // ✅ Handle online/offline status
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid place-content-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
        <p className="text-white mt-4">Loading...</p>
      </div>
    );
  }

  if (!isOnline) {
    return <InternetError />;
  }

  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isCommunityPage = location.pathname === "/community";
  const isManageGroupPage = location.pathname === "/community/manage-group";

  return (
    <div className="h-screen bg-black">
       <ToastContainer position="top-right" autoClose={3000} />
      {!isAuthPage && isLoggedIn && (
        <>
          {isManageGroupPage ? (
            <ManageGroup />
          ) : isCommunityPage ? (
            <Community />
          ) : (
            <div className="h-[90%] flex">
              <Sidebar />
              <Display />
            </div>
          )}
          <Player />
          <audio ref={audioRef} src={track ? track.file : ""} preload="auto"></audio>
        </>
      )}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes here */}
      </Routes>
    </div>
  );
};

export default App;
