import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlayerContext } from "../../context/PlayerContext";
import { getSender } from "../../utils/chatHelpers";

const uri = "http://localhost:4000";

export default function GroupPanel({ selectedChat, setSelectedChat, chats, socket }) {
  const [selectedTab, setSelectedTab] = useState("Single");
  const { useUserDetails } = useContext(PlayerContext);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setSelectedTab("Single");
      setSelectedChat(null);
    };
  }, []);

  const filteredChats = chats.filter((chat) =>
    selectedTab === "Single" ? !chat.isGroupChat : chat.isGroupChat
  );

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    socket.emit("join chat", chat._id);
  };

  return (
    <div className="p-3 h-full overflow-y-auto bg-[#111B21] text-[#EDEDED]">
      {/* Manage Group */}
      <div className="mb-4">
        <Link
          to="/community/manage-group"
          className="block text-center text-sm font-semibold text-[#25D366] bg-[#1F2C34] hover:bg-[#2A3942] py-2 rounded-md transition"
        >
          ➕ Create / Manage Groups
        </Link>
      </div>

      {/* Search */}
      <input
        className="w-full p-2 rounded-md border border-[#2A3942] bg-[#1F2C34] text-sm text-[#EDEDED] placeholder:text-[#8696A0] mb-4"
        placeholder="Search or start a new chat"
      />

      {/* Tabs */}
      <div className="flex gap-2 text-sm mb-4">
        {["Single", "Groups"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 rounded-full capitalize transition ${
              selectedTab === tab
                ? "bg-[#25D366] text-black font-semibold"
                : "bg-[#1F2C34] text-[#8696A0] hover:bg-[#2A3942]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="space-y-2">
        {filteredChats.map((chat) => {
          const chatName = chat.isGroupChat
            ? chat.name
            : getSender(useUserDetails, chat.users);

          const avatar = chat.isGroupChat
            ? chat.groupAvatar
            : chat.users.find((u) => u._id !== useUserDetails._id)?.pic;

          const latest = chat.latestMessage;
          const lastMessage = latest
            ? `${latest.sender?.name || ""}: ${latest.content?.slice(0, 40)}${
                latest.content?.length > 40 ? "..." : ""
              }`
            : "No messages yet";

          return (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                selectedChat?._id === chat._id ? "bg-[#2A3942]" : "bg-[#1F2C34]"
              } hover:bg-[#2A3942] transition`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={chatName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{chatName}</div>
                  <div className="text-xs text-[#8696A0] truncate w-48">
                    {lastMessage}
                  </div>
                </div>
              </div>
              <div className="text-xs text-[#8696A0] text-nowrap">
                {new Date(chat.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="text-sm text-[#8696A0] text-center mt-4">
            No chats found.
          </div>
        )}
      </div>
    </div>
  );
}
