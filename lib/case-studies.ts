import type { projects } from '@/lib/data'
import type { FormQuestion } from '@/components/case/GoogleFormMock'

/* ─────────────────────────────────────────────────────────────────────────
 * Case-study content model
 *
 * Every project page renders ONE structure (see ProjectDetailClient):
 *
 *   01  Project Overview
 *   02  Research
 *        ├─ Qualitative Research   → user personas
 *        ├─ Quantitative Research  → Google Form surveys
 *        ├─ Research Findings      → key findings
 *        └─ Problem Statement      → refined, research-grounded problem
 *   03  Idea  (the solution)
 *        ├─ Information Architecture
 *        └─ System Build           → what it is · options · features
 *   04  Results
 *
 * Rich content lives here, keyed by slug. Projects without an entry fall back
 * to `deriveCaseStudy()`, which builds a lean version from the base project
 * fields so the template never breaks.
 * ──────────────────────────────────────────────────────────────────────── */

type Project = (typeof projects)[number]

export interface Fact {
  label: string
  value: string
}

export interface Glance {
  /** Illustration3D name: dashboard | workflow | database | roles | pipeline | mobile | gate | analytics */
  name: string
  title: string
  body: string
  accent: string
}

export interface Stat {
  value: string
  label: string
  color?: string
  /** Optional struck-through "before" value shown above the number. */
  before?: string
}

export interface Method {
  method: string
  desc: string
}

export interface EmpathyMap {
  /** What the persona says out loud — verbatim phrases. */
  says: string[]
  /** What they think but rarely voice. */
  thinks: string[]
  /** Observable behaviours and workarounds. */
  does: string[]
  /** The emotions underneath it all. */
  feels: string[]
}

export interface Persona {
  name: string
  role: string
  age: number
  color: string
  badge?: string
  bio: string
  goals: string[]
  frustrations: string[]
  quote: string
  empathy: EmpathyMap
}

export interface Survey {
  title: string
  description?: string
  responses?: string
  questions: FormQuestion[]
}

export interface Finding {
  title: string
  desc: string
}

/* A single headline stat tile in the Key-Findings bento grid. */
export interface FindingStat {
  /** Big number, e.g. "86%" or "0". */
  value: string
  /** Short descriptor under the number. */
  label: string
  /** Optional secondary line, e.g. a benchmark. */
  note?: string
  /** Colour treatment. accent = brand fill · contrast = inverts per theme · surface = flat bordered. */
  tone?: 'accent' | 'contrast' | 'surface'
  /** Tile footprint in the mosaic. */
  span?: 'normal' | 'wide' | 'tall' | 'hero' | 'spotlight' | 'banner'
  /** Per-stat accent colour (hex). Drives the fill, glow, icon chip, and watermark. Defaults to the brand accent. */
  color?: string
  /** Number-size override, decoupled from span, for typographic rhythm. Defaults to a span-based size. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /** Decorative icon key (see FindingsBento). */
  icon?: string
}

export interface SitemapNode {
  route: string
  desc: string
  color?: string
}

export interface BuildOption {
  label: string
  desc: string
  selected?: boolean
}

export interface Feature {
  title: string
  desc: string
  impact?: string
  color?: string
}

/* One numbered feature within a System-Build screen walkthrough. */
export interface SystemFeature {
  title: string
  body: string
}

/* A single product screen in the sticky-scroll System-Build walkthrough:
 * the image pins on the left while its features scroll past on the right,
 * then cross-fades to the next screen. */
export interface SystemScreen {
  id: string
  /** Path under /public, e.g. /screenshots/ah-crm/dashboard.png */
  image: string
  /** Screen label, e.g. "Dashboard". */
  title: string
  /** Short one-line gloss under the screen title. */
  caption?: string
  features: SystemFeature[]
  /** When true, the image fills the frame width at its natural height instead of using object-cover. Use for tall/portrait screenshots where no cropping is acceptable. */
  fitWidth?: boolean
  /** When true (and fitWidth is also true), the frame content area becomes a scrollable window capped at 75vh, so very tall full-page screenshots are fully accessible without an enormous frame. */
  scrollable?: boolean
  /** When true, the left column is NOT pinned — the image flows naturally with the page so the full vertical height is visible as the user scrolls. Use for very tall full-page screenshots where you want the entire image seen. */
  noPin?: boolean
  /** Optional download CTA shown beneath this screen's features (e.g. a sample PDF the screen produces). */
  download?: {
    /** Path under /public, e.g. /downloads/ah-itinerary-sample.pdf */
    href: string
    /** Button label. Defaults to "Download PDF". */
    label?: string
    /** Suggested filename for the saved file. Defaults to the href's basename. */
    filename?: string
  }
}

/* Rich quantitative-research report (charted survey results + insights). */
export interface QuantBar {
  label: string
  value: number
}

export interface QuantInsight {
  /** Headline figure, e.g. "86%" or "1.4 avg". */
  metric: string
  /** One-line gloss on the metric. */
  label: string
  /** The interpretation paragraph. */
  text: string
}

export interface QuantQuestion {
  n: string
  /** Section grouping label, e.g. "Current state" — questions sharing it render under one separator. */
  group: string
  /** Free-text question-type badge, e.g. "Multi-select", "Likert · frequency". */
  type: string
  question: string
  note?: string
  /** Accent colour for the bars, badge, and insight. */
  color: string
  /** Value-axis suffix, e.g. "%". Defaults to "". */
  unit?: string
  /** Value-axis maximum. Defaults to the largest bar value. */
  max?: number
  bars: QuantBar[]
  insight: QuantInsight
}

export interface QuantMeta {
  label: string
  value: string
  sub?: string
}

export interface QuantRole {
  label: string
  count: number
  color: string
}

export interface QuantReport {
  subtitle?: string
  meta: QuantMeta[]
  rolesTitle?: string
  roles: QuantRole[]
  questions: QuantQuestion[]
}

/* A before/after result-comparison card (Results section). */
export interface ResultMetric {
  /** Ordinal label, e.g. "01". */
  n: string
  /** Short metric name, e.g. "Lead loss rate". */
  category: string
  /** One-line definition of what the metric measures. */
  desc: string
  before: string
  after: string
  /** 'down' = lower is better (before bar reads as the bad value); 'up' = higher is better. */
  direction: 'down' | 'up'
  /** Before/after bar widths (0–100), normalised so the larger value reads as 100. */
  beforeBar: number
  afterBar: number
  /** Improvement magnitude shown in the delta pill, e.g. "88%" or "42 pts". */
  delta: string
}

export interface OverviewMetaCard {
  icon: string
  label: string
  value: string
  sub?: string
}

export interface OverviewScaleItem {
  n: string | number
  label: string
  icon: string
}

export interface OverviewOutcomeItem {
  n: string
  label: string
  sub: string
}

export interface CaseStudy {
  overview: {
    facts: Fact[]
    glanceLabel?: string
    glance: Glance[]
    stats: Stat[]
    /** Rich overview panel (replaces facts/glance/stats when present). */
    projectHero?: { tagline: string; problem: string }
    metaCards?: OverviewMetaCard[]
    scaleItems?: OverviewScaleItem[]
    techStack?: string[]
    tools?: string[]
    outcome?: { period: string; items: OverviewOutcomeItem[] }
  }
  qualitative: {
    intro: string
    methods?: Method[]
    personas: Persona[]
  }
  quantitative: {
    intro: string
    /** Optional rich charted report. When present, the template renders it instead of the form mocks. */
    report?: QuantReport
    surveys: Survey[]
    stats?: Stat[]
    takeaways?: string[]
  }
  findings: {
    intro?: string
    /** Optional headline-stat bento grid, rendered above the narrative findings. */
    bento?: FindingStat[]
    items: Finding[]
  }
  /** Refined, research-grounded problem statement (rendered as an editorial quote). */
  problemStatement: string
  idea: {
    intro: string
    /** Optional wireframe image paths shown in a bento grid above System Build. */
    wireframes?: string[]
    ia: {
      intro?: string
      sitemap?: SitemapNode[]
      entityChain?: string[]
      /** AH-Lead Management only: render the per-role vertical sitemap trees (RoleSitemaps). */
      roleSitemaps?: boolean
      /** AH-Lead Management only: render the interactive 25-page access matrix. */
      accessArchitecture?: boolean
    }
    systemBuild: {
      what: string
      optionsLabel?: string
      options?: BuildOption[]
      features?: Feature[]
      /** Optional sticky-scroll screen walkthrough (image pinned, features scroll). */
      screens?: SystemScreen[]
    }
  }
  results: {
    intro?: string
    metrics: Stat[]
    /** Optional before/after comparison cards. Rendered instead of the metric bento when present. */
    resultCards?: ResultMetric[]
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
 * AH-Lead Management
 * ═══════════════════════════════════════════════════════════════════════════ */

const AH_CRM: CaseStudy = {
  overview: {
    facts: [],
    glance: [],
    stats: [],
    projectHero: {
      tagline: 'A role-based internal CRM built specifically for a travel agency to manage the full lifecycle of a lead — from first enquiry to completed trip.',
      problem: 'An 8-role operation spanning sales, itinerary, execution, accounts, tour guides, and backend verification — run entirely through WhatsApp and Excel, with no shared system, no accountability trail, and no visibility across teams.',
    },
    metaCards: [
      { icon: 'Briefcase', label: 'Role', value: 'System Design', sub: 'Research · IA · UX · system logic' },
      { icon: 'Users', label: 'Team', value: 'Solo', sub: 'Non-technical founder directing vision' },
      { icon: 'Clock', label: 'Timeline', value: 'Research to Development', sub: '3 months post-launch data' },
      { icon: 'Monitor', label: 'Platform', value: 'Web Application', sub: 'Responsive' },
    ],
    outcome: {
      period: '3 months post-launch',
      items: [
        { n: '↓ 88%',   label: 'Lead loss rate',    sub: '34% → 4%'       },
        { n: '+42 pts',  label: 'Follow-up rate',    sub: '51% → 93%'      },
        { n: '↓ 73%',   label: 'Daily admin time',  sub: '2.5 hrs → 41 min' },
      ],
    },
  },
  qualitative: {
    intro:
      'I started with people, not features. Across the 8 roles at the agency I ran in-depth interviews and shadow sessions to map how a travel enquiry actually moves through the business — every handoff, every workaround, every breakdown. Four primary personas represent the most frequent and complex usage patterns.',
    personas: [
      {
        name: 'Ravi M.', role: 'Sales Employee', age: 28, color: '#1d4ed8', badge: 'Primary',
        empathy: {
          says: ['"Which leads did I follow up with today?"', '"Has backend verified this booking yet?"', '"Give me a minute — I\'ll get the quote and send it."'],
          thinks: ['"I know I\'m forgetting a lead, I just can\'t remember which."', '"If I lose this context, I lose the client."', '"Why do I chase three people for one update?"'],
          does: ['Scrolls back through WhatsApp to reconstruct each lead\'s history', 'Calls the execution team repeatedly to check quote status', 'Re-downloads itinerary PDFs from Drive and forwards them by hand'],
          feels: ['Overwhelmed juggling 18 active leads at once', 'Anxious about leads going cold while he waits', 'Frustrated by handoffs he can\'t see into'],
        },
        bio: 'A sales executive who manages 15–20 active leads at any time. He spends 6+ hours daily on calls, WhatsApp, and follow-ups. He is the primary user of the CRM.',
        goals: ['Track all his leads and their status in one place', 'Get quotes and itineraries from other teams without chasing them on WhatsApp', 'Know when a lead is verified so he can move to conversion quickly', 'Log call recordings and notes without switching apps'],
        frustrations: ['Loses context when leads sit idle for days — WhatsApp messages get buried', 'Has to chase the execution team via calls to get quote status', "Doesn't know if backend has verified a lead until someone tells him", 'Manually downloads itinerary PDFs from Google Drive and re-sends to clients'],
        quote: '"I manage 18 leads right now. I can tell you 5 off the top of my head. The rest, I need to scroll through WhatsApp to even remember what they wanted."',
      },
      {
        name: 'Meena S.', role: 'Execution Team Lead', age: 34, color: '#7c3aed', badge: 'Primary',
        empathy: {
          says: ['"Send me the full trip details, not half of them."', '"Is this trip actually profitable?"', '"I\'ll know the margin once I get to the Excel sheet."'],
          thinks: ['"I\'m quoting blind until the numbers come in."', '"There has to be a faster way than this back-and-forth."', '"If a booking changes, will the guide even know?"'],
          does: ['Pieces quote requests together from scattered WhatsApp messages', 'Reconciles vendor costs against payments in Excel after the trip', 'Files payment proofs from email and chat by hand'],
          feels: ['Stretched thin coordinating 3–4 vendors per trip', 'Uneasy committing to quotes without live margins', 'Always a step behind on profitability'],
        },
        bio: 'Manages the operational side — quoting trips, booking accommodation and transport, tracking vendor payments, and keeping trip margins healthy. Coordinates 3–4 vendors per trip.',
        goals: ['See all pending quotation requests in one queue', 'Track vendor costs against client payments in real time', 'Book stays, food, transport, and activities with all details logged', 'Know trip margins before the trip happens, not after'],
        frustrations: ['Receives quotation requests via WhatsApp — no structure, missing details, frequent back-and-forth', 'Has no real-time view of trip profitability — calculates margins in Excel post-trip', 'Vendor payment proof is scattered across WhatsApp and email', "Changes to bookings aren't visible to tour guides in real time"],
        quote: '"I quoted 12 trips last month. I only knew 3 were profitable before they happened. The rest, I found out in the Excel sheet two weeks later."',
      },
      {
        name: 'Kumar R.', role: 'Tour Guide', age: 42, color: '#0f766e', badge: 'Primary',
        empathy: {
          says: ['"Which hotel are we at, and who do I ask for?"', '"Let me call the office to confirm."', '"Nobody told me the booking changed."'],
          thinks: ['"I hope these details are still correct."', '"I shouldn\'t have to memorise this from a screenshot."', '"What if something changed after I left?"'],
          does: ['Works entirely off his phone, 20+ days a month in the field', 'Calls the office 3–4 times per trip to confirm details', 'Keeps paper receipts for every on-trip expense'],
          feels: ['Exposed when details are wrong in front of the client', 'Disconnected from last-minute office changes', 'Frustrated repeating the same confirmation calls'],
        },
        bio: "Has guided tours for 8 years. In the field 20+ days a month, operating off his phone. Needs to know exactly where to go, who to contact, and what's booked — without calling the office.",
        goals: ['See all his upcoming trip details on his phone', 'Have hotel names, contacts, and room counts at a glance', 'Know the full day-by-day itinerary without asking the office', "Log on-trip expenses quickly so they're accounted for"],
        frustrations: ['Receives trip details as WhatsApp screenshots — often blurry, incomplete, or outdated', 'Has to call the office 3–4 times per trip to confirm details that changed', 'No way to log expenses digitally — keeps paper receipts that sometimes get lost', "Can't see if booking details changed after he left for the trip"],
        quote: '"Last week I showed up at a hotel that had no booking for us. The office had changed it but nobody told me. The client was standing right there."',
      },
      {
        name: 'Priya V.', role: 'Business Owner', age: 52, color: '#b45309', badge: 'Primary',
        empathy: {
          says: ['"What\'s my conversion rate today?"', '"Who closed the most this month?"', '"Don\'t wait for Friday — I need it now."'],
          thinks: ['"I built this, yet I\'m the last to know the numbers."', '"I\'m deciding on gut feel, not data."', '"Which lead sources are actually paying off?"'],
          does: ['Waits for a manual report every Friday', 'Asks the team to compile data before any decision', 'Judges performance on impression rather than metrics'],
          feels: ['Blind to her own business in real time', 'Impatient with stale, second-hand reporting', 'Concerned margins are slipping unseen'],
        },
        bio: 'Founded the agency 15 years ago. Oversees a team of 12+, handles strategic decisions, and needs a finger on the pulse of the business — without waiting for someone to compile a report.',
        goals: ['See business KPIs in real time — leads, conversions, revenue, margins', 'Drill down into individual employee performance', "Know which lead sources are working and which aren't", 'Have a financial overview without waiting for the accounts team'],
        frustrations: ['Gets a manual report every Friday — already stale by the time she reads it', "Can't see conversion rate or lead-source ROI without asking someone to compile data", 'Has no visibility into trip margins until weeks after completion', 'Employee performance is assessed on gut feeling rather than data'],
        quote: '"I built this business over 15 years. But I can\'t tell you today what my conversion rate is, or which employee closed the most this month, without asking someone to run the numbers."',
      },
    ],
  },
  quantitative: {
    intro:
      'To pressure-test the interview themes with numbers, I ran a pre-development survey across all eight roles at the agency (n = 14). Ten questions mapped the current tooling, where the workflow broke, what it was costing in time and confidence, and which capabilities the team itself ranked as critical.',
    report: {
      subtitle: 'Pre-development survey · Q1 2026 · n = 14 participants',
      meta: [
        { label: 'Method', value: 'Online survey', sub: 'Google Forms' },
        { label: 'Timing', value: 'Pre-development', sub: 'Q1 2026' },
        { label: 'Sample', value: 'n = 14', sub: '8 roles represented' },
        { label: 'Format', value: '10 questions', sub: 'Likert · multi-select · ranking' },
      ],
      roles: [
        { label: 'Sales Employee', count: 4, color: '#1d4ed8' },
        { label: 'Execution', count: 2, color: '#b45309' },
        { label: 'Tour Guide', count: 3, color: '#0f766e' },
        { label: 'Accounts', count: 1, color: '#7c3aed' },
        { label: 'Itinerary', count: 1, color: '#dc2626' },
        { label: 'Admin', count: 1, color: '#65a30d' },
        { label: 'Backend', count: 1, color: '#525252' },
        { label: 'Owner', count: 1, color: '#0891b2' },
      ],
      questions: [
        {
          n: 'Q1', group: 'Current state', type: 'Multi-select', color: '#1d4ed8', unit: '%', max: 100,
          question: 'Which tools does your team currently use to track and manage leads?',
          note: '% of 14 respondents · multiple selections allowed',
          bars: [
            { label: 'WhatsApp chats', value: 86 },
            { label: 'Excel / Google Sheets', value: 71 },
            { label: 'Physical notebook', value: 50 },
            { label: 'Email threads', value: 36 },
            { label: 'Existing CRM software', value: 7 },
          ],
          insight: { metric: '86%', label: 'relied on WhatsApp as their primary lead-tracking tool', text: 'WhatsApp was the de facto system of record — built for personal messaging, not pipeline management. No audit trail, no assignment logic, no status tracking. Leads vanished the moment a chat got buried.' },
        },
        {
          n: 'Q2', group: 'Current state', type: 'Single select', color: '#1d4ed8', max: 8,
          question: 'How many new enquiries does your team receive per week on average?',
          note: 'n = 14 respondents',
          bars: [
            { label: '1–5 enquiries', value: 3 },
            { label: '6–15 enquiries', value: 5 },
            { label: '16–30 enquiries', value: 4 },
            { label: '31–50 enquiries', value: 2 },
            { label: '50+ enquiries', value: 0 },
          ],
          insight: { metric: '65%', label: 'handle 6–30 enquiries per week', text: 'Mid-volume throughput — enough to make informal tracking genuinely risky, but small enough that a lightweight, purpose-built tool (not enterprise software) is the right-sized solution.' },
        },
        {
          n: 'Q3', group: 'Current state', type: 'Single select', color: '#b45309', max: 8,
          question: 'How long does it typically take to send a quotation after receiving an enquiry?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Same day', value: 1 },
            { label: '1–2 days', value: 3 },
            { label: '3–5 days', value: 6 },
            { label: '1 week or more', value: 2 },
            { label: 'No standard process', value: 2 },
          ],
          insight: { metric: '57%', label: 'take three or more days to send a quotation', text: 'The travel-industry benchmark is 24–48 hours. At 3–5 days, the agency was ceding leads to faster-moving competitors. 14% had no standard process at all — every quotation reinvented from scratch.' },
        },
        {
          n: 'Q4', group: 'Failure points', type: 'Likert · frequency', color: '#dc2626', max: 8,
          question: 'How often do leads go cold or get lost due to missed follow-ups?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Never', value: 0 },
            { label: 'Rarely', value: 2 },
            { label: 'Sometimes', value: 3 },
            { label: 'Often', value: 6 },
            { label: 'Always', value: 3 },
          ],
          insight: { metric: '64%', label: 'lose leads to missed follow-ups often or always', text: 'No respondent said this never happens. The two highest-frequency options account for nearly two-thirds of all responses — pointing to follow-up failure as the single largest revenue leak in the current setup.' },
        },
        {
          n: 'Q5', group: 'Failure points', type: 'Likert · difficulty', color: '#dc2626', max: 9,
          question: 'How difficult is coordinating tasks between your sales, itinerary, and execution teams?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Very easy', value: 0 },
            { label: 'Easy', value: 1 },
            { label: 'Neutral', value: 2 },
            { label: 'Difficult', value: 7 },
            { label: 'Very difficult', value: 4 },
          ],
          insight: { metric: '79%', label: 'rated cross-team coordination as difficult or very difficult', text: 'No one called it easy. The team relied on constant hand-offs across three functional units — yet had no shared platform to track what was passed, to whom, or when.' },
        },
        {
          n: 'Q6', group: 'Failure points', type: 'Multi-select', color: '#dc2626', unit: '%', max: 100,
          question: 'What are your biggest operational pain points in the current workflow?',
          note: '% of 14 respondents · participants asked to select their top 3',
          bars: [
            { label: 'No central lead database', value: 79 },
            { label: 'Team miscommunication', value: 71 },
            { label: 'No real-time tracking', value: 64 },
            { label: 'No activity history per lead', value: 57 },
            { label: 'Slow quotation process', value: 57 },
            { label: 'Payment tracking gaps', value: 50 },
            { label: 'No team workload visibility', value: 43 },
          ],
          insight: { metric: '7 pain points', label: 'all selected by 43%+ of participants', text: 'The two leading pain points — no central database and team miscommunication — share one root cause: no shared source of truth. Every other item on the list is a downstream consequence of that gap.' },
        },
        {
          n: 'Q7', group: 'Cost of inaction', type: 'Single select', color: '#b45309', max: 8,
          question: 'How many hours per day do you spend on admin tasks (excluding actual sales work)?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Less than 30 min', value: 0 },
            { label: '30–60 min', value: 2 },
            { label: '1–2 hours', value: 4 },
            { label: '2–4 hours', value: 6 },
            { label: '4+ hours', value: 2 },
          ],
          insight: { metric: '57%', label: 'spend 2+ hours daily on admin tasks', text: 'At 2–4 hours of admin per person per day, the agency was effectively funding a second team that produced zero revenue. Structured workflows for follow-ups, quotations, and handoffs recover this time directly.' },
        },
        {
          n: 'Q8', group: 'Cost of inaction', type: 'Likert · confidence', color: '#1d4ed8', max: 7,
          question: "How confident are you in the accuracy of your team's lead data at any given time?",
          note: 'n = 14 · scale: 1 = not at all confident, 5 = very confident',
          bars: [
            { label: 'Not at all confident', value: 3 },
            { label: 'Slightly confident', value: 5 },
            { label: 'Moderately confident', value: 4 },
            { label: 'Confident', value: 2 },
            { label: 'Very confident', value: 0 },
          ],
          insight: { metric: '57%', label: 'rated data confidence at 1–2 out of 5', text: 'Not one respondent was fully confident in their own data. Every decision built on it — prioritising leads, assigning staff, forecasting revenue — was being made on acknowledged uncertainty.' },
        },
        {
          n: 'Q9', group: 'Solution direction', type: 'Priority ranking', color: '#7c3aed', unit: '', max: 5,
          question: "Rank the following features by how critical they are to your team's workflow.",
          note: 'Average rank · 14 respondents · lower score = higher priority (1–7 scale)',
          bars: [
            { label: 'Centralised lead tracking', value: 1.4 },
            { label: 'Role-based access', value: 1.8 },
            { label: 'Real-time status updates', value: 2.3 },
            { label: 'Follow-up reminders', value: 2.7 },
            { label: 'Quotation workflow', value: 3.1 },
            { label: 'Payment tracking', value: 3.6 },
            { label: 'Document storage', value: 4.1 },
          ],
          insight: { metric: '1.4 avg', label: 'centralised tracking — the highest-priority feature', text: 'The top two — centralised tracking and role-based access — are the structural foundation of the CRM. Participants independently identified the right architecture before the product existed.' },
        },
        {
          n: 'Q10', group: 'Solution direction', type: 'Likert · adoption intent', color: '#0f766e', max: 9,
          question: "If a dedicated CRM reduced your team's admin overhead by 50%, how likely are you to adopt it?",
          note: 'n = 14 respondents',
          bars: [
            { label: 'Definitely not', value: 0 },
            { label: 'Unlikely', value: 1 },
            { label: 'Neutral', value: 2 },
            { label: 'Likely', value: 4 },
            { label: 'Definitely yes', value: 7 },
          ],
          insight: { metric: '79%', label: 'expressed clear intent to adopt', text: 'With 50% choosing "Definitely yes", organisational readiness was never the risk. The constraint was the absence of the right tool — not the willingness to use one.' },
        },
      ],
    },
    surveys: [
      {
        title: 'Internal Operations & Workflow Survey',
        description: 'Circulated to all 8 roles at the agency to baseline how work moves between teams today.',
        responses: '23 responses',
        questions: [
          { q: 'How do you currently track the status of a lead?', type: 'choice', options: ['WhatsApp messages', 'Excel sheet', 'Memory / verbal', 'A dedicated tool'], answer: 0, required: true },
          { q: 'How often do you lose context on a lead because information is scattered?', type: 'scale', scale: 5, scaleLabels: ['Never', 'Daily'], answer: 3, required: true },
          { q: 'Before a lead is converted, is the booking verified by another team?', type: 'choice', options: ['Always', 'Sometimes', 'Rarely', 'Never'], answer: 2, required: true },
          { q: 'Which handoffs cause the most rework? (select all that apply)', type: 'checkbox', options: ['Sales → Execution', 'Execution → Itinerary', 'Office → Tour guide', 'Accounts reconciliation'], answers: [0, 2] },
          { q: 'When do you find out whether a trip was profitable?', type: 'choice', options: ['Before the trip', 'During the trip', '1–2 weeks after', 'I never see this'], answer: 2 },
        ],
      },
      {
        title: 'Field & Tour-Guide Readiness Survey',
        description: 'Sent to tour guides and execution staff about on-trip information gaps.',
        responses: '11 responses',
        questions: [
          { q: 'How do you receive trip details before a tour?', type: 'choice', options: ['WhatsApp screenshots', 'Phone call', 'Printed sheet', 'A live app'], answer: 0, required: true },
          { q: 'How many times per trip do you call the office to confirm details?', type: 'choice', options: ['0', '1–2', '3–4', '5+'], answer: 2, required: true },
          { q: 'How confident are you that your trip info is up to date when you depart?', type: 'scale', scale: 5, scaleLabels: ['Not at all', 'Fully'], answer: 1 },
          { q: 'How do you record on-trip expenses?', type: 'choice', options: ['Paper receipts', 'Personal notes', 'WhatsApp to office', 'I forget some'], answer: 0 },
        ],
      },
    ],
  },
  findings: {
    intro:
      'Synthesising the qualitative and quantitative research produced five findings that directly shaped the system — none of them generic UX best practice, all of them specific to how this business actually runs.',
    bento: [
      { value: '86%', label: 'used WhatsApp as their primary lead-tracking tool', tone: 'contrast', span: 'banner', size: '2xl', color: '#1d4ed8', icon: 'message' },
      { value: '0', label: 'respondents were fully confident in their own lead data', note: 'the zero, not a percentage, is the finding', tone: 'accent', size: 'lg', color: '#00AAFF', icon: 'gauge' },
      { value: '64%', label: 'lose leads to missed follow-ups often or always', tone: 'contrast', size: 'lg', color: '#dc2626', icon: 'trending-down' },
      { value: '79%', label: 'rated cross-team coordination difficult or very difficult', tone: 'surface', size: 'lg', color: '#7c3aed', icon: 'users' },
      { value: '57%', label: 'take 3+ days to send a quotation', note: 'vs. a 24–48 hr industry benchmark', tone: 'surface', size: 'lg', color: '#b45309', icon: 'clock' },
      { value: '57%', label: 'spend 2+ hours daily on non-sales admin work', tone: 'accent', span: 'wide', size: 'lg', color: '#00AAFF', icon: 'hourglass' },
    ],
    items: [
      { title: 'Sequential handoff, not parallel pipeline', desc: 'The travel enquiry lifecycle involves 5+ teams working in strict sequence. Generic CRMs model leads as a linear pipeline owned by one user — this system needed shared ownership across stages.' },
      { title: 'The conversion moment was the highest-risk point', desc: '~35% of client disputes originated from conversions that happened before backend teams had verified booking details. The design needed a hard gate — not a soft recommendation.' },
      { title: 'Financial visibility was delayed by 10–14 days', desc: 'The accounts team had no real-time data. The owner learned about trip profitability only after the trip was complete and expenses were manually tallied. A live two-sided P&L per trip was essential.' },
      { title: 'Tour guides were fully disconnected', desc: 'Tour guides operated off WhatsApp screenshots, averaging 2–3 information errors per trip — wrong hotel contact, missing activity booking, outdated transport detail.' },
      { title: 'Employees and management needed different views', desc: 'Showing business-wide pipeline metrics to sales employees distorted their behaviour — they optimised for status numbers rather than individual lead quality. A dual-view model was needed.' },
    ],
  },
  problemStatement:
    'There was no single connected system that could take a lead from enquiry to execution with full accountability, role-based access, and a real-time audit trail. Every handoff between teams was a potential point of failure — and the moment of conversion, the highest-risk point of all, had no enforced verification.',
  idea: {
    intro:
      'The answer was not to copy HubSpot or Salesforce, but to model the real-world handoff chain: a role-based internal CRM where 8 distinct user types operate in one unified system — from first enquiry to tour-guide handoff — with enforced quality gates and real-time financial visibility.',
    wireframes: [
      '/screenshots/ah-crm/wireframes/wireframe-01.png',
      '/screenshots/ah-crm/wireframes/wireframe-02.png',
      '/screenshots/ah-crm/wireframes/wireframe-03.png',
      '/screenshots/ah-crm/wireframes/wireframe-04.png',
      '/screenshots/ah-crm/wireframes/wireframe-05.png',
      '/screenshots/ah-crm/wireframes/wireframe-06.png',
      '/screenshots/ah-crm/wireframes/wireframe-07.png',
      '/screenshots/ah-crm/wireframes/wireframe-08.png',
      '/screenshots/ah-crm/wireframes/wireframe-09.png',
      '/screenshots/ah-crm/wireframes/wireframe-10.png',
    ],
    ia: {
      intro:
        'The information architecture was designed role-first. A single login routes each user to a workspace built for their job — no generic dashboard with toggled visibility. Each role tree traces a path end to end, and beneath those landing pages sits a fully enforced access model: 25 pages across 7 functional modules, each gated at the database level.',
      roleSitemaps: true,
    },
    systemBuild: {
      what:
        'The CRM is one connected lifecycle behind 8 role-gated front doors. A lead is created (manually or via the Telegram import bridge), worked by sales, quoted and booked by execution, verified by the backend team at a locked conversion gate, executed by a tour guide in the field, and reconciled by accounts — every step writing to a single audit chain. It grew across 26+ schema migrations, each one a real business need discovered through use.',
      screens: [
        {
          id: 'dashboard',
          image: '/screenshots/ah-crm/dashboard.jpg',
          title: 'Admin Dashboard',
          features: [
            {
              title: 'Four KPI summary cards',
              body:
                'Every number the team checks daily sits at the top in plain view — Total Leads, South India, North India, International. No one has to pull a report or open a spreadsheet to know how many leads are active and where they are coming from.',
            },
            {
              title: 'Category filter pills',
              body:
                'One tap switches the entire dashboard to a specific travel category. A manager reviewing only international enquiries does not scroll past unrelated data — the whole screen reorganises instantly around what they need.',
            },
            {
              title: 'Date-range filter',
              body:
                'The dashboard is not locked to today. The team can pull any window — last week, last quarter, all time — and the charts and cards update accordingly. Useful for month-end reviews without switching tools.',
            },
            {
              title: 'One-click export',
              body:
                'The entire dashboard view downloads in one click. No manual copy-pasting into Excel for reporting — the data leaves the system in the same structured format it is displayed in.',
            },
            {
              title: 'Lead status breakdown — three donut charts',
              body:
                'Instead of one combined chart, the screen shows three views side by side: all leads, open leads, and leads in follow-up. The team sees not just how many leads exist, but where each one currently sits in the workflow.',
            },
          ],
        },
        {
          id: 'leads',
          image: '/screenshots/ah-crm/leads.png',
          title: 'Leads',
          features: [
            {
              title: 'Status filter tabs with live counts',
              body:
                'The exact number of leads in every stage — All, Open, Follow Up, Converted, Lost — sits on the tab itself, not inside the table. A manager checking pipeline health sees in one glance that 496 leads are lost and 98 are still open, without opening a single record or running a filter first.',
            },
            {
              title: 'Date-range filter',
              body:
                'The table only shows leads that arrived within the selected window. Instead of scrolling through hundreds of rows to find this month’s enquiries, the team sets a date range and the list narrows to exactly what is relevant to their current review.',
            },
            {
              title: 'One-click export',
              body:
                'The entire filtered leads list — whatever date range and status filter is active — downloads in one click. Weekly reports, handoffs to management, or backups happen without rebuilding the data in Excel manually.',
            },
            {
              title: 'Incoming Leads queue',
              body:
                'Leads arriving from the website or external sources land in a separate incoming queue rather than mixing into the live pipeline immediately. The team reviews and qualifies them before they enter the main list, keeping the active pipeline clean and free of unverified enquiries.',
            },
            {
              title: 'New Lead button — always in reach',
              body:
                'A walk-in customer or a phone enquiry can be added from anywhere on the Leads page without navigating away. The entry point is always one click from wherever the employee is looking — top right, always visible.',
            },
          ],
        },
        {
          id: 'leads-activity',
          image: '/screenshots/ah-crm/leads-activity.png',
          title: 'Leads Activity',
          features: [
            {
              title: 'Two-tab structure — Activity & Inactivity Tracker',
              body:
                'The page separates what has happened from what has stopped happening. The team does not have to scan a single combined list trying to identify who has not been contacted — the Inactivity Tracker surfaces those leads automatically, already sorted by how long they have been silent.',
            },
            {
              title: 'Priority filter tabs with live counts',
              body:
                'Inactivity is not treated as binary. Every inactive lead is classified by severity — Critical means it is at serious risk of being lost, Warning means it is heading there, and Watch means it needs monitoring. The employee knows exactly where to focus first without reading through all 88 records.',
            },
          ],
        },
        {
          id: 'trips',
          image: '/screenshots/ah-crm/trips.png',
          title: 'Trips',
          features: [
            {
              title: 'Page-level summary — 10 upcoming · 32 completed',
              body:
                'The total state of all trips is visible before the table even loads. A manager walking into a morning review knows immediately how many active trips the team is managing and how many have already been delivered — no filters, no counting, no report needed.',
            },
            {
              title: 'Two-tab structure — Upcoming and Completed with live counts',
              body:
                'Upcoming trips and completed trips are separated into two distinct views. The execution team stays focused on what needs action now, while completed trips are preserved for reference and revenue reconciliation — neither list clutters the other.',
            },
          ],
        },
        {
          id: 'tasks',
          image: '/screenshots/ah-crm/tasks.png',
          title: 'Tasks',
          features: [
            {
              title: 'Two-tab structure — Create New Task and Task History',
              body:
                'Task creation and task records live in the same page but never mix. The employee creating a new follow-up works in a clean form, while the manager reviewing past tasks gets a dedicated history view — neither workflow interrupts the other.',
            },
            {
              title: 'Completed and Incomplete filter tabs',
              body:
                'The history is split by outcome, not just by date. A manager auditing team performance can isolate only completed tasks to verify what was done, or switch to incomplete tasks to see what is overdue — without reading through a mixed list to separate the two.',
            },
          ],
        },
        {
          id: 'quotations',
          image: '/screenshots/ah-crm/quotations.png',
          title: 'Quotations',
          features: [
            {
              title: 'Page-level pending alert badge — persistent at top right',
              body:
                'A count of unresponded requests stays visible at all times, even when the user scrolls or switches between tabs. The execution team member never has to read the table to know whether their queue is clear — the badge tells them the moment they land on the page.',
            },
            {
              title: 'Date range filter — scoped view of requests',
              body:
                'The quotation list is not a single unfiltered backlog. The team sets a date window and sees only the requests that arrived within that period, making weekly workload reviews and deadline tracking manageable without scrolling through historical records.',
            },
            {
              title: 'Two side-by-side donut charts — Pending Requests and Completed Responses, both broken down by employee',
              body:
                'Pending workload and completed output are visualised separately but on the same screen. A manager can immediately compare who has the most requests sitting unresponded against who has completed the most — workload imbalances become visible at a glance before they become a bottleneck.',
            },
            {
              title: 'Pending and Completed tab filter below the charts',
              body:
                'The table switches between unresponded and responded requests without leaving the page. The execution team works from the pending list, while management reviews completed responses for quality checks — each view is one click away from the other.',
            },
            {
              title: 'Lead quick-link button per row',
              body:
                'Each request carries a direct link to the full lead record. If the execution team needs more context — the client\'s budget, travel dates, group size — they open the lead in one click from the same row, without searching for it separately in the Leads module.',
            },
            {
              title: 'Respond button — direct action from the table row',
              body:
                'Every pending request has a Respond button attached to it. The execution team member does not navigate away, search for a form, or open a separate workflow — the action that matters most is right on the row, reducing the steps between seeing a request and acting on it.',
            },
          ],
        },
        {
          id: 'quotation-respond',
          image: '/screenshots/ah-crm/quotation-respond.png',
          title: 'Quotation Response',
          features: [
            {
              title: 'Two-column split layout — Employee Request on the left, Price Calculation on the right',
              body:
                'The request being responded to and the pricing being built live on the same screen simultaneously. The execution team member never switches between tabs or windows to cross-reference what the sales team asked for against what they are calculating — both sides are always visible at once.',
            },
            {
              title: 'Responded status badge — persistent at top right',
              body:
                'Once a quotation has been submitted, its status is immediately confirmed on the page itself. Anyone opening this record later — the sales employee, a manager, or the execution team — can tell at first glance that this request has been handled without reading through the content to find out.',
            },
            {
              title: 'Line-item price breakdown — Title, Units, Rate, Amount per cost component',
              body:
                'Every cost in the quotation is entered as a separate named line item with its own unit count and per-unit rate. The total is not a single entered figure — it is the sum of traceable, individually justifiable components, making the pricing auditable and easy to revise if any single element changes.',
            },
            {
              title: 'Margin line — separated from cost items',
              body:
                'The team\'s margin is recorded as a distinct line in the breakdown rather than buried inside individual cost entries. Management can review what markup was applied to any quotation without reverse-engineering it from the total, and the execution team can adjust the margin independently of the underlying costs.',
            },
            {
              title: 'Total — auto-calculated from all line items',
              body:
                'The final price is computed by the system from all the individual entries rather than typed manually. There is no arithmetic error risk, and any change to a single line item — a hotel upgrade, an extra day — immediately updates the total without the team recalculating from scratch.',
            },
            {
              title: 'Notes field — free-text operational context at the bottom of the price panel',
              body:
                'The execution team can attach specific instructions, inclusions, or caveats to the quotation that do not fit neatly into any structured field. The notes travel with the record, so the sales employee presenting the quote to the client and the operations team executing the trip both see the same context.',
            },
          ],
        },
        {
          id: 'accounts',
          image: '/screenshots/ah-crm/accounts.png',
          title: 'Accounts',
          features: [
            {
              title: 'Five summary cards at the top — Expected, Received, Balance, Paid Expense, Net Profit',
              body:
                'The complete financial picture of all converted trips is condensed into five numbers before the table begins. The accounts team and management see the business\'s current cash position — what was promised, what has arrived, what is still outstanding, what has been spent, and what remains as profit — without opening a single trip record.',
            },
            {
              title: 'Colour-coded financial columns — green for received and profit, orange for outstanding balance, red for expenses',
              body:
                'The table communicates financial health visually, not just numerically. A manager scanning the list immediately spots trips with large outstanding balances in orange and compares them against profit in green — without reading every figure carefully to determine which trips need payment follow-up.',
            },
          ],
        },
        {
          id: 'owner-dashboard',
          image: '/screenshots/ah-crm/owner-dashboard.jpg',
          title: 'Owner Dashboard',
          fitWidth: true,
          features: [
            {
              title: 'Four cross-team KPI cards in a single row — Leads, Itinerary, Execution, Net Profit',
              body:
                'The owner sees the health of every operational team before reading a single chart. Sales volume, itinerary completion, execution queue, and financial result are each distilled into one number — the complete business overview is absorbed in seconds, not assembled from four different module reports.',
            },
            {
              title: 'Conversion sub-label beneath each KPI card',
              body:
                'Every top-line number carries its downstream outcome directly below it. Total leads shows how many converted. Itinerary pending shows how many were completed. Execution pending shows how many were responded to. The owner sees not just the volume but the throughput rate of each team without drilling into any module.',
            },
            {
              title: 'Net profit with margin percentage displayed together',
              body:
                'Revenue performance and efficiency are shown as a pair rather than separately. The owner knows both the absolute profit figure and what percentage of revenue it represents — two different signals that together indicate whether the business is growing healthily or just growing.',
            },
            {
              title: 'Date range filter with Export — scoped to the owner\'s review period',
              body:
                'The entire dashboard recalculates around any date window the owner sets. Monthly board reviews, quarterly performance assessments, or year-to-date snapshots all use the same page — the Export button then captures the exact filtered view rather than requiring a manual report to be assembled separately.',
            },
            {
              title: 'Sales Performance Overview with category-level breakdown — Total, South India, North India, International',
              body:
                'The owner sees not just how many leads came in, but where they came from geographically. This reveals which markets are driving volume and which are underperforming — information that directly informs where marketing budget should be allocated next.',
            },
            {
              title: 'Category filter pills — All, South India, North India, International',
              body:
                'The entire sales performance section refilters to a single travel category in one click. The owner can isolate international performance from domestic performance and compare them independently, without the numbers from each category mixing into a single view that obscures the differences between them.',
            },
            {
              title: 'Lead Status Breakdown by Employee — multi-line chart across Open, Follow Up, Converted, Lost',
              body:
                'Every employee\'s pipeline progression is plotted as a separate line across all four lead stages. The owner can see at a glance which employees are converting well, which are accumulating leads in Follow Up without progressing them, and which have a disproportionate share of Lost leads — without reading through tabular data to draw those conclusions.',
            },
            {
              title: 'Employee dropdown filter on the performance chart',
              body:
                'The chart can be narrowed to a single employee for focused review. When an owner wants to discuss performance with a specific team member, they filter to that individual and see their exact pipeline shape — a factual basis for the conversation rather than a general impression.',
            },
            {
              title: 'Itinerary Performance card — Responded vs Pending with completion rate progress bar',
              body:
                'The itinerary team\'s output is summarised as two numbers and one visual indicator. The owner does not need to open the Itinerary module or ask the team for a status update — the completion rate bar communicates at a glance whether the team is keeping up with requests or building a backlog.',
            },
            {
              title: 'Execution Performance Overview — same structure as Itinerary, directly comparable',
              body:
                'Itinerary and Execution performance are displayed in the same format side by side. The owner can compare the completion rates of both teams using identical metrics — if one team is at a high completion rate and the other is significantly lower, the imbalance is immediately visible without switching between modules.',
            },
            {
              title: 'Accounts Overview — Total Income, Total Expense, Net Profit with transaction counts',
              body:
                'Financial performance is summarised in three numbers at the bottom of the same page the owner uses for sales and operational review. There is no need to open the General Ledger for a top-level financial snapshot — the owner sees revenue, cost, and profit in the same session as team performance, connecting commercial outcomes to operational activity directly.',
            },
          ],
        },
        {
          id: 'lead-detail',
          image: '/screenshots/ah-crm/lead-detail.png',
          title: 'Lead Detail',
          fitWidth: true,
          scrollable: true,
          features: [
            {
              title: 'Personal Details card — editable inline on the lead record',
              body:
                'The client\'s name, phone, WhatsApp, email, and location are stored on the lead itself, not in a separate contact database that requires cross-referencing. The sales employee has everything needed to reach the client without leaving the record they are already working in.',
            },
            {
              title: 'Lead Overview card — source, status, and quality indicator in one view',
              body:
                'The origin of the lead, its current pipeline status, and a quality assessment are all visible on the same card. A manager reviewing the lead knows at a glance where it came from, where it stands, and how promising it is — three distinct signals that together tell the full story of a lead\'s health.',
            },
            {
              title: 'Trip Details card — destination, travelers, duration, category, travel date, and budget together',
              body:
                'All the parameters that define what the client wants from the trip are captured in a single structured card. The execution team building a quotation, the itinerary team creating a document, and the sales employee discussing options with the client all read from the same source — there is no version of the trip details that lives only in someone\'s notes or memory.',
            },
            {
              title: 'Quotation section — multiple requests listed with individual status badges',
              body:
                'Every quotation request raised for a lead is tracked in sequence with its current status visible. When a client requests a revision or a different option, the new request sits alongside the previous ones — the full history of what was asked and what was responded to is preserved in order.',
            },
            {
              title: 'Request New Quotation button — triggers the execution team workflow from inside the lead',
              body:
                'The sales employee raises a quotation request without leaving the lead record or contacting the execution team through a separate channel. The request enters the execution team\'s queue immediately, with all the trip details already attached — no briefing message, no WhatsApp forward, no chance of the request being missed.',
            },
            {
              title: 'Itinerary section — upload status and file access in the lead record',
              body:
                'The itinerary document created by the itinerary team is visible and accessible directly on the lead page. The sales employee can review and share the itinerary without opening the itineraries module, and the client-facing file is always linked to the correct lead.',
            },
            {
              title: 'Request New Itinerary button — cross-team handoff initiated from the lead',
              body:
                'When a trip needs a new or revised itinerary, the request goes to the itinerary team directly from the lead record. The team receives it in their own module with full lead context attached — destination, travel dates, group size — without needing to be briefed separately.',
            },
            {
              title: 'Revisions section — uploaded revision files stored against the lead',
              body:
                'Every revised itinerary, updated quotation, or amended plan is saved directly on the lead record with a timestamp. When a client asks to go back to an earlier version or disputes what was agreed, the revision history on the record is the definitive reference — not an email thread or a WhatsApp chat.',
            },
            {
              title: 'Notes and Tasks panel — communication and follow-up managed on the lead',
              body:
                'The employee adds internal notes and schedules follow-up tasks without switching to a separate tasks module. Notes capture context from client calls and meetings. Tasks ensure the next action is recorded with a deadline and an assignee — all attached to the specific lead they relate to.',
            },
            {
              title: 'Trip Payments section — collection status visible on the lead record',
              body:
                'The payment position of the trip — expected amount, what has been received, and what remains outstanding — is accessible from the lead page itself. The sales employee and the accounts team both see the same payment data without the accounts team needing to send updates or the sales employee needing to check a separate payments module.',
            },
            {
              title: 'Booking Details section — operational specifics captured on the confirmed lead',
              body:
                'Once a lead converts to a confirmed booking, the logistics details are recorded in a dedicated section on the same record. The execution team has everything needed to run the trip — pickup, drop, confirmation status — without a separate handover document or briefing session.',
            },
            {
              title: 'Activity Log — complete timestamped history of every action on the lead',
              body:
                'Every change, note, status update, file upload, request, and interaction is recorded automatically with the time it happened and the person responsible. The log cannot be edited or deleted. When accountability for a decision or a delay is questioned, the activity log is the factual record — not someone\'s recollection of events.',
            },
          ],
        },
        {
          id: 'general-ledger',
          image: '/screenshots/ah-crm/general-ledger.png',
          title: 'General Ledger',
          features: [
            {
              title: 'Three summary cards — Total Revenue, Total Expense, Net Profit with margin percentage',
              body:
                'The financial health of the business for any selected period is visible before the table is read. The accounts team and owner see the net position — what came in, what went out, and what remained — without adding up individual rows or building a summary separately.',
            },
            {
              title: 'Quick preset filters — Last 30 Days and Last 90 Days alongside custom date range',
              body:
                'Commonly needed reporting windows are available as single clicks rather than requiring manual date entry every time. Monthly reconciliations and quarterly reviews start immediately without the accounts team having to remember or calculate the correct date boundaries each time.',
            },
            {
              title: 'Transaction count beneath each summary card',
              body:
                'The number of individual transactions behind each total is shown alongside the amount. The accounts team can immediately tell whether a high revenue figure reflects many small payments or a few large ones — context that matters when auditing entries or investigating discrepancies.',
            },
            {
              title: 'Income and Expense tab filter — separating two distinct transaction types',
              body:
                'Client receipts and vendor payments are kept in separate views under the same page. The accounts team reviews income without expense rows creating noise in the list, and reviews expenses without income entries obscuring the pattern — each financial flow is examined on its own terms.',
            },
            {
              title: 'Amount shown in green with explicit plus sign — income clearly distinguished',
              body:
                'Every income transaction is displayed with a positive indicator and in green, making the direction of the transaction visually unambiguous. In a ledger that can switch between income and expense views, there is no possibility of misreading a payment received as a cost incurred.',
            },
            {
              title: 'Proof column — bill or receipt linked per transaction',
              body:
                'Each transaction can carry an attached proof document, accessible directly from the table row. Audits, tax filings, and internal reviews do not require the accounts team to search email threads or file systems for supporting documents — every entry carries its own verification.',
            },
            {
              title: 'Search bar — searchable by lead, title, or category',
              body:
                'The accounts team can locate a specific transaction by typing a client name, a trip category, or a title keyword without scrolling through the full list. When a specific payment needs to be found quickly during a client call or a management query, the search returns it in seconds.',
            },
            {
              title: 'Icon-only collapsed sidebar — maximum screen space for financial data',
              body:
                'The navigation is compressed to icons rather than labelled items, giving the table as much horizontal space as possible. On a page where multiple financial columns need to be visible simultaneously, the compact sidebar ensures the data is not crowded off screen.',
            },
            {
              title: 'Export button — full filtered ledger downloadable in one click',
              body:
                'The accounts team exports the exact view currently on screen — filtered by date, type, and any active search — without building a report manually. The exported file reflects the same period and scope shown in the summary cards, making it ready for submission or sharing without further preparation.',
            },
          ],
        },
        // To add the next screen, append another object here with its own
        // image + features — it renders as a new pinned section automatically.
      ],
    },
  },
  results: {
    intro:
      'Measured three months after the CRM went live, every operational metric the research had flagged moved decisively in the right direction — lead loss, response time, and cross-team errors fell sharply, while follow-up, visibility, and task completion climbed.',
    metrics: [],
    resultCards: [
      { n: '01', category: 'Lead loss rate', desc: 'Percentage of incoming leads that were lost permanently due to zero follow-up action taken by the team', before: '34%', after: '4%', direction: 'down', beforeBar: 100, afterBar: 12, delta: '88%' },
      { n: '02', category: 'Cold lead rate', desc: 'Percentage of active leads that went completely cold with no activity recorded for seven or more days', before: '47%', after: '9%', direction: 'down', beforeBar: 100, afterBar: 19, delta: '81%' },
      { n: '03', category: 'Follow-up rate', desc: 'Share of total enquiries that received at least one documented follow-up action from the assigned employee', before: '51%', after: '93%', direction: 'up', beforeBar: 55, afterBar: 100, delta: '42 pts' },
      { n: '04', category: 'Response time', desc: 'Average time elapsed between a new lead enquiry arriving and the first follow-up contact being made', before: '6.4 hrs', after: '48 min', direction: 'down', beforeBar: 100, afterBar: 13, delta: '87%' },
      { n: '05', category: 'Lead visibility', desc: 'Proportion of leads actively trackable in real time by any authorised team member at any given moment', before: '23%', after: '98.4%', direction: 'up', beforeBar: 23, afterBar: 100, delta: '75 pts' },
      { n: '06', category: 'Task completion', desc: 'Rate at which follow-up tasks assigned to employees were completed on time without manual escalation required', before: '41%', after: '91%', direction: 'up', beforeBar: 45, afterBar: 100, delta: '50 pts' },
      { n: '07', category: 'Miscommunication incidents', desc: 'Number of cross-team handoff errors and miscommunication incidents recorded per month across all operational departments', before: '18.3 /mo', after: '2.1 /mo', direction: 'down', beforeBar: 100, afterBar: 11, delta: '89%' },
      { n: '08', category: 'Admin time per person', desc: 'Hours spent per employee each day on non-sales administrative tasks including chasing updates and manual data logging', before: '2.5 hrs', after: '41 min', direction: 'down', beforeBar: 100, afterBar: 27, delta: '73%' },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
 * AH-ITINERARY
 * ═══════════════════════════════════════════════════════════════════════════ */

const AH_ITINERARY: CaseStudy = {
  overview: {
    facts: [],
    glance: [],
    stats: [],
    projectHero: {
      tagline: 'A guided itinerary-quotation builder for a travel agency — a 4-step wizard that takes a travel consultant from a blank screen to a professional, branded PDF in under 12 minutes.',
      problem: 'A 4-consultant studio producing 5–8 itineraries each every week — every quotation hand-formatted from scratch in Word, with no reusable content, no consistent branding, no version tracking, and no visibility into how many quotations were going out the door.',
    },
    metaCards: [
      { icon: 'Briefcase', label: 'Role', value: 'Product Analyst & System Designer', sub: 'Research · IA · UX · system logic' },
      { icon: 'Users', label: 'Users', value: 'Travel consultants', sub: '5–8 itineraries per week each' },
      { icon: 'Clock', label: 'Timeline', value: 'Research to Deployment', sub: 'Iterative build · multiple pivots' },
      { icon: 'Monitor', label: 'Platform', value: 'Web Application', sub: 'Responsive' },
    ],
    techStack: ['React 18', 'TypeScript', 'Vite', 'Supabase', 'shadcn/ui', 'Tailwind', 'jsPDF', 'Recharts', 'Vercel'],
    tools: ['Figma', 'FigJam', 'Notion', 'Google Forms', 'VS Code'],
    outcome: {
      period: 'Measured across the 4-consultant team',
      items: [
        { n: '↓ 73%',  label: 'Creation time',   sub: '45 min → 12 min' },
        { n: '+80 pts', label: 'Day-plan reuse',  sub: '0% → 80%'        },
        { n: '↓ 100%',  label: 'Code collisions', sub: '~15% → 0%'       },
      ],
    },
  },
  qualitative: {
    intro:
      'Itinerary creation looked like a software problem but was really a behaviour problem, so I started by watching consultants work. Two primary personas and one secondary persona emerged from interviews and timed shadow sessions.',
    personas: [
      {
        name: 'Anand K.', role: 'Travel Consultant', age: 26, color: '#3b82f6', badge: 'Primary',
        empathy: {
          says: ['"I already know what this trip should say."', '"Where did I save that Kerala itinerary?"', '"Why does mine look different from everyone else\'s?"'],
          thinks: ['"Half my time goes to formatting, not the client."', '"I\'m re-typing content I\'ve written ten times."', '"A slow quote is a lost client."'],
          does: ['Spends 45–60 minutes per itinerary fighting Word', 'Re-types the same day plans from memory each week', 'Scrolls Drive folders for ten minutes to find old quotes'],
          feels: ['Frustrated by time lost to layout, not content', 'Rushed by the speed-versus-quality squeeze', 'Embarrassed by inconsistent-looking PDFs'],
        },
        bio: 'A junior consultant handling 15–20 client enquiries per week. He creates 5–8 itinerary quotations weekly, mostly domestic. Speed and accuracy matter — a delayed quotation means a lost client.',
        goals: ['Create a professional itinerary in under 15 minutes', 'Reuse day-plan content from past itineraries', 'Generate a clean, consistent PDF', 'Find any past itinerary instantly'],
        frustrations: ['Spends 45–60 minutes per itinerary in Word', 'Re-types the same Kerala day plans every week', "Can't find old quotations without scrolling for 10 minutes", "His PDFs look different from other consultants' PDFs"],
        quote: '"I know exactly what a 5-day Kerala trip should say. But I still spend 40 minutes making it look right in Word."',
      },
      {
        name: 'Deepa R.', role: 'Senior Consultant / Team Lead', age: 35, color: '#7c3aed', badge: 'Primary',
        empathy: {
          says: ['"How many quotations did you send this week?"', '"Email me the itinerary so I can review it."', '"Can\'t we just duplicate the last one?"'],
          thinks: ['"I have no central view of my team\'s work."', '"Quality is inconsistent and I can\'t enforce it."', '"Counting output by hand every Friday is absurd."'],
          does: ['Asks each consultant individually for their numbers', 'Reviews itineraries as email attachments, one by one', 'Rebuilds quotations from scratch instead of duplicating'],
          feels: ['Stretched between reviewing, reporting, and her own trips', 'Frustrated by the lack of a single source of truth', 'Powerless to enforce consistent quality'],
        },
        bio: 'Manages a team of 4 consultants. Reviews their itineraries before they reach clients, handles complex international and corporate group trips, and reports team output to the owner.',
        goals: ["Review any consultant's itinerary quickly", 'Track team output this week/month', "Edit and improve junior consultants' work", 'Duplicate a past itinerary as a starting point'],
        frustrations: ['Has to ask each consultant individually for output numbers', 'Reviews itineraries as email attachments — no central access', "Can't duplicate a past quotation — each is built from scratch", 'No way to enforce consistent quality across the team'],
        quote: '"I spend Friday afternoons asking each person how many quotations they sent out this week. Nobody keeps count."',
      },
      {
        name: 'Lakshmi N.', role: 'Business Owner', age: 50, color: '#0f766e', badge: 'Secondary',
        empathy: {
          says: ['"How many quotations did we send last month?"', '"Which regions are growing?"', '"Are we even using the tools I pay for?"'],
          thinks: ['"I run 12 people on gut feeling alone."', '"I can\'t see domestic-versus-international trends."', '"Without data, I can\'t plan the next quarter."'],
          does: ['Relies on intuition for volume and trends', 'Asks the team for numbers nobody tracks', 'Reviews the board with anecdotes, not exports'],
          feels: ['Frustrated flying blind on her own business', 'Uncertain which group types to invest in', 'Skeptical of ROI on tools she can\'t measure'],
        },
        bio: 'Founded the agency 15 years ago. Wants to understand the business at a glance — popular regions, productive consultants, volume trends month over month. Currently has none of this data.',
        goals: ['Dashboard KPIs: total itineraries, region breakdown, consultant performance', 'Filter data by date range, region, and group type', 'Export data to Excel for board reviews', 'Know if team output is growing or declining'],
        frustrations: ['Has zero data on itinerary volume — relies on gut feeling', "Can't compare domestic vs international quotation trends", 'No way to identify which group types are growing', "Pays for tools but can't measure if the team is using them"],
        quote: '"I run a business with 12 people and I can\'t tell you how many quotations we sent last month."',
      },
    ],
  },
  quantitative: {
    intro:
      'To put numbers behind the shadow-session observations, I ran a pre-development survey with the travel consulting team (n = 14). Ten questions mapped how itineraries are built today, where the process breaks down, what errors cost in client trust, and which capabilities the consultants themselves ranked as most valuable.',
    report: {
      subtitle: 'Pre-development survey · 12–18 May 2025 · n = 14 consultants',
      meta: [
        { label: 'Method', value: 'Online survey', sub: 'Google Forms' },
        { label: 'Timing', value: 'Pre-development', sub: 'May 2025' },
        { label: 'Sample', value: 'n = 14', sub: 'Travel consulting team' },
        { label: 'Format', value: '10 questions', sub: 'Likert · multi-select · multiple choice' },
      ],
      rolesTitle: 'Participant roles',
      roles: [
        { label: 'Travel Consultant', count: 9, color: '#3b82f6' },
        { label: 'Senior Consultant', count: 3, color: '#7c3aed' },
        { label: 'Operations Coordinator', count: 1, color: '#f59e0b' },
        { label: 'Business Owner', count: 1, color: '#0f766e' },
      ],
      questions: [
        {
          n: 'Q1', group: 'Current state', type: 'Multiple choice', color: '#1d4ed8', max: 8,
          question: 'How do you currently create travel itineraries for clients?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'MS Word / Google Docs', value: 8 },
            { label: 'WhatsApp — typed to client', value: 3 },
            { label: 'Excel / Spreadsheet', value: 2 },
            { label: 'Pre-designed PDF (Canva)', value: 1 },
            { label: 'Dedicated travel software', value: 0 },
          ],
          insight: { metric: '57%', label: 'create itineraries in Word or Google Docs', text: 'General-purpose tools with no travel-specific structure — every itinerary formatted from scratch. Not one consultant used dedicated travel software built for the job.' },
        },
        {
          n: 'Q2', group: 'Current state', type: 'Multiple choice', color: '#b45309', max: 7,
          question: 'How long does it take you to create one complete itinerary from scratch?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Less than 30 min', value: 1 },
            { label: '30 min – 1 hour', value: 2 },
            { label: '1 – 2 hours', value: 6 },
            { label: '2 – 3 hours', value: 4 },
            { label: 'More than 3 hours', value: 1 },
          ],
          insight: { metric: '72%', label: 'spend 1–3 hours on a single itinerary', text: 'At 4–6 itineraries a week, that is 4–18 hours of pure itinerary production per consultant — a significant, recurring operational cost the studio had to cut.' },
        },
        {
          n: 'Q8', group: 'Current state', type: 'Multiple choice', color: '#b45309', max: 6,
          question: 'How is your time split between writing content and handling formatting?',
          note: 'n = 14 respondents · content (days, activities) vs formatting (layout, design)',
          bars: [
            { label: '80% content / 20% format', value: 2 },
            { label: '60% content / 40% format', value: 4 },
            { label: '50% content / 50% format', value: 5 },
            { label: '40% content / 60% format', value: 3 },
            { label: '20% content / 80% format', value: 0 },
          ],
          insight: { metric: '57%', label: 'spend equal or more time on formatting than content', text: 'Not one consultant spent the majority of their time on content. Automating layout and branding could recover 40–60% of the time sunk into every itinerary.' },
        },
        {
          n: 'Q3', group: 'Failure points', type: 'Likert · satisfaction', color: '#dc2626', max: 6,
          question: 'How satisfied are you with your current itinerary creation process?',
          note: 'n = 14 · scale: 1 = very dissatisfied, 5 = very satisfied · avg 2.6',
          bars: [
            { label: 'Very dissatisfied (1)', value: 2 },
            { label: 'Dissatisfied (2)', value: 5 },
            { label: 'Neutral (3)', value: 4 },
            { label: 'Satisfied (4)', value: 2 },
            { label: 'Very satisfied (5)', value: 1 },
          ],
          insight: { metric: '2.6 / 5', label: 'average satisfaction with the current process', text: 'Half of all consultants scored 2 or lower and only one scored a 5. The process is tolerated, not accepted — a clear appetite for a better tool.' },
        },
        {
          n: 'Q4', group: 'Failure points', type: 'Checkboxes', color: '#dc2626', unit: '%', max: 100,
          question: 'What are the biggest challenges in your current itinerary creation process?',
          note: '% of 14 respondents · multiple selections allowed',
          bars: [
            { label: 'Formatting takes too long', value: 79 },
            { label: 'No standard format', value: 71 },
            { label: 'Redo entire itinerary on changes', value: 64 },
            { label: 'Hard to reuse past content', value: 64 },
            { label: 'Copy-paste errors', value: 57 },
            { label: 'Inconsistent pricing layout', value: 43 },
            { label: 'No version tracking', value: 36 },
          ],
          insight: { metric: '79%', label: 'named formatting time as a top challenge', text: 'Formatting overhead (79%), no standard format (71%), and rework on client changes (64%) are the top three — all structurally solvable by a template-driven builder.' },
        },
        {
          n: 'Q6', group: 'Failure points', type: 'Multiple choice', color: '#dc2626', max: 8,
          question: 'Is there a standardized itinerary format used across all consultants?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'No — everyone has their own', value: 7 },
            { label: 'Loose template, modified freely', value: 6 },
            { label: 'Yes — one fixed template', value: 1 },
          ],
          insight: { metric: '93%', label: 'have no shared template, or deviate from it', text: 'Only one consultant follows a fixed format. The brand experience depends entirely on the individual, not the system — every itinerary looks different to the client.' },
        },
        {
          n: 'Q5', group: 'Cost of inaction', type: 'Likert · frequency', color: '#b45309', max: 9,
          question: 'How often do you notice errors — wrong dates, pricing, or client name — in your itineraries?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Never', value: 0 },
            { label: 'Rarely — monthly or less', value: 3 },
            { label: 'Sometimes — few times a month', value: 8 },
            { label: 'Often — multiple times a week', value: 3 },
          ],
          insight: { metric: '100%', label: "experience itinerary errors — none said 'never'", text: 'Every consultant catches wrong dates, prices, or names; 78% hit them at least a few times a month. This is a process failure, not careless data entry.' },
        },
        {
          n: 'Q9', group: 'Cost of inaction', type: 'Multiple choice', color: '#dc2626', max: 9,
          question: 'Has an itinerary error ever caused a client complaint, confusion, or follow-up?',
          note: 'n = 14 respondents',
          bars: [
            { label: 'Yes — multiple times', value: 5 },
            { label: 'Yes — once or twice', value: 7 },
            { label: 'No — never', value: 2 },
          ],
          insight: { metric: '86%', label: 'have had an itinerary error reach a client', text: "Errors don't stay internal — they surface as complaints, confusion, and follow-ups. Structured auto-fill and a single template remove the copy-paste step that causes them." },
        },
        {
          n: 'Q7', group: 'Solution direction', type: 'Checkboxes', color: '#7c3aed', unit: '%', max: 100,
          question: 'How do you typically deliver the final itinerary to clients?',
          note: '% of 14 respondents · multiple selections allowed',
          bars: [
            { label: 'WhatsApp — PDF attachment', value: 86 },
            { label: 'Email', value: 64 },
            { label: 'WhatsApp — typed in chat', value: 29 },
            { label: 'Printed, handed in person', value: 14 },
            { label: 'Google Drive link', value: 7 },
          ],
          insight: { metric: '86%', label: 'deliver the final itinerary as a WhatsApp PDF', text: 'PDF over WhatsApp is the dominant delivery channel by far. This directly validated making one-click branded PDF export the primary output of the studio.' },
        },
        {
          n: 'Q10', group: 'Solution direction', type: 'Checkboxes', color: '#0f766e', unit: '%', max: 100,
          question: 'Which features would be most valuable in a dedicated itinerary tool?',
          note: '% of 14 respondents · multiple selections allowed',
          bars: [
            { label: 'Auto-generate a professional PDF', value: 93 },
            { label: 'Pre-built day-plan templates', value: 86 },
            { label: 'Consistent branded design', value: 79 },
            { label: 'Reusable content blocks', value: 79 },
            { label: 'Auto-fill client & trip details', value: 71 },
            { label: 'Structured pricing section', value: 64 },
            { label: 'Duplicate & adapt a past itinerary', value: 57 },
          ],
          insight: { metric: '93%', label: 'ranked automatic PDF generation as most valuable', text: 'PDF export (93%), pre-built day-plan templates (86%), and consistent branded formatting (79%) are the top three asks — and the three core features of the Quotation Maker.' },
        },
      ],
    },
    surveys: [
      {
        title: 'Itinerary Creation Workflow Survey',
        description: 'Sent to all travel consultants to baseline how itinerary quotations are produced today.',
        responses: '14 responses',
        questions: [
          { q: 'On average, how long does one itinerary take you to create in Word?', type: 'choice', options: ['Under 20 min', '20–40 min', '45–60 min', 'Over an hour'], answer: 2, required: true },
          { q: 'How much of a typical itinerary is content you have written before?', type: 'scale', scale: 5, scaleLabels: ['Almost none', 'Almost all'], answer: 3, required: true },
          { q: 'Where do you store and find past itineraries?', type: 'choice', options: ['Personal Google Drive folder', 'Email attachments', 'Local computer', 'I rebuild from scratch'], answer: 0, required: true },
          { q: 'Which steps waste the most time? (select all that apply)', type: 'checkbox', options: ['Formatting & layout', 'Re-typing day plans', 'Generating the PDF', 'Numbering / codes'], answers: [0, 1] },
          { q: 'Does the business track how many itineraries the team produces?', type: 'choice', options: ['Yes, accurately', 'Roughly', 'No', "I don't know"], answer: 2 },
        ],
      },
    ],
  },
  findings: {
    intro:
      'The research converged on five findings — the most important being that consultants were doing document-layout work, not sales work.',
    bento: [
      { value: '93%', label: 'want automatic PDF export', note: 'the single most-wanted feature', tone: 'accent', span: 'spotlight', size: '2xl', color: '#00AAFF', icon: 'file-down' },
      { value: '0%', label: 'said they never make errors', note: 'so every consultant does — errors are universal', tone: 'accent', span: 'wide', size: 'lg', color: '#0f172a', icon: 'ban' },
      { value: '86%', label: 'had an error reach a client', note: 'complaints & follow-ups', tone: 'surface', size: 'md', color: '#e11d48', icon: 'alert-triangle' },
      { value: '2.6/5', label: 'average satisfaction score', note: 'tolerated, not accepted', tone: 'surface', size: 'sm', color: '#7c3aed', icon: 'gauge' },
      { value: '72%', label: 'spend 1–3 hours per itinerary', tone: 'surface', size: 'md', color: '#2563eb', icon: 'clock' },
      { value: '50%', label: 'have no standard format at all', tone: 'surface', size: 'sm', color: '#d97706', icon: 'shuffle' },
      { value: '57%', label: 'still use Word or Google Docs', tone: 'surface', span: 'wide', size: 'lg', color: '#0891b2', icon: 'file-text' },
      { value: '7', label: 'distinct pain points identified', tone: 'surface', size: 'xl', color: '#e11d48', icon: 'list-checks' },
    ],
    items: [
      { title: '40% of creation time was spent on formatting, not content', desc: 'Consultants spent nearly half their time adjusting margins, fonts, page breaks, and logo placement — work with zero client value. The template should handle all formatting automatically.' },
      { title: '80% of day-plan content was reusable across clients', desc: 'A 5-day Kerala itinerary shared roughly 80% of its day-by-day content with every other Kerala itinerary. Only the client name, dates, group size, and pricing changed. A keyword/snippet library could eliminate most re-typing.' },
      { title: 'Consultants had no retrieval system', desc: 'Past itineraries lived in personal Google Drive folders. Finding a specific quotation meant remembering a file name or scrolling through months of files. A searchable management table was essential.' },
      { title: 'The business had zero operational visibility', desc: 'The owner had no way to know how many itineraries were created last month, which regions were trending, which consultants were most active, or the average group size.' },
      { title: 'Itinerary codes were untracked and duplicated', desc: 'Each consultant kept their own numbering. Code collisions happened ~15% of the time, causing confusion when clients referenced a quotation number that matched multiple documents.' },
    ],
  },
  problemStatement:
    'Consultants spent more time formatting documents than selling trips. Every itinerary was built from scratch — no reusable content, no version tracking, no consistent branding, and no way to know how many quotations were going out the door.',
  idea: {
    intro:
      'The solution was a guided itinerary builder: a 4-step wizard that takes a consultant from a blank screen to a professional, branded PDF in under 12 minutes — with reusable content blocks, automatic code generation, and a live analytics dashboard for the business.',
    wireframes: [
      '/screenshots/ah-itinerary/wireframes/wireframe-01.png',
      '/screenshots/ah-itinerary/wireframes/wireframe-02.png',
      '/screenshots/ah-itinerary/wireframes/wireframe-03.png',
      '/screenshots/ah-itinerary/wireframes/wireframe-04.png',
      '/screenshots/ah-itinerary/wireframes/wireframe-05.png',
    ],
    ia: {
      intro:
        'The application has 6 flat routes — no nested hierarchies, every page reachable from the top navigation. Behind them sits a deliberately flat data model: complex nested data (day plans, pricing, notes) is stored as JSONB, so there are no joins for what is essentially document data.',
    },
    systemBuild: {
      what:
        'The Studio replaces an unstructured Word document with a guided 4-step wizard. Each step collects one category of information with smart defaults and reusable content, then a single branded template renders the PDF. An atomic Postgres counter guarantees globally-unique codes, and an in-memory index makes search across 50,000+ records instant.',
      screens: [
        {
          id: 'dashboard',
          image: '/screenshots/ah-itinerary/dashboard.jpg',
          title: 'Dashboard',
          caption: 'A one-screen analytics view over the entire itinerary portfolio.',
          fitWidth: true,
          features: [
            {
              title: 'Two-surface navigation — Dashboard · Itinerary Management',
              body:
                'Analytics and operations live on separate tabs so neither clutters the other. A consultant handling bookings stays in Itinerary Management; a manager reviewing numbers stays on Dashboard — each role sees only what they need, on the surface built for them.',
            },
            {
              title: 'Date range filter — From / To Created Date',
              body:
                'Scoping to a date window turns a 1,300-record system into a focused snapshot. A team reviewing one month’s performance sets the window and every card, chart, and bar on the page immediately narrows to only those itineraries — no export, no custom query, no spreadsheet.',
            },
            {
              title: 'Region filter — All · Domestic · International',
              body:
                'One click isolates the entire dashboard to a single geography. With Domestic at 934 and International at 336, a manager tracking the international growth target switches to that view and instantly sees the group type breakdown, consultant contribution, and intake rate for that segment alone.',
            },
            {
              title: 'Group Type filter — All · F&F · School · College · Corp · Couple · GD',
              body:
                'Six group types sit on permanently visible pills, each narrowing every chart on the page when clicked. The School segment — just 13 itineraries in the system — is invisible inside the combined view, but filtering to it isolates it completely so a coordinator can review it without the 649 F&F records drowning it out.',
            },
            {
              title: 'Four KPI cards — Total · Domestic · International · Added Today',
              body:
                'The four headline numbers give any reviewer a complete portfolio snapshot before they look at anything else on the page. At 1,300 total — 934 domestic and 336 international — the split is readable from the cards alone, without touching either chart below.',
            },
            {
              title: 'Percentage context on each card — count + share of total',
              body:
                'Each geographic card shows its absolute number and its share of the portfolio simultaneously. “934” and “72% of total” appearing together means a manager reads both volume and relative weight in one glance, rather than dividing numbers in their head.',
            },
            {
              title: 'Group Type Split — donut chart with labeled breakdown',
              body:
                'The donut makes portfolio composition visual rather than numerical. Friends & Family at 649 clearly dominates; Corporate at 34 and School at 13 register as the smallest segments. Decisions about which group type to invest in next start from this chart, not from a separate analysis.',
            },
            {
              title: 'Region Split — donut chart',
              body:
                'The 72/26 split confirms in one look that the business is predominantly domestic, with international still a growth segment. When the team runs a campaign to shift that ratio, this chart becomes the natural before/after metric — no new report to set up, just check the same screen again after the campaign closes.',
            },
            {
              title: 'By Consultant — ranked bar chart',
              body:
                'Every consultant’s output is ranked by volume in a single view. Mr. Thianeshwar at 233 and Mr. Rifayin at 213 sit visibly ahead of the field. A manager doing a workload review or a performance conversation doesn’t need to pull individual records — the relative contribution of each person is readable directly from the bar lengths.',
            },
          ],
        },
        {
          id: 'management',
          image: '/screenshots/ah-itinerary/management.png',
          title: 'Itinerary Management',
          caption: 'The operational surface — every itinerary searchable, filterable, and actionable from one table.',
          fitWidth: true,
          features: [
            {
              title: 'Live-count filter tabs — ALL 1300 · DOM 934 · INTL 336',
              body:
                'The record count sits inside each tab, not on a separate summary card. A consultant switching between Domestic and International doesn’t need to run a filter and wait for a count — the number is already there, and clicking the tab narrows the table and updates the group type row simultaneously.',
            },
            {
              title: 'Group Type tabs with counts — FIT 649 · SCH 13 · CLG 218 · COR 34 · CPL 236 · GD 112',
              body:
                'Six segments are permanently readable side by side. School at 13 and Corporate at 34 are immediately identifiable as the smallest segments without any calculation. A manager allocating consultant workload across group types reads the full distribution in one row without opening a filter panel.',
            },
            {
              title: 'Global search bar',
              body:
                'One search field works across client name, itinerary code, destination, and consultant — whatever the user remembers is enough to locate the record. A consultant who only recalls “Vagamon” or “Rifayin” or a partial code like “CLG-194” finds the right row without knowing which filter to apply first.',
            },
            {
              title: 'Per-row actions — View · Edit · Duplicate · Delete',
              body:
                'Every record action is available directly on the row without selecting a checkbox or opening the record first. A consultant who needs to reuse last week’s Goa itinerary for a new couple hits Duplicate in one click and gets a new record with the next available code, ready to edit — no re-entering the destination, duration, or policies.',
            },
            {
              title: 'Keywords Management — accessible from this surface',
              body:
                'The keyword library is reachable directly from the management page, not buried in settings. When a consultant notices a destination is missing from the keyword library while reviewing itineraries, they can add it immediately and come back — the workflow doesn’t require switching tabs or navigating to a separate admin area.',
            },
            {
              title: '+ Create Itinerary — primary CTA, always visible',
              body:
                'The yellow button stays in the top-right regardless of scroll position or active filter. A consultant who just reviewed an existing record and wants to create a similar one for a new client doesn’t need to navigate back to a home page — the entry point to the creation wizard is on the same screen they’re already on.',
            },
            {
              title: 'Download export button',
              body:
                'The entire itinerary table — across all filters and columns — exports to Excel in one click. A manager doing a monthly review or sharing data with the business owner doesn’t need database access or a custom report; the download produces a structured file that carries every field the table holds.',
            },
          ],
        },
        {
          id: 'keywords',
          image: '/screenshots/ah-itinerary/keywords.png',
          title: 'Keyword Templates',
          caption: 'The reusable day-plan library that powers auto-fill inside the wizard.',
          fitWidth: true,
          features: [
            {
              title: 'Keyword as a unique identifier — e.g. Mysore1day, Chikmagalur Day 1',
              body:
                'The keyword is the lookup handle a consultant types inside the itinerary wizard, not the title the client sees. Because it’s a slug — short, unique, and unambiguous — a consultant typing “chik” in Step 2 gets both Chikmagalur Day 1 and Day 2 as autocomplete options instantly, without scrolling through a generic list of place names.',
            },
            {
              title: 'Day Title as a separate field from the keyword',
              body:
                'The keyword is for internal lookup; the Day Title is what prints on the client’s itinerary. “Alleppey Backwater Boating” is the keyword a consultant searches for, while “Alleppey Sightseeing” is what the client reads. The two being separate means the lookup language can be operational and the client-facing language can be polished — without editing the keyword every time the phrasing needs to change.',
            },
            {
              title: 'Day Notes field — one per line',
              body:
                'Notes are structured as a line-separated list rather than a free-text paragraph. The placeholder shows the intended pattern: Morning Visit, Afternoon Exploration, Evening Leisure. When this template is pulled into an itinerary, each line becomes a discrete note item — so a consultant doesn’t receive a wall of text they have to reformat; they get a ready-to-send structured breakdown.',
            },
            {
              title: 'Day Plan Activities field — one per line',
              body:
                'Activities are separate from notes, giving consultants two distinct content layers per day. The placeholder examples — Visit Mysore Palace, Lunch at local hotel, Chamundi Hills sunset — show that activities are specific and sequential. When a template is selected in the itinerary wizard, this list auto-populates the day’s activity blocks, eliminating retyping for routes the team covers repeatedly.',
            },
            {
              title: 'Split-panel layout — form on the left, saved templates on the right',
              body:
                'The creation form and the template library sit side by side on the same screen. A consultant adding a new template can reference existing ones for naming conventions or structure without navigating away. There is no modal, no separate page — the full context stays visible during the authoring process.',
            },
            {
              title: 'Search within saved templates — “Search keyword or title...”',
              body:
                'The search filters the saved template list in real time by keyword or day title. With destinations like Alleppey having multiple entries — Alleppey Backwater Boating and Alleppey House Boat — a consultant searching “allep” narrows to both and picks the right one, rather than scanning an unsorted list that grows longer as more destinations are added.',
            },
            {
              title: 'Multi-day destination support — Chikmagalur Day 1 · Chikmagalur Day 2',
              body:
                'A single destination can have multiple day templates, each with its own keyword, title, notes, and activities. A consultant building a 2-night Chikmagalur itinerary selects Day 1 for the first day and Day 2 for the second — each day gets different content automatically. No template needs to cover an entire trip; they’re composable day by day.',
            },
            {
              title: 'Inline edit on saved templates',
              body:
                'Every saved template has an edit action directly in the row. When a destination’s standard activity list changes — say a new experience replaces an old one at Coonoor — the team updates the template once in this library and every future itinerary that uses that keyword gets the updated content. Past itineraries are unaffected; only new ones pick up the change.',
            },
            {
              title: 'Delete action with per-row control',
              body:
                'Templates can be removed individually without affecting any itinerary that already used them. A deprecated route like an old Belur water activity that no longer runs can be deleted from the library so consultants stop seeing it as an option — without disturbing any existing itinerary where that day was already saved.',
            },
          ],
        },
        {
          id: 'code-sequence',
          image: '/screenshots/ah-itinerary/code-sequence.png',
          title: 'Code Sequence Manager',
          caption: 'The control room behind every itinerary code — 12 independent, year-aware counters.',
          fitWidth: true,
          features: [
            {
              title: 'Code Sequence Manager as a dedicated modal',
              body:
                'Counter management is separated from the itinerary table into its own panel, opened deliberately. An admin adjusting sequences doesn’t risk accidentally editing or deleting a record — the two operations are structurally isolated, and the table underneath remains fully visible as context.',
            },
            {
              title: 'Code structure — AH26-DOM-FIT-439',
              body:
                'Every code encodes four pieces of information: company prefix, year, region, and group type — before the sequence number even appears. A manager looking at AH26-DOM-CLG-196 in the table knows immediately that it is a 2026 domestic college group itinerary, without opening the record. The code is a readable audit trail, not just a unique ID.',
            },
            {
              title: 'Year prefix — AH26',
              body:
                'The year is baked into every code at the sequence level, not appended manually. When the year rolls over to 2027, every new itinerary automatically starts as AH27 — with its own counters starting fresh — while 2026 records retain their original codes permanently. Year-over-year comparison is clean without any renaming or migration.',
            },
            {
              title: 'Independent counter per region × group type — 12 separate sequences',
              body:
                'DOM-FIT and INTL-FIT maintain separate counters: 439 and 148 respectively. A domestic friends-and-family trip and an international one are never in the same numbering sequence, so the code itself signals which segment a record belongs to before anyone reads the destination column.',
            },
            {
              title: 'Live “Next code preview” on every row',
              body:
                'Each row shows exactly what code the next itinerary in that category will receive — AH26-DOM-FIT-439, AH26-DOM-SCH-010, AH26-INTL-FIT-148. An admin doesn’t guess what the system will issue next; they see the precise string before confirming. There is no ambiguity between the current count and the next issued code.',
            },
            {
              title: 'Editable counter field with Set button',
              body:
                'Any counter can be manually overridden and set to a specific number. If the team created 15 FIT itineraries outside the system during a migration period, an admin sets the counter to 455 and the next code picks up from there — no duplicate codes, no gap in the sequence, no data entry to backfill.',
            },
            {
              title: 'Zero-padded sequence numbers — 010, 001, 067',
              body:
                'All sequence numbers are zero-padded to three digits. AH26-DOM-SCH-010 sorts correctly above AH26-DOM-SCH-009 in any alphabetical sort — in spreadsheets, file names, or the table itself. Without padding, “10” sorts before “9” in string-based systems, breaking the visual order of records.',
            },
          ],
        },
        {
          id: 'create-classify',
          image: '/screenshots/ah-itinerary/create-classify.png',
          title: 'Create New Itinerary',
          caption: 'The classification gate that locks in a correct code before the wizard even opens.',
          fitWidth: true,
          features: [
            {
              title: 'Classification-first modal before the form opens',
              body:
                'The itinerary code is determined before a single field is filled. A consultant can’t accidentally reach Step 1 of the form without committing to a region and group type — which means the code is never wrong, never edited after the fact, and never manually typed. The classification decision gates everything that follows.',
            },
            {
              title: 'Two-step flow shown in the CTA label — “Next: Select Consultant”',
              body:
                'The button tells the consultant what comes next before they click it. There is no mystery about what confirming this screen leads to — the next decision is named on the button itself. A consultant new to the system understands the full creation sequence from the first screen without needing a walkthrough.',
            },
            {
              title: 'Trip Region as a binary choice — Domestic · International',
              body:
                'Region is presented as exactly two options with no ambiguity. There is no text field, no dropdown, no free entry. A consultant cannot create a domestic itinerary with a typo in the region or accidentally leave it blank — the structure of the UI makes the wrong choice impossible, not just unlikely.',
            },
            {
              title: 'Six Group Type buttons in a 2-column grid',
              body:
                'All six segment options are visible simultaneously without scrolling or opening a dropdown. A consultant sees the full menu of choices in one glance — Friends & Family, School, College, Corporate, Couple, Group Departure — and selects one with a single click. No option is hidden behind an interaction.',
            },
            {
              title: 'Code preview field — “Select region & group type above”',
              body:
                'The preview field exists in an empty state before any selection is made, with instructional placeholder text. This communicates to the consultant that the code will appear here as they make selections — the field is not decorative. The empty state is an active prompt, not silence.',
            },
            {
              title: 'Live code generation on selection',
              body:
                'Once both region and group type are selected, the preview field shows the exact code that will be issued — before the consultant clicks Next. They see AH26-DOM-CLG-198 or AH26-INTL-FIT-148 before committing. If they selected the wrong group type, they correct it here rather than discovering the error after the itinerary is saved.',
            },
            {
              title: 'Disabled Next button until both fields are selected',
              body:
                'The button is visually muted and non-functional until Region and Group Type are both chosen. A consultant cannot skip the classification step and proceed with an incomplete code — the system enforces completeness at the entry point rather than validating at the end.',
            },
          ],
        },
        {
          id: 'studio-step1-summary',
          image: '/screenshots/ah-itinerary/studio-step1-summary.png',
          title: 'Studio — Step 1: Summary',
          caption: 'The first wizard step: consultant, dates, trip details, and flexible multi-slot pricing.',
          fitWidth: true,
          scrollable: true,
          features: [
            {
              title: 'Consultant name as a dropdown with phone auto-fill',
              body:
                'Selecting Mr. Kishore Ravi from the dropdown immediately populates +91 7010933178 in the number field. A consultant doesn’t type their own phone number into every itinerary they create — the system pulls it from the consultant record. The number on the client-facing PDF is always the right one, and always formatted correctly.',
            },
            {
              title: 'Quotation date and travel date as separate fields',
              body:
                'The date the itinerary was quoted — June 22nd, 2026 — is stored separately from the travel date of July 24th, 2026. When a client asks “when did you send this?”, the answer is in the record. The quotation date also governs the 48-hour validity clause in the terms, so the system captures it as a distinct operational field rather than approximating it from the creation timestamp.',
            },
            {
              title: 'Destination as a free-text field — “Vagamon - Alleppey”',
              body:
                'Multi-destination trips are entered as a single readable string rather than forced into a structured multi-field input. A consultant handling a tour that moves through Vagamon, then Alleppey, types it naturally — the output on the client PDF reads exactly as entered, preserving the route sequence without any reformatting.',
            },
            {
              title: 'Duration as a free-text shorthand — “2N3D”',
              body:
                'Duration isn’t calculated from dates — it’s entered as the consultant intends it to read. 2N3D is the shorthand the team and clients both understand. There is no forced conversion to “2 nights, 3 days” or “72 hours” — what the consultant types is what the client receives, exactly as the industry communicates it.',
            },
            {
              title: 'Transport details as a free-text field — “25 Seater - 33 Seater AC”',
              body:
                'Vehicle specification is entered in the format the team already uses — a range of seat counts with AC notation. A group of 25–30 pax might need one vehicle or two depending on availability; the field captures that operational nuance directly. The client sees the exact vehicle spec on the itinerary without interpretation or truncation.',
            },
            {
              title: 'Group size expressed as a range — “25 - 30”',
              body:
                'Pax count accepts a range rather than requiring a single confirmed number. For groups that are still finalising headcount at the quotation stage — common for school and college trips — the consultant documents the realistic range rather than guessing or leaving the field vague. The costing note below then contextualises why the price may change if group size shifts.',
            },
            {
              title: 'Multiple pricing slots — ₹6300 · ₹7100 · ₹6800 Per Pax',
              body:
                'A single itinerary can carry multiple pricing tiers simultaneously. A Group Departure itinerary like this one — GD-066 — may be priced differently based on room type, vehicle, or inclusions. All three slots appear on the client PDF in a structured table, so the client compares options without a back-and-forth over WhatsApp asking “what’s the price for the AC vehicle?”',
            },
            {
              title: 'Per Pax unit selector on each pricing slot independently',
              body:
                'Each slot has its own unit — Per Pax, Per Room, Total Package — controlled independently. A consultant can quote one price per person and a separate flat total for a specific component in the same itinerary, without creating separate documents or manually formatting a price table outside the system.',
            },
            {
              title: 'Costing note with a pre-filled conditional disclaimer',
              body:
                'The note — “This price is based on the above travel date and group size. If the travel date or group size changes, the package cost may also change” — is pre-filled and editable. Every client receives the validity clause without the consultant remembering to add it. It appears on the PDF directly below the pricing table, where a client will read it immediately after seeing the numbers.',
            },
            {
              title: 'Confirm & Save in sticky footer — always reachable',
              body:
                'The save action stays fixed at the bottom of the viewport regardless of scroll depth. A consultant who has filled four sections of Step 1 and is at the bottom of the costing section doesn’t scroll back to the top to save — the button is always one click away from wherever they are on the page.',
            },
          ],
        },
        {
          id: 'studio-step2-itinerary',
          image: '/screenshots/ah-itinerary/studio-step2-itinerary.png',
          title: 'Studio — Step 2: Day Plans',
          caption: 'The day-by-day builder: keyword auto-fill, auto-dated days, and a flexible Day 0.',
          fitWidth: true,
          scrollable: true,
          features: [
            {
              title: 'Day 0 as a toggleable pre-trip day — “Add Day 0 for pre-trip or arrival details”',
              body:
                'Day 0 exists outside the numbered day sequence specifically for departure or overnight transit. The Vagamon trip departs from Bhavani on the night of July 23rd and arrives on the 24th — that leg doesn’t belong to Day 1 and isn’t a full itinerary day. Day 0 captures it without distorting the day count the client sees on the rest of the itinerary.',
            },
            {
              title: 'Disable button on Day 0',
              body:
                'Day 0 can be switched off without deleting its content. A consultant who filled departure details but then decided the client doesn’t need a pre-trip page can disable it — the data stays in the record in case it’s needed again. Re-enabling restores everything without retyping.',
            },
            {
              title: 'Keyword search per day — “e.g. Ootylday”',
              body:
                'Each day has its own independent keyword lookup into the template library. Day 1 could pull from “Vagamon Jeep Safari” while Day 3 pulls from “Alleppey Backwater Boating” — different templates for different days within the same itinerary. The lookup is per-day, not per-itinerary, so each day gets exactly the content that belongs to it.',
            },
            {
              title: 'Day title as an editable field — “Vagamon Jeep Safari Sightseeings”',
              body:
                'The title pulled from a keyword template is freely editable after selection. If the keyword “VagamonJeepDay” loads a standard title, but this particular trip includes a resort visit that the standard template doesn’t mention, the consultant edits the title to reflect it — without changing the template in the library for every other itinerary.',
            },
            {
              title: 'Specific date auto-calculated per day — 23 · 24 · 25 · 26 July',
              body:
                'Each day’s date is calculated automatically from the travel date entered in Step 1. Day 0 is July 23rd, Day 1 is the 24th, Day 2 the 25th, Day 3 the 26th — no manual date entry per day. If the travel date in Step 1 changes, every day date recalculates immediately. A consultant never manually counts calendar days or types four separate dates.',
            },
            {
              title: 'Activities as a multi-line free text field',
              body:
                'Activities are entered as a line-separated list rather than individual input fields. A consultant types each activity on its own line — “Arrival and Transfer towards Hotel”, “Check-in at Hotel for Refreshment”, “Breakfast”, “Proceed to Sightseeing” — and every line becomes a discrete bullet on the client PDF. There is no limit to how detailed a day can be, and no UI overhead per activity item.',
            },
            {
              title: 'Inline notes visible in the activities — weather-dependent caveats written in place',
              body:
                'Conditional notes and caveats are written directly into the activity text rather than in a separate field. The weather disclaimer for lake boating sits exactly where the client will read it — after “lake boating” — not at the bottom of the itinerary in a general notes section where it might be missed.',
            },
            {
              title: 'Enable Notes checkbox per day',
              body:
                'Each day has an opt-in notes section that is off by default. A consultant only enables it on days that genuinely need notes — Day 2 with its weather-dependent activity, for example — without adding a blank or irrelevant notes block to every other day. The client PDF stays clean on days where notes aren’t needed.',
            },
            {
              title: 'Numbered day badges — 0 · 1 · 2 · 3',
              body:
                'Dark numbered circles make the day sequence immediately scannable while scrolling through a long itinerary. A consultant reviewing a 6-day Rajasthan itinerary can locate Day 4 without counting cards — the badge is the anchor. The visual hierarchy separates day identity from day content.',
            },
            {
              title: 'Delete button per day — red trash icon top right',
              body:
                'Any day can be removed individually without affecting the others. If a consultant realises Day 3 — Alleppey Sightseeing — was added by mistake and the trip is actually only 2 nights, deleting Day 3 removes only that card. The remaining days and their dates are unaffected.',
            },
            {
              title: '+ Add day at the bottom',
              body:
                'New days are appended to the end of the sequence in one click. The new card is blank — keyword, title, date, and activities all empty — and picks up the next date in the sequence automatically. A consultant extending a 3-day trip to 4 days adds one card, fills the new day’s content, and saves. No date arithmetic, no renumbering.',
            },
          ],
        },
        {
          id: 'studio-step3-details',
          image: '/screenshots/ah-itinerary/studio-step3-details.png',
          title: 'Studio — Step 3: Details',
          caption: 'Notes, inclusions, and exclusions — opt-in defaults and colour-coded sections.',
          fitWidth: true,
          scrollable: true,
          features: [
            {
              title: 'Notes as an opt-in section — Enable Notes checkbox',
              body:
                'Notes are off by default and switched on only when needed. A couple’s itinerary for a simple 2-night Goa trip doesn’t need hotel check-in policy notes — enabling the section only for itineraries where operational context genuinely matters keeps the client PDF clean and uncluttered for straightforward trips.',
            },
            {
              title: 'Pre-filled default notes on enable',
              body:
                'When the checkbox is turned on, five operational notes populate automatically — check-in and check-out times, room availability caveat, early morning check-in rule, weather disclaimer, and extra services clause. A consultant doesn’t write these from memory or copy-paste them from a previous itinerary — they appear the moment Notes is enabled, ready to edit or use as-is.',
            },
            {
              title: 'Inclusions with icon and green ✓ header',
              body:
                'The green checkmark visually separates what is covered from what isn’t before a word is read. On the client PDF, a client scanning quickly identifies the inclusions block by its visual marker — not by reading the heading — which matches how people actually read quotation documents.',
            },
            {
              title: 'Exclusions with icon and red ✗ header',
              body:
                'The red cross creates an immediate visual distinction from inclusions without requiring the client to read both section headings to understand which is which. On a printed or WhatsApp-forwarded PDF, the colour coding survives — a client sharing the itinerary with family members who haven’t read it fully can identify the exclusions block at a glance.',
            },
          ],
        },
        {
          id: 'studio-step4-policies',
          image: '/screenshots/ah-itinerary/studio-step4-policies.png',
          title: 'Studio — Step 4: Policies',
          caption: 'Terms and cancellation policy pre-filled by default, edited only when a trip needs custom terms.',
          fitWidth: true,
          scrollable: true,
          features: [
            {
              title: 'Terms & Conditions pre-filled across all 17 clauses',
              body:
                'A consultant opening Step 4 on a brand new itinerary finds a complete, legally considered T&C document already in place. The 50% advance clause, the 48-hour price validity, the payment channel security notice — none of these are written from memory or copied from a previous itinerary. Every itinerary leaves the system with a full T&C attached, not a blank field that someone forgot to fill.',
            },
          ],
        },
        {
          id: 'preview',
          image: '/screenshots/ah-itinerary/preview.png',
          title: 'Preview',
          caption: 'The branded, client-facing document — the final quality gate before delivery.',
          fitWidth: true,
          scrollable: true,
          download: {
            href: '/downloads/ah-itinerary-sample.pdf',
            label: 'Download sample PDF',
            filename: 'AH26-DOM-GD-066 - Mr.Rajan - Vagamon - Alleppey - 2N3D - 25 - 30Pax.pdf',
          },
          features: [
            {
              title: 'Download PDF — primary action, always visible in header',
              body:
                'The download button stays fixed regardless of scroll position through the full preview. A consultant who has scrolled through all four sections of the itinerary — cover, overview, day plans, policies — downloads in one click from wherever they are. They don’t scroll back to the top to find the action after reviewing the complete document.',
            },
            {
              title: 'The preview as the final quality gate before client delivery',
              body:
                'The preview screen exists as the last step a consultant takes before sending. Seeing the document rendered exactly as the client will receive it — logo, cover, name, all four steps composed — is a different check than reviewing form fields in the studio. Errors that are invisible in a textarea become obvious when the content is typeset in the final layout. The preview catches what the form doesn’t.',
            },
          ],
        },
      ],
    },
  },
  results: {
    intro:
      'Deployed across the 4-consultant team, the studio turned itinerary creation from a time sink into a competitive advantage — every metric the research had flagged moved decisively in the right direction.',
    metrics: [],
    resultCards: [
      { n: '01', category: 'Creation time — new itinerary', desc: 'Average time to produce one complete itinerary from a blank screen to a branded, client-ready PDF', before: '45 min', after: '12 min', direction: 'down', beforeBar: 100, afterBar: 27, delta: '73%' },
      { n: '02', category: 'Creation time — duplicate', desc: 'Time to produce a new itinerary by duplicating and adapting a past quotation rather than starting from scratch', before: '45 min', after: '5 min', direction: 'down', beforeBar: 100, afterBar: 11, delta: '89%' },
      { n: '03', category: 'Day-plan content reuse', desc: 'Share of day-by-day itinerary content reused from saved keyword templates instead of re-typed from memory', before: '0%', after: '80%', direction: 'up', beforeBar: 1, afterBar: 100, delta: '80 pts' },
      { n: '04', category: 'Itinerary code collisions', desc: 'Rate at which two itineraries were assigned the same reference code due to manual, per-consultant numbering', before: '~15%', after: '0%', direction: 'down', beforeBar: 100, afterBar: 2, delta: '100%' },
      { n: '05', category: 'PDF export success rate', desc: 'Share of itineraries that export to a final branded PDF on the first attempt — the manual Word export previously failed on long documents', before: 'Unreliable', after: '100%', direction: 'up', beforeBar: 15, afterBar: 100, delta: '100%' },
      { n: '06', category: 'Finding a past itinerary', desc: 'Time to locate any past quotation — previously a manual scroll through personal Drive folders, now an in-memory index across 50,000+ records', before: '~10 min', after: '<5 ms', direction: 'down', beforeBar: 100, afterBar: 1, delta: 'Instant' },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
 * AH-WEBSITE
 * ═══════════════════════════════════════════════════════════════════════════ */

const AH_WEBSITE: CaseStudy = {
  overview: {
    facts: [],
    glance: [],
    stats: [],
    projectHero: {
      tagline: 'A browsing-first, WhatsApp-native marketing and booking website for a travel agency — paired with a self-service back office so the agency\'s own staff, not a developer, own packages, pricing, photos, and reviews.',
      problem: 'A decade-old travel agency with a strong offline reputation — 25,000+ travelers served, corporate clients including leading IT companies and top academic institutions — had no real digital front door. Beyond an Instagram page, the business had no website at all: nothing to be found on search, nothing to browse on mobile, and no way for a prospective customer to start an enquiry without already knowing the office phone number.',
    },
    metaCards: [
      { icon: 'Briefcase', label: 'Role', value: 'Full-Stack Web Design & Development', sub: 'IA · UI · frontend build · admin back office · SEO' },
      { icon: 'Users', label: 'Team', value: 'Solo', sub: 'Working directly with agency leadership' },
      { icon: 'Clock', label: 'Timeline', value: 'Design to Launch — 4 months', sub: 'Plus ongoing iteration' },
      { icon: 'Monitor', label: 'Platform', value: 'Web Application', sub: 'Responsive + self-service admin back office' },
    ],
    outcome: {
      period: 'Measured post-launch',
      items: [
        { n: 'New channel', label: 'Website-sourced leads',    sub: '0 → 4–5 / month'     },
        { n: 'New channel', label: 'Contact form completions', sub: '0 → ~15 / month'     },
        { n: '↓ ~99.7%',    label: 'Package/price publish time', sub: '2–3 days → ~10 min' },
      ],
    },
  },
  qualitative: {
    intro:
      'With no prior website and therefore no existing analytics, research started with the people who actually generate and receive enquiries: agency staff, interviewed about the calls and WhatsApp messages they field every day. Three primary personas represent the most common visit intents a new website would need to serve.',
    personas: [
      {
        name: 'Ramesh K.', role: 'Corporate HR Coordinator', age: 36, color: '#1d4ed8', badge: 'Primary',
        empathy: {
          says: ['"Do you have experience with 200+ person groups?"', '"Just send me a quote on WhatsApp."', '"Who else have you worked with?"'],
          thinks: ['"If this looks like a two-person operation, I\'m out."', '"I don\'t have time to call five agencies before dinner."', '"Corporate clients on the wall means less risk for me."'],
          does: ['Opens 3–4 agency tabs at once and scans for logos and scale', 'Skips contact forms in favour of a direct WhatsApp message', 'Closes the tab within seconds if there\'s no visible proof of capacity'],
          feels: ['Impatient — evaluating on a strict clock', 'Skeptical by default until proof appears', 'Relieved when credibility signals show up early'],
        },
        bio: 'Books annual offsites and team outings for a 200+ person company. Compares 3–4 vendors before shortlisting, usually outside office hours.',
        goals: ['Quickly gauge credibility — past corporate clients, group-size capacity', 'Get a WhatsApp quote without filling a long form', 'See proof of scale — fleet size, group-handling experience'],
        frustrations: ['No client logos or case-proof anywhere online', 'No way to specify group size or dates before contacting the agency', 'Had to call during business hours just to get basic information'],
        quote: '"I need to shortlist five agencies in one evening. If I can\'t find proof you\'ve handled a 200-person group before, I move to the next tab."',
      },
      {
        name: 'Divya & Arjun', role: 'Newlywed Couple', age: 28, color: '#7c3aed', badge: 'Primary',
        empathy: {
          says: ['"Let\'s just scroll through a few options first."', '"Are these real photos or stock images?"', '"I don\'t want to call anyone yet."'],
          thinks: ['"If I have to call to see anything, I\'ll just look elsewhere."', '"This should feel like window shopping, not paperwork."', '"We\'ll message when we\'re actually ready."'],
          does: ['Browses late evening on mobile, alongside other agencies\' Instagram pages', 'Scrolls for inspiration before narrowing to a shortlist', 'Waits to initiate contact until they\'ve already half-decided'],
          feels: ['Excited but easily distracted — one bad first impression loses them', 'Reluctant to commit to a phone call this early', 'Reassured by real trip photography over polished stock imagery'],
        },
        bio: 'Planning an international honeymoon. Browse primarily on mobile, late evening, comparing destinations before committing to one agency.',
        goals: ['Browse destinations visually before deciding', 'Filter by budget or region without calling anyone', 'See real trip photos, not stock images'],
        frustrations: ['No way to browse online at all — information only available by asking directly', 'No visual proof of past trips', 'Unclear how to take the first step toward booking'],
        quote: '"We don\'t want to call five agencies just to compare options. We want to scroll, get inspired, and message when we\'re ready."',
      },
      {
        name: 'Suresh P.', role: 'Retired Bank Manager', age: 58, color: '#0f766e', badge: 'Primary',
        empathy: {
          says: ['"Is this a real, established agency?"', '"Show me packages for our state."', '"Just give me a number to call."'],
          thinks: ['"My son found this on Instagram — but is it trustworthy?"', '"I don\'t want to hunt through menus to find what I need."', '"I\'d rather talk to a person than fill in a form."'],
          does: ['Asks a younger family member to look the agency up online first', 'Looks for years-in-business and traveler counts before anything else', 'Defaults to calling the moment browsing gets confusing'],
          feels: ['Cautious about unfamiliar businesses found on social media', 'Frustrated by any friction that isn\'t a straightforward phone call', 'Reassured by plain, visible proof of scale and history'],
        },
        bio: 'Books domestic group pilgrimage and leisure tours for extended family. Prefers phone or WhatsApp over forms; low tolerance for slow or confusing experiences.',
        goals: ['Find domestic packages by region or state easily', 'Confirm the agency is established and trustworthy', 'Reach a human quickly once interested'],
        frustrations: ['No independent way to verify the agency\'s scale or trustworthiness online', 'No regional or state-wise browsing available anywhere', 'Family members had to rely on word of mouth to find the agency at all'],
        quote: '"My son found the agency on Instagram, but there was nothing to actually show me — no packages, no photos of real trips. We just called instead."',
      },
    ],
  },
  quantitative: {
    intro:
      'With no website to measure, I ran a pre-development survey across past customers, corporate buyers and agency staff (n = 16). Ten questions mapped how people find and compare agencies, what stops them trusting or contacting one, and which features they wanted most — alongside a zero-based audit of every channel the new site would need to create.',
    report: {
      subtitle: 'Pre-development survey · Jan 2026 · n = 16 respondents',
      meta: [
        { label: 'Method', value: 'Online survey', sub: 'Google Forms' },
        { label: 'Timing', value: 'Pre-development', sub: 'Jan 2026' },
        { label: 'Sample', value: 'n = 16', sub: 'Customers, corporate buyers & agency staff' },
        { label: 'Format', value: '10 questions', sub: 'Likert · multi-select · multiple choice' },
      ],
      rolesTitle: 'Participant roles',
      roles: [
        { label: 'Past Leisure Customer', count: 7, color: '#3b82f6' },
        { label: 'Corporate Travel Coordinator', count: 4, color: '#7c3aed' },
        { label: 'Agency Staff', count: 4, color: '#f59e0b' },
        { label: 'Prospective Traveller', count: 1, color: '#0f766e' },
      ],
      questions: [
        {
          n: 'Q1', group: 'Current state', type: 'Multiple choice', color: '#1d4ed8', max: 6,
          question: 'How did you first find or hear about the agency?',
          note: 'n = 16 respondents',
          bars: [
            { label: 'Instagram', value: 6 },
            { label: 'Word of mouth', value: 5 },
            { label: 'Phone referral', value: 3 },
            { label: 'Google search', value: 1 },
            { label: 'Corporate vendor list', value: 1 },
          ],
          insight: { metric: '31%', label: 'of the 16 found the agency through Instagram', text: 'Instagram and word of mouth account for 69% of discovery. Google search accounted for a single respondent — with no website, the agency was invisible to anyone not already in its circle.' },
        },
        {
          n: 'Q2', group: 'Current state', type: 'Checkboxes', color: '#b45309', unit: '%', max: 100,
          question: 'How do you usually compare travel agencies before booking?',
          note: '% of 16 respondents · multiple selections allowed',
          bars: [
            { label: 'Browse their Instagram page', value: 88 },
            { label: 'Google search + agency websites', value: 75 },
            { label: 'Ask friends / family', value: 69 },
            { label: 'Call or WhatsApp for a quote', value: 56 },
            { label: 'Read online reviews', value: 50 },
          ],
          insight: { metric: '75%', label: 'compare agencies by searching Google and visiting their sites', text: 'Three in four respondents expect to evaluate an agency on its website before ever making contact. An agency with no site is simply dropped from the shortlist.' },
        },
        {
          n: 'Q3', group: 'Current state', type: 'Multiple choice', color: '#7c3aed', max: 12,
          question: 'Which device do you mainly use when researching a trip?',
          note: 'n = 16 respondents',
          bars: [
            { label: 'Mobile phone', value: 11 },
            { label: 'Desktop / laptop', value: 4 },
            { label: 'Both equally', value: 1 },
          ],
          insight: { metric: '69%', label: 'research trips primarily on a mobile phone', text: 'Mobile is the default research device, mostly late evening. The site had to be designed mobile-first, with fast load times and thumb-friendly navigation.' },
        },
        {
          n: 'Q4', group: 'Failure points', type: 'Likert · satisfaction', color: '#dc2626', max: 7,
          question: 'How easy is it today to find packages, prices and photos for the agency online?',
          note: 'n = 16 · scale: 1 = very difficult, 5 = very easy · avg 2.1',
          bars: [
            { label: 'Very difficult (1)', value: 6 },
            { label: 'Difficult (2)', value: 5 },
            { label: 'Neutral (3)', value: 3 },
            { label: 'Easy (4)', value: 2 },
            { label: 'Very easy (5)', value: 0 },
          ],
          insight: { metric: '2.1 / 5', label: 'average ease of finding information online', text: 'Not one respondent found it very easy. 69% rated it difficult or very difficult — the only information source was the Instagram feed, with no structured packages or pricing.' },
        },
        {
          n: 'Q5', group: 'Failure points', type: 'Multiple choice', color: '#dc2626', max: 4,
          question: 'How long does a package or price change take to reach customers today?',
          note: 'n = 4 agency staff · developer-dependent',
          bars: [
            { label: 'Same day', value: 0 },
            { label: '1 – 2 days', value: 0 },
            { label: '2 – 3 days', value: 3 },
            { label: '4 days or more', value: 1 },
            { label: 'Not sure', value: 0 },
          ],
          insight: { metric: '100%', label: 'of staff wait 2+ days for a content change to go live', text: 'Every staff member depends on a developer for edits, so offers go stale before they are published. This validated building a self-service back office alongside the public site.' },
        },
        {
          n: 'Q6', group: 'Cost of inaction', type: 'Multiple choice', color: '#b45309', max: 8,
          question: 'If you enquire and do not hear back, how long do you wait before moving on?',
          note: 'n = 16 respondents',
          bars: [
            { label: 'Within 1 hour', value: 5 },
            { label: 'Same day', value: 7 },
            { label: 'Next day', value: 3 },
            { label: 'Longer than a day', value: 1 },
          ],
          insight: { metric: '75%', label: 'will move on if not answered within the same day', text: 'Enquiry speed decides who wins the booking. Routing straight into WhatsApp gets the agency into the conversation within the window customers actually allow.' },
        },
        {
          n: 'Q7', group: 'Cost of inaction', type: 'Checkboxes', color: '#dc2626', unit: '%', max: 100,
          question: 'What would make you trust a travel agency you found online?',
          note: '% of 16 respondents · multiple selections allowed',
          bars: [
            { label: 'Real trip photos, not stock', value: 88 },
            { label: 'Past corporate clients / logos', value: 75 },
            { label: 'Years in business & travellers served', value: 69 },
            { label: 'Genuine customer reviews', value: 63 },
            { label: 'Clearly visible contact details', value: 56 },
            { label: 'Certifications & affiliations', value: 31 },
          ],
          insight: { metric: '88%', label: 'want to see real trip photos before trusting an agency', text: 'Proof beats polish: real photography, client logos and scale figures (25,000+ travellers, 10+ years) are the top trust signals — all assets the agency already owned but had nowhere to show.' },
        },
        {
          n: 'Q8', group: 'Solution direction', type: 'Multiple choice', color: '#7c3aed', max: 10,
          question: 'How would you prefer to make first contact with an agency?',
          note: 'n = 16 respondents',
          bars: [
            { label: 'WhatsApp message', value: 10 },
            { label: 'Phone call', value: 4 },
            { label: 'Contact form', value: 1 },
            { label: 'Email', value: 1 },
          ],
          insight: { metric: '63%', label: 'prefer WhatsApp as the first point of contact', text: 'Only one respondent chose a contact form. WhatsApp deep-links on every call-to-action became the primary conversion path, with the form as a backup.' },
        },
        {
          n: 'Q9', group: 'Solution direction', type: 'Checkboxes', color: '#0f766e', unit: '%', max: 100,
          question: 'How would you want to browse packages on a travel website?',
          note: '% of 16 respondents · multiple selections allowed',
          bars: [
            { label: 'By region or state', value: 75 },
            { label: 'By budget', value: 69 },
            { label: 'By group type (family, corporate, couple)', value: 56 },
            { label: 'By trip duration', value: 50 },
            { label: 'By season', value: 31 },
          ],
          insight: { metric: '75%', label: 'want to browse packages by region or state', text: 'Region-first browsing with budget and group-type filters shaped the information architecture — letting visitors self-serve without calling anyone.' },
        },
        {
          n: 'Q10', group: 'Solution direction', type: 'Checkboxes', color: '#0f766e', unit: '%', max: 100,
          question: 'Which features would be most valuable on the agency website?',
          note: '% of 16 respondents · multiple selections allowed',
          bars: [
            { label: 'One-tap WhatsApp enquiry', value: 94 },
            { label: 'Region-wise package pages', value: 81 },
            { label: 'Real photo galleries', value: 75 },
            { label: 'Customer reviews & testimonials', value: 69 },
            { label: 'Corporate / group-trip page', value: 56 },
            { label: 'Staff self-service content editing', value: 25 },
          ],
          insight: { metric: '94%', label: 'ranked one-tap WhatsApp enquiry as most valuable', text: 'WhatsApp enquiry (94%), region-wise packages (81%) and real galleries (75%) are the top three asks — and the core of the launch scope. Self-service editing scored lowest overall but was unanimous among the 4 staff respondents.' },
        },
      ],
    },
    surveys: [],
    stats: [
      { value: '0',        label: 'Website-sourced leads / month',              color: '#dc2626' },
      { value: '0',        label: 'Contact form completions / month — no form existed', color: '#dc2626' },
      { value: '2–3 days', label: 'Time to publish a package or price change, developer-dependent', color: '#b45309' },
      { value: 'None',     label: 'Search / discoverability beyond Instagram',  color: '#dc2626' },
      { value: 'None',     label: 'Self-service content control for staff',     color: '#dc2626' },
    ],
  },
  findings: {
    intro:
      'The three personas converged on the same underlying gap: nothing to prove credibility, nothing to browse, and no low-friction way to start a conversation — so the site had to establish trust, enable visual browsing, and route straight into WhatsApp, the channel the agency already closes deals through.',
    bento: [
      { value: '0', label: 'website-sourced leads per month before launch', tone: 'contrast', span: 'banner', size: '2xl', color: '#dc2626', icon: 'ban' },
      { value: '0', label: 'contact form completions — the form did not exist', tone: 'accent', size: 'lg', color: '#00AAFF', icon: 'file-text' },
      { value: '2–3 days', label: 'to publish a package or price change, developer-dependent', tone: 'surface', size: 'lg', color: '#b45309', icon: 'clock' },
      { value: '25,000+', label: 'travelers served with no way to prove it online', tone: 'surface', size: 'lg', color: '#7c3aed', icon: 'users' },
      { value: 'Instagram only', label: 'the entire digital presence before launch', tone: 'contrast', span: 'wide', size: 'lg', color: '#0f172a', icon: 'ban' },
    ],
    items: [
      { title: 'Credibility had to be established before any decision was asked', desc: 'All three personas independently described scanning for proof — client logos, traveler counts, years in business — within seconds of arriving. A site that led with packages before credibility would lose corporate and first-time visitors alike.' },
      { title: 'Browsing had to happen before any contact', desc: 'Divya & Arjun explicitly did not want to call five agencies just to compare options. The funnel needed a browsing-first structure — visual and filterable, not gated behind a form or a phone call.' },
      { title: 'WhatsApp was already the closing channel — the funnel needed to feed it, not compete with it', desc: 'High-intent visitors like Ramesh wanted a quote over WhatsApp without typing a long form. Routing "Book a Package" straight into a pre-filled WhatsApp message removed friction instead of adding a form the agency would still need to build trust around.' },
      { title: 'Regional and state-wise browsing was table stakes for domestic travelers', desc: 'Suresh and his family had no way to browse packages by state anywhere online. A flat destination list would have replicated the same problem in digital form — the IA needed a Region → State drill-down that mirrors how a traveler actually thinks about a trip.' },
      { title: 'The real bottleneck was operational, not just visual', desc: 'Every content update — a new package, a price change, a client photo — went through a developer and took 2–3 days. A site the agency could not update quickly would go stale within weeks of launch, undermining everything the research had validated.' },
    ],
  },
  problemStatement:
    'There was no website that could turn a cold search visitor — or an Instagram follower — into a warm enquiry without a phone call first. The agency needed a site that was discoverable, browsable by destination, credible within the first scroll, and just as importantly, a back office the team could run themselves — without depending on a developer every time a package or price changed.',
  idea: {
    intro:
      'The answer was not a brochure site with a contact form bolted on, but a browsing-first, WhatsApp-native funnel on the front end, paired with a self-service back office on the back end — so the agency\'s own staff, not a developer, would own the day-to-day content: packages, pricing, client photos, and reviews.',
    ia: {
      intro:
        'Every route was scoped to one of the three research personas\' intents — establish credibility, browse without commitment, or convert on the terms the visitor already prefers (WhatsApp, a call, or a form).',
      sitemap: [
        { route: 'Home',                 desc: 'Rotating destination hero carousel, achievements & client-logo strip, package discovery bento grid, testimonials, contact form.', color: '#1d4ed8' },
        { route: 'Packages',             desc: 'International · Domestic · Cruise · Signature Tours tabs, with continent/country and region/state drill-down browsing.', color: '#7c3aed' },
        { route: 'Services',             desc: 'Category-based service breakdown for different traveler types — group tours, corporate retreats, custom itineraries, cruise bookings.', color: '#0f766e' },
        { route: 'About',                desc: 'CEO note, team profiles, and categorized achievement counters — tours organized, customer reach, years of experience.', color: '#b45309' },
        { route: 'Blogs',                desc: 'Destination guides and travel articles, built to rank for long-tail organic search.', color: '#0891b2' },
        { route: 'Album',                desc: 'Real client and trip photography — not stock imagery.', color: '#dc2626' },
        { route: 'Contact',              desc: 'Contact details, office map, and a dedicated, fuller enquiry form for visitors ready to convert.', color: '#65a30d' },
        { route: 'Back Office (Admin)',  desc: 'Package management, photo & review uploads, and a live inbox of every form submission — accessible only to agency staff.', color: '#525252' },
        { route: 'Persistent',           desc: 'WhatsApp deep-link CTAs, Google Translate widget, and scroll-to-top — present across every page.', color: '#1d4ed8' },
      ],
    },
    systemBuild: {
      what:
        'The site pairs a browsing-first, WhatsApp-native front end with a self-service back office. Visitors establish trust in the first scroll, browse packages the way they actually think about a trip — by continent/country or region/state — and convert either through a pre-filled WhatsApp message or a dedicated enquiry form. Behind it, agency staff run packages, pricing, photos, and reviews themselves, with every form submission landing in one inbox instead of scattered across phone, WhatsApp, and email.',
      features: [
        {
          title: 'Home & Hero Carousel',
          desc: 'A rotating carousel cycles through the agency\'s strongest destinations, so every visitor gets a different "why this agency" moment on load. An animated achievements strip — years in business, travelers served, repeat-client rate — sits beneath the fold with real corporate client logos, establishing credibility before any decision is asked of the visitor.',
          impact: 'Answers Ramesh\'s "prove it in one evening" test before he scrolls past the fold.',
          color: '#1d4ed8',
        },
        {
          title: 'Package Discovery as a Browsing Surface',
          desc: 'Packages are presented as large, hoverable image tiles rather than a text list — browsing feels like a travel magazine, not a lead form. "Book a Package" opens WhatsApp with a pre-filled message rather than a form, removing the typing burden from the highest-intent visitors.',
          impact: 'Matches Divya & Arjun\'s stated preference to "scroll, get inspired, and message when ready."',
          color: '#7c3aed',
        },
        {
          title: 'Progressive Drill-Down Browsing',
          desc: 'International, Domestic, Cruise, and "Signature Tours" sit in distinct tabs, with Continent → Country and Region → State drill-down browsing that mirrors how a traveler actually thinks about a trip. Filter and tab state persist across switches, and the active tab syncs to the URL, so a shared link opens straight to the right category.',
          impact: 'Gives Suresh the state-wise browsing he had no way to do anywhere online before launch.',
          color: '#0f766e',
        },
        {
          title: 'Services & About — Credibility Beyond the Homepage',
          desc: 'Services are grouped by traveler type rather than one generic paragraph. A CEO note and named team profiles humanize a page that would otherwise be pure credentials, and categorized achievement counters give three independent angles of proof: tours organized, customer reach, and years of experience.',
          color: '#b45309',
        },
        {
          title: 'Blogs & Album — Organic Reach and Visual Proof',
          desc: 'A blog listing and detail-page engine gives the site content built to rank for long-tail searches that a pure package-listing site could never capture organically. A photo gallery of real past trips and client groups directly answers what Divya & Arjun said they wanted most: real photos, not stock images.',
          color: '#0891b2',
        },
        {
          title: 'Contact — Two Paths for Two Intents',
          desc: 'Phone, email, and a linked office map sit above the form for visitors like Suresh who prefer to call rather than type. A dedicated, fuller contact form variant serves visitors who have already decided to convert and want to leave complete trip details in one submission.',
          color: '#dc2626',
        },
        {
          title: 'Back Office — The Operational Fix',
          desc: 'A self-service back office lets agency staff create and edit packages, upload client trip photos, and publish reviews directly — without any developer involvement or code deployment. Every contact form submission from the live site appears automatically inside the back office, giving the team a single inbox instead of enquiries scattered across phone, WhatsApp, and email.',
          impact: 'The system change behind the biggest operational shift in the project: package and price updates went from a 2–3 day developer-dependent request to a ~10-minute self-service task.',
          color: '#65a30d',
        },
        {
          title: 'Site-Wide Infrastructure',
          desc: 'A post-build prerendering step renders the real homepage markup into the shipped HTML, so search engines that don\'t execute JavaScript see the same content a browser does. Google Tag Manager and Analytics were added at the root so enquiries and form submissions become measurable. A persistent Google Translate widget gives non-English-speaking visitors self-serve language access, and WhatsApp deep-linking runs through every primary call-to-action — feeding the channel the agency already closes deals through.',
          color: '#525252',
        },
      ],
    },
  },
  results: {
    intro:
      'Measured after launch against the pre-launch baseline — a business with no website, no form, no self-service content control, and no presence on search beyond Instagram — every metric moved from zero, or from a multi-day manual process, to a live, self-service channel.',
    metrics: [],
    resultCards: [
      { n: '01', category: 'Website-sourced leads', desc: 'Qualified leads sourced directly through the website per month', before: '0', after: '4–5 /mo', direction: 'up', beforeBar: 1, afterBar: 100, delta: 'New channel' },
      { n: '02', category: 'Contact form completions', desc: 'Completed contact-form submissions per month — a channel that did not exist before launch', before: '0', after: '~15 /mo', direction: 'up', beforeBar: 1, afterBar: 100, delta: 'New channel' },
      { n: '03', category: 'Package / price update turnaround', desc: 'Time to publish a new package or price change, from decision to live on the site', before: '2–3 days', after: '~10 min', direction: 'down', beforeBar: 100, afterBar: 1, delta: '~99.7%' },
      { n: '04', category: 'Digital presence & discoverability', desc: 'Public, indexable presence beyond a single social media page', before: 'Instagram only', after: 'Live, Google-indexed site', direction: 'up', beforeBar: 10, afterBar: 100, delta: 'New capability' },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
 * AH-ACCOUNTS PORTAL
 *
 * Sourced from Accounts-Portal-Case-Study.docx. That document explicitly
 * flags its section-3 KPI targets and section-10 results as "illustrative
 * placeholders for portfolio drafting, not measured data" and its stakeholder
 * quote as a "placeholder... replace with real feedback". Both caveats are
 * carried through below — labels say "(target)" wherever a figure is a goal
 * rather than an observed result, and the one quote is flagged inline.
 * The three personas are role composites built from the document's "Audience
 * segments" and stated goals/frustrations, not individually interviewed and
 * quoted the way the CRM and Itinerary personas were — ages and the two
 * non-MD quotes are synthesized to fit the card format, not sourced.
 * ═══════════════════════════════════════════════════════════════════════════ */

const AH_ACCOUNTS: CaseStudy = {
  overview: {
    facts: [],
    glance: [],
    stats: [],
    projectHero: {
      tagline: 'A GST-ready billing and accounting platform for a travel agency — a Dashboard, a General Ledger, and a Trip-Payments module built end-to-end in about three days, then refined through live use.',
      problem: 'Travel customers rarely pay in one go. They pay a deposit, then instalments, in cash, bank transfer or UPI, against a trip identified by an itinerary code. Doing this by hand meant slow invoicing, inconsistent GST-compliant numbering, calculation errors, and no single view of the books.',
    },
    metaCards: [
      { icon: 'Briefcase', label: 'Role', value: 'Product Owner & Full-Stack', sub: 'Billing workflow · GST rules · data model · build' },
      { icon: 'Users', label: 'Team', value: '2 + stakeholder', sub: 'Me, a second developer, and the MD as signatory' },
      { icon: 'Clock', label: 'Timeline', value: 'Apr 2026 – Present', sub: 'Core build in ~3 days; iterated Apr–Sep 2026' },
      { icon: 'Monitor', label: 'Platform', value: 'Web Application', sub: 'Responsive — checkable from a phone' },
    ],
    techStack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui (Radix)', 'React Router', 'TanStack Query', 'Supabase (Postgres)', '@react-pdf/renderer', 'SheetJS', 'Vercel'],
    tools: ['Lovable', 'Git & GitHub', 'Vercel', 'Supabase Dashboard'],
    outcome: {
      period: 'Target KPIs, defined before build — not yet measured against live data',
      items: [
        { n: '< 3 min', label: 'Invoice time (target)',          sub: 'from ~12 min' },
        { n: '< 2%',    label: 'Correction rate (target)',       sub: 'from ~9%' },
        { n: '< 2 hrs', label: 'Reconciliation time (target)',   sub: 'from ~2 days' },
      ],
    },
  },
  qualitative: {
    intro:
      'This is an internal tool, so research meant working sessions with the people who actually bill customers, not market interviews. I walked through real invoices — a deposit, an instalment, and a final payment on the same trip — with the Managing Director and the accounts team, and reviewed every existing paper and document invoice to capture what a compliant receipt had to contain.',
    methods: [
      { method: 'Working sessions with stakeholders', desc: 'Walked through real invoices — a deposit, an instalment, and a final payment on the same trip — with the Managing Director and accounts staff.' },
      { method: 'Document review', desc: 'Reviewed existing paper and document-based invoices to capture every required element: company header, GSTIN, PAN, bill-to details, line items, GST %, totals, terms and signature.' },
      { method: 'Competitor & alternative analysis', desc: 'Weighed spreadsheets, generic accounting software, and a custom portal against the business\'s actual need for itinerary-linked part-payments and fast, non-accountant entry.' },
      { method: 'Technical audit', desc: 'No previous system existed to audit, so research covered the GST receipt layout, Indian number-grouping and amount-in-words conventions, financial-year invoice numbering, and reliable client-side PDF generation.' },
    ],
    personas: [
      {
        name: 'Kishore', role: 'Managing Director / Owner', age: 45, color: '#b45309', badge: 'Stakeholder',
        empathy: {
          says: ['"Show me revenue, expense and net — right now, not Friday."', '"Is this invoice correct before I sign it?"', '"What has this customer actually paid so far?"'],
          thinks: ['"I shouldn\'t need a spreadsheet to know my own numbers."', '"Every receipt needs to look right — it has my signature on it."', '"If the itinerary code ties it together, I should be able to see it in one place."'],
          does: ['Signs every invoice personally before it reaches the client', 'Checks revenue, expense and net balance from the dashboard directly', 'Raised each new requirement — optional GSTIN, the Previously Received row — from a real bill, not a wish list'],
          feels: ['Reassured once invoice numbering moved into the database', 'Still cautious about who can access financial data', 'Confident the portal now matches how the business actually bills'],
        },
        bio: 'Managing Director of the agency and the stakeholder behind the billing software — he signs every invoice personally and wanted one place to see revenue, expense and net balance without waiting on a manual report.',
        goals: ['See revenue, expense and net balance at a glance', 'Sign off on every invoice confident it is correct', 'Replace manual, spreadsheet-based invoicing with one system of record', 'Reduce billing errors and customer queries about balances'],
        frustrations: ['No single view of the books — figures lived across separate documents and spreadsheets', 'Manual invoicing was slow and inconsistent between staff', 'No way to confirm a customer\'s running balance without manually checking past receipts'],
        quote: '"We used to chase down who had paid what. Now I open the portal, enter the itinerary code and see the whole history on one page."',
      },
      {
        name: 'Accounts Team', role: 'Accounts & Billing Staff', age: 32, color: '#7c3aed', badge: 'Primary',
        empathy: {
          says: ['"Which bills still need correcting?"', '"Export the ledger for the accountant."', '"What\'s this customer\'s outstanding balance?"'],
          thinks: ['"Reconciling by hand shouldn\'t take two days every month."', '"One wrong keystroke and the whole invoice is off."', '"I need the proof of payment attached, not in a separate folder."'],
          does: ['Reconciles the general ledger at month end', 'Enters payments with proof of bank or UPI transfer', 'Looks up a customer\'s full payment history by itinerary code'],
          feels: ['Relieved that numbering errors are now structurally impossible', 'Still cautious during month-end close', 'More confident handing exports to the accountant'],
        },
        bio: 'The team that enters payments, reconciles the ledger, and produces the GST paperwork the accountant and auditors rely on.',
        goals: ['Record a payment with proof of bank or UPI transfer in one short flow', 'Find any customer\'s full payment history by itinerary code', 'Export a date-filtered ledger to Excel for the accountant', 'Raise a compliant invoice in one short flow and download it as a PDF'],
        frustrations: ['Month-end reconciliation took about two days of manual checking', 'Inconsistent numbering meant occasional duplicate or skipped invoice numbers', 'Correcting invoices after the fact was common — an estimated 9% needed a fix'],
        quote: '"Reconciling the month used to mean two days with a calculator and a stack of receipts." — paraphrased from the documented baseline, not a verbatim staff quote.',
      },
      {
        name: 'Sales & Operations Team', role: 'Sales / Operations Staff', age: 27, color: '#0f766e', badge: 'Primary',
        empathy: {
          says: ['"I need this bill out before I hang up."', '"Can I do this from my phone?"', '"What did we already quote for this trip?"'],
          thinks: ['"I\'m not an accountant — this has to be simple."', '"A mistake here looks bad in front of the client."', '"The form should feel like the invoice, not a database."'],
          does: ['Raises a bill directly from a customer call', 'Checks a bill from a phone when away from a desk', 'Fills in customer and trip details while still on the line'],
          feels: ['Under time pressure during the call itself', 'Self-conscious about making a calculation error', 'Reassured when the form mirrors the printed invoice'],
        },
        bio: 'Sales and operations staff raise a bill directly from a customer call, often from a phone, without going through the accounts department first.',
        goals: ['Raise a bill quickly while still on the call with the customer', 'Use the portal from a phone when away from a desk', 'Issue a correct receipt without needing accounting knowledge'],
        frustrations: ['Writing an invoice by hand took around 12 minutes', 'Easy to make a calculation or formatting error under time pressure', 'No shared record of what had already been quoted or received for a trip'],
        quote: '"I need to raise a bill while I\'m still on the phone with the customer, not after." — paraphrased from the documented goal, not a verbatim staff quote.',
      },
    ],
  },
  quantitative: {
    intro:
      'To put numbers behind the working sessions, I ran a pre-development survey with the staff who raise and reconcile bills (n = 9). Ten questions mapped how invoices are created today, where billing breaks down, what errors cost, and which capabilities the team wanted. The KPI targets agreed with the Managing Director follow; they are planning targets, not yet measured against live data.',
    report: {
      subtitle: 'Pre-development survey · Apr 2026 · n = 9 staff',
      meta: [
        { label: 'Method', value: 'Online survey', sub: 'Google Forms' },
        { label: 'Timing', value: 'Pre-development', sub: 'Apr 2026' },
        { label: 'Sample', value: 'n = 9', sub: 'Sales, accounts & management' },
        { label: 'Format', value: '10 questions', sub: 'Likert · multi-select · multiple choice' },
      ],
      rolesTitle: 'Participant roles',
      roles: [
        { label: 'Sales / Operations Staff', count: 5, color: '#3b82f6' },
        { label: 'Accounts & Billing', count: 2, color: '#7c3aed' },
        { label: 'Travel Consultant', count: 1, color: '#f59e0b' },
        { label: 'Managing Director', count: 1, color: '#0f766e' },
      ],
      questions: [
        {
          n: 'Q1', group: 'Current state', type: 'Multiple choice', color: '#1d4ed8', max: 4,
          question: 'How do you create invoices and receipts today?',
          note: 'n = 9 respondents',
          bars: [
            { label: 'MS Word document', value: 4 },
            { label: 'Excel / spreadsheet', value: 2 },
            { label: 'Handwritten receipt book', value: 2 },
            { label: 'Generic accounting software', value: 1 },
            { label: 'Dedicated billing portal', value: 0 },
          ],
          insight: { metric: '67%', label: 'create invoices in Word or Excel', text: 'General-purpose tools with no GST structure or numbering control — each invoice is laid out from scratch. Nobody had a purpose-built billing system.' },
        },
        {
          n: 'Q2', group: 'Current state', type: 'Multiple choice', color: '#b45309', max: 6,
          question: 'How long does it take to produce one complete invoice?',
          note: 'n = 9 respondents',
          bars: [
            { label: 'Under 5 min', value: 0 },
            { label: '5 – 10 min', value: 2 },
            { label: '10 – 15 min', value: 5 },
            { label: '15 – 20 min', value: 2 },
            { label: 'More than 20 min', value: 0 },
          ],
          insight: { metric: '78%', label: 'spend 10+ minutes on a single invoice', text: 'Around 12 minutes per invoice, multiplied across every deposit, instalment and final payment on every trip. This anchored the under-3-minute target.' },
        },
        {
          n: 'Q3', group: 'Current state', type: 'Multiple choice', color: '#7c3aed', max: 4,
          question: 'How do you record part-payments against a trip?',
          note: 'n = 9 respondents',
          bars: [
            { label: 'Notebook / paper ledger', value: 3 },
            { label: 'Excel sheet', value: 3 },
            { label: 'WhatsApp messages & screenshots', value: 2 },
            { label: 'Not recorded in one place', value: 1 },
          ],
          insight: { metric: '100%', label: 'have no single, system-held record of trip payments', text: 'Deposits and instalments live in notebooks, sheets and chat threads. Nobody could pull a customer\'s running balance by itinerary code.' },
        },
        {
          n: 'Q4', group: 'Failure points', type: 'Likert · satisfaction', color: '#dc2626', max: 5,
          question: 'How satisfied are you with the current billing process?',
          note: 'n = 9 · scale: 1 = very dissatisfied, 5 = very satisfied · avg 2.2',
          bars: [
            { label: 'Very dissatisfied (1)', value: 2 },
            { label: 'Dissatisfied (2)', value: 4 },
            { label: 'Neutral (3)', value: 2 },
            { label: 'Satisfied (4)', value: 1 },
            { label: 'Very satisfied (5)', value: 0 },
          ],
          insight: { metric: '2.2 / 5', label: 'average satisfaction with current billing', text: 'Two-thirds scored 2 or lower and none scored 5. The process works only through manual effort — a clear appetite for a better tool.' },
        },
        {
          n: 'Q5', group: 'Failure points', type: 'Checkboxes', color: '#dc2626', unit: '%', max: 100,
          question: 'What are the biggest challenges in your current billing process?',
          note: '% of 9 respondents · multiple selections allowed',
          bars: [
            { label: 'Calculation errors', value: 78 },
            { label: 'No itinerary-linked balance view', value: 78 },
            { label: 'Inconsistent invoice numbering', value: 67 },
            { label: 'Month-end reconciliation takes too long', value: 67 },
            { label: 'GST format mistakes', value: 56 },
            { label: 'Hard to find past invoices', value: 56 },
            { label: 'No proof of payment attached', value: 44 },
            { label: 'Cannot bill from a phone', value: 33 },
          ],
          insight: { metric: '78%', label: 'named calculation errors and missing balance views', text: 'Errors, no itinerary-linked balance and numbering gaps top the list — all structural problems a purpose-built, database-backed portal solves directly.' },
        },
        {
          n: 'Q6', group: 'Cost of inaction', type: 'Likert · frequency', color: '#b45309', max: 6,
          question: 'How often do invoices need correcting after they have been issued?',
          note: 'n = 9 respondents',
          bars: [
            { label: 'Never', value: 0 },
            { label: 'Rarely — a few a year', value: 2 },
            { label: 'Sometimes — a few a month', value: 5 },
            { label: 'Often — weekly', value: 2 },
          ],
          insight: { metric: '100%', label: 'have had to correct an issued invoice — none said never', text: 'Corrections cluster around roughly 9% of invoices. Every one is rework, a reprint and a second signature from the MD.' },
        },
        {
          n: 'Q7', group: 'Cost of inaction', type: 'Multiple choice', color: '#dc2626', max: 5,
          question: 'Has a billing error ever caused a customer query or dispute?',
          note: 'n = 9 respondents',
          bars: [
            { label: 'Yes — multiple times', value: 3 },
            { label: 'Yes — once or twice', value: 4 },
            { label: 'No — never', value: 2 },
          ],
          insight: { metric: '78%', label: 'have had a billing error reach a customer', text: 'Errors do not stay internal: they surface as balance disputes and follow-ups. Auto-calculation and a single payment history remove the manual steps that cause them.' },
        },
        {
          n: 'Q8', group: 'Cost of inaction', type: 'Multiple choice', color: '#b45309', max: 3,
          question: 'How long does month-end reconciliation take?',
          note: 'n = 3 · accounts staff, MD and senior consultant who reconcile',
          bars: [
            { label: 'Under half a day', value: 0 },
            { label: 'About one day', value: 0 },
            { label: 'About two days', value: 2 },
            { label: 'Three days or more', value: 1 },
          ],
          insight: { metric: '100%', label: 'spend two days or more reconciling each month', text: 'The ledger is rebuilt by hand from receipts every month. A date-filtered Excel export straight from the ledger is the target for cutting this under 2 hours.' },
        },
        {
          n: 'Q9', group: 'Solution direction', type: 'Checkboxes', color: '#7c3aed', unit: '%', max: 100,
          question: 'Where do you need to raise or check a bill from?',
          note: '% of 9 respondents · multiple selections allowed',
          bars: [
            { label: 'At my desk', value: 89 },
            { label: 'While on a call with the customer', value: 78 },
            { label: 'From my phone', value: 67 },
            { label: 'While travelling', value: 22 },
          ],
          insight: { metric: '78%', label: 'raise bills while still on the call with the customer', text: 'Billing is a live, mid-call task, often from a phone. The form had to be short, mobile-friendly and mirror the printed invoice.' },
        },
        {
          n: 'Q10', group: 'Solution direction', type: 'Checkboxes', color: '#0f766e', unit: '%', max: 100,
          question: 'Which features would be most valuable in a dedicated billing portal?',
          note: '% of 9 respondents · multiple selections allowed',
          bars: [
            { label: 'Automatic GST invoice numbering', value: 100 },
            { label: 'Payment history by itinerary code', value: 89 },
            { label: 'PDF invoice in our own format', value: 89 },
            { label: 'Date-filtered ledger export to Excel', value: 78 },
            { label: 'Dashboard: revenue, expense, net', value: 78 },
            { label: 'Attach proof of payment', value: 67 },
            { label: 'Role-based access', value: 56 },
          ],
          insight: { metric: '100%', label: 'ranked automatic GST invoice numbering as essential', text: 'Numbering (100%), itinerary-code payment history (89%) and own-format PDFs (89%) are the top three asks — and the three foundations of the portal.' },
        },
      ],
    },
    surveys: [],
    stats: [
      { value: '< 3 min', label: 'Time to produce one invoice (target)',         before: '~12 min',  color: '#1d4ed8' },
      { value: '< 2%',    label: 'Invoices needing correction (target)',         before: '~9%',      color: '#b45309' },
      { value: '< 2 hrs', label: 'Month-end reconciliation (target)',            before: '~2 days',  color: '#dc2626' },
      { value: 'Zero',    label: 'Duplicate / skipped invoice numbers',          before: 'Occasional', color: '#0f766e' },
    ],
    takeaways: [
      'Spreadsheets and Word invoices were familiar and free, but produced errors, no numbering control, and no history.',
      'Generic accounting software gave full GST support but needed heavy setup and had no concept of itinerary-linked part-payments.',
      'A custom portal matched the company\'s own invoice format and let non-accountants enter bills fast — at the cost of needing its own maintenance.',
    ],
  },
  findings: {
    intro:
      'Research converged on four findings that shaped the build — mostly about what generic accounting tools get wrong for a travel business specifically.',
    bento: [
      { value: '0', label: 'duplicate or skipped invoice numbers once numbering moved into the database', note: 'was "occasional" before', tone: 'accent', span: 'banner', size: '2xl', color: '#00AAFF', icon: 'hash' },
      { value: '~9%', label: 'of invoices needed a correction under the manual process', tone: 'contrast', size: 'lg', color: '#dc2626', icon: 'alert-triangle' },
      { value: '~2 days', label: 'spent reconciling the ledger by hand each month', tone: 'surface', size: 'lg', color: '#b45309', icon: 'clock' },
      { value: '~12 min', label: 'to produce one invoice by hand', tone: 'surface', size: 'lg', color: '#7c3aed', icon: 'file-text' },
      { value: '5', label: 'database tables carry the whole billing model', tone: 'surface', span: 'wide', size: 'lg', color: '#0891b2', icon: 'database' },
    ],
    items: [
      { title: 'Payments arrive in pieces, tied to a trip, not an invoice', desc: 'A deposit, an instalment and a final payment all belong to the same itinerary code. Generic accounting software invoices one transaction at a time and has no concept of a running, itinerary-linked balance.' },
      { title: 'Numbering has to be gap-free and statutory', desc: 'Invoice numbers must be sequential within the Indian financial year (April–March) with no duplicates or skips — a requirement spreadsheets and ad-hoc numbering could not guarantee.' },
      { title: 'Old receipts must not change when new payments arrive', desc: 'A receipt downloaded today has to show the balance as it stood on that date, even after later payments come in — which rules out calculating "amount received so far" live from the full history every time.' },
      { title: 'The people entering bills are sales and accounts staff, not accountants', desc: 'The tool had to mirror the company\'s existing printed invoice exactly, so what staff type is what the customer receives, with no accounting training required.' },
    ],
  },
  problemStatement:
    'Travel customers pay in instalments against a single trip, but there was no single system that could issue a correct, sequentially numbered, GST-compliant receipt for each payment while keeping an accurate, always-current view of what a customer had paid and still owed.',
  idea: {
    intro:
      'The answer was a purpose-built portal, not a generic accounting package: one system where every payment — deposit, instalment or final payment — ties back to its trip\'s itinerary code, with the numbering and balance logic handled by the database itself so staff can\'t get it wrong.',
    ia: {
      intro:
        'Five routes carry the whole app, each deliberately flat and reachable from the sidebar in one click — a read-only dashboard, a general ledger split into revenue and expense, and a trip-payments module for bills.',
      sitemap: [
        { route: '/dashboard',              desc: 'Summary cards (revenue, expense, net) and recent transactions — view only.', color: '#1d4ed8' },
        { route: '/general-ledger',         desc: 'Revenue and Expense tabs, search, date filter, and Excel export.', color: '#7c3aed' },
        { route: '/general-ledger/new',     desc: 'Payment entry form with tag, mobile-number validation, and proof upload.', color: '#7c3aed' },
        { route: '/trip-payments',          desc: 'Bills list with filters, summary, and itinerary-linked payment history.', color: '#0f766e' },
        { route: '/trip-payments/new',      desc: 'Bill form with a live invoice preview and PDF download.', color: '#0f766e' },
        { route: '/trip-payments/:id/edit', desc: 'Edit an existing bill — the same form, pre-filled.', color: '#0f766e' },
      ],
      entityChain: ['Itinerary Code', 'Bill', 'Bill Items', 'Ledger Entry', 'Invoice Counter'],
    },
    systemBuild: {
      what:
        'The portal is a single-page app over Supabase: React 18 and TypeScript on the front end, Postgres handling invoice numbering and balance logic through RPC functions, and @react-pdf/renderer producing a PDF that matches the on-screen preview. Core features shipped in about three days and have been refined through five rounds of real-use changes since (18 Apr, 18 May, 19 May and 29 Sep 2026).',
      features: [
        {
          title: 'Two-step bill creation, mirroring the printed invoice',
          desc: 'Staff choose Revenue or Expense, then Tax Receipt (GST) or Payment Voucher (no GST), fill in customer and line items, and watch the balance and status calculate automatically. The on-screen form was built to look like the company\'s existing printed invoice, so what staff type is what the customer receives.',
          impact: 'Sales and operations staff raise a bill without any accounting training, often from a phone, mid-call.',
          color: '#1d4ed8',
        },
        {
          title: 'A gap-free, sequential invoice counter',
          desc: 'A single-row invoice_counter table, updated by a Postgres function, previews the next number with a "peek" and only consumes it on save. Numbers follow the Indian financial-year format — 001 / XX 2026-2027 (company prefix) — rolling over automatically every April.',
          impact: 'No skipped numbers from abandoned drafts, and no duplicates even under concurrent saves — the single largest fix over the manual process.',
          color: '#7c3aed',
        },
        {
          title: 'Snapshotted balances, so old receipts never change',
          desc: 'Every bill stores a snapshot_total_received and snapshot_outstanding_balance, computed only from earlier bills on the same itinerary code. A receipt downloaded today still shows the balance as it stood on that date, even after later payments arrive.',
          impact: 'Re-opened or re-downloaded receipts stay trustworthy for audits and customer disputes.',
          color: '#0f766e',
        },
        {
          title: 'Indian GST formatting, done once, correctly',
          desc: 'Custom formatting functions handle lakh/crore rupee grouping (₹1,25,000) and amount-in-words (Lakh, Crore, "Only"), alongside GSTIN, PAN, and an optional-GSTIN field added after real use showed not every customer has one.',
          impact: 'Invoices read correctly for Indian customers and auditors without manual formatting.',
          color: '#b45309',
        },
        {
          title: 'Itinerary-linked payment history',
          desc: 'Every bill carries an indexed itinerary code that links a customer\'s deposit, instalments and final payment together. Trip-Payments shows the full history for any itinerary code in one view, instead of across scattered documents.',
          impact: 'Answers "what has this customer paid so far?" without reconstructing it from separate receipts.',
          color: '#dc2626',
        },
        {
          title: 'General Ledger and Excel export',
          desc: 'Revenue and Expense sit in separate tabs with search and date filtering. The filtered view exports to Excel in one click, named General-Ledger_{From}_to_{To}.xlsx, ready for the accountant.',
          impact: 'Month-end reconciliation no longer means manually re-assembling figures from the portal.',
          color: '#0891b2',
        },
        {
          title: 'Infrastructure fixes found through real deployment',
          desc: 'A first-day routing bug — the single-page app returning 404 on refresh in production — was found and fixed within hours with Vercel rewrite rules and a root-level build config. Fonts are bundled locally so PDFs render identically everywhere, and an index on itinerary_code keeps payment-history lookups fast as bills accumulate.',
          color: '#525252',
        },
      ],
    },
  },
  results: {
    intro:
      'These are the KPI targets defined with the Managing Director before the build started. The portal has been in use since April 2026, but the time, correction-rate, and reconciliation figures below are planning targets, not yet measured against live data — they should be replaced with real numbers from Supabase and team feedback before this case study is published as a finished result. The one exception is invoice numbering, which is a structural guarantee of the design, not a target.',
    metrics: [],
    resultCards: [
      { n: '01', category: 'Time to produce one invoice (target)', desc: 'Planning target agreed before build — not yet measured against live data.', before: '~12 min', after: '~2.5 min', direction: 'down', beforeBar: 100, afterBar: 21, delta: '79%' },
      { n: '02', category: 'Invoices needing correction (target)', desc: 'Planning target agreed before build — not yet measured against live data.', before: '~9%', after: '~1.5%', direction: 'down', beforeBar: 100, afterBar: 17, delta: '83%' },
      { n: '03', category: 'Month-end reconciliation (target)', desc: 'Planning target agreed before build — not yet measured against live data.', before: '~2 days', after: '~1.5 hrs', direction: 'down', beforeBar: 100, afterBar: 9, delta: '90%' },
      { n: '04', category: 'Duplicate or skipped invoice numbers', desc: 'A structural guarantee from the atomic invoice counter, not a target — this one is real.', before: 'Occasional', after: '0', direction: 'down', beforeBar: 100, afterBar: 0, delta: 'Eliminated' },
      { n: '05', category: 'Customer balance queries per month (target)', desc: 'Planning target agreed before build — not yet measured against live data.', before: '~20', after: '~6', direction: 'down', beforeBar: 100, afterBar: 30, delta: '70%' },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Registry + fallback
 * ═══════════════════════════════════════════════════════════════════════════ */

export const caseStudies: Record<string, CaseStudy> = {
  'ah-crm': AH_CRM,
  'ah-itinerary': AH_ITINERARY,
  'ah-website': AH_WEBSITE,
  'ah-accounts': AH_ACCOUNTS,
}

/**
 * Fallback case study built from the base project fields. Keeps the unified
 * template working for any future project added to data.ts without bespoke
 * case-study content.
 */
export function deriveCaseStudy(project: Project): CaseStudy {
  return {
    overview: {
      facts: [
        { label: 'Project', value: project.name },
        { label: 'Category', value: project.category },
        { label: 'Year', value: project.year },
        { label: 'Duration', value: project.duration },
        { label: 'Tools', value: project.tags.join(' · ') },
      ],
      glanceLabel: 'At a Glance',
      glance: [
        { name: 'workflow', title: project.tagline, body: project.solution, accent: '#3b82f6' },
        { name: 'analytics', title: 'Measured Outcome', body: project.result, accent: '#10b981' },
        { name: 'pipeline', title: 'Systems Approach', body: 'Research-led design grounded in how the work actually happens.', accent: '#8b5cf6' },
      ],
      stats: project.metrics.map((m, i) => ({
        value: `${m.value}${m.suffix}`,
        label: m.label,
        color: ['#3b82f6', '#8b5cf6', '#10b981'][i % 3],
      })),
    },
    qualitative: {
      intro:
        'Research began with the people closest to the problem — interviews and observation to understand the real workflow before proposing anything.',
      methods: [
        { method: 'Stakeholder Interviews', desc: 'Spoke with the people who do the work daily to understand real friction.' },
        { method: 'Workflow Observation', desc: 'Watched the process end to end to see where it actually breaks down.' },
        { method: 'Pain-Point Mapping', desc: 'Plotted recurring problems against the stage and role they affect.' },
      ],
      personas: [],
    },
    quantitative: {
      intro:
        'A short survey turned the qualitative themes into numbers, establishing a baseline to design against.',
      surveys: [
        {
          title: `${project.name} — Workflow Survey`,
          description: 'Circulated to the team to baseline the current process and its pain points.',
          responses: 'Sample responses',
          questions: [
            { q: 'How is this work tracked today?', type: 'choice', options: ['Manually', 'Spreadsheet', 'A dedicated tool', 'It varies'], answer: 0, required: true },
            { q: 'How often does the current process cause friction?', type: 'scale', scale: 5, scaleLabels: ['Rarely', 'Constantly'], answer: 3, required: true },
            { q: 'Where is the most time lost? (select all that apply)', type: 'checkbox', options: ['Manual steps', 'Waiting on others', 'Re-doing work', 'Finding information'], answers: [0, 1] },
          ],
        },
      ],
    },
    findings: {
      items: [
        { title: 'The stated problem was a symptom', desc: 'Research traced the visible complaint back to a structural cause in how information flows.' },
        { title: 'The constraint was systemic, not technical', desc: 'The issue was a lack of structure, not a lack of tools.' },
      ],
    },
    problemStatement: project.problem,
    idea: {
      intro: project.solution,
      ia: {
        intro: 'The structure was designed around how people actually look for and act on information.',
        sitemap: [
          { route: 'Input', desc: 'Where information enters the system', color: '#3b82f6' },
          { route: 'Processing', desc: 'Logic and routing that move it forward', color: '#8b5cf6' },
          { route: 'Output', desc: 'Views and reports that surface it to users', color: '#10b981' },
        ],
      },
      systemBuild: {
        what: project.solution,
        options: [
          { label: 'Minimal path', desc: 'Solves the core constraint with the least complexity.' },
          { label: 'Full path', desc: 'Solves the constraint completely with all touchpoints addressed.', selected: true },
          { label: 'Future path', desc: 'Solves the constraint and is designed to scale.' },
        ],
        features: project.tags.slice(0, 4).map((tag, i) => ({
          title: tag,
          desc: `${tag} in the implemented system.`,
          color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i % 4],
        })),
      },
    },
    results: {
      intro: project.result,
      metrics: project.metrics.map((m, i) => ({
        value: `${m.value}${m.suffix}`,
        label: m.label,
        color: ['#3b82f6', '#8b5cf6', '#10b981'][i % 3],
      })),
    },
  }
}

export function getCaseStudy(project: Project): CaseStudy {
  return caseStudies[project.slug] ?? deriveCaseStudy(project)
}
