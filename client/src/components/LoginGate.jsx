import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../lib/api.js';

export default function LoginGate({
  mode,
  title,
  subtitle,
  buttonClass = 'bg-indigo-600 hover:bg-indigo-700',
  altLink,
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(mode, password);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Login failed');
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="Enter password"
        />

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className={`mt-5 w-full rounded-lg px-4 py-2 font-semibold text-white transition disabled:opacity-50 ${buttonClass}`}
        >
          {busy ? 'Checking…' : 'Enter'}
        </button>

        {altLink && (
          <Link
            to={altLink.to}
            className="mt-4 block text-center text-sm text-slate-500 hover:text-slate-700"
          >
            {altLink.label}
          </Link>
        )}
      </form>
    </div>
  );
}
