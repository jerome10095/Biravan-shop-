import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { login } from './store.js';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (login(password)) {
        onLogin();
      } else {
        setError('Incorrect password. Please try again.');
      }
      setLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-display text-4xl font-bold tracking-widest mb-1" style={{ color: 'var(--gold)' }}>BIRAVAN</div>
          <div className="text-stone-400 text-xs tracking-[0.35em] uppercase">Admin Panel</div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-5"
          style={{ background: 'var(--ink-card)', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <h2 className="text-white text-lg font-semibold">Sign in to continue</h2>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="text-stone-400 text-sm block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                required
                className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-stone-600 outline-none"
                style={{ background: 'var(--ink)', border: '1px solid rgba(212,175,55,0.2)' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(212,175,55,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(212,175,55,0.2)')}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ background: 'var(--gold)', color: '#0B0A09' }}
          >
            {loading ? 'Verifying…' : 'Sign In'}
          </button>

          <p className="text-center text-stone-600 text-xs">
            Default password:{' '}
            <span className="text-stone-400 font-mono">biravan2025</span>
          </p>
        </form>

        <p className="text-center mt-6">
          <a
            href="#/"
            className="text-stone-600 text-sm hover:text-stone-400 transition-colors"
            onClick={() => { window.location.hash = '/'; }}
          >
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
