// ============================================================
// AI Match Explanation Service
// Uses Gemini API if configured, otherwise uses local heuristics
// ============================================================
import type { Profile, AIExplanation } from '../types';
import { computeCompatibilityScore } from '../utils/matcher';

const GEMINI_KEY_STORAGE = 'matchmaker_gemini_key';

export function getGeminiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
}

export function setGeminiKey(key: string): void {
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
}

// ─── Local Heuristic Engine ───────────────────────────────────

function heightFt(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

function incomeLabel(lpa: number): string {
  if (lpa >= 30) return `₹${lpa} LPA (high earner)`;
  if (lpa >= 15) return `₹${lpa} LPA (upper-mid)`;
  if (lpa >= 8) return `₹${lpa} LPA`;
  return `₹${lpa} LPA (entry level)`;
}

export function generateLocalExplanation(client: Profile, candidate: Profile): AIExplanation {
  const strengths: string[] = [];
  const concerns: string[] = [];
  const score = computeCompatibilityScore(client, candidate);

  // Religion & Caste
  if (client.religion === candidate.religion) {
    if (client.caste === candidate.caste) {
      strengths.push(`Both share the same religion (${client.religion}) and caste (${client.caste}), a key factor for many Indian families.`);
    } else {
      strengths.push(`Both follow ${client.religion}, providing a compatible religious foundation even with differing castes.`);
    }
  } else {
    concerns.push(`Different religious backgrounds (${client.religion} vs ${candidate.religion}) may require family discussions.`);
  }

  // Language
  const sharedLangs = client.languagesKnown.filter(l => candidate.languagesKnown.includes(l));
  if (sharedLangs.length >= 2) {
    strengths.push(`Strong linguistic compatibility — both speak ${sharedLangs.join(', ')}.`);
  } else if (sharedLangs.length === 1) {
    strengths.push(`A common language (${sharedLangs[0]}) ensures clear communication.`);
  } else {
    concerns.push('No shared language beyond English may create communication barriers with extended family.');
  }

  // Children
  if (client.wantKids === candidate.wantKids) {
    strengths.push(`Aligned views on children (both prefer "${client.wantKids}") — a critical life-goals match.`);
  } else if (client.wantKids === 'Maybe' || candidate.wantKids === 'Maybe') {
    strengths.push('Flexible stance on children means compromise is very achievable.');
  } else {
    concerns.push(`Differing views on children (${client.firstName}: "${client.wantKids}", ${candidate.firstName}: "${candidate.wantKids}") — this may be a deal-breaker requiring early discussion.`);
  }

  // Relocation
  if (client.openToRelocate === 'Yes' && candidate.openToRelocate === 'Yes') {
    strengths.push('Both are open to relocation, giving the couple great flexibility in life planning.');
  } else if (client.openToRelocate === 'No' && candidate.openToRelocate === 'No') {
    if (client.city === candidate.city) {
      strengths.push(`Both are settled in ${client.city} and prefer to stay, indicating strong rootedness.`);
    } else {
      concerns.push(`Neither is open to relocation (${client.city} vs ${candidate.city}) — geographic compromise will be essential.`);
    }
  } else if (client.openToRelocate === 'No' || candidate.openToRelocate === 'No') {
    concerns.push('One partner is unwilling to relocate; this needs open communication about long-term settlement.');
  }

  // Diet
  if (client.dietaryPreference === candidate.dietaryPreference) {
    strengths.push(`Identical dietary lifestyle (${client.dietaryPreference}) simplifies daily life and social interactions.`);
  } else if (['Jain', 'Vegetarian'].includes(client.dietaryPreference) && ['Jain', 'Vegetarian'].includes(candidate.dietaryPreference)) {
    strengths.push('Both follow plant-based diets, making meal-sharing and family gatherings seamless.');
  } else if (client.dietaryPreference === 'Non-Vegetarian' || candidate.dietaryPreference === 'Non-Vegetarian') {
    concerns.push(`Dietary difference (${client.dietaryPreference} vs ${candidate.dietaryPreference}) may cause friction in a traditional household.`);
  }

  // Family values
  if (client.familyValues === candidate.familyValues) {
    strengths.push(`Shared ${client.familyValues} family values ensure compatibility in household expectations and lifestyle.`);
  } else {
    const order = ['Traditional', 'Moderate', 'Liberal'];
    const diff = Math.abs(order.indexOf(client.familyValues) - order.indexOf(candidate.familyValues));
    if (diff === 1) {
      strengths.push('Their family values differ slightly but are close enough for productive middle ground.');
    } else {
      concerns.push(`A significant gap in family values (${client.familyValues} vs ${candidate.familyValues}) may require active compromise in day-to-day decisions.`);
    }
  }

  // Age
  const ageDiff = Math.abs(client.age - candidate.age);
  if (client.gender === 'Male') {
    if (client.age > candidate.age && ageDiff >= 2 && ageDiff <= 5) {
      strengths.push(`The ${ageDiff}-year age gap (he: ${client.age}, she: ${candidate.age}) is culturally ideal for Indian matrimony.`);
    } else if (client.age <= candidate.age) {
      concerns.push(`${candidate.firstName} is older than ${client.firstName} — while manageable, this may require family acceptance.`);
    }
  }

  // Income
  if (client.gender === 'Male' && client.incomeLPA > candidate.incomeLPA) {
    strengths.push(`Income profile is complementary — he earns ${incomeLabel(client.incomeLPA)} while she earns ${incomeLabel(candidate.incomeLPA)}.`);
  } else if (client.gender === 'Female' && candidate.incomeLPA >= client.incomeLPA) {
    strengths.push(`Financial stability is strong on both sides — he earns ${incomeLabel(candidate.incomeLPA)}, creating a secure foundation.`);
  }

  // Height
  if (client.gender === 'Male' && client.heightCm > candidate.heightCm) {
    strengths.push(`Height compatibility is natural — he is ${heightFt(client.heightCm)} and she is ${heightFt(candidate.heightCm)}.`);
  }

  // Pets
  if (client.openToPets === candidate.openToPets && client.openToPets !== 'No') {
    strengths.push(`Both share a love for pets, a charming lifestyle compatibility.`);
  }

  // Education
  const premiumInstitutions = ['IIT', 'IIM', 'BITS', 'NIT', 'AIIMS'];
  const clientPremium = premiumInstitutions.some(inst => client.undergradCollege.includes(inst));
  const candidatePremium = premiumInstitutions.some(inst => candidate.undergradCollege.includes(inst));
  if (clientPremium && candidatePremium) {
    strengths.push(`Both attended premium institutions (${client.undergradCollege} & ${candidate.undergradCollege}) — intellectual and social compatibility is strong.`);
  }

  // Summary
  const strengthCount = strengths.length;
  const concernCount = concerns.length;
  let summary: string;

  if (score >= 85) {
    summary = `${client.firstName} and ${candidate.firstName} demonstrate exceptional compatibility across ${strengthCount} key dimensions. Their shared values and complementary life goals make this a high-priority match recommendation.`;
  } else if (score >= 70) {
    summary = `${client.firstName} and ${candidate.firstName} show strong alignment in most critical areas. With ${strengthCount} compatibility strengths and ${concernCount} minor points to navigate, this is a high-potential introduction.`;
  } else if (score >= 55) {
    summary = `There is meaningful compatibility between ${client.firstName} and ${candidate.firstName}, particularly in ${strengths[0]?.toLowerCase().substring(0, 40) || 'values'}. A few areas require open dialogue but the foundation is solid.`;
  } else {
    summary = `${client.firstName} and ${candidate.firstName} have some compatible traits but key differences in ${concernCount} areas may require careful consideration before proceeding with an introduction.`;
  }

  return {
    summary,
    strengths: strengths.slice(0, 5),
    concerns: concerns.slice(0, 3),
    isGenerated: false,
  };
}

// ─── Gemini API Integration ────────────────────────────────────

function profileSummaryForAI(p: Profile): string {
  return `
Name: ${p.firstName} ${p.lastName} | Gender: ${p.gender} | Age: ${p.age}
City: ${p.city} | Religion: ${p.religion} | Caste: ${p.caste}
Education: ${p.degree} from ${p.undergradCollege}
Career: ${p.designation} at ${p.company} | Income: ₹${p.incomeLPA} LPA
Height: ${p.heightCm}cm | Marital Status: ${p.maritalStatus}
Dietary: ${p.dietaryPreference} | Family Values: ${p.familyValues} | Family Type: ${p.familyType}
Languages: ${p.languagesKnown.join(', ')}
Want Kids: ${p.wantKids} | Open to Relocate: ${p.openToRelocate} | Open to Pets: ${p.openToPets}
Mother Tongue: ${p.motherTongue} | Manglic: ${p.manglicStatus} | Kundali: ${p.kundaliMatch}
  `.trim();
}

export async function generateAIExplanation(client: Profile, candidate: Profile): Promise<AIExplanation> {
  const apiKey = getGeminiKey();

  if (!apiKey) {
    // Fall back to local heuristics
    return generateLocalExplanation(client, candidate);
  }

  const score = computeCompatibilityScore(client, candidate);

  const prompt = `You are a professional Indian matrimonial matchmaker AI. Analyze these two profiles and provide a compatibility report.

PROFILE 1 (Client seeking match):
${profileSummaryForAI(client)}

PROFILE 2 (Candidate):
${profileSummaryForAI(candidate)}

Compatibility Score: ${score}/100

Provide a JSON response with these exact fields:
{
  "summary": "2-3 sentence overall match assessment in professional matchmaking tone",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "concerns": ["concern 1", "concern 2"]
}

Focus on Indian matrimonial context: family values, religion, lifestyle, career, and life goals.
Be specific, mention actual profile details. Keep it warm but professional.
Return ONLY valid JSON, no markdown.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );

    if (!response.ok) {
      console.warn('Gemini API error, falling back to local engine');
      return generateLocalExplanation(client, candidate);
    }

    const data = await response.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || '',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
      isGenerated: true,
    };
  } catch (err) {
    console.warn('AI generation failed, using local engine:', err);
    return generateLocalExplanation(client, candidate);
  }
}
