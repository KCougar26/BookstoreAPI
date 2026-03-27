import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext'; // Add this import
import BookList from './assets/BookList'; 
import Cart from './Cart';

function App() {
  return (
    <CartProvider> {/* The Provider must wrap the entire App logic */}
      <Router>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;