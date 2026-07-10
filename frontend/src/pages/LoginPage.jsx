import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      login(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <span className={styles.logoEmoji}>📓</span>
          <span className={styles.logoText}>MyNotes</span>
        </div>

        <h2 className={styles.cardTitle}>Welcome back! 👋</h2>
        <p className={styles.cardSub}>Sign in to see your notes</p>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIcon}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>📧 Email address</label>
            <div className={styles.inputWrap}>
              <input
                id="email"
                className={styles.input}
                style={{ paddingLeft: '1rem' }}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>🔑 Password</label>
            <div className={styles.inputWrap}>
              <input
                id="password"
                className={styles.input}
                style={{ paddingLeft: '1rem' }}
                type="password"
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : '🚀 Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          New here?{' '}
          <Link to="/register" className={styles.switchLink}>Create a free account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
