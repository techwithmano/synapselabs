'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

type AuthFormProps = { mode: 'login' | 'signup' };

export default function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === 'signup';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? 'Unable to continue. Please try again.');
        return;
      }

      const requestedNext = new URLSearchParams(window.location.search).get('next');
      const safeNext =
        requestedNext?.startsWith('/') &&
        !requestedNext.startsWith('//') &&
        !requestedNext.includes('\\')
          ? requestedNext
          : '/';
      window.location.assign(safeNext);
    } catch {
      setError('Connection issue. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="account-shell">
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-words"><strong>SYNAPSE</strong><small>LABS</small></span>
        </Link>
        <Link className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Back to store
        </Link>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <span className="eyebrow">SYNAPSE LABS · YOUR ACCOUNT</span>
          <h1>{isSignup ? 'Join the system.' : 'Welcome back.'}</h1>
          <p>
            {isSignup
              ? 'One account for your devices and orders.'
              : 'Sign in to manage your Synapse orders.'}
          </p>
          <div className="auth-orbit" aria-hidden="true">
            <span className="orbit-ring orbit-ring-one" />
            <span className="orbit-ring orbit-ring-two" />
            <span className="orbit-core">S</span>
          </div>
          <div className="auth-trust"><span /> Private by design</div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="eyebrow">{isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}</span>
            <h2>{isSignup ? 'Create your account' : 'Sign in to Synapse'}</h2>
          </div>

          <form onSubmit={submit} className="auth-form">
            {isSignup && (
              <label className="form-field">
                <span>Name</span>
                <input
                  autoComplete="name"
                  maxLength={80}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  required
                  value={name}
                />
              </label>
            )}
            <label className="form-field">
              <span>Email</span>
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>
            <div className="form-field">
              <label htmlFor="auth-password">Password</label>
              <span className="password-input-wrap">
                <input
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  id="auth-password"
                  minLength={isSignup ? 8 : undefined}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="button-primary auth-submit" disabled={busy} type="submit">
              {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
              {!busy && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New to Synapse?'}{' '}
            <Link href={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
