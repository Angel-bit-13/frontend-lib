const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");



// CREATE a book (Admin only)
router.post("/", auth, admin, async (req, res) => {
    try {
        const { title, author, publicationYear, genre, ISBN } = req.body;

        const existingBook = await Book.findOne({ ISBN });
        if (existingBook) {
            return res.status(400).json({ message: "Book with this ISBN already exists" });
        }

        const newBook = new Book({ title, author, publicationYear, genre, ISBN });
        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE book (Admin only)
router.put("/:id", auth, admin, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book updated", book });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE book (Admin only)
router.delete("/:id", auth, admin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // fetch all books from MongoDB
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET single book by id
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Rent a book
router.post("/rent/:id", auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.status === "rented") return res.status(400).json({ message: "Book already rented" });

        book.status = "rented";
        book.rentedBy = req.user._id;
        await book.save();

        // Update user's rentedBooksCount
        req.user.rentedBooksCount = (req.user.rentedBooksCount || 0) + 1;
        await req.user.save();

        res.json({ message: "Book rented successfully", book });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Return a book
router.post("/return/:id", auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.status === "available") return res.status(400).json({ message: "Book is not rented" });

        book.status = "available";
        book.rentedBy = null;
        await book.save();

        // Update user's rentedBooksCount
        if (req.user.rentedBooksCount && req.user.rentedBooksCount > 0) {
            req.user.rentedBooksCount -= 1;
            await req.user.save();
        }

        res.json({ message: "Book returned successfully", book });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Like a book
router.post("/like/:id", auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        const userId = req.user._id;

        if (book.likedBy.includes(userId)) {
            return res.status(400).json({ message: "You already liked this book" });
        }

        book.likedBy.push(userId);
        await book.save();

        res.json({ message: "Book liked successfully", book });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
