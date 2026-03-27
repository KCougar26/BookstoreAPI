import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      {cart.length > 0 ? (
        <>
          <table className="table table-bordered shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Book Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.bookID}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-secondary fw-bold">
                <td colSpan={3} className="text-end">Total:</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="d-flex justify-content-between mt-4">
            {/* Continue Shopping requirement  */}
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              &larr; Continue Shopping
            </button>
            <button className="btn btn-primary">Checkout</button>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <h4>Your cart is empty.</h4>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Go back to Bookstore
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;