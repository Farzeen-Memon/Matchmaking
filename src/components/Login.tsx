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
            <span style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em', fontSize: '1rem' }}>Matchmaker</span>
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
                <span style={{ fontSize: '1rem', marginLeft: '6px', opacity: 0.6 }}>&#8594;</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Second Section (Premium Smart Matchmaking) ── */}
        <div className="lp-second-section">
          <div className="lp-second-header">
            <span className="lp-section-tag">Professional Workflow</span>
            <h2 className="lp-second-title">How Matchmakers Work Smarter</h2>
            <p className="lp-second-desc">
              An AI-assisted workflow designed to help professional matchmakers discover compatible matches, manage customer journeys, and create meaningful introductions.
            </p>
          </div>

          <div className="lp-features-grid">
            {/* Card 1 */}
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon-svg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="lp-feature-item-title">Verified Profiles</h3>
              <p className="lp-feature-item-desc">
                Review detailed customer profiles, preferences, family background, and relationship goals.
              </p>
            </div>
            {/* Card 2 */}
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon-svg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
              </div>
              <h3 className="lp-feature-item-title">AI Compatibility Analysis</h3>
              <p className="lp-feature-item-desc">
                Evaluate values, lifestyle preferences, career alignment, and future expectations.
              </p>
            </div>
            {/* Card 3 */}
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon-svg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <h3 className="lp-feature-item-title">Intelligent Match Discovery</h3>
              <p className="lp-feature-item-desc">
                Receive ranked matches with compatibility scores and AI-generated reasoning.
              </p>
            </div>
            {/* Card 4 */}
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon-svg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 className="lp-feature-item-title">Matchmaker Insights</h3>
              <p className="lp-feature-item-desc">
                Capture consultation notes, preferences, concerns, and customer feedback.
              </p>
            </div>
            {/* Card 5 */}
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon-svg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="lp-feature-item-title">Journey Tracking</h3>
              <p className="lp-feature-item-desc">
                Monitor every stage from onboarding through successful introductions.
              </p>
            </div>
            {/* Card 6 */}
            <div className="lp-feature-card-item">
              <div className="lp-feature-icon-svg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="lp-feature-item-title">Smart Introductions</h3>
              <p className="lp-feature-item-desc">
                Generate personalized introductions and manage match proposals efficiently.
              </p>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="lp-metrics-row">
            <div className="lp-metric-item">
              <div className="lp-metric-value">100+</div>
              <div className="lp-metric-label">Verified Profiles</div>
            </div>
            <div className="lp-metric-divider" />
            <div className="lp-metric-item">
              <div className="lp-metric-value">AI</div>
              <div className="lp-metric-label">Powered Matching</div>
            </div>
            <div className="lp-metric-divider" />
            <div className="lp-metric-item">
              <div className="lp-metric-value">Personal</div>
              <div className="lp-metric-label">Introductions</div>
            </div>
            <div className="lp-metric-divider" />
            <div className="lp-metric-item">
              <div className="lp-metric-value">Real-Time</div>
              <div className="lp-metric-label">Journey Tracking</div>
            </div>
          </div>

          <div className="lp-second-footer">
            <p className="lp-second-supporting-text">
              Built for professional matchmakers who value precision, discretion, and meaningful outcomes.
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
