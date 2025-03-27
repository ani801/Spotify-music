import axios from 'axios'
import React, {  useEffect, useState } from 'react'
import { url } from '../App'
import { toast } from 'react-toastify'

function ListAlbum() {
  const[data,setData]=useState([])
  const [loading, setLoading] = useState(false);

  const fetchAlbums=async()=>{
    setLoading(true)
    try{
         const response=await axios.get(`${url}/api/album/list`)
         if(response.data.success)
         {
          setData(response.data.albums)

         }
    }catch(error)
    {
  toast.error("Error Occured.")
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchAlbums()

  },[])

   const removeAlbum = async (id) => {
    setLoading(true)
    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAlbums(); // Refresh the list
      } else {
        toast.error("Failed to delete the Album");
      }
    } catch (error) {
      toast.error("Error occurred while removing Album: " + error.message);
    }
    setLoading(false)
  };

  return loading ? (
    <div className="grid place-content-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
    </div>
  ) 
  : (
    <div>
      <p>All Albums List</p>
      <br />
      <div>
      <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-400'>
      <b>Image</b>
      <b>Name</b>
      <b>Description</b>
      <b>Album Colour</b>
      <b>Action</b>
      </div>
      {data.map((item,index)=>{
        return (
          <div key={index} className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2 p-3 border border-gray-300 text-sm mr-5'>
            <img className='w-12' src={item.image} alt="" />
            <p>
              {item.name}
            </p>
            <p>
              {item.desc}
            </p>
           <input
  type="color"
  value={item.bgColour}
  readOnly
  className="border-none outline-none bg-transparent cursor-default pointer-events-none"
/>
           <p className='hover:bg-red-600 cursor-pointer' onClick={()=>removeAlbum(item._id)}>X</p>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default ListAlbum