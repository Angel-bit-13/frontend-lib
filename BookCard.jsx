import React from "react";
import { Link, useParams } from "react-router-dom";

const BookDetails = ({ books }) => {
  const { id } = useParams();
  const book = books.find((b) => b._id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Book Cover */}
        <div className="flex justify-center bg-[#FAF6F0] p-6">
          <img
            src={book.img || "https://via.placeholder.com/200x300"}
            alt={book.title}
            className="w-48 h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Book Details */}
        <div className="p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-center">{book.title}</h1>

          <table className="table-auto border-collapse w-full text-center">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-700">Author</td>
                <td className="py-3 text-gray-600">{book.author}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-700">Genre</td>
                <td className="py-3 text-gray-600">{book.genre || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-700">Status</td>
                <td className={`py-3 font-bold ${book.isRented ? "text-red-600" : "text-green-600"}`}>
                  {book.isRented ? "Rented" : "Available"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-700">Description</td>
                <td className="py-3 text-gray-600">{book.description || "No description available."}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-700">Publisher</td>
                <td className="py-3 text-gray-600">{book.publisher || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          {/* Back Button */}
          <div className="flex justify-center mt-6">
            <Link
              to="/"
              className="bg-[#6F4E37] hover:bg-[#5a3d2d] text-white px-6 py-2 rounded-full transition"
            >
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
