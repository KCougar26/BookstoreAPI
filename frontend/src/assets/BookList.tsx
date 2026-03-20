import { useEffect, useState } from 'react';

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
  const [pageSize, setPageSize] = useState(5); 
  const [sortBy, setSortBy] = useState("title");

useEffect(() => {
  const fetchBooks = async () => {
    try {
      // Ensure this URL matches your Rider console (http://localhost:5003)
      const response = await fetch(`http://localhost:5003/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}`)
      const data = await response.json();

      if (data.books) {
        setBooks(data.books); 
      } else {
        setBooks(data); 
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  fetchBooks();
}, [pageNum, pageSize, sortBy]); // This "Dependency Array" tells React to re-run when these change

  return (
    <div className="container mt-4">
      <h2>Bookstore</h2>
        <div className="mb-3">
            <button onClick={() => setSortBy("title")} className="btn btn-outline-primary me-2">Sort by Title</button>
            <button onClick={() => setSortBy("author")} className="btn btn-outline-primary">Sort by Author</button>
        </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>${b.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls [cite: 23, 24] */}
      <div className="d-flex justify-content-between align-items-center">
        <button 
          className="btn btn-primary" 
          disabled={pageNum === 1} 
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>
        
        <span>Page {pageNum}</span>

        <button 
          className="btn btn-primary" 
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>

        <select 
          className="form-select w-auto" 
          value={pageSize} 
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>
    </div>
  );
};

export default BookList;