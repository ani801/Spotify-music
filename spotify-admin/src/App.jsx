import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import AddSong from './pages/AddSong';
import AddAlbum from './pages/AddAlbum';
import ListSong from './pages/ListSong';
import ListAlbum from './pages/ListAlbum';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import axios from 'axios';

export const url = "https://spotify-music-1qiw.onrender.com";
// export const url = "http://localhost:4000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Check login status on app load
  useEffect(() => {
    axios.get(`${url}/api/me`, {
      withCredentials: true // Send cookies with request
    })
    .then(res => {
      setIsLoggedIn(true);
    })
    .catch(err => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleLogout = async () => {
   await axios.post(`${url}/api/adminlogout`,{},{ withCredentials: true })
      .then(() => setIsLoggedIn(false));
  };

  if (isLoggedIn === null) return <div>Loading...</div>;

  return (
    <>
      {!isLoggedIn ? (
        <div className="min-h-screen bg-green-800 flex items-center justify-center">
          <Login setIsLoggedIn={setIsLoggedIn} />
        </div>
      ) : (
        <div className="flex items-start min-h-screen">
          <ToastContainer />
          <Sidebar />
          <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
            <Navbar handleLogout={handleLogout} />
            <div className="pt-8 pl-5 sm:pl-12">
              <Routes>
                <Route path="/add-song" element={<AddSong />} />
                <Route path="/add-album" element={<AddAlbum />} />
                <Route path="/list-song" element={<ListSong />} />
                <Route path="/list-album" element={<ListAlbum />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
