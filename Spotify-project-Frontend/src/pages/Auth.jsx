import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errorText } from '../api';

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // One handler for every input: the input's `name` attribute decides which field changes.
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user =
        mode === 'login'
          ? await login({ email: form.email, password: form.password })
          : await register(form);
      navigate(user.role === 'artist' ? '/studio' : '/');
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <section className="auth-art">
        <h1>Songs from people who actually made them.</h1>
        <p>Listen as a fan, or sign up as an artist and put your own tracks on the shelf.</p>
      </section>

      <form className="auth-form" onSubmit={onSubmit}>
        <h2>{mode === 'login' ? 'Welcome back' : 'Make an account'}</h2>

        {mode === 'register' && (
          <label>Username
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
        )}
        <label>Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </label>

        {mode === 'register' && (
          <fieldset>
            <legend>I want to</legend>
            <label className="radio">
              <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={onChange} />
              Listen to music
            </label>
            <label className="radio">
              <input type="radio" name="role" value="artist" checked={form.role === 'artist'} onChange={onChange} />
              Upload my own music
            </label>
          </fieldset>
        )}

        {error && <p className="error" role="alert">{error}</p>}

        <button className="primary" disabled={busy}>
          {busy ? 'One moment…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>

        <p className="switch">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </form>
    </main>
  );
}
