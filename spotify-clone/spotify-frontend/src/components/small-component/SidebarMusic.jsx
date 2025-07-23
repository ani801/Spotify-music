import { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCheck,
  FaUserFriends,
} from "react-icons/fa";
import axios from "axios";
import { url } from "../../App";
import { toast } from "react-toastify";
 import { FaRegCommentDots } from "react-icons/fa";

export default function SidebarMusic({setSelectedChat, socket, fetchChats,onlineUsers}) {
  const tabs = ["friends", "requests", "add"];
  const [tab, setTab] = useState("friends");

  const tabState = useRef({
    friends: { data: [], page: 1, hasMore: true, loading: false },
    requests: { data: [], page: 1, hasMore: true, loading: false },
    add: { data: [], page: 1, hasMore: true, loading: false },
  });

  const [displayData, setDisplayData] = useState([]);
  const listRef = useRef();
  const abortControllerRef = useRef(null);

  const dummyFollowing = [
    { id: 201, name: "Sonu Nigam", img: "https://i.pravatar.cc/40?img=14" },
    { id: 202, name: "Neha Kakkar", img: "https://i.pravatar.cc/40?img=15" },
  ];

  const endpoints = {
    friends: "/api/user/friends",
    requests: "/api/user/friendRequests",
    add: "/api/user/suggestions",
  };

  const fetchData = async (type, reset = false) => {
    const tabObj = tabState.current[type];
    if (tabObj.loading || (!tabObj.hasMore && !reset)) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    tabObj.loading = true;
    try {
      const res = await axios.get(
        `${url}${endpoints[type]}?page=${reset ? 1 : tabObj.page}&limit=10`,
        { signal: controller.signal, withCredentials: true }
      );

      const items =
        res.data.friends || res.data.friendRequests || res.data.suggestions || [];

      tabObj.data = reset ? items : [...tabObj.data, ...items];
      tabObj.page = reset ? 2 : tabObj.page + 1;
      tabObj.hasMore = res.data.hasMore;
      setDisplayData([...tabObj.data]);
    } catch (err) {
      if (!axios.isCancel(err)) toast.error("Failed to fetch data");
    } finally {
      tabObj.loading = false;
    }
  };

  const handleScroll = () => {
    const container = listRef.current;
    if (!container) return;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      fetchData(tab);
    }
  };

  useEffect(() => {
    const current = tabState.current[tab];
    if (current.data.length === 0) fetchData(tab, true);
    else setDisplayData([...current.data]);
  }, [tab]);

  const handleAcceptFriend = async (userId) => {
    try {
      const res = await axios.post(`${url}/api/user/acceptfriend`, { friendId: userId }, { withCredentials: true });
      if (!res.data.success) return toast.error("Failed to accept friend request");
      toast.success("Friend request accepted");
      tabState.current.requests.data = tabState.current.requests.data?.filter((u) => u._id !== userId);
      setDisplayData([...tabState.current.requests.data]);
      fetchData("requests", true); // Refresh requests tab

    } catch {
      toast.error("Error accepting friend");
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const res = await axios.post(`${url}/api/user/addfriendrequest`, { friendId: userId }, { withCredentials: true });
      if (!res.data.success) return toast.error("Failed to send friend request");
      toast.success("Friend request sent");
      tabState.current.add.data = tabState.current.add.data.filter((u) => u._id !== userId);
      setDisplayData([...tabState.current.add.data]);
      fetchData("add", true); // Refresh requests tab
    } catch {
      toast.error("Error sending friend request");
    }
  };

  const makeAchat = async (friendId) => {
    try {
      const res = await axios.post(`${url}/api/chat/private`, { friendId }, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSelectedChat(res.data.chat);
        socket.emit("join chat", res.data.chat._id);
        fetchChats(); // Refresh chats after creating a new chat
      }
    } catch (error) {
      toast.error("Error creating chat");
      console.error("Error creating chat:", error);
    }
  };

const FriendCard = ({ friend }) => (
  <div className="flex items-center justify-between gap-3 p-2 rounded hover:bg-white/10 cursor-pointer group">
    {/* Left side: Profile image and name */}
    <div className="flex items-center gap-3">
      <img
        src={friend.img || "https://i.pravatar.cc/40"}
        alt={friend.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <div className="text-sm font-semibold">{friend.name}</div>
        <div className={`text-xs text-${(friend && onlineUsers?.has(friend._id))===true?"green":"gray"}-400`}>{ (friend && onlineUsers?.has(friend._id))===true?"Online":"Offline"}</div>
      </div>
    </div>

    {/* Right side: Message icon always visible, hover effect only on hover */}
    <button onClick={() => makeAchat(friend._id)}
      className="p-2 rounded-full transition-all duration-200 text-white hover:bg-white/20 hover:scale-110"
      title="Message"
    >
      <FaRegCommentDots size={16} />
    </button>
  </div>
);

  

  const RequestCard = ({ request }) => (
    <div className="flex items-center justify-between gap-3 p-2 rounded hover:bg-white/10 cursor-pointer">
      <div className="flex items-center gap-3">
        <img src={request.img} className="w-10 h-10 rounded-full" />
        <div>
          <div className="text-sm font-semibold">{request.name}</div>
          <div className="text-xs text-gray-400">{request.mutual} mutual friends</div>
        </div>
      </div>
      <button onClick={() => handleAcceptFriend(request._id)} className="bg-green-500 hover:bg-green-700 text-xs px-3 py-1 rounded text-white">Accept</button>
    </div>
  );

  const AddFriendCard = ({ user }) => (
    <div className="flex items-center justify-between gap-3 p-2 rounded hover:bg-white/10 cursor-pointer">
      <div className="flex items-center gap-3">
        <img src={user.img} className="w-10 h-10 rounded-full" />
        <div>
          <div className="text-sm font-semibold">{user.name}</div>
          <div className="text-xs text-gray-400">{user.mutual} mutual friends</div>
        </div>
      </div>
      <button onClick={() => handleAddFriend(user._id)} className="bg-blue-500 hover:bg-blue-700 text-xs px-3 py-1 rounded text-white">Add</button>
    </div>
  );

  const FollowingCard = ({ artist }) => (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer">
      <img src={artist.img} className="w-10 h-10 rounded-full" />
      <div>
        <div className="text-sm font-semibold">{artist.name}</div>
        <div className="text-xs text-gray-400">Following</div>
      </div>
    </div>
  );

  return (
    <div className="w-[300px] h-full min-h-0 bg-[#121212] text-white p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Music Social</h2>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {[{ key: "friends", label: "Friends", icon: <FaUserFriends/> }, { key: "add", label: "Add Friend", icon: <FaUserPlus /> }, { key: "requests", label: "Requests", icon: <FaUserCheck/> }, { key: "following", label: "Following", icon: <FaUsers /> }].map(({ key, label, icon }) => (
          <button
            key={key}
            className={`flex items-center gap-1 px-2 py-1 rounded-full justify-center ${tab === key ? "bg-white text-black" : "bg-white/10 text-white"}`}
            onClick={() => setTab(key)}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="relative mt-1">
        <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
        <input
          className="w-full pl-9 pr-2 py-2 rounded bg-white/10 text-sm focus:outline-none"
          placeholder="Search artist or friend"
        />
      </div>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto space-y-2 mt-2"
      >
        {tab === "friends" && displayData.map((f) => <FriendCard key={f._id} friend={f} />)}
        {tab === "requests" && displayData.map((r) => <RequestCard key={r._id} request={r} />)}
        {tab === "add" && displayData.map((u) => <AddFriendCard key={u._id} user={u} />)}
        {tab === "following" && dummyFollowing.map((a) => <FollowingCard key={a.id} artist={a} />)}
      </div>
    </div>
  );
}
