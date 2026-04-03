import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext'; // Add this import
import BookList from './assets/BookList'; 
import Cart from './Cart';
import Admin from './Admin';
import BookForm from './BookForm';

function App() {
  return (
    <CartProvider> {/* The Provider must wrap the entire App logic */}
      <Router>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/adminbooks" element={<Admin />} />
          <Route path="/admin/add" element={<BookForm />} />
          <Route path="/admin/edit/:id" element={<BookForm />} />
        </Routes>
      </Router>
    </CartProvider>
    
  );
}

export default App;