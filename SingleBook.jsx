import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/axios";

function SingleBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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

  // Fetch logged-in user
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

  // Fetch comments for this book
  const getComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  // Rent a book
  const rentBook = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(
        `/books/rent/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book rented successfully!");
      getBook();
    } catch (err) {
      alert(err.response?.data?.message || "Rent failed");
    }
  };

  // Return a book
  const returnBook = async () => {
    if (!token) return alert("Please login first!");
    try {
      await API.post(
        `/books/return/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Book returned!");
      getBook();
    } catch (err) {
      alert(err.response?.data?.message || "Return failed");
    }
  };

  // Add a new comment
  const submitComment = async () => {
    if (!token) return alert("Please login first!");
    if (!newComment.trim()) return;
    try {
      await API.post(
        `/books/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      getComments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };

  useEffect(() => {
    getBook();
    getUser();
    getComments();
  }, []);

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  const isRented = book.status === "rented";
  const canReturn = isRented && user && book.rentedBy === user._id;

  return (
    <div className="min-h-screen p-10 bg-[#f8f5f1] flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-8 space-y-8">
        {/* Book Info Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[#6F4E37]">{book.title}</h1>
          <p className="text-gray-700"><span className="font-semibold">Author:</span> {book.author}</p>
          <p className="text-gray-700"><span className="font-semibold">Genre:</span> {book.genre}</p>
          <p className="text-gray-700"><span className="font-semibold">Description:</span> {book.description || "No description available."}</p>
          <p className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            isRented ? "bg-red-300 text-red-800" : "bg-green-300 text-green-800"
          }`}>
            {isRented ? "Currently Rented" : "Available"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={rentBook}
            disabled={isRented}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition ${
              isRented ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Rent Book
          </button>
          {canReturn && (
            <button
              onClick={returnBook}
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Return Book
            </button>
          )}
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#6F4E37]">Comments</h2>
          {/* Add Comment */}
          {user && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              />
              <button
                onClick={submitComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          )}
          {!user && <p className="text-gray-500">Login to add a comment.</p>}

          {/* Display Comments */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="bg-[#f5efe6] p-3 rounded-lg shadow-sm">
                  <p className="text-gray-700">{c.text}</p>
                  <p className="text-gray-500 text-sm mt-1">— {c.userName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleBook;

