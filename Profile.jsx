import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // EDIT MODE STATES
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // Fetch User Details
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Start Editing
  const startEditing = () => {
    setEditData({
      name: user.name,
      place: user.place,
      age: user.age,
      education: user.education,
      phone: user.phone,
    });
    setEditMode(true);
  };

  // Save Updated Profile
  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data); // update UI instantly
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  // Return rented book
  const returnBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/books/return/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Book returned!");
      fetchUser();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  // LOADING
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user found</p>;

  return (
    <div className="min-h-screen bg-[#F5EFE6] p-10">
      <h2 className="text-3xl font-bold text-[#6F4E37] mb-6">Profile</h2>

      {/* USER INFO CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 border">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Place:</strong> {user.place}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Education:</strong> {user.education}</p>
        <p><strong>Phone:</strong> {user.phone}</p>

        <button
          onClick={startEditing}
          className="mt-4 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* RENTED BOOKS */}
      <h3 className="text-2xl font-semibold text-[#6F4E37] mb-4">Rented Books</h3>

      {user.likedBooks?.length === 0 ? (
        <p>No rented books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {user.likedBooks.map((book) => (
            <div key={book._id} className="bg-white p-4 rounded-xl shadow-md border">
              <h4 className="text-lg font-bold">{book.title}</h4>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-500 text-sm">{book.genre}</p>

              <button
                onClick={() => returnBook(book._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EDIT PROFILE POPUP */}
      {editMode && (
        <div className="fixed inset-0 bg-amber-50 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-[#6F4E37]">Edit Profile</h3>

            {Object.keys(editData).map((key) => (
              <div key={key} className="mb-3">
                <label className="block font-medium capitalize">{key}</label>
                <input
                  className="w-full p-2 border rounded"
                  value={editData[key]}
                  onChange={(e) =>
                    setEditData({ ...editData, [key]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-amber-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
