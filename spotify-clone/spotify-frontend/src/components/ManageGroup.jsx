import { useState } from "react";
import {
  FiArrowLeft,
  FiUserPlus,
  FiTrash2,
  FiUsers,
  FiEdit2,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ManageGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [search, setSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [groups] = useState([
    {
      id: "g1",
      name: "DSA Warriors",
      members: [
        {
          id: 5,
          name: "Debayan",
          email: "debayan@chat.com",
          dp: "https://i.pravatar.cc/150?img=8",
        },
      ],
    },
    {
      id: "g2",
      name: "Frontend Devs",
      members: [
        {
          id: 2,
          name: "Bob",
          email: "bob@example.com",
          dp: "https://i.pravatar.cc/150?img=2",
        },
        {
          id: 3,
          name: "Charlie",
          email: "charlie@example.com",
          dp: "https://i.pravatar.cc/150?img=3",
        },
      ],
    },
  ]);

  const [results] = useState([
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      dp: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      dp: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Charlie",
      email: "charlie@example.com",
      dp: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Prachi",
      email: "prachi@example.com",
      dp: "https://i.pravatar.cc/150?img=4",
    },
  ]);

  const [filteredGroups, setFilteredGroups] = useState([]);

  const addUser = (user) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleCreateOrUpdate = () => {
    alert("Group created or updated!");
    navigate("/community");
  };

  const handleDeleteGroup = () => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (confirm) {
      alert("Group deleted!");
      navigate("/community");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#1a1d2b] text-white px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-[#1C1F2B] transition"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FiUsers /> Manage Group
        </h1>
      </div>

      {/* Search Existing Groups */}
      <div className="bg-[#1F2C34] rounded-xl p-5 mb-6 shadow-md">
        <h3 className="text-md font-semibold mb-3">Search Group</h3>
        <input
          value={groupSearch}
          onChange={(e) => {
            setGroupSearch(e.target.value);
            const filtered = groups.filter((g) =>
              g.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredGroups(filtered);
          }}
          placeholder="Search by group name"
          className="w-full p-2 mb-3 bg-[#111B21] border border-[#2A2A3C] rounded-md text-white placeholder:text-gray-400"
        />
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-[#111B21] hover:bg-[#2A3942] transition px-4 py-2 rounded-md cursor-pointer"
              onClick={() => {
                setGroupName(group.name);
                setSelectedUsers(group.members);
                setEditingName(false);
                setGroupSearch("");
                setFilteredGroups([]);
              }}
            >
              <p className="font-semibold">{group.name}</p>
              <p className="text-sm text-gray-400">{group.members.length} members</p>
            </div>
          ))}
          {filteredGroups.length === 0 && groupSearch && (
            <p className="text-sm text-gray-400 text-center">No group found.</p>
          )}
        </div>
      </div>

      {/* Group Name Section */}
      <div className="bg-[#1F2C34] rounded-xl p-5 mb-6 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Group Name
            <button
              onClick={() => setEditingName((prev) => !prev)}
              className="text-gray-400 hover:text-gray-200"
            >
              {editingName ? <FiCheck /> : <FiEdit2 />}
            </button>
          </h2>
        </div>
        {editingName ? (
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Make a new group"
            className="w-full p-2 bg-[#111B21] border border-[#2A2A3C] rounded-md text-white"
          />
        ) : (
          <p className="text-xl font-bold text-[#25D366]">{groupName}</p>
        )}
      </div>

      {/* Add Members */}
      <div className="bg-[#1F2C34] rounded-xl p-5 mb-6 shadow-md">
        <h3 className="text-md font-semibold mb-3">Add Members</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email"
          className="w-full mb-4 p-2 bg-[#111B21] border border-[#2A2A3C] rounded-md text-white placeholder:text-gray-400"
        />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {results
            .filter(
              (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-2 rounded-md bg-[#111B21] hover:bg-[#2A3942] transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.dp}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={user.name}
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => addUser(user)}
                  className="text-green-400 hover:text-green-300"
                >
                  <FiUserPlus size={18} />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Current Members */}
      <div className="bg-[#1F2C34] rounded-xl p-5 mb-8 shadow-md">
        <h3 className="text-md font-semibold mb-3">Current Members</h3>
        {selectedUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">No members added yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-2 bg-[#111B21] rounded-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.dp}
                    className="w-8 h-8 rounded-full object-cover"
                    alt={user.name}
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeUser(user.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save & Delete Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={handleCreateOrUpdate}
          className="bg-[#8E44AD] hover:bg-[#732d91] px-6 py-3 rounded-lg font-semibold text-white text-lg transition"
        >
          Save Group
        </button>

        <button
          onClick={handleDeleteGroup}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold text-white text-lg transition"
        >
          Delete Group
        </button>
      </div>
    </div>
  );
}
