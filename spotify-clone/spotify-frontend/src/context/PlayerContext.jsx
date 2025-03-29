import React ,{createContext, useEffect, useRef, useState}from 'react'
import axios from "axios"

export const PlayerContext = createContext()
const PlayerContextProvider=(props)=>{
    const  audioRef=useRef()
      const url="https://spotify-music-1qiw.onrender.com"
    
    const seekBg=useRef()
    const seekBar=useRef()
     
    const[songsData,setSongsData]=useState([])
     const[albumsData,setAlbumsData]=useState([])
    const [track,setTrack]=useState([])
    const [playStatus,setPlayStatus]=useState(false)
    const[time,setTime]=useState({currentTime:{
        second:0,
        minute:0
    },totalTime:{
        second:0,
        minute:0
    }})

    useEffect(()=>{
        getAlbumsData()
        getSongsData()
    },[])

   

    const getSongsData=async()=>{
        try{
         const response=await axios.get(`${url}/api/song/list`)
           
            setSongsData(response.data.songs);
          //  console.log("In get song : ",songsData)
           if(response.data.songs.length>=1) setTrack(response.data.songs[0])
         
        }catch(error)
        {
           console.log(error)
        }
    }
   console.log(songsData)
   console.log(albumsData)

     const getAlbumsData=async()=>{
        try{
         const response=await axios.get(`${url}/api/album/list`) 
         setAlbumsData(response.data.albums)
        }catch(error)
        {

        }
    }

    

    const play=()=>{
        audioRef.current.play()
        setPlayStatus(true)
    } 
    
    const pause=()=>{
        audioRef.current.pause()
        setPlayStatus(false)
    }       

    useEffect(() => {
        const audioElement = audioRef.current;
    
        if (audioElement) {
            // Update the time state on each ontimeupdate event
            setTimeout(
            audioElement.ontimeupdate = () => { 
                if (seekBar.current) {
                seekBar.current.style.width=(Math.floor(audioElement.currentTime/audioElement.duration*100))+"%"
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
            },1000);
        }
        return () => {
            if (audioElement) {
                audioElement.ontimeupdate = null;
            }
        };
    }, [audioRef]);


    const palyWithId=async(id)=>{
    await songsData.map((item)=>{
        if(id===item._id)
        {
            setTrack(item)
        }
    }) 
await audioRef.current.play()
await setPlayStatus(true) 
  }

    const previous=async()=>{
       songsData.map(async(item,index)=>{
        if(track._id===item._id&&index>0)
        {
            await setTrack (songsData[index-1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
       })
    }

    const seekSong=async(event)=>{
        const { offsetX } = event.nativeEvent; // Get horizontal click position
        const totalWidth = event.currentTarget.offsetWidth; // Get div width
        const clickRatio = offsetX / totalWidth; // Calculate

        const audioElement = audioRef.current;
        if (audioElement && audioElement.duration) {
          const newTime = clickRatio * audioElement.duration; // Calculate new time
          audioElement.currentTime = newTime; // Set the audio's current time
        }
        
    }
    
    const next=async()=>{
        songsData.map(async(item,index)=>{
        if(track._id===item._id&&index<songsData.length-1)
        {
            await setTrack (songsData[index+1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
       })
    }


    const contextValue={
        audioRef,
        seekBar,
        seekBg,
        track,setTrack,
        playStatus,setPlayStatus,
        time,setTime,
        play,pause,
        palyWithId,previous,
        next,seekSong,
        songsData,albumsData
    }
 
    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}
export default PlayerContextProvider
