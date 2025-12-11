import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      console.log("Error fetching books:", err);
    }
  };

  // Fetch logged-in user
  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5EFE6] p-10">

      {/* NAVBAR */}
      <nav className="bg-[#E8DFCA] shadow-md px-8 py-4 flex justify-between items-center rounded-2xl mb-12 border border-[#D8CDBA]">
        <h1 className="text-3xl font-bold text-[#6F4E37] tracking-wide">📚 BeigeReads</h1>

        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm w-full max-w-md mx-6 border border-[#D8CDBA]">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full bg-transparent outline-none text-[#6F4E37]"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-x-6 text-lg">
          <Link to="/" className="text-[#6F4E37] hover:text-black">Home</Link>
          <Link to="/signup" className="text-[#6F4E37] hover:text-black">Signup</Link>
          <Link to="/login" className="text-[#6F4E37] hover:text-black">Login</Link>
          <Link to="/login" className="text-[#6F4E37] hover:text-black">Admin</Link>
          <Link to="/profile" className="text-[#6F4E37] hover:text-black">Profile</Link>
        </div>
      </nav>

      <h2 className="text-4xl font-bold text-[#6F4E37] mb-8">
        Explore Our Cozy Book Collection ☕📖
      </h2>

      {/* BOOK GRID */}
      {/* BOOK GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
  {books
    ?.filter((b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
    )
    .map((book) => {
      const isRented = book.status === "rented";
      const rentedByUser = user && book.rentedBy === user._id;
      return (
        <Link
          to={`/book/${book._id}`}
          key={book._id}
          className={`bg-[#FAF6F0] border border-[#E3DCCE] rounded-3xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 ${
            rentedByUser ? "border-blue-500" : ""
          } flex flex-col items-center`}
        >
          {/* Book Image */}
          {book.image && (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-2xl mb-4"
            />
          )}

          <h3 className="text-xl font-bold text-[#6F4E37] mb-2 text-center">{book.title}</h3>
          <p className="text-[#8C6E54] text-center">✍ {book.author}</p>
          <p className="text-[#A18D7A] text-sm mt-1 text-center">{book.genre || "Fiction"}</p>

          <span
            className={`inline-block mt-4 px-3 py-1 text-sm font-semibold rounded-full ${
              isRented
                ? rentedByUser
                  ? "bg-blue-300 text-blue-800"
                  : "bg-red-300 text-red-800"
                : "bg-green-300 text-green-800"
            }`}
          >
            {isRented ? (rentedByUser ? "Rented by you" : "Rented") : "Available"}
          </span>
        </Link>
      );
    })}
</div>
    </div>
  );
};

export default Home;
