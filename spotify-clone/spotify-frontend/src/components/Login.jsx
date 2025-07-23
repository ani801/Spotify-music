import React, { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../App';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext';

const Login = () => {
  const {  handleSubmit, formData, setFormData } = useContext(PlayerContext);
  const navigate = useNavigate(); // prefer useNavigate over window.location

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const { contact, password } = formData;

  //   if (!contact || !password) {
  //     toast.error('Both fields are required!');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${url}/api/user/login`,
  //       { contact, password },
  //       { withCredentials: true }
  //     );

  //     if (response.data.success) {
  //       toast.success('Login successful!');
  //       setIsLoggedIn(true);
  //       navigate('/'); // redirect to homepage
  //     } else {
  //       toast.error(response.data.message || 'Login failed!');
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       toast.error(error.response.data.message || 'Unauthorized: Invalid credentials');
  //     } else {
  //       console.error('Login error:', error);
  //       toast.error('An error occurred. Please try again later.');
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#062e1f]/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Email or Phone</label>
            <input
              type="text"
              name="contact"
              className="w-full p-2 rounded-md bg-black/50 text-white border border-gray-600 focus:outline-none focus:border-green-500"
              onChange={handleChange}
              value={formData.contact}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 rounded-md bg-black/50 text-white border border-gray-600 focus:outline-none focus:border-green-500"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition-all"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-400 cursor-pointer hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
