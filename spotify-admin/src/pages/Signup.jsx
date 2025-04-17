import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      console.log("User Registered:", formData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-white">Create an Account</h2>
        
        {error && <p className="p-2 text-red-500 bg-red-100 border border-red-400 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 mt-1 text-white bg-gray-700 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
