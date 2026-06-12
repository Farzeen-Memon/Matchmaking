import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Profile, Gender, MaritalStatus, ClientStatus } from '../types';
import { saveProfile } from '../db/mockDb';

interface Props {
  searchQuery: string;
  onOpenProfile: (id: string) => void;
}

export default function MembersList({ searchQuery, onOpenProfile }: Props) {
  const { profiles, refreshProfiles } = useApp();

  // Filter and Sort states
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [religionFilter, setReligionFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for new profile
  const [newProfile, setNewProfile] = useState({
    firstName: '',
    lastName: '',
    gender: 'Female' as Gender,
    dateOfBirth: '1995-01-01',
    city: 'Mumbai',
    maritalStatus: 'Never Married' as MaritalStatus,
    religion: 'Hindu',
    caste: 'General',
    incomeLPA: 12,
    heightCm: 165,
    email: '',
    phoneNumber: '',
  });

  // Extract unique cities & religions for filter dropdowns
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(profiles.map(p => p.city))).sort();
  }, [profiles]);

  const uniqueReligions = useMemo(() => {
    return Array.from(new Set(profiles.map(p => p.religion))).sort();
  }, [profiles]);

  // Filter & Search Logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      // Search text matches Name, City, Religion, Caste, Designation, Company
      const matchesSearch = searchQuery ? (
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.religion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.caste.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase())
      ) : true;

      const matchesGender = genderFilter === 'All' ? true : p.gender === genderFilter;
      const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
      const matchesCity = cityFilter === 'All' ? true : p.city === cityFilter;
      const matchesReligion = religionFilter === 'All' ? true : p.religion === religionFilter;

      return matchesSearch && matchesGender && matchesStatus && matchesCity && matchesReligion;
    });
  }, [profiles, searchQuery, genderFilter, statusFilter, cityFilter, religionFilter]);

  // Sorting Logic
  const sortedProfiles = useMemo(() => {
    const list = [...filteredProfiles];
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'name-desc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case 'age-asc':
          return a.age - b.age;
        case 'age-desc':
          return b.age - a.age;
        case 'income-desc':
          return b.incomeLPA - a.incomeLPA;
        case 'joined-desc':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        default:
          return 0;
      }
    });
  }, [filteredProfiles, sortBy]);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const age = new Date().getFullYear() - new Date(newProfile.dateOfBirth).getFullYear();

    const created: Profile = {
      id: `${newProfile.gender[0].toLowerCase()}-${Math.random().toString(36).substring(2, 10)}`,
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      gender: newProfile.gender,
      dateOfBirth: newProfile.dateOfBirth,
      age,
      country: 'India',
      city: newProfile.city,
      heightCm: Number(newProfile.heightCm),
      email: newProfile.email || `${newProfile.firstName.toLowerCase()}.${newProfile.lastName.toLowerCase()}@example.com`,
      phoneNumber: newProfile.phoneNumber || `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      undergradCollege: 'DU / Mumbai University',
      degree: 'B.Com / B.Tech',
      incomeLPA: Number(newProfile.incomeLPA),
      company: 'TDC Member Client',
      designation: 'Professional',
      maritalStatus: newProfile.maritalStatus,
      languagesKnown: ['Hindi', 'English'],
      siblings: 1,
      religion: newProfile.religion,
      caste: newProfile.caste,
      wantKids: 'Maybe',
      openToRelocate: 'Maybe',
      openToPets: 'Maybe',
      motherTongue: 'Hindi',
      dietaryPreference: 'Vegetarian',
      familyType: 'Nuclear',
      familyValues: 'Moderate',
      manglicStatus: 'No',
      kundaliMatch: 'Optional',
      status: 'New',
      journeyStage: 'Onboarding',
      avatarColor: '#006F80',
      joinedDate: new Date().toISOString(),
      notes: [],
      activityLog: [
        {
          id: Math.random().toString(36).substring(2, 10),
          type: 'profile_updated',
          description: 'Client profile registered in workspace.',
          createdAt: new Date().toISOString(),
        }
      ],
      sentMatches: [],
    };

    // Save profile to database
    saveProfile(created);
    refreshProfiles();
    setIsCreateModalOpen(false);
    onOpenProfile(created.id);
  };

  const getStatusBadgeClass = (status: ClientStatus) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'New': return 'badge-new';
      case 'On Hold': return 'badge-hold';
      case 'Closed': return 'badge-closed';
    }
  };

  return (
    <div className="page animate-fade-in">
      <div className="flex justify-between items-center mb-20">
        <div>
          <h2 className="page-title">Client Portfolio</h2>
          <p className="page-subtitle">Track, filter, and manage relationship journeys</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          + Add New Member
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card card-pad mb-24">
        <div className="filters-bar">
          <div className="form-group" style={{ minWidth: '120px' }}>
            <label className="field-label">Gender</label>
            <select className="filter-select" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group" style={{ minWidth: '120px' }}>
            <label className="field-label">Status</label>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="New">New</option>
              <option value="On Hold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group" style={{ minWidth: '140px' }}>
            <label className="field-label">City</label>
            <select className="filter-select" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
              <option value="All">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ minWidth: '140px' }}>
            <label className="field-label">Religion</label>
            <select className="filter-select" value={religionFilter} onChange={e => setReligionFilter(e.target.value)}>
              <option value="All">All Religions</option>
              {uniqueReligions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ minWidth: '150px', marginLeft: 'auto' }}>
            <label className="field-label">Sort By</label>
            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="age-asc">Age (Youngest first)</option>
              <option value="age-desc">Age (Oldest first)</option>
              <option value="income-desc">Income (Highest first)</option>
              <option value="joined-desc">Joined Date (Recent first)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member Details</th>
                <th>Age / Gender</th>
                <th>Location</th>
                <th>Education & Career</th>
                <th>Matrimonial Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedProfiles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No members match the active search filters.
                  </td>
                </tr>
              ) : (
                sortedProfiles.map(p => (
                  <tr key={p.id} onClick={() => onOpenProfile(p.id)}>
                    <td>
                      <div className="profile-name-cell">
                        <div className="profile-avatar" style={{ background: p.avatarColor }}>
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <strong>{p.firstName} {p.lastName}</strong>
                          <span>ID: {p.id.toUpperCase().split('-').slice(0, 2).join('-')}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-8">
                        <span>{p.age} yrs</span>
                        <span className={`badge badge-${p.gender.toLowerCase()}`}>
                          {p.gender}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>{p.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.country}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }} className="truncate">{p.designation}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="truncate">
                        {p.company} • ₹{p.incomeLPA} LPA
                      </div>
                    </td>
                    <td>
                      <div>{p.religion} ({p.caste})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.maritalStatus}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="section-title" style={{ margin: 0 }}>Register New Member</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setIsCreateModalOpen(false)}
                style={{ border: 'none', padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateProfile}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newProfile.firstName}
                      onChange={e => setNewProfile({ ...newProfile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newProfile.lastName}
                      onChange={e => setNewProfile({ ...newProfile, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="filter-select w-full"
                      value={newProfile.gender}
                      onChange={e => setNewProfile({ ...newProfile, gender: e.target.value as Gender })}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={newProfile.dateOfBirth}
                      onChange={e => setNewProfile({ ...newProfile, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newProfile.city}
                      onChange={e => setNewProfile({ ...newProfile, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={newProfile.heightCm}
                      onChange={e => setNewProfile({ ...newProfile, heightCm: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label">Income (LPA)</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={newProfile.incomeLPA}
                      onChange={e => setNewProfile({ ...newProfile, incomeLPA: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Marital Status</label>
                    <select
                      className="filter-select w-full"
                      value={newProfile.maritalStatus}
                      onChange={e => setNewProfile({ ...newProfile, maritalStatus: e.target.value as MaritalStatus })}
                    >
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Awaiting Divorce">Awaiting Divorce</option>
                    </select>
                  </div>
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label className="form-label">Religion</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newProfile.religion}
                      onChange={e => setNewProfile({ ...newProfile, religion: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caste</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newProfile.caste}
                      onChange={e => setNewProfile({ ...newProfile, caste: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newProfile.email}
                    onChange={e => setNewProfile({ ...newProfile, email: e.target.value })}
                    placeholder="name@gmail.com"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
