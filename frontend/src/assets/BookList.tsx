import { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize] = useState(5); 
  const [sortBy, setSortBy] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart, subtotal, totalItems } = useCart();
  const [showToast, setShowToast] = useState<boolean>(false); 

  const categories = ["Biography", "Business", "Children", "Fiction", "Historical", "Non-Fiction", "Self-Help"];

  useEffect(() => {
    fetch(`${(import.meta as any).env.VITE_API_URL}/books?pageNum=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}&category=${selectedCategory || ''}`)
        .then(response => response.json())
        .then((data: { books: Book[], totalItems: number }) => {
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalItems / pageSize)); 
        })
        .catch(err => console.error("Fetch error:", err));
  }, [pageNum, pageSize, sortBy, selectedCategory]);

  return (
    <div className="container mt-4">
      <div className="row">
        
        {/* Sidebar */}
        <div className="col-md-3">
          <h4 className="mb-3">Categories</h4>
          <div className="list-group mb-4 shadow-sm">
            <button 
              className={`list-group-item list-group-item-action ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(null); setPageNum(1); }}
            >
              All Books
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(cat); setPageNum(1); }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="card border-primary mb-3 shadow-sm">
             <div className="card-header bg-primary text-white text-center fw-bold">Cart Summary</div>
             <div className="card-body text-center">
                {totalItems > 0 ? (
                  <>
                    <p className="card-text mb-1">{totalItems} item(s) in cart</p>
                    <p className="fw-bold text-primary mb-2">Total: ${subtotal.toFixed(2)}</p>
                    
                    {/* BOOTSTRAP FEATURE 1: PROGRESS BAR
                      This provides a dynamic visual representation of the user's subtotal. 
                      It uses 'progress-bar-animated' and 'striped' for a professional look 
                      and changes color (bg-info to bg-success) once the $50 free shipping threshold is met.
                    */}
                    <div className="mt-2 mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                        {subtotal >= 50 ? "🎉 Free Shipping!" : `Add $${(50 - subtotal).toFixed(2)} for Free Shipping`}
                      </small>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className={`progress-bar progress-bar-striped progress-bar-animated ${subtotal >= 50 ? 'bg-success' : 'bg-info'}`} 
                          role="progressbar"
                          style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="card-text text-muted">Your cart is currently empty.</p>
                )}

                <Link className="btn btn-outline-primary btn-sm w-100" to="/cart">
                  View Cart
                </Link>
                
                <Link to="/adminbooks" className="btn btn-dark btn-sm w-100 mt-2">
                  Admin Management
                </Link>

             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="display-6">Bookstore {selectedCategory ? `| ${selectedCategory}` : ''}</h2>
            
            <div className="btn-group shadow-sm">
              <button 
                onClick={() => { setSortBy("title"); setPageNum(1); }} 
                className={`btn btn-sm ${sortBy === "title" ? "btn-secondary" : "btn-outline-secondary"}`}
              >
                Sort by Title
              </button>
              <button 
                onClick={() => { setSortBy("author"); setPageNum(1); }} 
                className={`btn btn-sm ${sortBy === "author" ? "btn-secondary" : "btn-outline-secondary"}`}
              >
                Sort by Author
              </button>
            </div>
          </div>

          <table className="table table-hover table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((b) => (
                  <tr key={b.bookID}>
                    <td className="fw-bold">{b.title}</td>
                    <td>{b.author}</td>
                    <td><span className="badge bg-info text-dark">{b.category}</span></td>
                    <td>${b.price.toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          addToCart(b);
                          setShowToast(true);
                          setTimeout(() => setShowToast(false), 3000);
                        }}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="text-center">Loading books...</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button 
              className="btn btn-primary btn-sm" 
              disabled={pageNum === 1} 
              onClick={() => setPageNum(pageNum - 1)}
            >
              &larr; Previous
            </button>
            <span className="fw-bold">Page {pageNum} of {totalPages}</span>
            <button 
              className="btn btn-primary btn-sm" 
              disabled={pageNum >= totalPages} 
              onClick={() => setPageNum(pageNum + 1)}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* BOOTSTRAP FEATURE 2: TOAST NOTIFICATION
        A position-fixed popup that triggers when 'Add to Cart' is clicked. 
        It uses 'toast-container' and 'shadow-lg' to provide non-intrusive 
        feedback to the user, confirming that their action was successful 
        without refreshing the page or moving their scroll position.
      */}
      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className="toast show align-items-center text-white bg-success border-0 shadow-lg">
            <div className="d-flex">
              <div className="toast-body fw-bold">
                📚 Added to your cart!
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;