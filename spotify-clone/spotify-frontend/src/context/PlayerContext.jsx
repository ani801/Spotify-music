import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const navigate = useNavigate();
  const audioRef = useRef();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const seekBg = useRef();
  const seekBar = useRef();
  const [songsData, setSongsData] = useState([]);
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [useUserDetails, setUserDetails] = useState({});
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState([]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Fetch data on mount
  useEffect(() => {
    getAlbumsData();
    getSongsData();
  }, []);

  // Fetch user data when logged in
  useEffect(() => {
 getUserData();
  }, []);

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      if (response.data.songs.length >= 1) setTrack(response.data.songs[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`${url}/api/user/userdetails`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUserDetails(response.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.albums);
    } catch (error) {
      console.log(error);
    }
  };

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => {
      if (seekBar.current && audioElement.duration) {
        seekBar.current.style.width =
          Math.floor((audioElement.currentTime / audioElement.duration) * 100) + '%';
      }

      setTime({
        currentTime: {
          second: Math.floor(audioElement.currentTime % 60),
          minute: Math.floor(audioElement.currentTime / 60),
        },
        totalTime: {
          second: Math.floor(audioElement.duration % 60) || 0,
          minute: Math.floor(audioElement.duration / 60) || 0,
        },
      });
    };

    audioElement.addEventListener('timeupdate', updateTime);
    return () => audioElement.removeEventListener('timeupdate', updateTime);
  }, []);

  const palyWithId = async (id) => {
    const song = songsData.find((item) => item._id === id);
    if (song) {
      setTrack(song);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const previous = async () => {
    const index = songsData.findIndex((item) => item._id === track._id);
    if (index > 0) {
      setTrack(songsData[index - 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = async () => {
    const index = songsData.findIndex((item) => item._id === track._id);
    if (index < songsData.length - 1) {
      setTrack(songsData[index + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const seekSong = async (event) => {
    const { offsetX } = event.nativeEvent;
    const totalWidth = event.currentTarget.offsetWidth;
    const clickRatio = offsetX / totalWidth;
    const audioElement = audioRef.current;
    if (audioElement && audioElement.duration) {
      audioElement.currentTime = clickRatio * audioElement.duration;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { contact, password } = formData;
    if (!contact || !password) {
      toast.error('Both fields are required!');
      return;
    }
    try {
      const response = await axios.post(
        `${url}/api/user/login`,
        { contact, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        setUserDetails(response.data.user);
        setIsLoggedIn(true);
        getUserData();
        setTimeout(() => navigate('/'), 0);
      } else {
        toast.error(response.data.message || 'Login failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message || 'Unauthorized: Invalid credentials');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  console.log("userDetails", useUserDetails);   

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    palyWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
    useUserDetails,
    isOpen,
    setIsOpen,
    setIsLoggedIn,
    isLoggedIn,
    handleSubmit,
    formData,
    setFormData,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
