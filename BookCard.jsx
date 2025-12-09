import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <Link
      to={`/book/${book._id}`}
      className="p-4 bg-white rounded-lg shadow hover:shadow-xl transition block"
    >
      <img
        src={book.img}
        alt={book.title}
        className="w-full h-52 object-cover rounded"
      />

      <h3 className="mt-3 text-xl font-semibold">{book.title}</h3>
      <p className="text-gray-500">{book.author}</p>

      <p
        className={`mt-2 font-bold ${
          book.isRented ? "text-red-600" : "text-green-600"
        }`}
      >
        {book.isRented ? "Rented" : "Available"}
      </p>
    </Link>
  );
};

export default BookCard;
