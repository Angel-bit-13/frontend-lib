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

  if (!admin)
    return (
      <p className="text-center mt-10 text-gray-700 text-lg">Loading...</p>
    );

  return (
    <div className="min-h-screen p-10 bg-[#fdf6e3] flex justify-center items-start">
      <div className="bg-[#f8f1e7] w-full max-w-lg rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#5a4a3f] border-b border-[#e2d7cd] pb-3">
          Admin Profile
        </h1>

        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-[#5a4a3f]">Name:</span>{" "}
            <span className="text-[#4a3f35]">{admin.name}</span>
          </p>

          <p className="text-lg">
            <span className="font-semibold text-[#5a4a3f]">Email:</span>{" "}
            <span className="text-[#4a3f35]">{admin.email}</span>
          </p>

          <p className="text-lg">
            <span className="font-semibold text-[#5a4a3f]">Role:</span>{" "}
            <span className="text-[#4a3f35] capitalize">{admin.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


