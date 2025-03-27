import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

function AddSong() {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  // Fetch album data on component mount
  // useEffect(() => {
  //   async function fetchAlbums() {
  //     try {
  //       const response = await axios.get(`${url}/api/album/all`);
  //       if (response.data.success) {
  //         setAlbumData(response.data.albums);
  //       } else {
  //         toast.error("Failed to fetch albums");
  //       }
  //     } catch (error) {
  //       toast.error("Error fetching albums");
  //     }
  //   }
  //   fetchAlbums();
  // }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("image", image);
      formData.append("audio", song);
      formData.append("album", album);

    
      const response = await axios.post(`${url}/api/song/add`, formData);
       
      if (response.data.success) {
        toast.success("Song Added");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(null);
        setSong(null);
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      toast.error("Error Occurred");
    }
    setLoading(false);
  };


  const loadAlbumData=async()=>{
    try{
   const response=await axios.get(`${url}/api/album/list`)
   if(response.data.success)
   {
    setAlbumData(response.data.albums)
 
   }else{
    toast.error("Unable To Load Album Data.")
   }
    }catch(error)
    {
  toast.error("Error Occured.")
    }
  }


  useEffect(()=>{
loadAlbumData()
  },[])



  return loading ? (
    <div className="grid place-content-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      className="flex flex-col items-start gap-4 text-gray-600"
      onSubmit={onSubmitHandler}
    >
      <div className="flex gap-8">
        {/* Upload Song */}
        <div className="flex flex-col gap-4">
          <p>Upload Song</p>
          <input
            type="file"
            id="song"
            accept="audio/*"
            hidden
            onChange={(e) => setSong(e.target.files[0])}
          />
          <label htmlFor="song">
            <img
              src={song ? assets.upload_added : assets.upload_song}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="w-24 cursor-pointer"
              alt=""
            />
          </label>
        </div>
      </div>

      {/* Song Name */}
      <div className="flex flex-col gap-2.5">
        <p>Song Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          required
        />
      </div>

      {/* Song Description */}
      <div className="flex flex-col gap-2.5">
        <p>Song Description</p>
        <input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          type="text"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          required
        />
      </div>

      {/* Album Selection */}
      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          onChange={(e) =>setAlbum(e.target.value)}
          value={album }
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
        >
          <option value="none">None</option>
          {albumData.map((alb) => (
            <option key={alb._id} value={alb.name}>
              {alb.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
}

export default AddSong;
