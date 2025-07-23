import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { FaUsers, FaUserFriends, FaMusic, FaCompactDisc, FaUser } from 'react-icons/fa';

function ProfilePage() {
  const { useUserDetails } = useContext(PlayerContext);
//console.log("useUserDetails in ProfilePage: ", useUserDetails.pic);
  if (!useUserDetails) return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;

  const userData = {
    followers: "10",
    following: "20",
    friends: ["Abcd", "efgh", "ijkl", "Lmno"] || [],
    favoriteSong: 'No favorite song set',
    favoriteAlbums: ["Abcd", "efgh", "ijkl", "Lmno"] || [],
    artists: ["Abcd", "efgh", "ijkl", "Lmno"] || []
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg flex items-center gap-6">
  <img
   src={useUserDetails.pic} // ← this is a direct image link
  // src="https://www.freepik.com/free-vector/user-circles-set_145856997.htm#fromView=keyword&page=1&position=3&uuid=b306b2ff-9ff0-44e7-8735-652e42dc04a8&query=Profile"// Use the pic from useUserDetails
    alt="Profile"
    className="w-28 h-28 rounded-full object-cover border-4 border-white"
  />
  <div>
    <h1 className="text-3xl font-extrabold">{useUserDetails.name}</h1>
    <p className="text-sm mt-1 text-white/80">@musiclover</p>
  </div>
</div>


      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-white rounded-xl shadow p-4">
          <FaUsers className="text-indigo-600 text-2xl mx-auto" />
          <p className="mt-2 text-lg text-green-500 font-bold">{userData.followers}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <FaUserFriends className="text-pink-600 text-2xl mx-auto" />
          <p className="mt-2 text-lg text-cyan-400 font-bold">{userData.following}</p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <FaUser className="text-green-600 text-2xl mx-auto" />
          <p className="mt-2 text-lg text-violet-600 font-bold">{userData.friends.length}</p>
          <p className="text-sm text-gray-500">Friends</p>
        </div>
      </div>

      {/* Favorite Song */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
          <FaMusic /> Favorite Song
        </h2>
        <p className="mt-2 text-gray-700">{userData.favoriteSong}</p>
      </div>

      {/* Favorite Albums */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-pink-700 flex items-center gap-2">
          <FaCompactDisc /> Favorite Albums
        </h2>
        <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
          {userData.favoriteAlbums.map((album, i) => (
            <li key={i}>{album}</li>
          ))}
        </ul>
      </div>

      {/* Artists Listened To */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          <FaMusic /> Artists You Listen To
        </h2>
        <div className="flex flex-wrap gap-3 mt-3">
          {userData.artists.map((artist, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              {artist}
            </span>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-purple-700 flex items-center gap-2">
          <FaUserFriends /> Friends
        </h2>
        <div className="flex flex-wrap gap-5 mt-4">
          {userData.friends.map((friend, i) => (
            <div key={i} className="text-center">
              <img
                src={`https://i.pravatar.cc/100?img=${i + 30}`} // random avatar
                alt={friend}
                className="w-14 h-14 rounded-full mx-auto shadow"
              />
              <p className="text-sm mt-1 text-gray-600">{friend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
