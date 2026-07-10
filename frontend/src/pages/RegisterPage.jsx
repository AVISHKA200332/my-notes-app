import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const RegisterPage = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const { data } = await registerUser({
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
      });
      login(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Password strength */
  const strength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)          s++;
    if (p.length >= 10)         s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][strength];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <span className={styles.logoEmoji}>📓</span>
          <span className={styles.logoText}>MyNotes</span>
        </div>

        <h2 className={styles.cardTitle}>Create your account 🎉</h2>
        <p className={styles.cardSub}>It's free and takes less than a minute!</p>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIcon}>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>👤 Your name</label>
            <input
              id="name"
              className={styles.input}
              style={{ paddingLeft: '1rem' }}
              type="text"
              name="name"
              placeholder="e.g. Alex Smith"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>📧 Email address</label>
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

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>🔑 Password</label>
            <input
              id="password"
              className={styles.input}
              style={{ paddingLeft: '1rem' }}
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {formData.password && (
              <div className={styles.strengthWrap} data-testid="strength-indicator">
                <div className={styles.strengthBar}>
                  {[1,2,3,4,5].map((i) => (
                    <div
                      key={i}
                      className={styles.strengthSegment}
                      style={{ background: i <= strength ? strengthColor : '#e5e7eb' }}
                    />
                  ))}
                </div>
                <span className={styles.strengthLabel} style={{ color: strengthColor }}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="confirm" className={styles.label}>🔒 Confirm password</label>
            <input
              id="confirm"
              className={`${styles.input} ${
                formData.confirm && formData.confirm !== formData.password
                  ? styles.inputError : ''
              }`}
              style={{ paddingLeft: '1rem' }}
              type="password"
              name="confirm"
              placeholder="Repeat your password"
              value={formData.confirm}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {formData.confirm && formData.confirm !== formData.password && (
              <p className={styles.fieldError}>Passwords don't match</p>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : '🎉 Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
