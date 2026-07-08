import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DevLogin() {
  const { login, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleDevLogin() {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/dev/token', { method: 'POST' });
      const data = await res.json();
      login(data.token);
    } catch (err) {
      alert('Could not get a dev token. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Dev Login (temporary)</h2>
      <p style={{ color: '#666', fontSize: 14 }}>
        This button stands in for the real login page while it's still being built.
      </p>
      <button onClick={handleDevLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Log in as test user'}
      </button>
    </div>
  );
}

export default DevLogin;