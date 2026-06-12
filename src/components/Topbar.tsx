import { useApp } from '../context/AppContext';

interface Props {
  searchQuery: string;
  onSearch: (q: string) => void;
  onSearchFocus: () => void;
}

export default function Topbar({ searchQuery, onSearch, onSearchFocus }: Props) {
  const { matcherName } = useApp();
  const initials = matcherName.split(' ').map(n => n[ 0 ]).join('').toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-search">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search members by name, city, religion, caste..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          onFocus={onSearchFocus}
        />
      </div>

      <div className="topbar-right">
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginRight: '8px' }}>
          MatchMaker: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{matcherName}</span>
        </div>
        <div className="avatar-chip">
          <div className="avatar-circle">{initials}</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active</span>
        </div>
      </div>
    </header>
  );
}
