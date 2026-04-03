import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Book {
  bookID?: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const BookForm = () => {
  const { id } = useParams(); // Get ID from URL for editing
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>({
    title: '', author: '', publisher: '', isbn: '',
    classification: '', category: '', pageCount: 0, price: 0
  });

  useEffect(() => {
    if (id) {
      // If there is an ID, we are in "Edit" mode—fetch the existing data
      fetch(`http://localhost:5003/api/books/${id}`)
        .then(res => res.json())
        .then(data => setBook(data));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:5003/api/books/${id}` : 'http://localhost:5003/api/books';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    }).then(() => navigate('/adminbooks'));
  };

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" value={book.title} 
            onChange={e => setBook({...book, title: e.target.value})} required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Author</label>
            <input type="text" className="form-control" value={book.author} 
              onChange={e => setBook({...book, author: e.target.value})} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <input type="text" className="form-control" value={book.category} 
              onChange={e => setBook({...book, category: e.target.value})} required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price</label>
            <input type="number" step="0.01" className="form-control" value={book.price} 
              onChange={e => setBook({...book, price: parseFloat(e.target.value)})} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">ISBN</label>
            <input type="text" className="form-control" value={book.isbn} 
              onChange={e => setBook({...book, isbn: e.target.value})} required />
          </div>
        </div>
        <button type="submit" className="btn btn-success me-2 shadow-sm">Save Changes</button>
        <button type="button" className="btn btn-secondary shadow-sm" onClick={() => navigate('/adminbooks')}>Cancel</button>
      </form>
    </div>
  );
};

export default BookForm;