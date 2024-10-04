let { getBooks, getBookById, addBook } = require("./book");
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/books", (req, res) => {
  res.json(getBooks());
});

app.get("/api/books/:id", (req, res) => {
  const book = getBookById(parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");
  res.json(book);
});

app.post("/api/books", (req, res) => {
  const book = addBook(req.body);
  res.status(201).json(book);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
