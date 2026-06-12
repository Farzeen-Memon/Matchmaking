import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { matcherName, geminiKey, setGeminiKey, logout } = useApp();

  const [keyInput, setKeyInput] = useState(geminiKey);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    setGeminiKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearKey = () => {
    setKeyInput('');
    setGeminiKey('');
  };

  return (
    <div className="page animate-fade-in">
      {/* Hero */}
      <div className="dash-hero">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="dash-hero-tag">Configuration</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--primary)',
              marginBottom: '8px',
            }}
          >
            Settings
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.5 }}>
            Manage your account, configure AI integrations, and personalise your matchmaker workspace.
          </p>
        </div>
        <div
          style={{
            fontSize: '7rem',
            opacity: 0.1,
            userSelect: 'none',
            position: 'absolute',
            right: '30px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          ⚙️
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
        {/* Account Card */}
        <div className="card card-pad">
          <h3 className="section-title">Account</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              className="profile-avatar"
              style={{
                background: 'var(--primary)',
                width: 52,
                height: 52,
                fontSize: '1.2rem',
                flexShrink: 0,
              }}
            >
              {matcherName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{matcherName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Senior Matchmaker · The Date Crew</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Gemini API Key Card */}
        <div className="card card-pad">
          <h3 className="section-title">AI Integration — Gemini</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
            Provide your Google Gemini API key to enable AI-powered match explanations. The key is stored
            locally in your browser and never sent to any server.
          </p>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                id="settings-gemini-key"
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIza..."
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
              <button
                onClick={() => setShowKey((s) => !s)}
                title={showKey ? 'Hide key' : 'Show key'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 20px' }}
              onClick={handleSaveKey}
              disabled={keyInput.trim() === geminiKey}
            >
              {saved ? '✓ Saved' : 'Save Key'}
            </button>
            {geminiKey && (
              <button
                className="btn btn-outline"
                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                onClick={handleClearKey}
              >
                Clear
              </button>
            )}
            {geminiKey && !saved && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ✓ API key active
              </span>
            )}
            {saved && (
              <span style={{ fontSize: '0.78rem', color: 'var(--success)' }}>✓ Settings saved successfully!</span>
            )}
          </div>
        </div>

        {/* App Info Card */}
        <div className="card card-pad">
          <h3 className="section-title">About</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            {[
              ['Application', 'Matchmaker CRM'],
              ['Version', '1.0.0'],
              ['Data', 'Stored locally (browser)'],
              ['AI Engine', geminiKey ? 'Gemini (live)' : 'Heuristic fallback'],
            ].map(([label, val]) => (
              <div key={label} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
