import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(null); // holds user object on success

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      login(data.token);
      setSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.brand}>
          <div className={styles.brandInner}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>📝</span>
              <span className={styles.logoText}>MyNotes</span>
            </div>
            <h1 className={styles.tagline}>Your thoughts,<br />organised beautifully.</h1>
          </div>
        </div>
        <div className={styles.formPanel}>
          <div className={styles.card}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.cardTitle}>Welcome back, {success.name}!</h2>
            <p className={styles.cardSub}>You have successfully signed in.</p>
            <div className={styles.successInfo}>
              <p><span>Email</span><span>{success.email}</span></p>
              <p><span>Token saved</span><span>✔ localStorage</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Login form ── */
  return (
    <div className={styles.page}>
      {/* Left branding panel */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>📝</span>
            <span className={styles.logoText}>MyNotes</span>
          </div>
          <h1 className={styles.tagline}>
            Your thoughts,<br />organised beautifully.
          </h1>
          <p className={styles.sub}>
            Capture ideas, create to‑do lists, and stay on top of everything
            that matters — all in one secure place.
          </p>
          <div className={styles.features}>
            {['🔒 End‑to‑end secure', '⚡ Instant sync', '🗂 Smart organisation'].map((f) => (
              <span key={f} className={styles.featurePill}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Welcome back</h2>
          <p className={styles.cardSub}>Sign in to your account to continue</p>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIcon}>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>✉</span>
                <input
                  id="email"
                  className={styles.input}
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
              <div className={styles.labelRow}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔑</span>
                <input
                  id="password"
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.switchLink}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
