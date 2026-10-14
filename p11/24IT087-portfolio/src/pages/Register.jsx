import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await registerUser(form);
      navigate('/login', { replace: true, state: { message: 'Registration successful. Please login.' } });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page page-section" aria-labelledby="register-title">
      <div className="auth-card">
        <p className="eyebrow">Task Manager</p>
        <h1 id="register-title">Create your account</h1>
        <p>Register to start managing tasks securely.</p>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-email">Email<input id="register-email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" /></label>
          <label htmlFor="register-password">Password<input id="register-password" name="password" type="password" minLength="8" value={form.password} onChange={handleChange} required autoComplete="new-password" /></label>
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
}

export default Register;
