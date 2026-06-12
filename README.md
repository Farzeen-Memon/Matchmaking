# The Date Crew (TDC) Matchmaker CRM & Dashboard MVP

A bespoke internal CRM tool and Matchmaker Dashboard built for **The Date Crew (TDC)** matchmakers. This MVP enables matchmakers to manage client portfolios, review detailed Indian matrimonial biodata, analyze compatibility scores using a gender-specific matchmaking engine, generate real-time AI-powered profile reviews (using Google Gemini 2.0 Flash), and dispatch curated match recommendations.

---

## 🚀 Key Links & Sample Credentials
* **Sample Login Credentials:**
  * **Admin Matchmaker:** `admin@thedatecrew.com` / `password123`
  * **Associate Matchmaker:** `matchmaker@tdcapp.com` / `match2024`
* **Autofill Utility:** Available on the login portal for single-click credential loading.

---

## 🛠️ Design & Tech Choice Write-up

### 1. Technology Choices
The frontend is built using **React (TypeScript)** initialized via **Vite** for optimized Hot Module Replacement (HMR) and rapid compilation. Global state is managed via React Context (`AppContext.tsx`) which integrates a persistent mock local database (`mockDb.ts`) seeded with **200 highly customized, culturally realistic Indian matrimonial profiles** (100 male and 100 female). Styling is achieved entirely using custom **Vanilla CSS** (`index.css`), adhering to the premium design system utilizing **Midnight Green (`#004953`)** and **Misty Rose (`#FFE4E1`)** as primary colors, layered over warm linen surfaces with smooth keyframe animations and glassmorphism.

### 2. Gender-Specific Matching Logic
Match compatibility is computed using a granular weighted-scoring engine (`matcher.ts`) that incorporates cultural context critical to Indian matchmaking:
* **For Male Clients:** Prioritizes candidates who are younger (ideal gap: 2–5 years), earn less (traditional income hierarchy weight), are shorter in height (ideal gap: 5–25 cm), and share similar views on wanting children.
* **For Female Clients:** Employs progressive matching weights placing higher value on intellectual parity (bonus for premium institutions like IIT/IIM/NIT/BITS), equal or higher income stability, and matching relocation preferences, while also reviewing family values compatibility (Traditional vs. Liberal gaps).
* **Common Matrimonial Filters:** Incorporates custom rules for religion/caste matches, dietary preferences (e.g., Jain and Vegetarian harmony), family types (Joint vs. Nuclear), language sharing, and pet preferences.

### 3. How AI is Integrated
The platform integrates with the **Google Gemini 2.0 Flash API** to automate deep analysis of prospective matches. When a matchmaker triggers the "Generate AI Summary," the system sends structured profiles to the LLM and parses a JSON response explaining the match's viability. The generated output details:
* A concise **Matchmaker Summary** in a warm, professional, matrimonial tone.
* A list of **Key Strengths** (e.g., shared premium education, dialect overlap).
* **Potential Concerns** (e.g., relocation discrepancies, diet mismatch) to facilitate guided consultation.
* *Fallback:* In the absence of an API key, the system seamlessly triggers a highly detailed **local heuristic rule engine** (`aiService.ts`) to calculate strengths and concerns immediately.

### 4. Key Assumptions Made
* **Demographic Target:** Focused on high-intent Indian matrimonial matchmakers managing premium clients seeking long-term compatibility.
* **Cultural Context:** Assumed that religion, caste compatibility, dietary lifestyles (veg/non-veg/Jain), and family values remain pivotal first-round criteria in premium Indian matchmaking circles.
* **Role-Based Workspaces:** Assumed matchmakers need separate workspaces for quick statistics, pipeline stages (Onboarding ➔ Success), and custom notes compilation for audit trails.
