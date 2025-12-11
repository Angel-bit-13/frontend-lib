import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place:"",
    age: "",
    email: "",
    education: "",
    phone: "",
    password: ""

  });

  const BACKEND_URL = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`${BACKEND_URL}/api/auth/register`, form);
      alert("Signup successful");
      const loginRes = await API.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // 3. Store token and role
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("role", loginRes.data.role);
      navigate("/home");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Place"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, place: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Age"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Education"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, education: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Phone" 
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="w-full bg-amber-800 text-white p-3 rounded mt-2">
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
