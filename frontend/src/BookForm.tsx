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
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // 1. Grab the API URL from your .env
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [book, setBook] = useState<Book>({
    title: '', author: '', publisher: '', isbn: '',
    classification: '', category: '', pageCount: 0, price: 0
  });

  useEffect(() => {
    if (id) {
      // 2. Update the fetch to use the dynamic URL
      fetch(`${API_BASE_URL}/books/${id}`)
        .then(res => {
            if (!res.ok) throw new Error("Could not fetch book details");
            return res.json();
        })
        .then(data => setBook(data))
        .catch(err => console.error("Fetch book error:", err));
    }
  }, [id, API_BASE_URL]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Update the submission URLs
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/books/${id}` : `${API_BASE_URL}/books`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    })
    .then(res => {
        if (res.ok) {
            navigate('/adminbooks');
        } else {
            alert("Save failed. Check the console for details.");
        }
    })
    .catch(err => console.error("Submit error:", err));
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-4">{id ? 'Edit Book Details' : 'Add New Book'}</h2>
          <form onSubmit={handleSubmit} className="shadow-lg p-4 bg-white rounded border">
            {/* Form Fields */}
            <div className="mb-3">
              <label className="form-label fw-bold">Title</label>
              <input type="text" className="form-control" value={book.title} 
                onChange={e => setBook({...book, title: e.target.value})} required />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Author</label>
                <input type="text" className="form-control" value={book.author} 
                  onChange={e => setBook({...book, author: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Category</label>
                <input type="text" className="form-control" value={book.category} 
                  onChange={e => setBook({...book, category: e.target.value})} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="number" step="0.01" className="form-control" value={book.price} 
                    onChange={e => setBook({...book, price: parseFloat(e.target.value)})} required />
                </div>
              </div>
              <div className="col-md-8 mb-3">
                <label className="form-label fw-bold">ISBN</label>
                <input type="text" className="form-control" value={book.isbn} 
                  onChange={e => setBook({...book, isbn: e.target.value})} required />
              </div>
            </div>

            <div className="mt-4 border-top pt-3">
                <button type="submit" className="btn btn-success px-4 me-2 shadow-sm">Save Changes</button>
                <button type="button" className="btn btn-outline-secondary px-4 shadow-sm" onClick={() => navigate('/adminbooks')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;