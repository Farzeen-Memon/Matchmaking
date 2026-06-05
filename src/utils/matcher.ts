// ============================================================
// Gender-Specific Matchmaking Engine
// ============================================================
import type { Profile, MatchResult } from '../types';

// ─── Score Components ─────────────────────────────────────────

/** Age compatibility score (for male clients: prefer younger women) */
function scoreAge(client: Profile, candidate: Profile): number {
  if (client.gender === 'Male') {
    // Male clients: women who are younger (up to 5 years younger preferred)
    const ageDiff = client.age - candidate.age;
    if (ageDiff >= 2 && ageDiff <= 5) return 100;
    if (ageDiff >= 0 && ageDiff < 2) return 85;
    if (ageDiff > 5 && ageDiff <= 8) return 65;
    if (ageDiff < 0 && ageDiff >= -2) return 50; // candidate older by up to 2 years
    return 20; // candidate much older
  } else {
    // Female clients: men who are older (up to 5 years older preferred)
    const ageDiff = candidate.age - client.age;
    if (ageDiff >= 2 && ageDiff <= 5) return 100;
    if (ageDiff >= 0 && ageDiff < 2) return 85;
    if (ageDiff > 5 && ageDiff <= 8) return 65;
    if (ageDiff < 0 && ageDiff >= -2) return 50;
    return 20;
  }
}

/** Income compatibility */
function scoreIncome(client: Profile, candidate: Profile): number {
  if (client.gender === 'Male') {
    // Male clients: women who earn less (traditional preference)
    const ratio = candidate.incomeLPA / client.incomeLPA;
    if (ratio <= 0.5) return 100;
    if (ratio <= 0.75) return 85;
    if (ratio <= 1.0) return 70;
    if (ratio <= 1.25) return 50;
    return 30;
  } else {
    // Female clients: income not heavily penalized, equal/higher is fine
    const ratio = candidate.incomeLPA / client.incomeLPA;
    if (ratio >= 1.0) return 100;
    if (ratio >= 0.8) return 80;
    if (ratio >= 0.6) return 60;
    return 40;
  }
}

/** Height compatibility */
function scoreHeight(client: Profile, candidate: Profile): number {
  if (client.gender === 'Male') {
    // Male clients: women who are shorter
    const diff = client.heightCm - candidate.heightCm;
    if (diff >= 10 && diff <= 25) return 100;
    if (diff >= 5 && diff < 10) return 85;
    if (diff >= 0 && diff < 5) return 70;
    if (diff < 0 && diff >= -5) return 50; // slightly taller woman
    return 25;
  } else {
    // Female clients: men who are taller
    const diff = candidate.heightCm - client.heightCm;
    if (diff >= 10 && diff <= 25) return 100;
    if (diff >= 5 && diff < 10) return 85;
    if (diff >= 0 && diff < 5) return 70;
    if (diff < 0) return 40;
    return 60;
  }
}

/** Children preference compatibility */
function scoreKids(client: Profile, candidate: Profile): number {
  if (client.wantKids === candidate.wantKids) return 100;
  if (client.wantKids === 'Maybe' || candidate.wantKids === 'Maybe') return 70;
  // Yes vs No = conflict
  return 20;
}

/** Relocation compatibility */
function scoreRelocation(client: Profile, candidate: Profile): number {
  if (client.openToRelocate === candidate.openToRelocate) return 100;
  if (client.openToRelocate === 'Maybe' || candidate.openToRelocate === 'Maybe') return 65;
  // Yes vs No = conflict
  return 30;
}

/** Dietary compatibility */
function scoreDiet(client: Profile, candidate: Profile): number {
  if (client.dietaryPreference === candidate.dietaryPreference) return 100;
  // Jain & Vegetarian are compatible
  if (
    ['Jain', 'Vegetarian'].includes(client.dietaryPreference) &&
    ['Jain', 'Vegetarian'].includes(candidate.dietaryPreference)
  )
    return 85;
  // Eggetarian & Vegetarian are somewhat compatible
  if (
    ['Eggetarian', 'Vegetarian'].includes(client.dietaryPreference) &&
    ['Eggetarian', 'Vegetarian'].includes(candidate.dietaryPreference)
  )
    return 70;
  // Non-veg person with veg = partial mismatch
  if (
    client.dietaryPreference === 'Non-Vegetarian' &&
    ['Jain', 'Vegetarian'].includes(candidate.dietaryPreference)
  )
    return 35;
  return 55;
}

/** Religion & caste compatibility */
function scoreReligionCaste(client: Profile, candidate: Profile): number {
  if (client.religion !== candidate.religion) return 30;
  if (client.caste === candidate.caste) return 100;
  return 70; // Same religion, different caste
}

/** Education compatibility */
function scoreEducation(client: Profile, candidate: Profile): number {
  const premiumInstitutions = ['IIT', 'IIM', 'BITS', 'NIT', 'AIIMS'];
  const clientPremium = premiumInstitutions.some(inst => client.undergradCollege.includes(inst));
  const candidatePremium = premiumInstitutions.some(inst => candidate.undergradCollege.includes(inst));

  if (clientPremium && candidatePremium) return 100;
  if (!clientPremium && !candidatePremium) return 80;
  if (candidatePremium) return 90; // candidate is from premium = slight bonus
  return 60;
}

/** Family values compatibility */
function scoreFamilyValues(client: Profile, candidate: Profile): number {
  if (client.familyValues === candidate.familyValues) return 100;
  const order = ['Traditional', 'Moderate', 'Liberal'];
  const diff = Math.abs(order.indexOf(client.familyValues) - order.indexOf(candidate.familyValues));
  if (diff === 1) return 65;
  return 25; // Traditional vs Liberal = big mismatch
}

/** Language compatibility */
function scoreLanguage(client: Profile, candidate: Profile): number {
  const shared = client.languagesKnown.filter(l => candidate.languagesKnown.includes(l));
  if (shared.length >= 2) return 100;
  if (shared.length === 1) return 70;
  return 30;
}

/** Pets compatibility */
function scorePets(client: Profile, candidate: Profile): number {
  if (client.openToPets === candidate.openToPets) return 100;
  if (client.openToPets === 'Maybe' || candidate.openToPets === 'Maybe') return 75;
  return 40;
}

/** City proximity bonus */
function scoreLocation(client: Profile, candidate: Profile): number {
  if (client.city === candidate.city) return 100;
  // Same country is fine for relocation-open profiles
  if (client.openToRelocate !== 'No' || candidate.openToRelocate !== 'No') return 60;
  return 35;
}

// ─── Composite Score ─────────────────────────────────────────

interface WeightMap {
  [key: string]: number;
}

const MALE_WEIGHTS: WeightMap = {
  age: 0.20,
  income: 0.18,
  height: 0.10,
  kids: 0.15,
  relocation: 0.08,
  diet: 0.07,
  religion: 0.08,
  familyValues: 0.06,
  language: 0.04,
  pets: 0.02,
  location: 0.02,
};

const FEMALE_WEIGHTS: WeightMap = {
  age: 0.10,
  income: 0.12,
  height: 0.06,
  kids: 0.15,
  relocation: 0.10,
  diet: 0.08,
  religion: 0.08,
  education: 0.10,
  familyValues: 0.10,
  language: 0.05,
  pets: 0.03,
  location: 0.03,
};

export function computeCompatibilityScore(client: Profile, candidate: Profile): number {
  const weights = client.gender === 'Male' ? MALE_WEIGHTS : FEMALE_WEIGHTS;

  const scores: Record<string, number> = {
    age: scoreAge(client, candidate),
    income: scoreIncome(client, candidate),
    height: scoreHeight(client, candidate),
    kids: scoreKids(client, candidate),
    relocation: scoreRelocation(client, candidate),
    diet: scoreDiet(client, candidate),
    religion: scoreReligionCaste(client, candidate),
    education: scoreEducation(client, candidate),
    familyValues: scoreFamilyValues(client, candidate),
    language: scoreLanguage(client, candidate),
    pets: scorePets(client, candidate),
    location: scoreLocation(client, candidate),
  };

  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (scores[key] ?? 0) * weight;
  }

  return Math.min(100, Math.round(total));
}

/** Get top N matches for a given client */
export function getTopMatches(client: Profile, pool: Profile[], topN = 10): MatchResult[] {
  const oppositeGender = client.gender === 'Male' ? 'Female' : 'Male';
  const candidates = pool.filter(p => p.gender === oppositeGender && p.id !== client.id);

  const scored = candidates.map(candidate => ({
    profile: candidate,
    score: computeCompatibilityScore(client, candidate),
    aiExplanation: null,
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/** Label for a score */
export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Excellent Match', color: '#006F80' };
  if (score >= 70) return { label: 'High Potential', color: '#2C8A70' };
  if (score >= 55) return { label: 'Good Match', color: '#5E8A40' };
  if (score >= 40) return { label: 'Moderate', color: '#C47A5A' };
  return { label: 'Low Compatibility', color: '#B05574' };
}
