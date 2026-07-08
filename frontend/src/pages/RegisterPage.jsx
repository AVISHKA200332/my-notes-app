import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import styles from './Auth.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(null); // holds user object on success

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
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      setSuccess(data);
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
            <h1 className={styles.tagline}>Welcome aboard,<br />{success.name}! 🎉</h1>
          </div>
        </div>
        <div className={styles.formPanel}>
          <div className={styles.card}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.cardTitle}>Account created!</h2>
            <p className={styles.cardSub}>Your account is ready to use.</p>
            <div className={styles.successInfo}>
              <p><span>Name</span><span>{success.name}</span></p>
              <p><span>Email</span><span>{success.email}</span></p>
              <p><span>Token saved</span><span>✔ localStorage</span></p>
            </div>
            <Link to="/login" className={styles.submitBtn} style={{ display:'flex', justifyContent:'center', marginTop:'1.5rem', textDecoration:'none' }}>
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Register form ── */
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
            Start your journey<br />today — it's free.
          </h1>
          <p className={styles.sub}>
            Join thousands of users who trust MyNotes to keep their ideas safe,
            searchable, and always at hand.
          </p>
          <div className={styles.steps}>
            {[
              { n: '1', t: 'Create your free account' },
              { n: '2', t: 'Write your first note' },
              { n: '3', t: 'Access from anywhere' },
            ].map(({ n, t }) => (
              <div key={n} className={styles.step}>
                <span className={styles.stepNum}>{n}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create account</h2>
          <p className={styles.cardSub}>Get started — no credit card required</p>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIcon}>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>Full name</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  id="name"
                  className={styles.input}
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔑</span>
                <input
                  id="password"
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
              {formData.password && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    {[1,2,3,4,5].map((i) => (
                      <div
                        key={i}
                        className={styles.strengthSegment}
                        style={{ background: i <= strength ? strengthColor : 'var(--white-20)' }}
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
              <label htmlFor="confirm" className={styles.label}>Confirm password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  id="confirm"
                  className={`${styles.input} ${
                    formData.confirm && formData.confirm !== formData.password
                      ? styles.inputError : ''
                  }`}
                  type="password"
                  name="confirm"
                  placeholder="Repeat your password"
                  value={formData.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
              {formData.confirm && formData.confirm !== formData.password && (
                <p className={styles.fieldError}>Passwords don't match</p>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Create Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
