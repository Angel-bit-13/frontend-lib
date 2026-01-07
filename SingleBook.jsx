import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaBook,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import "../styles/sky.css";

function SingleBook() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const getBook = async () => {
    const res = await API.get(`/books/${id}`);
    setBook(res.data);
    setComments(res.data.comments || []);
    setRating(res.data.averageRating || 0);

    if (token) {
      setLiked(res.data.likes?.includes(userId));
      setDisliked(res.data.dislikes?.includes(userId));
    }
    setLoading(false);
  };

  useEffect(() => {
    getBook();
  }, []);

  const submitRating = async (value) => {
    const res = await API.post(`/books/rate/${id}`, { rating: value });
    setRating(res.data.averageRating);
  };

  const handleLike = async () => {
    await API.post(`/books/like/${id}`);
    setLiked(true);
    setDisliked(false);
    getBook();
  };

  const handleUnlike = async () => {
    await API.post(`/books/dislike/${id}`);
    setDisliked(true);
    setLiked(false);
    getBook();
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const res = await API.post(`/books/comment/${id}`, { text: newComment });
    setComments([...comments, res.data]);
    setNewComment("");
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="sky-background min-h-screen px-6 py-6 text-pink-900">

      {/* NAVBAR */}
      <nav className="mb-10 flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-3 rounded-xl shadow-md max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-pink-600">BeigeReads</h1>
        <div className="space-x-5 text-md">
          <Link to="/home" className="text-pink-600 hover:text-pink-800">
            Home
          </Link>
          <Link to="/profile" className="text-pink-600 hover:text-pink-800">
            Profile
          </Link>
        </div>
      </nav>

      {/* BOOK CONTENT */}
      <div className="flex justify-center">
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 max-w-3xl w-full flex flex-col gap-8 border border-pink-200">

          {/* TITLE */}
          <h1 className="magic-text text-3xl font-extrabold text-center">
            {book.title}
          </h1>

          {/* MAIN SECTION */}
          <div className="flex flex-col md:flex-row gap-8 items-center">

            {/* COVER - CENTERED */}
            <div className="flex justify-center items-center w-full md:w-auto">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-40 h-60 object-cover rounded-xl sparkle-hover shadow-md"
              />
            </div>

            {/* DETAILS */}
            <div className="flex-1 bg-white/60 rounded-xl p-4 border border-pink-200 shadow-inner w-full">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-pink-200 text-pink-800">
                  <tr>
                    <th className="py-2 flex items-center gap-2 font-semibold">
                      <FaUser /> Author
                    </th>
                    <td>{book.author}</td>
                  </tr>
                  <tr>
                    <th className="py-2 flex items-center gap-2 font-semibold">
                      <FaTag /> Genre
                    </th>
                    <td>{book.genre}</td>
                  </tr>
                  <tr>
                    <th className="py-2 flex items-center gap-2 font-semibold">
                      <FaCalendarAlt /> Year
                    </th>
                    <td>{book.publicationYear}</td>
                  </tr>
                  <tr>
                    <th className="py-2 flex items-center gap-2 font-semibold">
                      <FaBook /> ISBN
                    </th>
                    <td>{book.ISBN}</td>
                  </tr>
                </tbody>
              </table>

              {/* RATING */}
              <div className="mt-4 flex items-center gap-2">
                {[1,2,3,4,5].map((star) => (
                  <FaStar
                    key={star}
                    size={22}
                    className={`cursor-pointer ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => submitRating(star)}
                  />
                ))}
                <span className="ml-2 font-semibold text-sm">
                  {rating.toFixed(1)} / 5
                </span>
              </div>

              {/* LIKE / DISLIKE */}
              {token && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full text-white ${
                      liked ? "bg-pink-600" : "bg-pink-400 hover:bg-pink-500"
                    }`}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    onClick={handleUnlike}
                    className={`p-2 rounded-full text-white ${
                      disliked ? "bg-pink-600" : "bg-pink-400 hover:bg-pink-500"
                    }`}
                  >
                    <FaThumbsDown />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* COMMENTS */}
          <div className="bg-white/60 rounded-xl p-4 border border-pink-200 shadow-inner">
            <h2 className="text-xl font-bold text-pink-700 mb-3">
              Comments
            </h2>

            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto text-sm">
              {comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-pink-100 p-2 rounded-lg border border-pink-200"
                >
                  <p>{c.text}</p>
                  <span className="text-xs text-pink-600">
                    — {c.userName || "Anonymous"}
                  </span>
                </div>
              ))}
            </div>

            {token && (
              <div className="mt-3 flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 p-2 rounded-lg border border-pink-200 outline-none text-sm"
                />
                <button
                  onClick={submitComment}
                  className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
                >
                  Send
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SingleBook;
