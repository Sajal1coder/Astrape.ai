import { useEffect } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function Cart() {
  const { cart, total, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateCartItem(cartItemId, newQuantity);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      const result = await removeFromCart(cartItemId);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      const result = await clearCart();
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <Layout>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          {cart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="btn btn-danger"
              disabled={loading}
            >
              Clear Cart
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center p-6">
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p className="mt-4">Loading cart...</p>
          </div>
        )}

        {!loading && cart.length === 0 && (
          <div className="text-center p-6">
            <div className="card">
              <div className="card-body">
                <h2 className="text-xl mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-4">Add some products to get started!</p>
                <button
                  onClick={() => router.push('/')}
                  className="btn btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-bold">Cart Items ({cart.length})</h2>
                </div>
                <div className="card-body">
                  {cart.map((cartItem) => (
                    <div key={cartItem._id} className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.375rem' }}
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-bold">{cartItem.item.name}</h3>
                        <p className="text-gray-600 text-sm">{cartItem.item.description}</p>
                        <p className="text-gray-500 text-sm">{cartItem.item.category}</p>
                        <p className="font-bold text-lg">${cartItem.item.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(cartItem._id, cartItem.quantity - 1)}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          disabled={loading || cartItem.quantity <= 1}
                        >
                          -
                        </button>
                        
                        <span className="text-lg font-bold" style={{ minWidth: '2rem', textAlign: 'center' }}>
                          {cartItem.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(cartItem._id, cartItem.quantity + 1)}
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                          disabled={loading || cartItem.quantity >= cartItem.item.stock}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">${cartItem.subtotal.toFixed(2)}</p>
                        <button
                          onClick={() => handleRemoveItem(cartItem._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', marginTop: '0.5rem' }}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-bold">Order Summary</h2>
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <span>Subtotal:</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span>Shipping:</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-xl font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={loading}
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="btn btn-outline mt-2"
                    style={{ width: '100%' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
