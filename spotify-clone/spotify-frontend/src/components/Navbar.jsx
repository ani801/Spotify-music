import React from "react";
import DropdownMenu from "./small-component/DropdownMenu";
import { assets } from "../assets/assets";
import {useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { Link } from "react-router-dom";

const Navbar=()=>{
  const navigate=useNavigate()
  const location=useLocation()
  const {isOpen, setIsOpen,userurl} = useContext(PlayerContext);

 // console.log("userurl",userurl)
   return (
    <>
    <div className="w-full flex justify-between items center font-semibold">
        <div className="flex items-center gap-2">
          <img onClick={()=>{ if(location.pathname!=='/') navigate(-1)}} className="w-8 bg-black p-2 rounded-2xl cursor-pointer" src={assets.arrow_left} alt="" />
          <img onClick={()=>navigate(1)} className="w-8 bg-black p-2 rounded-2xl cursor-pointer" src={assets.arrow_right} alt="" />
        </div>
        <div className="flex items-center gap-4">
        <Link to="/community" className="bg-white text-black text-[15px] px-4 py-1 rounded -2xl hidden md:block cursor-pointer hover:bg-green-800 hover:text-white" >Spotify Community</Link>
        <p className="bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer">Install App</p>
       <div 
  onClick={() => setIsOpen(!isOpen)}
  onMouseEnter={() => setIsOpen(true)} 
  className="hover:transition-all duration-200 cursor-pointer bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center"
>
  {false ? (
    <img 
      src={userurl} 
      alt="User Avatar" 
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <span>{`A`}</span> // fallback avatar
  )}
  
  <DropdownMenu />
</div>

        </div>
    </div>
    <div className="flex items-center gap-2 mt-4 cursor-pointer">
  <p className="bg-white text-black px-4 py-1 rounded-2xl "> All</p>
  <p className="bg-black  px-4 py-1 rounded-2xl">Music</p>
  <p className="bg-black  px-4 py-1 rounded-2xl">Podcast</p>
    </div>
    </>
   )
}
export default Navbar