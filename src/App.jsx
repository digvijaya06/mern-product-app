import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useCart } from './context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Cart from './components/Cart';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Checkin from './pages/Checkin';

function App() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [page, setPage] = useState(1);
  const productsPerPage = 10;

  const { cart, addToCart, isCartOpen, toggleCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(false);
        let url = `/api/products?page=${page}&limit=${productsPerPage}`;
        if (categoryFilter) url += `&category=${categoryFilter}`;
        if (query) url += `&name=${query}`;
        if (priceRange) url += `&priceRange=${priceRange}`;
        const res = await axios.get(url);
        setProducts(res.data.products);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        setError(true);
      }
    };
    fetchProducts();
  }, [page, categoryFilter, query, priceRange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setQuery(search.trim());
      setPage(1);
    }
  };

  const paginationButtonStyle = (active) => ({
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: active ? '#fff' : 'gray',
    color: active ? 'black' : 'black',
  });

  const totalPages = Math.ceil(totalCount / productsPerPage);

  return (
    <Router>
      <div className="app-container">
        <button className="floating-cart-btn" onClick={toggleCart}>
          <FontAwesomeIcon icon={faCartShopping} />
          <span className="cart-badge">{cart.length}</span>
        </button>

        {isCartOpen && <Cart />}

        <Routes>
          <Route
            path="/"
            element={
              <div className="center-wrapper">
                <h1 className="title">Product Finder</h1>

                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="search-input"
                />

                {error ? (
                  <h2 className="error-text">Something went wrong!</h2>
                ) : (
                  <>
                    <h2 className="product-count">Showing {products.length} Products</h2>

                    <div className="filter-bar">
                      <select
                        className="filter-dropdown"
                        value={categoryFilter}
                        onChange={(e) => {
                          setCategoryFilter(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Bags">Bags</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Footwear">Footwear</option>
                      </select>

                      <select
                        className="filter-dropdown"
                        value={priceRange}
                        onChange={(e) => {
                          setPriceRange(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Prices</option>
                        <option value="under1k">Under ₹1000</option>
                        <option value="1kto2k">₹1000 - ₹2000</option>
                        <option value="2kto5k">₹2000 – ₹5000</option>
                        <option value="5kto10k">₹5000 – ₹10000</option>
                        <option value="10kto40k">₹10000 – ₹40000</option>
                      </select>
                    </div>

                    <table className="product-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price (₹)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, index) => (
                          <tr key={p._id || p.id}>
                            <td>{(page - 1) * productsPerPage + index + 1}</td>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>{p.price}</td>
                            <td>
                              <button className="icon-btn" onClick={() => addToCart(p)}>
                                <FontAwesomeIcon icon={faCartShopping} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {totalPages > 1 && (
                      <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            style={paginationButtonStyle(page === i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <Link to="/checkin" style={{ marginTop: '20px', display: 'inline-block', color: '#00e5ff' }}>
                  Go to Checkin Page
                </Link>
              </div>
            }
          />
          <Route path="/checkin" element={<Checkin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
