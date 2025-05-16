import { useCart } from '../context/CartContext';
import './Cart.css';
import { FaTrash} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const Cart = () => {
  const { cart, removeFromCart, isCartOpen, toggleCart } = useCart();

  if (!isCartOpen) return null; 

  return (
    <div className="cart-container">
      <div className="cart-header">
        🛒 Your Cart
        <button onClick={toggleCart} style={{
          float: 'right',
          background: 'transparent',
          border: 'none',
          color: '#00e5ff',
          fontSize: '1.2rem',
          cursor: 'pointer'
        }}>
          ✖
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="cart-empty">No items in your cart.</p>
      ) : (
        <div>
          {cart.map((item, idx) => (
            <div className="cart-item" key={idx}>
              <div>
                <div className="cart-item-name">{item.name}</div>
                <div>Category: {item.category}</div>
                <div className="cart-item-price">₹{item.price}</div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)} className='icon-btn'>
                style={{ padding: '4px 8px', background: '#ff5252', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              
                <FaTrash/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
