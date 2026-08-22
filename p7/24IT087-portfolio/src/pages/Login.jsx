import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const notice = location.state?.message || '';

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await loginUser(form);
      localStorage.setItem('token', data.token);
      navigate('/projects', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page page-section" aria-labelledby="login-title">
      <div className="auth-card">
        <p className="eyebrow">Task Manager</p>
        <h1 id="login-title">Welcome back</h1>
        <p>Sign in to access your protected task workspace.</p>
        {notice && <div className="auth-message" role="status">{notice}</div>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email<input id="login-email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" /></label>
          <label htmlFor="login-password">Password<input id="login-password" name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" /></label>
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Create one</Link></p>
      </div>
    </section>
  );
}

export default Login;
