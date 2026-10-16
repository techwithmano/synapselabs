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

  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');

  function validateEmail(val: string): string {
    if (!val.trim()) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
      return 'Please enter a valid email address (e.g., name@domain.com).';
    }
    return '';
  }

  function handleEmailChange(val: string) {
    setEmail(val);
    if (emailTouched) {
      setEmailError(validateEmail(val));
    }
  }

  function handleEmailBlur() {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const err = validateEmail(email);
    if (err) {
      setEmailTouched(true);
      setEmailError(err);
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.trim(), password }),
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

  const requestedNext = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null;
  const switchQuery = requestedNext ? `?next=${encodeURIComponent(requestedNext)}` : '';

  return (
    <main className="account-shell" id="main-content">
      <header className="account-topbar">
        <Link className="brand-lockup" href="/" aria-label="Synapse Labs home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-words"><strong>SYNAPSE</strong><small>LABS</small></span>
        </Link>
        <Link className="back-link" href="/" aria-label="Return to store home">
          <ArrowLeft size={15} aria-hidden="true" /> Back to store
        </Link>
      </header>

      <section className="auth-layout" aria-labelledby="auth-main-title">
        <div className="auth-intro">
          <span className="eyebrow">SYNAPSE LABS · YOUR ACCOUNT</span>
          <h1 id="auth-main-title">{isSignup ? 'Join the system.' : 'Welcome back.'}</h1>
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
          <div className="auth-trust"><span aria-hidden="true" /> Private by design</div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="eyebrow">{isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'}</span>
            <h2>{isSignup ? 'Create your account' : 'Sign in to Synapse'}</h2>
          </div>

          <form onSubmit={submit} className="auth-form" noValidate>
            {isSignup && (
              <div className="form-field">
                <label htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  autoComplete="name"
                  maxLength={80}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  required
                  value={name}
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                autoComplete="email"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                onBlur={handleEmailBlur}
                onChange={(event) => handleEmailChange(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
              {emailError && (
                <p className="form-field-error" id="email-error" role="alert">
                  {emailError}
                </p>
              )}
            </div>

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
                  aria-label={showPassword ? 'Hide password text' : 'Show password text'}
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                </button>
              </span>
            </div>

            {error && <p className="form-error" role="alert" id="auth-error">{error}</p>}

            <button className="button-primary auth-submit" disabled={busy} type="submit">
              {busy ? (
                <>
                  <span className="button-spinner" aria-hidden="true" />
                  <span>Please wait…</span>
                </>
              ) : (
                <>
                  <span>{isSignup ? 'Create account' : 'Sign in'}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup ? 'Already have an account?' : 'New to Synapse?'}{' '}
            <Link href={(isSignup ? '/login' : '/signup') + switchQuery}>
              {isSignup ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
