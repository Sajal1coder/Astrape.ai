import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      router.push('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="card">
            <div className="card-header text-center">
              <h1 className="text-2xl font-bold">Login</h1>
            </div>
            <div className="card-body">
              {error && (
                <div style={{ 
                  padding: '0.75rem', 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626', 
                  borderRadius: '0.375rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner"></div>
                      <span style={{ marginLeft: '0.5rem' }}>Logging in...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
