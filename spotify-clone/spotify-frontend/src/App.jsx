import React, { useContext, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import { PlayerContext } from "./context/PlayerContext";
import InternetError from "./components/InternetError";

const App = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);
  
  // State to track loading and internet status
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Simulate loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Show loading for 800 mili seconds

    // Listen for internet status changes
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Show loading UI
  if (isLoading) {
    return (
      <div className="grid place-content-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
        <p className="text-white mt-4">Loading...</p>
      </div>
    );
  }

  // Show no internet connection UI if offline
  if (!isOnline) {
    return <InternetError />;
  }

  return (
    <div className="h-screen bg-black">
      {songsData?.length ? (
        <>
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
          <Player />
        </>
      ):null }

      <audio ref={audioRef} src={track ? track.file : ""} preload="auto"></audio>
    </div>
  );
};

export default App;
