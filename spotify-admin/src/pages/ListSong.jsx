import React, { useEffect, useState } from 'react'
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

const ListSong = () => {
const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the song list
  const fetchSongList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setSongData(response.data.songs);
       
      } else {
        toast.error("Failed to fetch songs");
      }
    } catch (error) {
      toast.error("Error fetching songs: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongList();
  }, []);


 const removeSong = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongList(); // Refresh the list
      } else {
        toast.error("Failed to delete the song");
      }
    } catch (error) {
      toast.error("Error occurred while removing song: " + error.message);
    }
  };




  return  loading ? (
    <div className="grid place-content-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
    </div>
  ) 
  :
    (
    <div>
      <p>
        All Songs List
      </p>
      <br />
      <div>
        <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr]  items-center gap-2.5 p-3 border-gray-500 text-sm mr-5 bg-gray-400'>
    <b>Image</b>
    <b>Name</b>
    <b>Album</b>
    <b>Duration</b>
    <b> Action</b>
        </div>
        {songData.map((item,index)=>{
          return ( <div key={index} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 test-sm mr-5'>  

   <img className='w-12' src={item.image} alt="" />
   <p>{item.name}</p>
     <p>{item.album}</p>
       <p>{item.duration}</p>
       <p className='hover:bg-red-600 cursor-pointer' onClick={()=>removeSong(item._id)}>X</p>
          </div> )
        })}
      </div>
    </div>
  )
}

export default ListSong;