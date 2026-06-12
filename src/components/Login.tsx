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
            <span>TDC ── WORKSPACE</span>
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
              alt="Manage Meaningful Matches"
              className="lp-hero-image"
            />
            {/* Manage Meaningful Matches overlay */}
            <div className="lp-hero-text-overlay">
              <h1 className="lp-hero-title">Manage Meaningful Matches</h1>
              <div className="lp-hero-subtitle">
                An AI-powered matchmaking workspace for managing client profiles, tracking journeys, and discovering compatible matches.
              </div>
              
              {/* Circular portraits overlapping bottom-right of the image on desktop, centering on mobile */}
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
          </div>

          {/* ── Bottom Banner Section (Misty Rose) ────────────── */}
          <div className="lp-bottom-banner">
            <h2 className="lp-bottom-title">
              <em>Smart</em> Matchmaking
            </h2>
            <div className="lp-bottom-subtitle">100+ Profiles • AI Ranked Matches • Real-Time Tracking</div>

            <div className="lp-interactive-row">
              {/* Decorative workflow tags */}
              <div className="lp-social-icons">
                <span className="lp-workflow-tag">✦ Matchmaker Console</span>
              </div>

              {/* Action buttons */}
              <div className="lp-buttons-container">
                <button className="lp-btn-journey" onClick={() => handleOpenModal('signin')}>
                  View Clients
                </button>
                <button className="lp-btn-signup" onClick={() => handleOpenModal('signup')}>
                  Explore Matches
                </button>
              </div>

              {/* Final CTA marker */}
              <div className="lp-save-later" onClick={() => handleOpenModal('signin')}>
                <span>Start Matching Smarter</span>
                <span style={{ fontSize: '1.2rem', marginLeft: '4px' }}>🔖</span>
                <span style={{ fontSize: '1.2rem', color: '#ffb300' }}>✦</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Second Section (Features & Detailed Workspace Highlights) ── */}
        <div className="lp-second-section">
          <div className="lp-second-header">
            <span className="lp-section-tag">Internal Workspace</span>
            <h2 className="lp-second-title">Smart Matchmaking Architecture</h2>
            <p className="lp-second-desc">
              Track customer progress, review verified profiles, generate AI-powered match recommendations, and manage introductions from one intuitive dashboard.
            </p>
          </div>

          <div className="lp-features-grid">
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon">👤</div>
              <h3 className="lp-feature-item-title">Verified Customer Profiles</h3>
              <p className="lp-feature-item-desc">
                Review extensive bio-data covering 20+ specific Indian matrimonial values including religion, caste, diet, and family parameters.
              </p>
            </div>
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon">🧠</div>
              <h3 className="lp-feature-item-title">AI Compatibility Scoring</h3>
              <p className="lp-feature-item-desc">
                Execute automated compatibility reports powered by Google Gemini, generating structured match strengths and lifestyle concerns instantly.
              </p>
            </div>
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon">💖</div>
              <h3 className="lp-feature-item-title">Match Recommendations</h3>
              <p className="lp-feature-item-desc">
                Run our gender-specific compatibility formula, tailoring matching criteria for both traditional and progressive lifestyle filters.
              </p>
            </div>
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon">📈</div>
              <h3 className="lp-feature-item-title">Customer Journey Tracking</h3>
              <p className="lp-feature-item-desc">
                Oversee customer staging from onboarding, manual and background verification, to first meetings and matching success.
              </p>
            </div>
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon">📝</div>
              <h3 className="lp-feature-item-title">Matchmaker Notes</h3>
              <p className="lp-feature-item-desc">
                Log quick matching observations, consultation call summaries, and customized notes with full historic audit logging.
              </p>
            </div>
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon">✉️</div>
              <h3 className="lp-feature-item-title">Introduction Management</h3>
              <p className="lp-feature-item-desc">
                Formulate match introduction pitches, preview email drafts, and trigger simulated customer outreach proposals with one click.
              </p>
            </div>
          </div>

          <div className="lp-second-footer">
            <p className="lp-second-supporting-text">
              Designed for modern matchmaking teams to build meaningful, lasting connections through intelligent recommendations and streamlined workflows.
            </p>
            <button className="lp-btn-final" onClick={() => handleOpenModal('signin')}>
              Start Matching Smarter
            </button>
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
