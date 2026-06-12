import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTopMatches, getScoreLabel } from '../utils/matcher';
import { generateAIExplanation } from '../services/aiService';
import type { Profile, AIExplanation } from '../types';

interface Props {
  onOpenProfile: (id: string) => void;
}

export default function Matches({ onOpenProfile }: Props) {
  const { profiles, sendMatch } = useApp();
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // Send match states
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // AI states
  const [aiExplanations, setAiExplanations] = useState<Record<string, AIExplanation>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});

  // Filter clients to show only active ones in the selector
  const activeClients = profiles.filter(p => p.status === 'Active' || p.status === 'New');

  useEffect(() => {
    if (activeClients.length > 0 && !selectedClientId) {
      setSelectedClientId(activeClients[0].id);
    }
  }, [profiles]);

  const client = profiles.find(p => p.id === selectedClientId);
  
  // Compute top matches
  const matches = client ? getTopMatches(client, profiles, 5) : [];

  const handleLoadAI = async (matchId: string, candidate: Profile) => {
    if (!client || aiExplanations[matchId] || loadingAI[matchId]) return;

    setLoadingAI(prev => ({ ...prev, [matchId]: true }));
    try {
      const exp = await generateAIExplanation(client, candidate);
      setAiExplanations(prev => ({ ...prev, [matchId]: exp }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(prev => ({ ...prev, [matchId]: false }));
    }
  };

  // Auto load top match AI on client select
  useEffect(() => {
    if (client && matches.length > 0) {
      const topId = matches[0].profile.id;
      if (!aiExplanations[topId]) {
        handleLoadAI(topId, matches[0].profile);
      }
    }
  }, [selectedClientId]);

  const triggerSendMatch = (match: Profile) => {
    setSelectedMatch(match);
  };

  const confirmSendMatch = () => {
    if (!client || !selectedMatch) return;
    sendMatch(client.id, selectedMatch.id);
    setSuccessModalOpen(true);
  };

  return (
    <div className="page animate-fade-in">
      <div className="flex justify-between items-center mb-20">
        <div>
          <h2 className="page-title">Matchmaking Board</h2>
          <p className="page-subtitle">Formulate introductions and review compatibility vectors</p>
        </div>
      </div>

      {/* Select Client Card */}
      <div className="card card-pad mb-24" style={{ background: 'var(--surface-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ minWidth: '260px' }}>
            <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>Select Portfolio Member</label>
            <select
              className="filter-select w-full"
              value={selectedClientId}
              onChange={e => {
                setSelectedClientId(e.target.value);
                setAiExplanations({});
              }}
              style={{ padding: '10px 14px', fontSize: '0.92rem' }}
            >
              {activeClients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.gender} • {c.age} • {c.city})
                </option>
              ))}
            </select>
          </div>
          
          {client && (
            <div style={{ display: 'flex', gap: '16px', borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
              <div>
                <span className="field-label">Preferred Partner Age</span>
                <span className="field-value" style={{ fontSize: '0.9rem' }}>
                  {client.gender === 'Male' ? `Under ${client.age} yrs` : `Above ${client.age} yrs`}
                </span>
              </div>
              <div>
                <span className="field-label">Relocation Target</span>
                <span className="field-value" style={{ fontSize: '0.9rem' }}>
                  {client.openToRelocate === 'Yes' ? 'Open to Relocate' : `Rooted in ${client.city}`}
                </span>
              </div>
              <div>
                <span className="field-label">Diet Pattern</span>
                <span className="field-value" style={{ fontSize: '0.9rem' }}>
                  {client.dietaryPreference}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Output */}
      {!client ? (
        <div className="card card-pad text-center">
          <p className="text-muted">No active portfolio members available for matchmaking.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {matches.map(({ profile: candidate, score }) => {
            const hasSent = client.sentMatches.includes(candidate.id);
            const scoreMeta = getScoreLabel(score);
            const isAILoading = loadingAI[candidate.id];
            const aiExp = aiExplanations[candidate.id];

            return (
              <div key={candidate.id} className="card card-pad">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  
                  {/* Matching Candidate Summary Card */}
                  <div style={{ flex: '1.2', minWidth: '280px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <div className="profile-avatar" style={{ background: candidate.avatarColor }}>
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                          {candidate.firstName} {candidate.lastName}
                        </h4>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                          {candidate.age} yrs • {candidate.city} • {candidate.religion} ({candidate.caste})
                        </p>
                      </div>
                    </div>

                    <div className="fields-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: '0.82rem' }}>
                      <div>
                        <span className="field-label">Designation</span>
                        <span className="field-value truncate" style={{ maxWidth: '140px' }}>{candidate.designation}</span>
                      </div>
                      <div>
                        <span className="field-label">Income LPA</span>
                        <span className="field-value">₹{candidate.incomeLPA} LPA</span>
                      </div>
                      <div>
                        <span className="field-label">Education</span>
                        <span className="field-value truncate" style={{ maxWidth: '140px' }}>{candidate.degree}</span>
                      </div>
                      <div>
                        <span className="field-label">Marital Status</span>
                        <span className="field-value">{candidate.maritalStatus}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onOpenProfile(candidate.id)}>
                        View Full Biodata
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={hasSent}
                        onClick={() => triggerSendMatch(candidate)}
                      >
                        {hasSent ? 'Match Proposal Sent' : 'Send Match Proposal'}
                      </button>
                    </div>
                  </div>

                  {/* Compatibility Gauge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', minWidth: '140px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Match Score
                    </span>
                    <div className="score-ring">
                      <svg width="56" height="56">
                        <circle cx="28" cy="28" r="24" fill="transparent" stroke="var(--border-light)" strokeWidth="4" />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="transparent"
                          stroke={scoreMeta.color}
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 24}
                          strokeDashoffset={2 * Math.PI * 24 * (1 - score / 100)}
                        />
                      </svg>
                      <span className="score-ring-text" style={{ color: scoreMeta.color }}>{score}%</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: scoreMeta.color, marginTop: '8px', textAlign: 'center' }}>
                      {scoreMeta.label}
                    </span>
                  </div>

                  {/* AI Explanation Insight */}
                  <div style={{ flex: '1.5', minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="field-label">🧠 Matchmaker AI Insight</span>
                      {!aiExp && !isAILoading && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                          onClick={() => handleLoadAI(candidate.id, candidate)}
                        >
                          Generate AI Explanations
                        </button>
                      )}
                    </div>

                    {isAILoading && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', flex: 1 }}>
                        <div className="spinner" style={{ border: '3px solid var(--border-light)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 0.8s linear infinite' }}></div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>Generating matchmaking explanation...</span>
                      </div>
                    )}

                    {!isAILoading && aiExp && (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
                          "{aiExp.summary}"
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                          <div className="chip-list">
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--success)' }}>PROS</span>
                            {aiExp.strengths.slice(0, 2).map((s, i) => (
                              <div key={i} className="chip-strength" style={{ fontSize: '0.72rem', padding: '3px 6px' }}>✓ {s}</div>
                            ))}
                          </div>
                          <div className="chip-list">
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--warning)' }}>CONS</span>
                            {aiExp.concerns.length === 0 ? (
                              <div className="chip-strength" style={{ fontSize: '0.72rem', padding: '3px 6px' }}>Aligned goals.</div>
                            ) : (
                              aiExp.concerns.slice(0, 2).map((c, i) => (
                                <div key={i} className="chip-concern" style={{ fontSize: '0.72rem', padding: '3px 6px' }}>⚠️ {c}</div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {!isAILoading && !aiExp && (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justify: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px' }}>
                        <span className="text-muted" style={{ fontSize: '0.78rem' }}>Click "Generate AI Explanations" to run models.</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Match modal */}
      {selectedMatch && !successModalOpen && client && (
        <div className="modal-overlay" onClick={() => setSelectedMatch(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="section-title" style={{ margin: 0 }}>Review Match Proposal Draft</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedMatch(null)} style={{ border: 'none', padding: '4px' }}>✕</button>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-16">The match details card will be proposal-mailed to {client.firstName} {client.lastName}.</p>
              
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                <div><strong>To:</strong> {client.email}</div>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px', marginBottom: '10px' }}><strong>Subject:</strong> Concierge Match Introduction: {selectedMatch.firstName}</div>
                <div>
                  Dear {client.firstName},<br /><br />
                  I have identified an exciting match candidate that fits your lifestyle parameters.<br /><br />
                  <strong>Profile Preview:</strong><br />
                  - Name: {selectedMatch.firstName} {selectedMatch.lastName}<br />
                  - Age/City: {selectedMatch.age} yrs, {selectedMatch.city}<br />
                  - Profession: {selectedMatch.designation} ({selectedMatch.company})<br />
                  - Match Compatibility: {getScoreLabel(computeCompatibilityScore(client, selectedMatch)).label}<br /><br />

                  Please let me know if you would like me to share your profile details with {selectedMatch.firstName} to coordinate next steps.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedMatch(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmSendMatch}>
                Confirm & Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalOpen && selectedMatch && client && (
        <div className="modal-overlay" onClick={() => { setSuccessModalOpen(false); setSelectedMatch(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div className="success-icon">✓</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                Match Proposal Sent!
              </h3>
              <p className="text-muted mb-24">
                Match suggestion of <strong>{selectedMatch.firstName}</strong> sent to <strong>{client.firstName}</strong>. Delivery successfully simulated!
              </p>
              <button className="btn btn-primary w-full" onClick={() => { setSuccessModalOpen(false); setSelectedMatch(null); }}>
                Continue Matchmaking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
