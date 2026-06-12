import React from 'react';
import { useApp } from '../context/AppContext';
import type { Page } from '../App';

interface Props {
  onNavigate: (page: Page) => void;
  onOpenProfile: (id: string) => void;
}

export default function Dashboard({ onNavigate, onOpenProfile }: Props) {
  const { analytics, matcherName, profiles } = useApp();

  // Find some recent new profiles to display in a quick view
  const recentProfiles = [...profiles]
    .sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime())
    .slice(0, 5);

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'Profile Active': return 'Active';
      case 'First Meeting': return 'Meeting Scheduled';
      case 'Match Review': return 'In Review';
      default: return stage;
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="dash-hero">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="dash-hero-tag">Concierge Portal</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
            Good Day, {matcherName.split(' ')[0]}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.5 }}>
            You have <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{analytics.pendingApprovals} match proposals</span> awaiting review. Your portfolio remains balanced and active.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('matches')}>
              Review Matches
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('members')}>
              Manage Members
            </button>
          </div>
        </div>
        <div style={{ fontSize: '7rem', opacity: 0.1, userSelect: 'none', position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
          🤝
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>👤</div>
          <div className="stat-label">Total Portfolio</div>
          <div className="stat-value">{analytics.totalClients}</div>
          <div className="stat-meta">Registered members</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>♥</div>
          <div className="stat-label">Active Journeys</div>
          <div className="stat-value">{analytics.activeClients}</div>
          <div className="stat-meta">In matchmaking flow</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>✨</div>
          <div className="stat-label">New Profiles</div>
          <div className="stat-value">{analytics.newProfiles}</div>
          <div className="stat-meta">Awaiting first vetting</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>📅</div>
          <div className="stat-label">Consultations</div>
          <div className="stat-value">{analytics.scheduledConsultations}</div>
          <div className="stat-meta">Scheduled for today</div>
        </div>
      </div>

      <div className="main-side">
        {/* Left Column: Recent Activity */}
        <div className="card card-pad">
          <div className="flex justify-between items-center mb-16">
            <h3 className="section-title" style={{ margin: 0 }}>Recent Activity</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('members')}>View All</button>
          </div>
          <div className="activity-list">
            {analytics.recentActivity.length === 0 ? (
              <p className="text-muted" style={{ padding: '20px 0', textAlign: 'center' }}>No activities logged yet.</p>
            ) : (
              analytics.recentActivity.map(activity => {
                const date = new Date(activity.createdAt);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="flex-1">
                      <div className="activity-text">{activity.description}</div>
                      <div className="activity-time">{dateStr} at {timeStr}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Profiles Shortcut */}
        <div className="card card-pad">
          <h3 className="section-title">New Members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentProfiles.map(p => (
              <div
                key={p.id}
                onClick={() => onOpenProfile(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: '1px solid var(--border-light)',
                  transition: 'var(--transition)',
                }}
                className="hover-card"
              >
                <div className="profile-avatar" style={{ background: p.avatarColor, width: 34, height: 34 }}>
                  {p.firstName[0]}{p.lastName[0]}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }} className="truncate">
                    {p.firstName} {p.lastName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {p.gender} • {p.age} • {p.city}
                  </div>
                </div>
                <span className={`badge badge-${p.gender.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                  {getStageLabel(p.journeyStage)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
