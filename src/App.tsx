import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import MembersList from './components/MembersList';
import MemberDetail from './components/MemberDetail';
import Matches from './components/Matches';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import './index.css';

export type Page = 'dashboard' | 'members' | 'matches' | 'analytics' | 'settings';

function AppInner() {
  const { isLoggedIn } = useApp();
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isLoggedIn) return <Login />;

  const openProfile = (id: string) => {
    setSelectedProfileId(id);
    setPage('members');
  };

  const renderPage = () => {
    if (page === 'members' && selectedProfileId) {
      return (
        <MemberDetail
          profileId={selectedProfileId}
          onBack={() => setSelectedProfileId(null)}
          onOpenProfile={openProfile}
        />
      );
    }
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} onOpenProfile={openProfile} />;
      case 'members': return <MembersList searchQuery={searchQuery} onOpenProfile={openProfile} />;
      case 'matches': return <Matches onOpenProfile={openProfile} />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setPage} onOpenProfile={openProfile} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={page}
        onNavigate={(p) => { setPage(p); setSelectedProfileId(null); }}
      />
      <div className="main-content">
        <Topbar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onSearchFocus={() => { setPage('members'); setSelectedProfileId(null); }}
        />
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
