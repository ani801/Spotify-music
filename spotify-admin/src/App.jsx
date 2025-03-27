import { useState } from 'react'
  import { ToastContainer, toast } from 'react-toastify';
import './App.css'
import AddSong from "../src/pages/AddSong"
import AddAlbum from "../src/pages/AddAlbum"
import ListSong from "../src/pages/ListSong"  
import ListAlbum from "../src/pages/ListAlbum" 
import {Routes,Route, Router} from "react-router-dom"
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export const url="http://localhost:4000"

function App() {

  return (
   <div className='flex items-start min-h-screen'>
    <ToastContainer/>
    <Sidebar/>
    <div className='flex-1 h-screen overflow-y-scroll  bg-[#F3FFF7]'>
      <Navbar/>
      <div className='pt-8 pl-5 sm:pl-12' >
        
          <Routes>
           <Route path='/add-song' element={<AddSong/>}/>
           <Route path='/add-album' element={<AddAlbum/>}/>
           <Route path='/list-song' element={<ListSong/>}/>
           <Route path='/list-album' element={<ListAlbum/>}/>
          </Routes> 
           
      </div>

    </div>
     
   </div>
  )
}

export default App
