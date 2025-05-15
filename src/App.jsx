import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(false);
        let url = `/api/products?page=${page}&limit=${productsPerPage}`;

        if (categoryFilter) url += `&category=${categoryFilter}`;
        if (query) url += `&name=${query}`;
        if (priceRange) url += `&priceRange=${priceRange}`; // Sending range string like "1kto2k"

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
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: active ? '#333' : '#eee',
    color: active ? '#fff' : '#000',
  });

  const totalPages = Math.ceil(totalCount / productsPerPage);

  return (
    <div className="app-container">
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
            <h2 className="product-count">
              Showing {products.length} Products
            </h2>

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
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p._id || p.id}>
                    <td>{(page - 1) * productsPerPage + index + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Simple numbered pagination */}
            {totalPages > 1 && (
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }}>
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
      </div>
    </div>
  );
}

export default App;
