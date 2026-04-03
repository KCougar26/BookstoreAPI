import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Book {
  bookID: number;
  title: string;
  author: string;
  category: string;
  price: number;
}

const Admin = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  // Get the API URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    // Use the dynamic URL instead of localhost
    fetch(`${API_BASE_URL}/books?pageSize=100`) 
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch admin books");
        return res.json();
      })
      .then(data => {
        setBooks(data.books || []); // Ensure we handle the .books wrapper
        setLoading(false);
      })
      .catch(err => {
        console.error("Admin fetch error:", err);
        setLoading(false);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      // Use the dynamic URL for deletion too
      fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            fetchBooks(); // Refresh list after successful deletion
          } else {
            alert("Failed to delete the book.");
          }
        })
        .catch(err => console.error("Delete error:", err));
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5">Admin Panel</h1>
        <button className="btn btn-primary shadow-sm" onClick={() => navigate('/admin/add')}>
          + Add New Book
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                  <div className="mt-2">Loading Admin Data...</div>
                </td>
              </tr>
            ) : books.length > 0 ? (
              books.map(b => (
                <tr key={b.bookID}>
                  <td className="fw-bold">{b.title}</td>
                  <td>{b.author}</td>
                  <td><span className="badge bg-secondary">{b.category}</span></td>
                  <td>${b.price.toFixed(2)}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-warning btn-sm me-2 shadow-sm" 
                      onClick={() => navigate(`/admin/edit/${b.bookID}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm shadow-sm" 
                      onClick={() => handleDelete(b.bookID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No books found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;