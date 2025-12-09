import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAdmin(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!admin) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen p-10 bg-[#f8f5f1] flex justify-center">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow p-8">
        <h1 className="text-3xl font-bold mb-4 text-[#4a3f35]">Admin Profile</h1>

        <p className="text-lg mb-2">
          <span className="font-semibold">Name:</span> {admin.name}
        </p>
        <p className="text-lg mb-2">
          <span className="font-semibold">Email:</span> {admin.email}
        </p>
        <p className="text-lg mb-2">
          <span className="font-semibold">Role:</span> {admin.role}
        </p>
      </div>
    </div>
  );
}
