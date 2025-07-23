import { useState, useContext, useEffect } from "react";
import Navbar from "./small-component/CommunityNavbar";
import SidebarMusic from "./small-component/SidebarMusic";
import GroupPanel from "./small-component/GroupPanel";
import ChatBox from "./small-component/ChatBox";
import { PlayerContext } from "../context/PlayerContext";
import { io } from "socket.io-client";
import axios from "axios";

const uri = "http://localhost:4000";

export default function Community() {
  const [selectedChat, setSelectedChat] = useState(null);
  const { useUserDetails } = useContext(PlayerContext);
  const [trigger, setTrigger] = useState(false);
  const [chats, setChats] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Setup socket connection
  useEffect(() => {
    const newSocket = io(uri, { withCredentials: true });
    setSocket(newSocket);

    return () => {
      // Cleanup on component unmount
      if (newSocket) {
        newSocket.disconnect();
        newSocket.off();
      }
      setChats([]);
      setSelectedChat(null);
      setTrigger(false);
    };
  }, []);

  // Setup socket user after userDetails are available
  useEffect(() => {
    if (socket && useUserDetails?._id) {
      socket.emit("setup", useUserDetails);
    }
    return () => {
      if (socket) {
        socket.off("setup");
      }
    };
  }, [socket, useUserDetails]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${uri}/api/chat/user`, {
        withCredentials: true,
      });
      if (data.success && Array.isArray(data.chats)) {
        setChats(data.chats);
      } else {
        console.error("❌ Failed to fetch chats:", data.error || data);
        setChats([]);
      }
    } catch (error) {
      console.error("❌ Error fetching chats:", error);
    }
  };

  useEffect(() => {
    if (useUserDetails?._id) fetchChats();
  }, [useUserDetails]);

  // Listen for 'refresh chats'
  useEffect(() => {
    if (!socket) return;
    socket.on("refresh chats", fetchChats);
    return () => socket.off("refresh chats", fetchChats);
  }, [socket]);

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 z-10">
        <Navbar />
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="shrink-0">
          <SidebarMusic setSelectedChat={setSelectedChat} socket={socket} fetchChats={fetchChats} onlineUsers={onlineUsers} />
        </aside>

        <section className="flex flex-1 overflow-hidden border-l">
          <div className="w-[320px] shrink-0 border-r overflow-y-auto bg-white">
            <GroupPanel
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
              socket={socket}
              onlineUsers={onlineUsers}
            />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {socket && (
              <ChatBox
                selectedChat={selectedChat}
                socket={socket}
                setTrigger={setTrigger}
                setOnlineUsers={setOnlineUsers}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
