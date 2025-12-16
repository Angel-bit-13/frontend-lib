import { useState } from "react";

const BookCard = ({ book }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation(); // stop Link click
    e.preventDefault();  // stop navigation
    setLiked(!liked);
  };

  return (
    <div
      style={{
        width: "200px",
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        position: "relative",
        margin: "10px",
        backgroundColor: "#fff",
      }}
    >
      {/* ❤️ LIKE BUTTON */}
      <button
        onClick={handleLike}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          fontSize: "28px",
          background: "#fff",
          border: "2px solid red",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 100,
        }}
      >
        {liked ? "❤️" : "🤍"}
      </button>

      <img
        src={book?.img || "https://via.placeholder.com/150x200"}
        alt={book?.title || "Book"}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />

      <h3 style={{ marginTop: "8px" }}>{book?.title || "Book Title"}</h3>
      <p style={{ color: "#666" }}>{book?.author || "Author Name"}</p>
      <p style={{ fontWeight: "bold", color: book?.isRented ? "red" : "green" }}>
        {book?.isRented ? "Rented" : "Available"}
      </p>
    </div>
  );
};

export default BookCard;
