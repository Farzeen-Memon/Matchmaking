import { useApp } from '../context/AppContext';

// ── Tiny bar chart rendered with divs ──────────────────────────────────────
function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div
        style={{
          width: '110px',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          flexShrink: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={label}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: '8px',
          background: 'var(--border-light)',
          borderRadius: '99px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: '99px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <div
        style={{
          width: '28px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Journey Stage funnel colours ───────────────────────────────────────────
const STAGE_COLORS: Record<string, string> = {
  Onboarding: '#a78bfa',
  Verification: '#60a5fa',
  'Profile Active': '#34d399',
  'Match Review': '#fbbf24',
  'First Meeting': '#f87171',
  Success: '#c084fc',
};

export default function Analytics() {
  const { analytics, profiles } = useApp();

  // Derived: top cities / religions / stages
  const stageEntries = Object.entries(analytics.stageBreakdown).sort((a, b) => b[1] - a[1]);
  const maxStage = Math.max(...stageEntries.map(([, v]) => v), 1);

  const religionEntries = Object.entries(analytics.religionBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxReligion = Math.max(...religionEntries.map(([, v]) => v), 1);

  const cityEntries = Object.entries(analytics.cityBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxCity = Math.max(...cityEntries.map(([, v]) => v), 1);

  // Success rate
  const successRate =
    analytics.totalClients > 0
      ? Math.round((analytics.successfulMatches / analytics.totalClients) * 100)
      : 0;

  const genderTotal = analytics.genderBreakdown.male + analytics.genderBreakdown.female;
  const malePct = genderTotal > 0 ? Math.round((analytics.genderBreakdown.male / genderTotal) * 100) : 50;
  const femalePct = 100 - malePct;

  // Average age
  const avgAge =
    profiles.length > 0
      ? Math.round(profiles.reduce((s, p) => s + p.age, 0) / profiles.length)
      : 0;

  return (
    <div className="page animate-fade-in">
      {/* Hero */}
      <div className="dash-hero">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="dash-hero-tag">Insights</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--primary)',
              marginBottom: '8px',
            }}
          >
            Portfolio Analytics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.5 }}>
            A holistic view of your matchmaking portfolio — from member demographics to journey progress.
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
          📊
        </div>
      </div>

      {/* Top KPIs */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>👥</div>
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{analytics.totalClients}</div>
          <div className="stat-meta">All time registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>💑</div>
          <div className="stat-label">Successful Matches</div>
          <div className="stat-value">{analytics.successfulMatches}</div>
          <div className="stat-meta">{successRate}% success rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>🔗</div>
          <div className="stat-label">Active Matches</div>
          <div className="stat-value">{analytics.activeMatches}</div>
          <div className="stat-meta">Ongoing proposals</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>🎂</div>
          <div className="stat-label">Avg. Age</div>
          <div className="stat-value">{avgAge}</div>
          <div className="stat-meta">Across all members</div>
        </div>
      </div>

      {/* Gender Split + Stage Funnel */}
      <div className="main-side">
        {/* Gender donut (CSS-based) */}
        <div className="card card-pad">
          <h3 className="section-title">Gender Distribution</h3>

          {/* Segmented bar */}
          <div
            style={{
              height: '18px',
              borderRadius: '99px',
              overflow: 'hidden',
              display: 'flex',
              marginBottom: '18px',
            }}
          >
            <div
              style={{ width: `${malePct}%`, background: 'var(--primary)', transition: 'width 0.6s ease' }}
              title={`Male ${malePct}%`}
            />
            <div
              style={{ width: `${femalePct}%`, background: '#ec4899', transition: 'width 0.6s ease' }}
              title={`Female ${femalePct}%`}
            />
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{analytics.genderBreakdown.male}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Male ({malePct}%)</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ec4899' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{analytics.genderBreakdown.female}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Female ({femalePct}%)</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', margin: '20px 0' }} />

          <h3 className="section-title">Religion Breakdown</h3>
          {religionEntries.map(([rel, count]) => (
            <BarRow key={rel} label={rel} value={count} max={maxReligion} color="var(--accent)" />
          ))}
        </div>

        {/* Journey Stage Funnel */}
        <div className="card card-pad">
          <h3 className="section-title">Journey Stage Funnel</h3>
          {stageEntries.map(([stage, count]) => (
            <BarRow
              key={stage}
              label={stage}
              value={count}
              max={maxStage}
              color={STAGE_COLORS[stage] || 'var(--primary)'}
            />
          ))}

          <div style={{ borderTop: '1px solid var(--border-light)', margin: '20px 0' }} />

          <h3 className="section-title">Top Cities</h3>
          {cityEntries.map(([city, count]) => (
            <BarRow key={city} label={city} value={count} max={maxCity} color="var(--primary)" />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card card-pad" style={{ marginTop: '20px' }}>
        <h3 className="section-title">Recent Activity Log</h3>
        <div className="activity-list">
          {analytics.recentActivity.length === 0 ? (
            <p className="text-muted" style={{ padding: '20px 0', textAlign: 'center' }}>
              No activity recorded yet.
            </p>
          ) : (
            analytics.recentActivity.map((entry) => {
              const d = new Date(entry.createdAt);
              return (
                <div key={entry.id} className="activity-item">
                  <div className="activity-dot" />
                  <div className="flex-1">
                    <div className="activity-text">{entry.description}</div>
                    <div className="activity-time">
                      {d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                      {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
