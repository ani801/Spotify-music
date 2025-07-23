import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { url } from '../App';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contact: '', // single input for email or phone
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const isValidEmail = (value) =>
    /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

  const isValidPhone = (value) =>
    /^\d{10}$/.test(value);

  const handleSubmit =async (e) => {
    e.preventDefault();
    const { name, contact, password } = formData;

    if (!name || !password) {
      setError('Name and password are required.');
      return;
    }

    if (!isValidEmail(contact) && !isValidPhone(contact)) {
      setError('Please enter a valid email or 10-digit phone number.');
      return;
    }

    console.log('Form submitted:', formData);

   try {
    const response = await axios.post(`${url}/api/user/signup`, formData)

    if (response.data.success) {
      console.log('Signup successful:', response.data.message);
      toast.success(response.data.message);
      navigate('/login'); 
    
    }else{
      console.log('Signup failed:', response.data.message);
      setError(response.data.message);
      toast.error(response.data.message);
    }


   }catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred. Please try again later.');
    }

  

  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#062e1f] p-8 rounded-2xl shadow-xl max-w-md w-full text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Sign Up</h2>

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 rounded-md bg-black border border-gray-600 focus:outline-none focus:border-green-500"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email or Phone</label>
            <input
              type="text"
              name="contact"
              className="w-full p-2 rounded-md bg-black border border-gray-600 focus:outline-none focus:border-green-500"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              minLength={6}
              className="w-full p-2 rounded-md bg-black border border-gray-600 focus:outline-none focus:border-green-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* <div>
            <label className="block mb-1">Profile Picture URL (optional)</label>
            <input
              type="text"
              name="pic"
              className="w-full p-2 rounded-md bg-black border border-gray-600 focus:outline-none focus:border-green-500"
              onChange={handleChange}
            />
          </div> */}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition-all p-2 rounded-lg text-black font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
                   Have an account? <Link to="/login" className="text-green-400 cursor-pointer hover:underline">Login</Link>
                </p>
      </motion.div>
    </div>
  );
};

export default Signup;
