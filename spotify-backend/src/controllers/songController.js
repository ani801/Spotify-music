import {v2 as cloudinary} from 'cloudinary'
import songModel from '../models/songModel.js'
const addSong=async(req,res)=>{
try
{
const name=req.body.name
const desc=req.body.desc
const album=req.body.album
const audioFile=req.files.audio[0];
const imageFile=req.files.image[0];
const audioUpload=await cloudinary.uploader.upload(audioFile.path,{resource_type:"video"})
const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
const duration=`${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`;
const songData={
    name,
    desc,
    album,
    image:imageUpload.secure_url,
    file:audioUpload.secure_url,
    duration
}
console.log(name,desc,album,audioUpload,imageUpload)
const song=songModel(songData)
await song.save()
res.json({success:true,message:"Song added"})

}catch(error)
{
    console.log(error)
    res.json({success:false})
}
}

const listSong =async(req,res)=>{
    try{
    const allSongs=await songModel.find({})
    res.json({success:true,songs:allSongs})
    }catch(error)
    {
         res.json({success:false})
    }
}

const removeSong=async(req,res)=>{
   try{
   const val=  await songModel.findByIdAndDelete(req.body.id)
       res.json({success:val,message:"Song removed"})
   } catch(error)
   {
     res.json({success:false})

   }
}

export {addSong,listSong,removeSong}