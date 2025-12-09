import { useEffect, useState } from "react";
import API from "../api/axios";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.log("Error fetching books:", err);
    }
  };

  const deleteBook = async (id) => {
    try {
      await API.delete(`/books/${id}`);
      fetchBooks(); // refresh list
    } catch (err) {
      console.log("Error removing book:", err);
    }
  };

  const toggleStatus = async (book) => {
    try {
      const newStatus = book.status === "available" ? "rented" : "available";
      await API.put(`/books/${book._id}`, { status: newStatus });
      fetchBooks();
    } catch (err) {
      console.log("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Manage Books</h1>

      <div className="bg-white shadow rounded-lg p-5">
        {books.map((book) => (
          <div key={book._id} className="border-b py-3 flex justify-between">
            
            <div>
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p>Status: <span className="font-bold">{book.status}</span></p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleStatus(book)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Toggle Status
              </button>

              <button
                onClick={() => deleteBook(book._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
