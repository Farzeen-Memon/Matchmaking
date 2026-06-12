import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTopMatches, getScoreLabel } from '../utils/matcher';
import { generateAIExplanation } from '../services/aiService';
import type { Profile, JourneyStage, AIExplanation } from '../types';

interface Props {
  profileId: string;
  onBack: () => void;
  onOpenProfile: (id: string) => void;
}

const STAGES: JourneyStage[] = [
  'Onboarding',
  'Verification',
  'Profile Active',
  'Match Review',
  'First Meeting',
  'Success',
];

export default function MemberDetail({ profileId, onBack, onOpenProfile }: Props) {
  const { profiles, addNote, updateStage, sendMatch } = useApp();
  const [activeTab, setActiveTab] = useState<'biodata' | 'history' | 'matches'>('biodata');
  const [noteText, setNoteText] = useState('');

  // Selected match for "Send Match" modal
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Cache/Store for AI Explanations during this view session
  const [aiExplanations, setAiExplanations] = useState<Record<string, AIExplanation>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});

  const client = profiles.find(p => p.id === profileId);

  useEffect(() => {
    // Reset tabs when profile changes
    setActiveTab('biodata');
    setNoteText('');
  }, [profileId]);

  if (!client) {
    return (
      <div className="page">
        <button className="btn btn-ghost mb-16" onClick={onBack}>← Back to Portfolio</button>
        <div className="card card-pad text-center">
          <p>Member profile not found.</p>
        </div>
      </div>
    );
  }

  // 1. Compute Matches using our engine
  const recommendations = getTopMatches(client, profiles, 6);

  // 2. Journey Stepper Logic
  const handleStageClick = (stage: JourneyStage) => {
    updateStage(client.id, stage);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(client.id, noteText.trim());
    setNoteText('');
  };

  // 3. AI Explanation Trigger
  const handleLoadAIExplanation = async (candidateId: string, candidate: Profile) => {
    if (aiExplanations[candidateId] || loadingAI[candidateId]) return;

    setLoadingAI(prev => ({ ...prev, [candidateId]: true }));
    try {
      const explanation = await generateAIExplanation(client, candidate);
      setAiExplanations(prev => ({ ...prev, [candidateId]: explanation }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  // Automatically trigger AI explanation load for the top match
  useEffect(() => {
    if (activeTab === 'matches' && recommendations.length > 0) {
      const topMatch = recommendations[0];
      if (!aiExplanations[topMatch.profile.id]) {
        handleLoadAIExplanation(topMatch.profile.id, topMatch.profile);
      }
    }
  }, [activeTab, client.id]);

  const handleSendMatchClick = (match: Profile) => {
    setSelectedMatch(match);
  };

  const confirmSendMatch = () => {
    if (!selectedMatch) return;
    sendMatch(client.id, selectedMatch.id);
    setSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    setSelectedMatch(null);
  };

  const heightFtStr = (cm: number) => {
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}" (${cm} cm)`;
  };

  return (
    <div className="page animate-fade-in">
      {/* Header & Navigation */}
      <div className="flex justify-between items-center mb-16">
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back to Portfolio
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className={`badge badge-${client.gender.toLowerCase()}`}>
            {client.gender}
          </span>
          <span className="badge badge-active">{client.status}</span>
        </div>
      </div>

      {/* Main Profile Identity Summary */}
      <div className="card card-pad mb-24 flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="profile-avatar" style={{ background: client.avatarColor, width: 64, height: 64, fontSize: '1.5rem' }}>
            {client.firstName[0]}{client.lastName[0]}
          </div>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-muted" style={{ marginTop: '2px' }}>
              {client.designation} at {client.company} • {client.city}, {client.country}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Budget / Income</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>₹{client.incomeLPA} LPA</div>
        </div>
      </div>

      {/* Interactive Journey Stepper */}
      <div className="card card-pad mb-24">
        <h4 className="field-label" style={{ marginBottom: '14px' }}>Matchmaking Journey Progress</h4>
        <div className="journey-stepper">
          {STAGES.map((stage, i) => {
            const currentIdx = STAGES.indexOf(client.journeyStage);
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;

            return (
              <div
                key={stage}
                className={`step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                onClick={() => handleStageClick(stage)}
                style={{ cursor: 'pointer' }}
                title={`Change stage to ${stage}`}
              >
                <div className="step-dot">
                  {isDone ? '✓' : i + 1}
                </div>
                <div className="step-label">{stage}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'biodata' ? 'active' : ''}`}
          onClick={() => setActiveTab('biodata')}
        >
          Biodata Details
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Consultation Notes & Logs ({client.notes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('matches')}
        >
          Match Pool Recommendations ({recommendations.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'biodata' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section: Basic info */}
          <div className="card card-pad">
            <h3 className="section-title">Personal & Contact Info</h3>
            <div className="fields-grid">
              <div className="field-item">
                <span className="field-label">Full Name</span>
                <span className="field-value">{client.firstName} {client.lastName}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Gender</span>
                <span className="field-value">{client.gender}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Date of Birth</span>
                <span className="field-value">{new Date(client.dateOfBirth).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })} ({client.age} yrs)</span>
              </div>
              <div className="field-item">
                <span className="field-label">Height</span>
                <span className="field-value">{heightFtStr(client.heightCm)}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Email</span>
                <span className="field-value">{client.email}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Phone Number</span>
                <span className="field-value">{client.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Section: Education & Profession */}
          <div className="card card-pad">
            <h3 className="section-title">Education & Profession</h3>
            <div className="fields-grid">
              <div className="field-item">
                <span className="field-label">Undergraduate College</span>
                <span className="field-value">{client.undergradCollege}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Degree</span>
                <span className="field-value">{client.degree}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Current Company</span>
                <span className="field-value">{client.company}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Designation</span>
                <span className="field-value">{client.designation}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Annual Income</span>
                <span className="field-value">₹{client.incomeLPA} LPA</span>
              </div>
            </div>
          </div>

          {/* Section: Matrimonial Specifics */}
          <div className="card card-pad">
            <h3 className="section-title">Indian Matrimonial Specifics</h3>
            <div className="fields-grid">
              <div className="field-item">
                <span className="field-label">Religion</span>
                <span className="field-value">{client.religion}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Caste</span>
                <span className="field-value">{client.caste}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Mother Tongue</span>
                <span className="field-value">{client.motherTongue}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Dietary Preference</span>
                <span className="field-value">{client.dietaryPreference}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Manglik Status</span>
                <span className="field-value">{client.manglicStatus}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Kundali Match Requirement</span>
                <span className="field-value">{client.kundaliMatch}</span>
              </div>
            </div>
          </div>

          {/* Section: Lifestyle & Family */}
          <div className="card card-pad">
            <h3 className="section-title">Lifestyle & Family Profile</h3>
            <div className="fields-grid">
              <div className="field-item">
                <span className="field-label">Marital Status</span>
                <span className="field-value">{client.maritalStatus}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Family Type</span>
                <span className="field-value">{client.familyType}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Family Values</span>
                <span className="field-value">{client.familyValues}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Siblings Count</span>
                <span className="field-value">{client.siblings}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Want Children</span>
                <span className="field-value">{client.wantKids}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Open to Relocation</span>
                <span className="field-value">{client.openToRelocate}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Open to Pets</span>
                <span className="field-value">{client.openToPets}</span>
              </div>
              <div className="field-item">
                <span className="field-label">Languages Spoken</span>
                <span className="field-value">{client.languagesKnown.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="main-side">
          {/* Notes Compiler */}
          <div className="card card-pad">
            <h3 className="section-title">Consultation Notes</h3>
            <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="mb-20">
              <textarea
                className="form-input form-textarea"
                placeholder="Log discussion points, preferences, family concerns..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }}>
                Save Note
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {client.notes.length === 0 ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>No consultation notes recorded yet.</p>
              ) : (
                [...client.notes].reverse().map(note => (
                  <div key={note.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <strong>{note.author} (Matchmaker)</strong>
                      <span>{new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', whiteSpace: 'pre-wrap' }}>{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="card card-pad">
            <h3 className="section-title">Profile History</h3>
            <div className="activity-list">
              {[...client.activityLog].reverse().map(act => (
                <div key={act.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="flex-1">
                    <div className="activity-text" style={{ fontSize: '0.82rem' }}>{act.description}</div>
                    <div className="activity-time" style={{ fontSize: '0.7rem' }}>
                      {new Date(act.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {recommendations.map(({ profile: match, score }) => {
            const hasSent = client.sentMatches.includes(match.id);
            const scoreMeta = getScoreLabel(score);
            const isAILoading = loadingAI[match.id];
            const aiExp = aiExplanations[match.id];

            return (
              <div key={match.id} className="card card-pad">
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {/* Left Column - Member Card Details */}
                  <div style={{ flex: '1', minWidth: '240px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <div className="profile-avatar" style={{ background: match.avatarColor }}>
                        {match.firstName[0]}{match.lastName[0]}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{match.firstName} {match.lastName}</h4>
                        <p className="text-muted">{match.age} yrs • {match.city} • {match.religion}</p>
                      </div>
                    </div>

                    <div className="fields-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: '0.82rem' }}>
                      <div>
                        <span className="field-label">Height</span>
                        <span className="field-value">{heightFtStr(match.heightCm)}</span>
                      </div>
                      <div>
                        <span className="field-label">Annual Income</span>
                        <span className="field-value">₹{match.incomeLPA} LPA</span>
                      </div>
                      <div>
                        <span className="field-label">Profession</span>
                        <span className="field-value truncate" style={{ maxWidth: '140px' }}>{match.designation}</span>
                      </div>
                      <div>
                        <span className="field-label">Marital Status</span>
                        <span className="field-value">{match.maritalStatus}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onOpenProfile(match.id)}>
                        Inspect Full Profile
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={hasSent}
                        onClick={() => handleSendMatchClick(match)}
                      >
                        {hasSent ? 'Match Sent' : 'Send Match Recommendation'}
                      </button>
                    </div>
                  </div>

                  {/* Middle Column - Compatibility Score */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', minWidth: '130px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Match Index
                    </div>
                    {/* SVG Score Ring */}
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

                  {/* Right Column - AI Insights Explanation */}
                  <div style={{ flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🧠 AI Analysis Explanation
                      </span>
                      {!aiExp && !isAILoading && (
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                          onClick={() => handleLoadAIExplanation(match.id, match)}
                        >
                          Generate AI Summary
                        </button>
                      )}
                    </div>

                    {isAILoading && (
                      <div style={{ display: 'flex', flexCol: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', flex: 1 }}>
                        <div className="spinner" style={{ border: '3px solid var(--border-light)', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 0.8s linear infinite' }}></div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>AI Matchmaker is analyzing profiles...</span>
                      </div>
                    )}

                    {!isAILoading && aiExp && (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 500, fontStyle: 'italic', color: 'var(--text-primary)', lineLight: 1.4, margin: 0 }}>
                          "{aiExp.summary}"
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                          <div className="chip-list">
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)' }}>STRENGTHS</span>
                            {aiExp.strengths.slice(0, 2).map((s, idx) => (
                              <div key={idx} className="chip-strength" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                ✓ {s}
                              </div>
                            ))}
                          </div>
                          <div className="chip-list">
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--warning)' }}>POTENTIAL CONCERNS</span>
                            {aiExp.concerns.length === 0 ? (
                              <div className="chip-strength" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                None identified.
                              </div>
                            ) : (
                              aiExp.concerns.slice(0, 2).map((c, idx) => (
                                <div key={idx} className="chip-concern" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
                                  ⚠️ {c}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {!isAILoading && !aiExp && (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px' }}>
                        <span className="text-muted" style={{ fontSize: '0.78rem' }}>Click "Generate AI Summary" to compile compatibility profile.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Match Draft / Confirmation Modal */}
      {selectedMatch && !successModalOpen && (
        <div className="modal-overlay" onClick={() => setSelectedMatch(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="section-title" style={{ margin: 0 }}>Review Match Proposal Email</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedMatch(null)} style={{ border: 'none', padding: '4px' }}>✕</button>
            </div>
            <div className="modal-body">
              <p className="text-muted mb-16">The following recommendation report will be dispatched to {client.firstName} {client.lastName}.</p>
              
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
                  <strong>To:</strong> {client.email}<br />
                  <strong>Subject:</strong> Premium Match Proposal: Introducing {selectedMatch.firstName}
                </div>
                <div>
                  Dear {client.firstName},<br /><br />
                  I hope you are doing well. Based on our recent consultation and your stated preferences, I have selected a highly compatible candidate from our premium network for your consideration.<br /><br />
                  <strong>Meet {selectedMatch.firstName}:</strong><br />
                  - {selectedMatch.age} years old based in {selectedMatch.city}<br />
                  - {selectedMatch.designation} at {selectedMatch.company}<br />
                  - Education: {selectedMatch.degree} ({selectedMatch.undergradCollege})<br />
                  - Religion/Caste: {selectedMatch.religion} ({selectedMatch.caste})<br />
                  - Height: {heightFtStr(selectedMatch.heightCm)}<br /><br />
                  
                  <strong>Why we suggest this match:</strong><br />
                  {aiExplanations[selectedMatch.id] ? (
                    <span>"{aiExplanations[selectedMatch.id].summary}"</span>
                  ) : (
                    <span>This candidate demonstrates high alignment in family values, career aspirations, and lifestyle choices.</span>
                  )}
                  <br /><br />
                  Please reply to this email to let me know if you would like to proceed with setting up a virtual or in-person introduction.<br /><br />
                  Warm regards,<br />
                  {client.activityLog[0]?.id ? client.activityLog[client.activityLog.length - 1]?.description.includes('Note') ? 'Your Personal Matchmaker' : 'The Date Crew' : 'The Date Crew'}
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
      {successModalOpen && selectedMatch && (
        <div className="modal-overlay" onClick={closeSuccessModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
              <div className="success-icon">✓</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                Proposal Dispatched!
              </h3>
              <p className="text-muted mb-24">
                The match proposal card for <strong>{selectedMatch.firstName} {selectedMatch.lastName}</strong> has been shared with <strong>{client.firstName}</strong>. Delivery simulated.
              </p>
              <button className="btn btn-primary w-full" onClick={closeSuccessModal}>
                Awesome
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
