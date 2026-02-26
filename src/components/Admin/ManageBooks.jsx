import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Plus, Edit, Trash2 } from "lucide-react";
import BookModal from "./BookModal";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Fetch
  const fetchBooks = async () => {
    const { data } = await supabase
      .from("tomes")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBooks(data);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("tomes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching books:", error);
      } else if (data) {
        setBooks(data);
      }
    };

    fetchBooks();
  }, []);

  // Filter Logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Banish this book?")) return;
    await supabase.from("tomes").delete().eq("id", id);
    fetchBooks();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    fetchBooks(); // Refresh after add/edit
  };

  return (
    <div>
      {/* Controls */}
      <div className="dashboard-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search title or author..."
            className="search-input"
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="filter-select"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Mystery">Mystery</option>
          </select>
        </div>
        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Book
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td style={{ fontWeight: "bold" }}>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <span className={`badge ${book.category.toLowerCase()}`}>
                    {book.category}
                  </span>
                </td>
                <td>{"⭐".repeat(book.sparkleRating || 0)}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(book.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BookModal bookToEdit={editingBook} onClose={handleCloseModal} />
      )}
    </div>
  );
}
