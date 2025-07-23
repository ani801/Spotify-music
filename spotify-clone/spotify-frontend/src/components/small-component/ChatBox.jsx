// ChatBox.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { FiSend, FiPlus } from "react-icons/fi";
import { PlayerContext } from "../../context/PlayerContext";
import axios from "axios";
import {
  scrollToBottom,
  preserveScrollOnPrepend,
  isOwnMessage,
} from "../../utils/chatUtils";


const uri = "http://localhost:4000";
let typingTimeout = null;

export default function ChatBox({ selectedChat, socket , setTrigger,setOnlineUsers,onlineUsers }) {
  const { useUserDetails } = useContext(PlayerContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMore, setHasMore] = useState(true);
 

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (!socket.connected || !selectedChat) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  };

  useEffect(() => {
    const handleOnlineUsers = (userIds) => {
      setOnlineUsers(new Set(userIds));
     
    };

    socket.on("online-users", handleOnlineUsers);
    return () => socket.off("online-users", handleOnlineUsers);
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const { data } = await axios.get(
          `${uri}/api/message/${selectedChat._id}?limit=20`,
          { withCredentials: true }
        );

        if (data.success) {
          setMessages(data.messages.reverse());
          setHasMore(data.messages.length > 0);
          setTrigger(true); // Trigger to refresh chats in GroupPanel
          socket.emit("join chat", selectedChat._id);
        } else {
          console.error("Fetch messages error:", data.error || data);
          setMessages([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Message fetch failed", err);
      }
    };

    fetchMessages();
    return () => {
      if (selectedChat) socket.emit("leave chat", selectedChat._id);
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      socket.emit("refresh chats");
      setTrigger(true); // Trigger to refresh chats in GroupPanel
    };

    const handleTypingStart = () => setIsTyping(true);
    const handleTypingStop = () => setIsTyping(false);

    socket.on("message received", handleNewMessage);
    socket.on("typing", handleTypingStart);
    socket.on("stop typing", handleTypingStop);

    return () => {
      socket.off("message received", handleNewMessage);
      socket.off("typing", handleTypingStart);
      socket.off("stop typing", handleTypingStop);
    };
  }, [socket, selectedChat]);

  const loadOlderMessages = async () => {
    if (isFetching || !hasMore || messages.length === 0) return;
    setIsFetching(true);

    const oldestMessageId = messages[0]._id;
    try {
      const { data } = await axios.get(
        `${uri}/api/message/${selectedChat._id}?before=${oldestMessageId}&limit=20`,
        { withCredentials: true }
      );

      if (data.success) {
        preserveScrollOnPrepend(scrollContainerRef, () => {
          setMessages((prev) => [...data.messages.reverse(), ...prev]);
        });
        setHasMore(data.messages.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load older messages failed", err);
    }
    setIsFetching(false);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current.scrollTop === 0 && hasMore) {
      loadOlderMessages();
    }
  };

  const send = async () => {
    if (!input.trim() || !selectedChat) return;
    socket.emit("stop typing", selectedChat._id);

    try {
      const { data } = await axios.post(
        `${uri}/api/message`,
        {
          content: input,
          chatId: selectedChat._id,
        },
        { withCredentials: true }
      );

      setInput("");

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        socket.emit("new message", data.message);
        socket.emit("refresh chats");
      } else {
        console.error("Message send failed:", data.error || data);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const chatPartner =
    !selectedChat.isGroupChat &&
    selectedChat.users.find((u) => u._id !== useUserDetails._id);

  const isPartnerOnline = chatPartner && onlineUsers?.has(chatPartner._id);
  console.log("Chat partner online status:", isPartnerOnline);
  console.log("onlineUsers:", onlineUsers);

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-[#0B0F19] text-[#F5F5F5]">
      <div className="shrink-0 p-3 border-b border-[#2A2A3C] bg-[#1E1E2E] shadow-sm flex items-center gap-3">
        <img
          src={selectedChat.groupAvatar || selectedChat.dp}
          alt={selectedChat.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-white">{selectedChat.name}</h2>
          {!selectedChat.isGroupChat && (
            <p className={`text-xs ${isPartnerOnline ? "text-green-400" : "text-gray-500"}`}>
              {isPartnerOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat"
      >
        {isFetching && (
          <div className="text-center text-sm text-gray-400">
            Loading older messages...
          </div>
        )}

        {!hasMore && !isFetching && (
          <div className="text-center text-xs text-gray-500 mt-2">
            No older messages
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-xl break-words ${
              isOwnMessage(msg, useUserDetails._id)
                ? "bg-[#8E44AD] text-white ml-auto"
                : "bg-[#2ECC71] text-black"
            }`}
          >
            {msg.content || msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="text-xs text-gray-400 pl-2 pb-2">Typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 p-3 border-t border-[#2A2A3C] bg-[#1E1E2E] flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-[#2A2A3C] text-white">
          <FiPlus />
        </button>
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 border-none rounded-full px-4 py-2 text-sm bg-[#2A2A3C] text-white placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#8E44AD]"
          placeholder="Type a message"
        />
        <button
          onClick={send}
          className="bg-[#8E44AD] text-white px-4 py-2 rounded-full hover:bg-[#732d91]"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}
