const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/booklibrary", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  year: Number,
  status: { type: String, default: "Available" }
}, { versionKey: false }); 
const Book = mongoose.model("Book", bookSchema);
app.get("/api/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});
app.post("/api/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json({ message: "Book added!", book });
});
app.delete("/api/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted!" });
});
app.put("/api/books/:id/borrow", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.status = book.status === "Available" ? "Borrowed" : "Available";
  await book.save();
  res.json({ message: "Book status updated!", status: book.status });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
