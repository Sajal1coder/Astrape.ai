import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { itemsAPI } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadItems();
    loadCategories();
  }, [filters, pagination.currentPage]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: 12
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await itemsAPI.getItems(params);
      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await itemsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleAddToCart = async (itemId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(itemId, 1);
    if (result.success) {
      alert('Item added to cart!');
    } else {
      alert(result.message);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        
        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Min Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center p-6">
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p className="mt-4">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.map(item => (
                <div key={item._id} className="card">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h3 className="font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold">${item.price}</span>
                      <span className="text-sm text-gray-500">{item.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(item._id)}
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  className="btn btn-outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </button>
                
                <span className="text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  className="btn btn-outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </button>
              </div>
            )}

            {/* Results info */}
            <div className="text-center text-gray-600 mt-4">
              Showing {items.length} of {pagination.totalItems} products
            </div>
          </>
        )}

        {/* No results */}
        {!loading && items.length === 0 && (
          <div className="text-center p-6">
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
