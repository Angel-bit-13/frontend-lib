import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/axios";

function SingleBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null); // store logged-in user

  const token = localStorage.getItem("token");

  // Fetch book by ID
  const getBook = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.log("Error loading book:", err);
    }
  };

  // Fetch logged-in user (if token exists)
  const getUser = async () => {
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

  // Rent a book
  const rentBook = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(
        `http://localhost:5000/api/books/rent/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book rented successfully!");
      getBook(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Rent failed");
    }
  };

  // Return a book
  const returnBook = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(
        `http://localhost:5000/api/books/return/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book returned!");
      getBook(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  useEffect(() => {
    getBook();
    getUser();
  }, []);

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  const isRented = book.status === "rented";
  const canReturn = isRented && user && book.rentedBy === user._id;

  return (
    <div className="min-h-screen p-10 bg-[#F5EFE6] flex justify-center">
      <div className="bg-white shadow-lg rounded-3xl p-10 w-full max-w-2xl border">
        <h1 className="text-4xl font-bold text-[#6F4E37] mb-4">{book.title}</h1>

        <p className="text-lg text-gray-700 mb-1">
          <span className="font-semibold">Author:</span> {book.author}
        </p>

        <p className="text-lg text-gray-700 mb-3">
          <span className="font-semibold">Genre:</span> {book.genre}
        </p>

        <p
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-3 ${
            isRented ? "bg-red-300 text-red-800" : "bg-green-300 text-green-800"
          }`}
        >
          {isRented ? "Currently Rented" : "Available"}
        </p>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex gap-4">
          {/* Rent Button */}
          <button
            onClick={rentBook}
            disabled={isRented}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition ${
              isRented ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Rent Book
          </button>

          {/* Return Button (only if logged-in user rented it) */}
          {canReturn && (
            <button
              onClick={returnBook}
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Return Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleBook;
