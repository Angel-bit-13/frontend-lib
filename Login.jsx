import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert("Invalid login credentials");
    }
  };

  return (
   <div
  className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80')",
  }}
>
  {/* Glassy Card in center */}
  <form
    onSubmit={handleLogin}
    className="relative z-10 max-w-sm mx-auto bg-amber-50/30 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-amber-200/40"
  >
    {/* Heading */}
    <h2 className="text-3xl font-bold text-center text-amber-800 mb-6">
      Welcome Back!
    </h2>

    {/* Email Input */}
    <div className="mb-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-xl border border-amber-200/50 bg-amber-100/30 backdrop-blur-sm placeholder-amber-700 text-amber-900 focus:ring-2 focus:ring-amber-300 transition-all duration-300"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    {/* Password Input */}
    <div className="mb-4">
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-xl border border-amber-200/50 bg-amber-100/30 backdrop-blur-sm placeholder-amber-700 text-amber-900 focus:ring-2 focus:ring-amber-300 transition-all duration-300"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    {/* Login Button */}
    <button className="w-full p-3 rounded-full bg-amber-300 text-amber-900 font-semibold shadow-md hover:bg-amber-400 transition-all duration-300">
      Login
    </button>

    {/* Signup Link */}
    <p className="text-center mt-5 text-amber-800 font-medium">
      No account?{" "}
      <Link to="/signup" className="underline hover:text-amber-900">
        Sign up
      </Link>
    </p>
  </form>
</div>
  );  
}
export default Login;