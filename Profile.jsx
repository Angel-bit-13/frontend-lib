import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch user data");
      setLoading(false);
    }
  };

  // Return a rented book
  const returnBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/books/return/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book returned!");
      fetchUser(); // refresh user data
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">No user data</p>;

  return (
    <div className="min-h-screen bg-[#F5EFE6] p-10">
      <h2 className="text-3xl font-bold text-[#6F4E37] mb-6">Profile</h2>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 border">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Place:</strong> {user.place}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Education:</strong> {user.education}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>

      <h3 className="text-2xl font-semibold text-[#6F4E37] mb-4">Rented Books</h3>

      {user.likedBooks?.length === 0 ? (
        <p>No rented books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {user.likedBooks.map((book) => (
            <div key={book._id} className="bg-white p-4 rounded-xl shadow-md border">
              <h4 className="text-lg font-bold">{book.title}</h4>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-500 text-sm mt-1">{book.genre}</p>

              <button
                onClick={() => returnBook(book._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
