import React, { useContext } from "react";
import { songsData,assets } from "../assets/assets";
import { PlayerContext } from "../context/PlayerContext";

const Player=()=>{
    const{seekBar,seekBg,playStatus,play,pause,track,time,previous,next,seekSong}=useContext(PlayerContext)
return track? (
<div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
   <div className="hidden lg:flex items-center gap-4">
          <img className="w-12" src={track.image} alt="" />
          <div>
            <p>{track.name}</p>
                <p>{track.desc?.slice(0,12)}</p>
          </div>
   </div>
   <div className="flex flex-col items-center gap-1 m-auto">
    <div className="flex gap-4">
        <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
        <img onClick={()=>previous()} className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
        <img onClick={()=>{if(playStatus===false)
        {play()}
        else{
        pause()
        }
    }} className="w-4 cursor-pointer" src={playStatus===true?assets.pause_icon:assets.play_icon} alt="" />
        <img onClick={()=>next()} className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
        <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
    </div>
        <div className="flex items-center gap-5">
           <p>{time.currentTime.minute}:{time.currentTime.second}</p>
           <div ref={seekBg} onClick={seekSong} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
               <hr ref={seekBar} className="h-1 border-none w-0 bg-green-800 rounded-full" />
           </div>
            <p>{time.totalTime.minute}:{time.totalTime.second}</p>
        </div>
   </div>
</div>
):null
   
}
export default Player