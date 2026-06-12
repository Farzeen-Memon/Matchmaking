// ============================================================
// Mock Database Seeder - 100 Male + 100 Female Indian Profiles
// ============================================================
import type {
  Profile,
  Gender,
  MaritalStatus,
  YesNoMaybe,
  DietaryPreference,
  FamilyType,
  FamilyValues,
  ManglicStatus,
  KundaliMatch,
  JourneyStage,
  ClientStatus,
} from '../types';

// ─── Helpers ────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#006F80', '#2C8A70', '#5E6A8A', '#7B5EA7', '#C47A5A',
  '#B05574', '#4A7FB5', '#3A8A5B', '#8A5A3B', '#6A4A8A',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], min = 1, max = 4): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDOB(minAge: number, maxAge: number): { dob: string; age: number } {
  const age = randomInt(minAge, maxAge);
  const now = new Date();
  const year = now.getFullYear() - age;
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { dob, age };
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function generateJoinedDate(): string {
  const daysAgo = randomInt(10, 365);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// ─── Data Pools ─────────────────────────────────────────────
const MALE_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advait',
  'Dhruv', 'Kabir', 'Ritvik', 'Aniket', 'Karan', 'Rohan', 'Nikhil', 'Manav',
  'Yash', 'Harsh', 'Dev', 'Rahul', 'Vikram', 'Amit', 'Suraj', 'Rajan',
  'Gaurav', 'Parth', 'Nakul', 'Samir', 'Tarun', 'Varun', 'Mohit', 'Abhinav',
  'Siddharth', 'Akash', 'Deepak', 'Kunal', 'Rajesh', 'Sandeep', 'Prateek',
  'Vishal', 'Shiv', 'Omkar', 'Chinmay', 'Sarthak', 'Kartik', 'Anshul',
  'Bharat', 'Chetan', 'Darshan', 'Eshan', 'Faiz', 'Gopal', 'Hemant',
  'Ishan', 'Jayesh', 'Kaustubh', 'Lakshay', 'Mahesh', 'Neeraj', 'Onkar',
  'Piyush', 'Quaiser', 'Rushil', 'Sahil', 'Tejas', 'Ujjwal', 'Vinayak',
  'Wasim', 'Xavier', 'Yuvraj', 'Zubin', 'Akshat', 'Bhaskar', 'Chirayu',
  'Divyansh', 'Ehtesham', 'Furqan', 'Girish', 'Hrithik', 'Indrajit',
  'Jatin', 'Keshav', 'Lokesh', 'Mihir', 'Narendra', 'Omkar', 'Prasad',
  'Raghav', 'Shubham', 'Tushar', 'Utkarsh', 'Vedant',
];

const FEMALE_FIRST_NAMES = [
  'Aadhya', 'Ananya', 'Pari', 'Aanya', 'Fatima', 'Kavya', 'Ira', 'Myra',
  'Sara', 'Nora', 'Avni', 'Priya', 'Riya', 'Nisha', 'Shreya', 'Pooja',
  'Meera', 'Neha', 'Simran', 'Anjali', 'Divya', 'Swati', 'Pallavi',
  'Deepika', 'Sunita', 'Geeta', 'Rekha', 'Sonia', 'Asha', 'Usha',
  'Laxmi', 'Sarita', 'Kavita', 'Meenakshi', 'Shweta', 'Ritika', 'Nidhi',
  'Preeti', 'Sneha', 'Tanvi', 'Mansi', 'Ishita', 'Komal', 'Ruchi',
  'Varsha', 'Sushma', 'Archana', 'Kiran', 'Vandana', 'Heena', 'Zara',
  'Aishwarya', 'Bhavna', 'Charu', 'Disha', 'Ekta', 'Falguni', 'Gauri',
  'Hansa', 'Indira', 'Jyoti', 'Kamla', 'Lavanya', 'Madhuri', 'Namrata',
  'Ojaswini', 'Pinki', 'Radhika', 'Shalini', 'Tara', 'Uma', 'Vibha',
  'Yamini', 'Akanksha', 'Bhumika', 'Charvi', 'Deeksha', 'Esha', 'Falak',
  'Gunjan', 'Harshita', 'Ipshita', 'Jasmine', 'Kanchan', 'Leena', 'Mahi',
  'Nandini', 'Ojasvi', 'Poonam', 'Renuka', 'Shruti', 'Trisha', 'Urvi',
  'Vaishnavi', 'Yashoda', 'Zoya', 'Anushka', 'Bhakti',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Shah', 'Gupta', 'Singh', 'Kumar', 'Joshi',
  'Mehta', 'Chopra', 'Malhotra', 'Khanna', 'Kapoor', 'Nair', 'Pillai',
  'Menon', 'Iyer', 'Rao', 'Reddy', 'Naidu', 'Chowdhury', 'Bose', 'Das',
  'Banerjee', 'Chatterjee', 'Mukherjee', 'Ghosh', 'Dutta', 'Sen', 'Roy',
  'Desai', 'Jain', 'Agarwal', 'Mittal', 'Goel', 'Srivastava', 'Pandey',
  'Mishra', 'Tiwari', 'Dubey', 'Yadav', 'Thakur', 'Rajput', 'Bhatt',
  'Shukla', 'Dwivedi', 'Tripathi', 'Saxena', 'Bhatia', 'Taneja',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Coimbatore', 'Kochi', 'Visakhapatnam', 'Nashik',
];

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur',
  'BITS Pilani', 'BITS Goa', 'NIT Trichy', 'NIT Warangal', 'NIT Surathkal',
  'Delhi University', 'Mumbai University', 'Osmania University', 'Jadavpur University',
  'Christ University', 'Symbiosis International University', 'Manipal University',
  'Anna University', 'Pune University', 'VIT Vellore', 'SRM Chennai',
  'Amity University', 'UPES Dehradun', 'Gujarat University', 'Calcutta University',
  'IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'XLRI Jamshedpur',
];

const DEGREES = [
  'B.Tech (Computer Science)', 'B.Tech (Electronics)', 'B.Tech (Mechanical)',
  'B.E. (Civil)', 'B.Com', 'BBA', 'B.Sc (Physics)', 'B.Sc (Chemistry)',
  'B.Sc (Mathematics)', 'MBBS', 'BDS', 'B.Arch', 'B.Des', 'BA (Economics)',
  'BA (English)', 'BA (Political Science)', 'LLB', 'B.Pharm', 'B.CA',
  'M.Tech (CS)', 'MBA (Finance)', 'MBA (Marketing)', 'MBA (HR)', 'CA', 'CFA',
  'MA (English)', 'MA (Economics)', 'M.Sc (Data Science)', 'M.Sc (Physics)',
];

const COMPANIES = [
  'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'Accenture',
  'IBM India', 'Cognizant', 'Capgemini', 'L&T Technology Services',
  'Reliance Industries', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI',
  'Flipkart', 'Amazon India', 'Swiggy', 'Zomato', 'Ola', 'Paytm', 'BYJU\'S',
  'Tata Motors', 'Mahindra & Mahindra', 'Bajaj Auto', 'Hero MotoCorp',
  'Asian Paints', 'Nestle India', 'HUL', 'ITC', 'Dr. Reddy\'s', 'Sun Pharma',
  'Deloitte India', 'PwC India', 'KPMG India', 'EY India', 'McKinsey India',
  'Boston Consulting Group', 'IQVIA', 'Fractal Analytics', 'Mu Sigma',
  'Microsoft India', 'Google India', 'Meta India', 'Adobe India', 'Salesforce India',
];

const MALE_DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Principal Engineer',
  'Product Manager', 'Senior Product Manager', 'Data Scientist', 'ML Engineer',
  'DevOps Engineer', 'Cloud Architect', 'Business Analyst', 'Consultant',
  'Senior Consultant', 'Manager', 'Senior Manager', 'Associate Director',
  'Director', 'VP Engineering', 'Founder', 'Co-Founder', 'CTO',
  'Investment Banker', 'Equity Analyst', 'Portfolio Manager', 'CA',
  'Doctor (MBBS)', 'Surgeon', 'Cardiologist', 'Dentist', 'Advocate',
  'Civil Engineer', 'Mechanical Engineer', 'Operations Manager',
];

const FEMALE_DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'UX Designer', 'Product Designer',
  'Product Manager', 'Data Analyst', 'Business Analyst', 'HR Manager',
  'Talent Acquisition', 'Marketing Manager', 'Content Strategist', 'SEO Specialist',
  'Doctor (MBBS)', 'Gynaecologist', 'Paediatrician', 'Dentist', 'Pharmacist',
  'Teacher', 'Principal', 'Professor', 'Research Scientist', 'Lab Analyst',
  'Fashion Designer', 'Interior Designer', 'Architect', 'Advocate', 'Judge',
  'CA', 'Financial Analyst', 'Investment Banker', 'Banker', 'Entrepreneur',
  'Co-Founder', 'Operations Manager', 'Supply Chain Manager', 'Nurse',
];

const LANGUAGES = [
  'Hindi', 'English', 'Punjabi', 'Bengali', 'Gujarati', 'Marathi',
  'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Odia', 'Assamese',
  'Urdu', 'Sanskrit', 'Sindhi', 'Konkani',
];

const RELIGIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi'];

const RELIGION_CASTES: Record<string, string[]> = {
  Hindu: ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Rajput', 'Jat', 'Yadav', 'Kurmi', 'Patel', 'Aggarwal', 'Marwari', 'Nair', 'Iyer', 'Iyengar', 'Pillai', 'Reddy', 'Naidu', 'Kamma', 'Vokkliga', 'Lingayat'],
  Muslim: ['Syed', 'Sheikh', 'Pathan', 'Ansari', 'Qureshi', 'Mughal', 'Siddiqui', 'Shaikh', 'Khan', 'Malik'],
  Sikh: ['Jat Sikh', 'Khatri', 'Arora', 'Ramgarhia', 'Saini'],
  Christian: ['Roman Catholic', 'Protestant', 'Syrian Christian', 'Anglo Indian', 'Church of North India'],
  Jain: ['Digambar', 'Shvetambara', 'Sthanakvasi', 'Terapanthi'],
  Buddhist: ['Ambedkarite', 'Theravada', 'Mahayana', 'Vajrayana'],
  Parsi: ['Irani Zoroastrian', 'Indian Zoroastrian'],
};

const MARITAL_STATUSES: MaritalStatus[] = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'];
const MARITAL_WEIGHTS = [0.75, 0.15, 0.06, 0.04];

function weightedPick<T>(arr: T[], weights: number[]): T {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return arr[i];
  }
  return arr[arr.length - 1];
}

const YES_NO_MAYBE: YesNoMaybe[] = ['Yes', 'No', 'Maybe'];
const DIETARY_PREFS: DietaryPreference[] = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Jain', 'Vegan'];
const DIETARY_WEIGHTS = [0.45, 0.35, 0.10, 0.07, 0.03];
const FAMILY_TYPES: FamilyType[] = ['Joint', 'Nuclear'];
const FAMILY_VALUES: FamilyValues[] = ['Traditional', 'Moderate', 'Liberal'];
const MANGLIC_STATUSES: ManglicStatus[] = ['Yes', 'No', 'Anshik', "Don't Know"];
const KUNDALI_PREFS: KundaliMatch[] = ['Necessary', 'Optional', 'Not Preferred'];
const JOURNEY_STAGES: JourneyStage[] = ['Onboarding', 'Verification', 'Profile Active', 'Match Review', 'First Meeting', 'Success'];
const CLIENT_STATUSES: ClientStatus[] = ['Active', 'On Hold', 'Closed', 'New'];
const STATUS_WEIGHTS = [0.55, 0.15, 0.10, 0.20];

// ─── Profile Generator ──────────────────────────────────────
function generateProfile(gender: Gender, index: number): Profile {
  const firstName = gender === 'Male'
    ? MALE_FIRST_NAMES[index % MALE_FIRST_NAMES.length]
    : FEMALE_FIRST_NAMES[index % FEMALE_FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  const minAge = gender === 'Male' ? 24 : 22;
  const maxAge = gender === 'Male' ? 42 : 38;
  const { dob, age } = generateDOB(minAge, maxAge);

  const religion = pick(RELIGIONS);
  const castesForReligion = RELIGION_CASTES[religion] || ['General'];
  const caste = pick(castesForReligion);

  const city = pick(CITIES);
  const motherTongue = pick(LANGUAGES);

  const incomeMin = gender === 'Male' ? 6 : 4;
  const incomeMax = gender === 'Male' ? 80 : 60;
  const incomeLPA = parseFloat((Math.random() * (incomeMax - incomeMin) + incomeMin).toFixed(1));

  const heightMin = gender === 'Male' ? 160 : 150;
  const heightMax = gender === 'Male' ? 190 : 175;
  const heightCm = randomInt(heightMin, heightMax);

  const designation = gender === 'Male'
    ? pick(MALE_DESIGNATIONS)
    : pick(FEMALE_DESIGNATIONS);

  const journeyIndex = randomInt(0, JOURNEY_STAGES.length - 1);
  const journeyStage = JOURNEY_STAGES[journeyIndex];
  const status = weightedPick(CLIENT_STATUSES, STATUS_WEIGHTS);
  const maritalStatus = weightedPick(MARITAL_STATUSES, MARITAL_WEIGHTS);

  const joined = generateJoinedDate();

  return {
    id: `${gender[0].toLowerCase()}-${String(index + 1).padStart(3, '0')}-${generateId()}`,
    firstName,
    lastName,
    gender,
    dateOfBirth: dob,
    age,
    country: 'India',
    city,
    heightCm,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(10, 99)}@gmail.com`,
    phoneNumber: `+91 ${randomInt(7000000000, 9999999999)}`,
    undergradCollege: pick(COLLEGES),
    degree: pick(DEGREES),
    incomeLPA,
    company: pick(COMPANIES),
    designation,
    maritalStatus,
    languagesKnown: [motherTongue, 'English', ...pickMultiple(LANGUAGES.filter(l => l !== motherTongue && l !== 'English'), 0, 2)],
    siblings: randomInt(0, 3),
    religion,
    caste,
    wantKids: pick(YES_NO_MAYBE),
    openToRelocate: pick(YES_NO_MAYBE),
    openToPets: pick(YES_NO_MAYBE),
    motherTongue,
    dietaryPreference: weightedPick(DIETARY_PREFS, DIETARY_WEIGHTS),
    familyType: pick(FAMILY_TYPES),
    familyValues: pick(FAMILY_VALUES),
    manglicStatus: pick(MANGLIC_STATUSES),
    kundaliMatch: pick(KUNDALI_PREFS),
    status,
    journeyStage,
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    joinedDate: joined,
    notes: [],
    activityLog: [
      {
        id: generateId(),
        type: 'profile_updated',
        description: 'Profile created and added to matchmaking pool.',
        createdAt: joined,
      },
    ],
    sentMatches: [],
  };
}

// ─── Database Manager ────────────────────────────────────────
const DB_KEY = 'matchmaker_db';

function seedDatabase(): Profile[] {
  // Use a seeded random for reproducible data
  const maleProfiles: Profile[] = [];
  const femaleProfiles: Profile[] = [];

  for (let i = 0; i < 100; i++) {
    maleProfiles.push(generateProfile('Male', i));
  }
  for (let i = 0; i < 100; i++) {
    femaleProfiles.push(generateProfile('Female', i));
  }

  return [...maleProfiles, ...femaleProfiles];
}

export function initializeDB(): Profile[] {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Profile[];
      if (Array.isArray(parsed) && parsed.length >= 200) {
        return parsed;
      }
    } catch (_) { /* fall through to seed */ }
  }
  const seeded = seedDatabase();
  localStorage.setItem(DB_KEY, JSON.stringify(seeded));
  return seeded;
}

export function getAllProfiles(): Profile[] {
  return initializeDB();
}

export function getProfileById(id: string): Profile | undefined {
  return getAllProfiles().find(p => p.id === id);
}

export function saveProfile(updated: Profile): void {
  const all = getAllProfiles();
  const index = all.findIndex(p => p.id === updated.id);
  if (index >= 0) {
    all[index] = updated;
    localStorage.setItem(DB_KEY, JSON.stringify(all));
  }
}

export function addNoteToProfile(profileId: string, noteText: string, author: string): Profile | null {
  const all = getAllProfiles();
  const idx = all.findIndex(p => p.id === profileId);
  if (idx < 0) return null;

  const note = {
    id: generateId(),
    text: noteText,
    createdAt: new Date().toISOString(),
    author,
  };

  const activity = {
    id: generateId(),
    type: 'note_added' as const,
    description: `Note added: "${noteText.substring(0, 60)}${noteText.length > 60 ? '...' : ''}"`,
    createdAt: new Date().toISOString(),
  };

  all[idx].notes = [...(all[idx].notes || []), note];
  all[idx].activityLog = [...(all[idx].activityLog || []), activity];
  localStorage.setItem(DB_KEY, JSON.stringify(all));
  return all[idx];
}

export function updateJourneyStage(profileId: string, stage: import('../types').JourneyStage): Profile | null {
  const all = getAllProfiles();
  const idx = all.findIndex(p => p.id === profileId);
  if (idx < 0) return null;

  const activity = {
    id: generateId(),
    type: 'stage_changed' as const,
    description: `Journey stage updated to: ${stage}`,
    createdAt: new Date().toISOString(),
  };

  all[idx].journeyStage = stage;
  all[idx].activityLog = [...(all[idx].activityLog || []), activity];
  localStorage.setItem(DB_KEY, JSON.stringify(all));
  return all[idx];
}

export function recordMatchSent(fromId: string, toId: string): void {
  const all = getAllProfiles();
  const fromIdx = all.findIndex(p => p.id === fromId);
  const toProfile = all.find(p => p.id === toId);
  if (fromIdx < 0 || !toProfile) return;

  if (!all[fromIdx].sentMatches.includes(toId)) {
    all[fromIdx].sentMatches = [...all[fromIdx].sentMatches, toId];
  }

  const activity = {
    id: generateId(),
    type: 'match_sent' as const,
    description: `Match sent to ${toProfile.firstName} ${toProfile.lastName}.`,
    createdAt: new Date().toISOString(),
  };
  all[fromIdx].activityLog = [...(all[fromIdx].activityLog || []), activity];
  localStorage.setItem(DB_KEY, JSON.stringify(all));
}

export function getAnalytics() {
  const all = getAllProfiles();
  const stageBreakdown = {} as Record<import('../types').JourneyStage, number>;
  const religionBreakdown = {} as Record<string, number>;
  const cityBreakdown = {} as Record<string, number>;

  for (const stage of ['Onboarding', 'Verification', 'Profile Active', 'Match Review', 'First Meeting', 'Success'] as import('../types').JourneyStage[]) {
    stageBreakdown[stage] = 0;
  }

  for (const p of all) {
    stageBreakdown[p.journeyStage] = (stageBreakdown[p.journeyStage] || 0) + 1;
    religionBreakdown[p.religion] = (religionBreakdown[p.religion] || 0) + 1;
    cityBreakdown[p.city] = (cityBreakdown[p.city] || 0) + 1;
  }

  const recentActivity = all
    .flatMap(p => p.activityLog)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);

  return {
    totalClients: all.length,
    activeClients: all.filter(p => p.status === 'Active').length,
    newProfiles: all.filter(p => p.status === 'New').length,
    scheduledConsultations: Math.floor(all.filter(p => p.status === 'Active').length * 0.08),
    activeMatches: all.filter(p => p.journeyStage === 'Match Review' || p.journeyStage === 'First Meeting').length,
    successfulMatches: stageBreakdown['Success'],
    pendingApprovals: all.filter(p => p.journeyStage === 'Match Review').length,
    genderBreakdown: {
      male: all.filter(p => p.gender === 'Male').length,
      female: all.filter(p => p.gender === 'Female').length,
    },
    stageBreakdown,
    religionBreakdown,
    cityBreakdown,
    recentActivity,
  };
}
