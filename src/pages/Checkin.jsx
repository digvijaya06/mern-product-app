import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Checkin.css';

const Checkin = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handlePayment = () => {
    alert("Redirecting to payment gateway... (mock)");
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="checkin-container">
      <h2>🧾 Checkin Page</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table className="checkin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity ? item.quantity : 1}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="remove-btn"
                      aria-label="Remove item"
                      title="Remove item"
                    >
                      &#10060;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="checkin-actions">
            <button onClick={handlePayment} className="payment-btn">
              Make Payment
            </button>

            <button onClick={handleBack} className="back-btn" aria-label="Go back" title="Go back">
              &#8592; Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkin;
