import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar({ darkMode, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Tasks' },
    { to: '/contact', label: 'Contact' },
  ];
  const loggedIn = Boolean(localStorage.getItem('token'));

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark">DS</span>
        <span className="brand-name">Digisha Studio</span>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((value) => !value)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-panel ${menuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          {links.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button type="button" className="theme-toggle" onClick={onToggleTheme}>
          {darkMode ? '☀ Light' : '🌙 Dark'}
        </button>
        {loggedIn ? (
          <button type="button" className="theme-toggle" onClick={() => { localStorage.removeItem('token'); navigate('/login', { replace: true, state: { message: 'Logged out successfully.' } }); }}>
            Logout
          </button>
        ) : (
          <Link className="theme-toggle" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
