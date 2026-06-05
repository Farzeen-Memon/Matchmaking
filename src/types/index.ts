// ============================================================
// Core TypeScript Types - Matchmaker Dashboard
// ============================================================

export type Gender = 'Male' | 'Female';
export type MaritalStatus = 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
export type YesNoMaybe = 'Yes' | 'No' | 'Maybe';
export type DietaryPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';
export type FamilyType = 'Joint' | 'Nuclear';
export type FamilyValues = 'Traditional' | 'Moderate' | 'Liberal';
export type ManglicStatus = 'Yes' | 'No' | 'Anshik' | "Don't Know";
export type KundaliMatch = 'Necessary' | 'Optional' | 'Not Preferred';
export type JourneyStage =
  | 'Onboarding'
  | 'Verification'
  | 'Profile Active'
  | 'Match Review'
  | 'First Meeting'
  | 'Success';
export type ClientStatus = 'Active' | 'On Hold' | 'Closed' | 'New';

export interface Profile {
  id: string;
  // Personal
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // ISO date string
  age: number;
  country: string;
  city: string;
  heightCm: number; // in cm
  // Contact
  email: string;
  phoneNumber: string;
  // Education & Career
  undergradCollege: string;
  degree: string;
  incomeLPA: number; // Annual income in LPA (Lakhs per annum)
  company: string;
  designation: string;
  // Personal Life
  maritalStatus: MaritalStatus;
  languagesKnown: string[];
  siblings: number;
  religion: string;
  caste: string;
  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;
  // Indian Matrimonial Specific
  motherTongue: string;
  dietaryPreference: DietaryPreference;
  familyType: FamilyType;
  familyValues: FamilyValues;
  manglicStatus: ManglicStatus;
  kundaliMatch: KundaliMatch;
  // CRM Data
  status: ClientStatus;
  journeyStage: JourneyStage;
  profilePhoto?: string; // initials-based avatar color
  avatarColor: string;
  joinedDate: string; // ISO date string
  notes: Note[];
  activityLog: ActivityEntry[];
  sentMatches: string[]; // IDs of profiles this person has been matched with
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface ActivityEntry {
  id: string;
  type:
    | 'profile_updated'
    | 'match_sent'
    | 'note_added'
    | 'stage_changed'
    | 'status_changed'
    | 'meeting_scheduled';
  description: string;
  createdAt: string;
}

export interface MatchResult {
  profile: Profile;
  score: number; // 0-100
  aiExplanation: AIExplanation | null;
}

export interface AIExplanation {
  summary: string;
  strengths: string[];
  concerns: string[];
  isGenerated: boolean; // true = live AI, false = heuristic
}

export interface AnalyticsData {
  totalClients: number;
  activeClients: number;
  newProfiles: number;
  scheduledConsultations: number;
  activeMatches: number;
  successfulMatches: number;
  pendingApprovals: number;
  genderBreakdown: { male: number; female: number };
  stageBreakdown: Record<JourneyStage, number>;
  religionBreakdown: Record<string, number>;
  cityBreakdown: Record<string, number>;
  recentActivity: ActivityEntry[];
}
