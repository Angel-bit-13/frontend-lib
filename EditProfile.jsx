import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    place: "",
    age: "",
    education: "",
    phone: ""
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/api/users/me");
        const user = res.data;

        setForm({
          name: user.name || "",
          place: user.place || "",
          age: user.age || "",
          education: user.education || "",
          phone: user.phone || ""
        });
      } catch (error) {
        console.log("Load user error:", error);
      }
    };

    loadUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put("/api/users/update", {
        ...form,
        age: Number(form.age)
      });

      alert("Profile updated!");
      navigate("/profile");
    } catch (error) {
      console.log("Update failed:", error);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form className="bg-white p-8 rounded-xl w-96" onSubmit={handleUpdate}>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {["name", "place", "age", "education", "phone"].map((key) => (
          <input
            key={key}
            type={key === "age" ? "number" : "text"}
            className="w-full p-3 border rounded mb-3"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={key.toUpperCase()}
          />
        ))}

        <button className="w-full bg-amber-800 text-white p-3 rounded mt-2">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
