import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

type FormMode = 'signin' | 'signup';

export default function Login() {
  const { login } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<FormMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (mode: FormMode) => {
    setModalMode(mode);
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate small API delay
    await new Promise((r) => setTimeout(r, 600));

    if (modalMode === 'signup') {
      setError('Registration is restricted to authorized matchmakers. Use demo credentials.');
      setLoading(false);
      return;
    }

    const success = login(email, password);
    if (success) {
      handleCloseModal();
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  const handleFillDemo = () => {
    setEmail('admin@thedatecrew.com');
    setPassword('password123');
    setModalMode('signin');
    setError('');
  };

  return (
    <div className="lp-root">
      <div className="lp-container">
        {/* ── Navbar ───────────────────────────────────────── */}
        <nav className="lp-nav">
          <div className="lp-nav-left">
            <span>COLOR ── COMBOS</span>
          </div>
          <div className="lp-nav-right">
            <span style={{ marginRight: '16px', fontWeight: 500 }}>matchmakers.co/global</span>
            <button className="lp-nav-btn" onClick={() => handleOpenModal('signin')}>
              Sign In
            </button>
            <button className="lp-nav-btn lp-nav-btn-filled" onClick={() => handleOpenModal('signup')}>
              Sign Up
            </button>
          </div>
        </nav>

        {/* ── Hero Section Card ────────────────────────────── */}
        <div className="lp-hero-card">
          <div className="lp-hero-image-wrapper">
            <img
              src="/7d74c3982c6fd9fed4037c347656b68f.webp.jpg"
              alt="Find Your Connection"
              className="lp-hero-image"
            />
            {/* Find Your Connection overlay */}
            <div className="lp-hero-text-overlay">
              <h1 className="lp-hero-title">Find Your Connection</h1>
              <div className="lp-hero-subtitle">HEARTS HEX #004953</div>
            </div>

            {/* Circular portraits overlapping bottom-right of the image */}
            <div className="lp-avatars-overlay">
              <div className="lp-avatar-circle">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=200&fit=crop&crop=faces&q=80"
                  alt="Male Profile Portrait"
                />
              </div>
              <div className="lp-avatar-circle">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=200&fit=crop&crop=faces&q=80"
                  alt="Female Profile Portrait"
                />
              </div>
            </div>
          </div>

          {/* ── Bottom Banner Section (Misty Rose) ────────────── */}
          <div className="lp-bottom-banner">
            <h2 className="lp-bottom-title">
              <em>Deep</em> Connection
            </h2>
            <div className="lp-bottom-subtitle">HEARTS HEX #FFE4E1</div>

            <div className="lp-interactive-row">
              {/* Social action icons (Instagram-like style) */}
              <div className="lp-social-icons">
                <span className="lp-social-icon" style={{ fontSize: '1.4rem' }}>
                  ♡
                </span>
                <span className="lp-social-icon" style={{ fontSize: '1.4rem' }}>
                  💬
                </span>
                <span className="lp-social-icon" style={{ fontSize: '1.4rem' }}>
                  ➦
                </span>
              </div>

              {/* Action buttons */}
              <div className="lp-buttons-container">
                <button className="lp-btn-journey" onClick={() => handleOpenModal('signin')}>
                  Start Your Journey
                </button>
                <button className="lp-btn-signup" onClick={() => handleOpenModal('signup')}>
                  Sign Up Now
                </button>
              </div>

              {/* Bookmark & sparkle actions */}
              <div className="lp-save-later">
                <span>SAVE for LATER</span>
                <span style={{ fontSize: '1.2rem', marginLeft: '4px' }}>🔖</span>
                <span style={{ fontSize: '1.2rem', color: '#ffb300' }}>✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Modal for Sign In / Sign Up ───────── */}
      {showModal && (
        <div className="lp-modal-overlay" onClick={handleCloseModal}>
          <div className="lp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="lp-modal-header">
              <button className="lp-modal-close" onClick={handleCloseModal}>
                ×
              </button>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Playfair Display', serif" }}>
                {modalMode === 'signin' ? 'Matchmaker Console' : 'Partner Registration'}
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                {modalMode === 'signin' ? 'Access your CRM workspace' : 'Request portal access credentials'}
              </p>
            </div>

            <div className="lp-modal-body">
              {/* Form tabs inside modal */}
              <div className="lp-tabs">
                <button
                  className={`lp-tab-btn ${modalMode === 'signin' ? 'active' : ''}`}
                  onClick={() => {
                    setModalMode('signin');
                    setError('');
                  }}
                >
                  Sign In
                </button>
                <button
                  className={`lp-tab-btn ${modalMode === 'signup' ? 'active' : ''}`}
                  onClick={() => {
                    setModalMode('signup');
                    setError('');
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {modalMode === 'signup' && (
                  <div className="lp-form-group">
                    <label className="lp-form-label">Full Name</label>
                    <input
                      type="text"
                      className="lp-form-input"
                      placeholder="Anjali Mehta"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="lp-form-group">
                  <label className="lp-form-label">Email Address</label>
                  <input
                    type="email"
                    className="lp-form-input"
                    placeholder="admin@thedatecrew.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="lp-form-group">
                  <label className="lp-form-label">Password</label>
                  <input
                    type="password"
                    className="lp-form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="lp-error-msg">{error}</div>}

                <button type="submit" className="lp-btn-submit" disabled={loading}>
                  {loading ? 'Processing...' : modalMode === 'signin' ? 'Sign In' : 'Request Access'}
                </button>
              </form>

              {/* Demo Credentials Box */}
              <div className="lp-demo-box">
                <div className="lp-demo-title">Demo Access</div>
                <div className="lp-demo-details">
                  <div>
                    Email: <code>admin@thedatecrew.com</code>
                  </div>
                  <div>
                    Password: <code>password123</code>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  style={{
                    marginTop: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--lp-dark)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Autofill Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
