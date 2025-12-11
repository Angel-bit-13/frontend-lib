import React, { useEffect, useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from "axios";
import { User, BookOpen, Users, ClipboardList, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRentals: 0,
  });

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  const BACKEND_URL = "http://localhost:5000"; // change if needed

  // Fetch stats + books
  const fetchDashboardData = async () => {
    try {
      const booksRes = await axios.get(`${BACKEND_URL}/api/books`);
      const usersRes = await axios.get(`${BACKEND_URL}/api/users`);
      const rentalsRes = await axios.get(`${BACKEND_URL}/api/rentals`);

      setStats({
        totalBooks: booksRes.data.length,
        totalUsers: usersRes.data.length,
        totalRentals: rentalsRes.data.length,
      });

      setBooks(booksRes.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-8">
          <BookOpen size={24} /> Admin Panel
        </h1>

        <nav className="flex flex-col gap-3">
          <Link className="p-3 bg-blue-600 rounded-lg flex items-center gap-2">
            <ClipboardList size={20} /> Dashboard
          </Link>

          <Link to="/admin/books" className="p-3 hover:bg-gray-700 rounded-lg flex items-center gap-2">
            <BookOpen size={20} /> Manage Books
          </Link>

          <Link to="/admin/users" className="p-3 hover:bg-gray-700 rounded-lg flex items-center gap-2">
            <Users size={20} /> Manage Users
          </Link>

          <Link to="/admin/rentals" className="p-3 hover:bg-gray-700 rounded-lg flex items-center gap-2">
            <ClipboardList size={20} /> Rentals
          </Link>

          <Link to="/login" className="p-3 hover:bg-gray-700 rounded-lg flex items-center gap-2 mt-10">
            <LogOut size={20} /> Logout
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
           
          <button
            onClick={() => navigate("/admin/profile")}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
          <User size={24} />
          </button>
    </div>
        

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-4xl font-bold">{stats.totalBooks}</h3>
            <p className="mt-2 text-gray-600">Total Books</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-4xl font-bold">{stats.totalUsers}</h3>
            <p className="mt-2 text-gray-600">Total Users</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-4xl font-bold">{stats.totalRentals}</h3>
            <p className="mt-2 text-gray-600">Total Rentals</p>
          </div>
        </div>

        {/* Books Table */}
        <h3 className="text-xl font-semibold mb-4">Books List</h3>
        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Genre</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-500">No books found</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="border-b">
                    <td className="p-3">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book.genre}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-white ${
                          book.status === "available" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
