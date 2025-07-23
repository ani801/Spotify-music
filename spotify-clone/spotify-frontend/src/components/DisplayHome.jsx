import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import Profile from "./Profile";
import { PlayerContext } from "../context/PlayerContext";

const DisplayHome = () => {
  const { songsData, albumsData,profileOpen } = useContext(PlayerContext);
  const location = useLocation();
  // useEffect(() => {         
  //   isProfile = location.pathname.includes("profile");
  // }
  // , [location.pathname]); 

  
  

  return (
    <>
      <Navbar />
      {profileOpen ? (
        <Profile />
      ) : (
        <>
          {/* Featured Charts Section */}
          <section className="mb-8">
            <h1 className="my-5 font-bold text-2xl text-white">Featured Charts</h1>
            <div className="flex overflow-x-auto gap-4">
              {albumsData.map((item, index) => (
                <AlbumItem 
                  key={item._id || index}
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                  image={item.image}
                />
              ))}
            </div>
          </section>

          {/* Today's Biggest Hits Section */}
          <section className="mb-8">
            <h1 className="my-5 font-bold text-2xl text-white">Today's Biggest Hits</h1>
            <div className="flex overflow-x-auto gap-4">
              {songsData.map((item, index) => (
                <SongItem 
                  key={item._id || index}
                  name={item.name}
                  desc={item.desc}
                  id={item._id}
                  image={item.image}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default DisplayHome;
