import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              E-Shop
            </Link>
            
            <nav className="nav">
              <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/cart" className={`nav-link ${router.pathname === '/cart' ? 'active' : ''}`}>
                    <div style={{ position: 'relative' }}>
                      Cart
                      {itemCount > 0 && (
                        <span className="cart-badge">{itemCount}</span>
                      )}
                    </div>
                  </Link>
                  <span className="text-gray-600">Hello, {user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={`nav-link ${router.pathname === '/login' ? 'active' : ''}`}>
                    Login
                  </Link>
                  <Link href="/register" className={`nav-link ${router.pathname === '/register' ? 'active' : ''}`}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
    </div>
  );
}
