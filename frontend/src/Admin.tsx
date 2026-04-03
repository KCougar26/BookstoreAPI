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
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('http://localhost:5003/api/books?pageSize=100') // Fetching a larger list for admin
      .then(res => res.json())
      .then(data => setBooks(data.books));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      fetch(`http://localhost:5003/api/books/${id}`, { method: 'DELETE' })
        .then(() => fetchBooks()); // Refresh list after deletion 
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Panel</h1>
        <button className="btn btn-primary" onClick={() => navigate('/admin/add')}>
          Add New Book
        </button>
      </div>

      <table className="table table-striped shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.category}</td>
              <td>${b.price.toFixed(2)}</td>
              <td>
                <button 
                  className="btn btn-warning btn-sm me-2" 
                  onClick={() => navigate(`/admin/edit/${b.bookID}`)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleDelete(b.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;