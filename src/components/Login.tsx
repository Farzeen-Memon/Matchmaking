import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    if (!ok) setError('Invalid credentials. Please try again.');
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💑</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: '12px', lineHeight: 1.2 }}>
            The Date Crew<br />Concierge Portal
          </h1>
          <p style={{ opacity: 0.85, fontSize: '1rem', maxWidth: '320px', lineHeight: 1.6, marginBottom: '40px' }}>
            An internal matchmaking workspace for professional relationship consultants.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', maxWidth: '280px' }}>
            {[
              ['🔍', 'Smart Profile Matching', 'AI-powered compatibility engine'],
              ['📊', 'Journey Tracking', 'End-to-end client management'],
              ['💬', 'AI Match Insights', 'Gemini-powered explanations'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px' }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.75, marginTop: '2px' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p className="text-muted">Sign in to your matchmaker workspace</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@thedatecrew.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: '100%', marginTop: '4px' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '28px', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Credentials</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <code style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>admin@thedatecrew.com</code>
              <code style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>password123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
