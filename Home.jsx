import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/sky.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [likes, setLikes] = useState({});
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    const res = await API.get("http://localhost:5000/api/books");
    setBooks(res.data);

    const initialLikes = {};
    res.data.forEach((b) => {
      initialLikes[b._id] =
        b.likes?.includes(localStorage.getItem("userId")) || false;
    });
    setLikes(initialLikes);
  };

  const fetchUser = async () => {
    if (!token) return;
    const res = await API.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem("userId", res.data._id);
  };

  const toggleLike = async (bookId) => {
    await API.post(`/books/like/${bookId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLikes((p) => ({ ...p, [bookId]: !p[bookId] }));
  };

  useEffect(() => {
    fetchBooks();
    fetchUser();
  }, []);

  return (
    <div className="sky-background min-h-screen px-10 py-8 text-pink-900">

      {/* NAVBAR */}
      <nav className="mb-16 flex justify-between items-center bg-white/60 backdrop-blur-md px-8 py-4 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-pink-600 tracking-wide">
          BeigeReads
        </h1>
        <input
          placeholder="Search books..."
          className="bg-white border border-pink-300
            px-4 py-2 rounded-lg outline-none
            focus:ring-2 focus:ring-pink-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      {/* HEADING */}
      <div className="mb-20 flex justify-center">
        <div>
          <h2 className="magic-text text-5xl font-extrabold text-center tracking-widest">
            Explore the Magic Collection
          </h2>
          <p className="mt-4 text-center text-pink-600 text-sm">
            Stories floating through pastel skies ✨
          </p>
        </div>
      </div>

      {/* BOOK GRID */}
      <div className="grid grid-cols-5 gap-12 justify-items-center">
        {books
          .filter(
            (b) =>
              b.title?.toLowerCase().includes(search.toLowerCase()) ||
              b.author?.toLowerCase().includes(search.toLowerCase())
          )
          .map((book) => {
            const liked = likes[book._id];

            return (
              <div
                key={book._id}
                className="w-[6cm] h-[10cm] float transition-transform duration-300 hover:scale-105"
              >
                <Link to={`/book/${book._id}`} className="block h-full">

                  {/* COVER */}
                  <div className="h-[70%] overflow-hidden">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover rounded-xl sparkle-hover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-pink-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="h-[30%] px-2 py-3 flex flex-col items-center justify-between">
                    <h3 className="text-sm truncate text-center font-semibold">
                      {book.title}
                    </h3>
                    <p className="text-xs text-pink-600 text-center">
                      {book.author}
                    </p>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(book._id);
                      }}
                      className={
                        liked
                          ? "text-pink-500 hover:scale-110 transition"
                          : "text-pink-400 hover:text-pink-500 hover:scale-110 transition"
                      }
                    >
                      {liked ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>

                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
