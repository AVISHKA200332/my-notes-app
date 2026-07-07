import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid #ddd' }}>
      <Link to="/dashboard" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        My Notes
      </Link>
      {user && (
        <span style={{ float: 'right' }}>
          Welcome, {user.name} &nbsp;
          <button onClick={handleLogout}>Logout</button>
        </span>
      )}
    </nav>
  );
};

export default Navbar;
