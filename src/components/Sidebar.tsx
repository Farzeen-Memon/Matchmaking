import { useApp } from '../context/AppContext';
import type { Page } from '../App';

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Workspace', icon: '⊞' },
  { id: 'members', label: 'Members', icon: '👤' },
  { id: 'matches', label: 'Matches', icon: '♥' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ activePage, onNavigate }: Props) {
  const { logout, matcherName } = useApp();
  const initials = matcherName.split(' ').map(n => n[ 0 ]).join('').toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Dashboard</h1>
        <p> Matchmaking</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.slice(0, 4).map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="new-member-btn" onClick={() => onNavigate('members')}>
          <span>+</span> New Member
        </button>
        <button
          className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>⚙</span>
          Settings
        </button>
        <button className="nav-item" onClick={logout}>
          <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>↩</span>
          Sign Out
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginTop: '4px' }}>
          <div className="avatar-circle" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{initials}</div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{matcherName}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Matchmaker</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
