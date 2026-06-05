// ============================================================
// App Context - Global State Management
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Profile, JourneyStage } from '../types';
import {
  getAllProfiles,
  addNoteToProfile,
  updateJourneyStage,
  recordMatchSent,
  getAnalytics,
} from '../db/mockDb';

interface AppContextType {
  profiles: Profile[];
  analytics: ReturnType<typeof getAnalytics>;
  isLoggedIn: boolean;
  matcherName: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  refreshProfiles: () => void;
  addNote: (profileId: string, text: string) => void;
  updateStage: (profileId: string, stage: JourneyStage) => void;
  sendMatch: (fromId: string, toId: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const VALID_CREDENTIALS = [
  { email: 'admin@thedatecrew.com', password: 'password123', name: 'Priya Sharma' },
  { email: 'matchmaker@tdcapp.com', password: 'match2024', name: 'Anjali Mehta' },
];

const GEMINI_KEY_STORAGE = 'matchmaker_gemini_key';
const AUTH_KEY = 'matchmaker_auth';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [analytics, setAnalytics] = useState(getAnalytics());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [matcherName, setMatcherName] = useState('');
  const [geminiKey, setGeminiKeyState] = useState('');

  useEffect(() => {
    // Check stored auth
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setIsLoggedIn(true);
      setMatcherName(parsed.name);
    }
    // Load profiles
    const loaded = getAllProfiles();
    setProfiles(loaded);
    setAnalytics(getAnalytics());
    // Load Gemini key
    const key = localStorage.getItem(GEMINI_KEY_STORAGE) || '';
    setGeminiKeyState(key);
  }, []);

  const refreshProfiles = useCallback(() => {
    const loaded = getAllProfiles();
    setProfiles(loaded);
    setAnalytics(getAnalytics());
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const cred = VALID_CREDENTIALS.find(c => c.email === email && c.password === password);
    if (cred) {
      setIsLoggedIn(true);
      setMatcherName(cred.name);
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({ email: cred.email, name: cred.name }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setMatcherName('');
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  const addNote = useCallback((profileId: string, text: string) => {
    addNoteToProfile(profileId, text, matcherName);
    refreshProfiles();
  }, [matcherName, refreshProfiles]);

  const updateStage = useCallback((profileId: string, stage: JourneyStage) => {
    updateJourneyStage(profileId, stage);
    refreshProfiles();
  }, [refreshProfiles]);

  const sendMatch = useCallback((fromId: string, toId: string) => {
    recordMatchSent(fromId, toId);
    refreshProfiles();
  }, [refreshProfiles]);

  const setGeminiKey = useCallback((key: string) => {
    localStorage.setItem(GEMINI_KEY_STORAGE, key);
    setGeminiKeyState(key);
  }, []);

  return (
    <AppContext.Provider value={{
      profiles,
      analytics,
      isLoggedIn,
      matcherName,
      login,
      logout,
      refreshProfiles,
      addNote,
      updateStage,
      sendMatch,
      geminiKey,
      setGeminiKey,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
