import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { url } from '../App';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Moved this up for cleaner flow

    try {
      const response = await axios.post(
        `${url}/api/user/adminlogin`,
        { email, password },
        { withCredentials: true } // 👈 Important for cookie-based login
      );

      if (response.data.success) {
        setIsLoggedIn(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-green-700">Login to Your Admin Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-lg font-semibold shadow-md transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
           <a href="#" className="text-black hover:underline">Forget Password</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
