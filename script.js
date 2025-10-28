const API_URL = "http://localhost:5000/api/books";
document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const year = document.getElementById("year").value;
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, genre, year }),
  });
  e.target.reset();
  loadBooks();
});
async function loadBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";
  books.forEach(book => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${book.title}</strong> by ${book.author} (${book.year})
        <em>${book.genre}</em> —
        <span style="color:${book.status === "Available" ? "green" : "red"}">
          ${book.status}
        </span>
      </div>
      <div>
        <button class="borrow-btn" onclick="borrowBook('${book._id}')">
          ${book.status === "Available" ? "Borrow" : "Return"}
        </button>
        <button class="delete-btn" onclick="deleteBook('${book._id}')">Delete</button>
      </div>
    `;
    bookList.appendChild(li);
  });
}
async function deleteBook(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadBooks();
}
async function borrowBook(id) {
  await fetch(`${API_URL}/${id}/borrow`, { method: "PUT" });
  loadBooks();
}
loadBooks();
