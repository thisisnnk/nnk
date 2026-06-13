'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react'
import { projects } from '@/lib/data'
import CountUp from '@/components/ui/CountUp'

function splitMetric(value: string) {
  const num = parseFloat(value)
  const unit = value.replace(/[0-9.\s]/g, '')
  return { num: Number.isNaN(num) ? 0 : num, unit }
}

// ── Full-bleed image placeholder ─────────────────────────
function ImagePlaceholder({ label = 'Image Placeholder', ratio = '21/9' }: { label?: string; ratio?: string }) {
  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio: ratio,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          style={{ color: 'var(--border-strong)', opacity: 0.4 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--text-dim)', opacity: 0.5 }}>{label}</p>
      </div>
    </div>
  )
}

// ── Editorial quote — full-bleed typographic callout ─────
function EditorialQuote({ children, label = 'Key Insight' }: { children: React.ReactNode; label?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.9 }}
      className="w-full py-24"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container-pad">
        <p className="text-xs font-bold uppercase tracking-[0.22em] mb-10" style={{ color: 'var(--accent)' }}>
          {label}
        </p>
        <blockquote
          className="font-display font-semibold italic leading-[1.15] max-w-5xl"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)', color: 'var(--text)' }}
        >
          {children}
        </blockquote>
      </div>
    </motion.div>
  )
}

// ── Section wrapper with ghost number background ──────────
function SectionWrapper({ id, number, title, children }: {
  id: string; number: string; title: string; children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  return (
    <section ref={ref} id={id} className="relative overflow-hidden border-b border-border scroll-mt-24">
      {/* Ghost number watermark */}
      <div
        aria-hidden
        className="absolute top-0 right-0 font-display font-black select-none pointer-events-none leading-none"
        style={{
          fontSize: 'clamp(8rem, 22vw, 18rem)',
          color: 'var(--border)',
          opacity: 0.5,
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
        }}
      >
        {number}
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container-pad relative pt-20 pb-12"
      >
        <span className="block text-xs font-bold uppercase tracking-[0.22em] mb-5" style={{ color: 'var(--accent)' }}>
          {number}
        </span>
        <h2 className="display-md mb-8" style={{ maxWidth: '68%' }}>{title}</h2>
        <div className="h-px" style={{ background: 'linear-gradient(to right, var(--accent), transparent 55%)' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// AH-CRM FULL CASE STUDY
// ─────────────────────────────────────────────────────────

function AHCRMCaseStudy() {
  return (
    <>
      {/* 01 — Project Overview */}
      <SectionWrapper id="overview" number="01" title="Project Overview">
        <div className="container-pad pb-20">
          <div className="mb-14" style={{ border: '1px solid var(--border)' }}>
            {[
              { label: 'Client', value: 'Adventure Holidays, Coimbatore, Tamil Nadu' },
              { label: 'My Role', value: 'Product Analyst & System Designer (end-to-end)' },
              { label: 'Product Type', value: 'B2B Internal Tool — Travel Industry CRM' },
              { label: 'Users', value: '8 distinct roles across sales, operations, finance, and field teams' },
              { label: 'Duration', value: 'Research to deployment — iterative build across 26+ schema migrations' },
              { label: 'Tools', value: 'Figma · FigJam · Notion · VS Code' },
              { label: 'Stack', value: 'React 18 · TypeScript · Supabase · shadcn/ui · TanStack React Query · Cloudflare R2 · Vercel' },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className="flex gap-6 px-6 py-4"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}>
                <span className="text-xs font-bold uppercase tracking-[0.12em] shrink-0 w-28 pt-0.5" style={{ color: 'var(--accent)' }}>{label}</span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
            {[
              { value: '8', label: 'DISTINCT USER ROLES', color: '#3b82f6' },
              { value: '26+', label: 'DATABASE MIGRATIONS', color: '#8b5cf6' },
              { value: '100%', label: 'LEADS WITH AUDIT TRAILS', color: '#10b981' },
            ].map(({ value, label, color }) => (
              <div key={label} className="p-12 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, color, letterSpacing: '-0.03em' }}>
                  {value}
                </p>
                <p className="text-xs font-bold tracking-[0.18em] relative" style={{ color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 02 — The Problem */}
      <SectionWrapper id="problem" number="02" title="The Problem">
        <div className="container-pad pb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }}>
            Industry Context
          </p>
          <p className="text-lg leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            India's travel industry — worth over $75 billion — is dominated by mid-sized agencies that still run
            operations manually. Despite handling bookings worth lakhs per trip and coordinating 4–6 specialised
            teams per booking, most agencies rely on WhatsApp groups, Excel sheets, and verbal handoffs between teams.
          </p>
        </div>

        <ImagePlaceholder label="Current Workflow — Fragmented & Entirely Manual" ratio="21/9" />

        <div className="container-pad py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-14" style={{ background: 'var(--border)' }}>
            {[
              { value: '0%', label: 'LEADS WITH DIGITAL AUDIT TRAIL', color: '#ef4444' },
              { value: '~35%', label: 'CONVERSIONS DISPUTED', color: '#ef4444' },
              { value: '4–6 hrs', label: 'WEEKLY MANUAL REPORT TIME', color: '#ef4444' },
            ].map(({ value, label, color }) => (
              <div key={label} className="p-10 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1, color, letterSpacing: '-0.03em' }}>
                  {value}
                </p>
                <p className="text-xs font-bold tracking-[0.15em] relative" style={{ color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Pain Points Identified
          </p>
          <div className="space-y-2 mb-14">
            {[
              'No lead history — WhatsApp messages disappear; average 3–4 context-loss incidents per week across the sales team',
              'Quotes delivered manually — no version control; ~20% of clients received outdated or wrong quote versions',
              'Itinerary miscommunication — itinerary team worked from WhatsApp summaries, causing ~15% rework',
              'No verification gate before conversion — roughly 35% of client disputes traced to unverified booking details',
              'Financial tracking in Excel — profitability per trip only calculated 10–14 days post-trip completion',
              'Tour guides relied on WhatsApp screenshots — averaging 2–3 information gaps per trip (wrong hotel, missing activity)',
              'Owner had zero real-time visibility — reports compiled manually every Friday, already stale by review time',
              'No role-based access — information not calibrated to actual job functions for any role',
            ].map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-5 px-6 py-4 transition-all duration-200"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  borderLeft: '2px solid var(--border-strong)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--accent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--border-strong)' }}
              >
                <span className="font-display font-black shrink-0 text-sm"
                  style={{ color: 'var(--border-strong)', minWidth: '2rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{point}</span>
              </div>
            ))}
          </div>

          <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-dim)' }}>
              The Design Challenge
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Design a role-based CRM where 8 distinct user types — each with different access needs, workflows,
              and goals — can operate in one unified system without friction, information leakage, or skipped quality gates.
            </p>
          </div>
        </div>

        <EditorialQuote label="Problem Statement">
          There was no single connected system that could take a lead from enquiry to execution with full
          accountability, role-based access, and a real-time audit trail. Every handoff between teams was a
          potential point of failure.
        </EditorialQuote>
      </SectionWrapper>

      {/* 03 — Research & Discovery */}
      <SectionWrapper id="research" number="03" title="Research & Discovery">
        <div className="container-pad pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
            {[
              'Map the complete lifecycle of a travel enquiry — every handoff, every team, every breakdown point',
              'Identify what information each role needs, and critically, what they should NOT see',
              'Understand why existing CRMs (Salesforce, HubSpot, Zoho) fail in the travel industry context',
              'Quantify the operational cost of the current fragmented workflow',
            ].map((goal, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'var(--accent)' }} />
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{goal}</span>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--accent)' }}>
            Research Methods
          </p>
          <div className="mb-14">
            {[
              { method: 'Stakeholder Interviews', desc: 'Conducted in-depth sessions with all 8 team roles — sales, execution, itinerary, accounts, owner, backend, and tour guides' },
              { method: 'Workflow Mapping', desc: 'Mapped the full lead-to-trip lifecycle on a physical whiteboard to identify 12 distinct handoff points' },
              { method: 'Competitive Analysis', desc: 'Evaluated Salesforce, HubSpot, Zoho CRM, and Pipedrive — none modelled the sequential multi-team handoff chain' },
              { method: 'Pain Point Quantification', desc: 'Tracked error frequency across 40+ trips to establish baseline metrics for disputes, miscommunication, and rework' },
              { method: 'Shadow Sessions', desc: 'Observed tour guides, sales staff, and the execution team during real working sessions to see tools and workarounds in use' },
            ].map(({ method, desc }, i, arr) => (
              <div key={method} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-display"
                    style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)', background: 'var(--bg)' }}
                  >
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>{method}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ImagePlaceholder label="Workflow Mapping Session — 12 Handoff Points Identified" ratio="21/9" />

        <div className="container-pad py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Key Research Findings
          </p>
          <div className="space-y-3 mb-14">
            {[
              { title: 'Sequential handoff, not parallel pipeline', desc: 'The travel enquiry lifecycle involves 5+ teams working in strict sequence. Generic CRMs model leads as a linear pipeline owned by one user — this system needed shared ownership across stages.' },
              { title: 'The conversion moment was the highest-risk point', desc: '~35% of client disputes originated from conversions that happened before backend teams had verified booking details. The design needed a hard gate — not a soft recommendation.' },
              { title: 'Financial visibility was delayed by 10–14 days', desc: 'The accounts team had no real-time data. The owner learned about trip profitability only after the trip was complete and expenses were manually tallied. A live two-sided P&L per trip was essential.' },
              { title: 'Tour guides were fully disconnected', desc: 'Tour guides operated off WhatsApp screenshots, averaging 2–3 information errors per trip — wrong hotel contact, missing activity booking, outdated transport detail.' },
              { title: 'Employees and management needed different views', desc: 'Showing business-wide pipeline metrics to sales employees distorted their behaviour — they optimised for status numbers rather than individual lead quality. A dual-view model was needed.' },
            ].map(({ title, desc }, i) => (
              <div
                key={i}
                className="p-6 transition-all duration-200"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderLeft: '2px solid var(--border-strong)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--accent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--border-strong)' }}
              >
                <p className="font-semibold mb-2">
                  <span style={{ color: 'var(--accent)' }}>Finding {i + 1} —</span>{' '}
                  <span style={{ color: 'var(--text)' }}>{title}</span>
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <EditorialQuote label="Key Insight">
          The system needed to model a real-world handoff chain, not a generic CRM pipeline. Each stage of a lead's
          journey required a different team with different tools, different access, and different goals.
        </EditorialQuote>
      </SectionWrapper>

      {/* 04 — User Personas */}
      <SectionWrapper id="personas" number="04" title="User Personas">
        <div className="container-pad pb-14">
          <p className="text-lg leading-relaxed mb-12 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            From the research, I identified 8 distinct roles. Four primary personas represent the most frequent and
            complex usage patterns.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {[
              {
                name: 'Ravi M.', role: 'Sales Employee', age: 28, color: '#1d4ed8',
                bio: 'A sales executive who manages 15–20 active leads at any time. He spends 6+ hours daily on calls, WhatsApp, and follow-ups. He is the primary user of the CRM.',
                goals: ['Track all his leads and their status in one place', 'Get quotes and itineraries from other teams without chasing them on WhatsApp', 'Know when a lead is verified so he can move to conversion quickly', 'Log call recordings and notes without switching apps'],
                frustrations: ['Loses context when leads sit idle for days — WhatsApp messages get buried', 'Has to chase the execution team via calls to get quote status', "Doesn't know if backend has verified a lead until someone tells him", 'Manually downloads itinerary PDFs from Google Drive and re-sends to clients'],
                quote: '"I manage 18 leads right now. I can tell you 5 off the top of my head. The rest, I need to scroll through WhatsApp to even remember what they wanted."',
              },
              {
                name: 'Meena S.', role: 'Execution Team Lead', age: 34, color: '#7c3aed',
                bio: 'Manages the operational side — quoting trips, booking accommodations and transport, tracking vendor payments, and ensuring trip margins stay healthy. Coordinates between 3–4 vendors per trip.',
                goals: ['See all pending quotation requests in one queue', 'Track vendor costs against client payments in real time', 'Book stays, food, transport, and activities with all details logged', 'Know trip margins before the trip happens, not after'],
                frustrations: ['Receives quotation requests via WhatsApp — no structure, missing details, frequent back-and-forth', 'Has no real-time view of trip profitability — calculates margins in Excel post-trip', 'Vendor payment proof is scattered across WhatsApp and email', "Changes to bookings aren't visible to tour guides in real time"],
                quote: '"I quoted 12 trips last month. I only knew 3 were profitable before they happened. The rest, I found out in the Excel sheet two weeks later."',
              },
              {
                name: 'Kumar R.', role: 'Tour Guide', age: 42, color: '#0f766e',
                bio: "Has been guiding tours for 8 years. In the field 20+ days a month, operating off his phone. Needs to know exactly where to go, who to contact, and what's booked — without calling the office.",
                goals: ['See all his upcoming trip details on his phone', 'Have hotel names, contacts, and room counts at a glance', 'Know the full day-by-day itinerary without asking the office', "Log on-trip expenses quickly so they're accounted for"],
                frustrations: ['Receives trip details as WhatsApp screenshots — often blurry, incomplete, or outdated', 'Has to call the office 3–4 times per trip to confirm details that changed', "No way to log expenses digitally — keeps paper receipts that sometimes get lost", "Can't see if booking details changed after he left for the trip"],
                quote: '"Last week I showed up at a hotel that had no booking for us. The office had changed it but nobody told me. The client was standing right there."',
              },
              {
                name: 'Priya V.', role: 'Business Owner', age: 52, color: '#b45309',
                bio: 'Founded Adventure Holidays 15 years ago. Oversees a team of 12+, handles strategic decisions, and needs a finger on the pulse of the business — without waiting for someone to compile a report.',
                goals: ['See business KPIs in real time — leads, conversions, revenue, margins', 'Drill down into individual employee performance', "Know which lead sources are working and which aren't", 'Have financial overview without waiting for the accounts team'],
                frustrations: ['Gets a manual report every Friday — already stale by the time she reads it', "Can't see conversion rate or lead source ROI without asking someone to compile data", 'Has no visibility into trip margins until weeks after completion', 'Employee performance is assessed on gut feeling rather than data'],
                quote: '"I built this business over 15 years. But I can\'t tell you today what my conversion rate is, or which employee closed the most this month, without asking someone to run the numbers."',
              },
            ].map(({ name, role, age, color, bio, goals, frustrations, quote }) => (
              <div key={name} className="overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {/* Header with avatar */}
                <div className="px-6 py-5 flex items-center gap-4" style={{ background: color }}>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-display font-black text-sm shrink-0"
                    style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', letterSpacing: '-0.02em' }}
                  >
                    {name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-base text-white leading-tight">{name}</p>
                    <p className="text-sm opacity-75 text-white">{role} · {age}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6" style={{ background: `${color}08` }}>
                  <p className="text-sm leading-relaxed italic mb-6" style={{ color: 'var(--text-muted)' }}>{bio}</p>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color }}>Goals</p>
                  <ul className="space-y-2 mb-6">
                    {goals.map((g, i) => (
                      <li key={i} className="text-sm flex gap-2.5 items-start" style={{ color: 'var(--text-muted)' }}>
                        <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: color }} />
                        {g}
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#ef4444' }}>
                    Frustrations
                  </p>
                  <ul className="space-y-2 mb-6">
                    {frustrations.map((f, i) => (
                      <li key={i} className="text-sm flex gap-2.5 items-start" style={{ color: 'var(--text-muted)' }}>
                        <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: '#ef4444' }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="text-sm italic leading-relaxed"
                    style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    {quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ImagePlaceholder label="User Journey Map — Sales Employee Primary Flow (12 Stages)" ratio="21/9" />
      </SectionWrapper>

      {/* 05 — Information Architecture */}
      <SectionWrapper id="ia" number="05" title="Information Architecture">
        <div className="container-pad pb-14">
          <p className="text-base leading-relaxed mb-10 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            The information architecture was designed role-first. Every user lands on a page calibrated to their job.
            No generic dashboard with toggled visibility — each role has a purpose-built entry point and navigation scope.
          </p>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }}>
            System Sitemap by Role
          </p>
          <div className="mb-14 overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  {['Role', 'Landing Page', 'Primary Function', 'Cannot See'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.12em]"
                      style={{ color: 'var(--text-dim)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { role: 'admin', page: '/dashboard', fn: 'Full system access', restrict: '—', color: '#3b82f6' },
                  { role: 'employee', page: '/dashboard', fn: 'Sales & client management', restrict: "Others' leads, business metrics", color: '#8b5cf6' },
                  { role: 'execution', page: '/quotation', fn: 'Quote, book, payments', restrict: 'Console, employee performance', color: '#10b981' },
                  { role: 'accounts', page: '/general-ledger', fn: 'Financial visibility (read-only)', restrict: 'Lead details, contacts', color: '#f59e0b' },
                  { role: 'itinerary', page: '/itineraries', fn: 'Create itineraries', restrict: 'Financial data, console', color: '#06b6d4' },
                  { role: 'owner', page: '/owner-dashboard', fn: 'Business monitoring', restrict: 'Console', color: '#b45309' },
                  { role: 'tour_guide', page: '/tour-guide/trips', fn: 'Field execution', restrict: 'All other leads, financial data', color: '#0f766e' },
                  { role: 'backend', page: '/verify-trips', fn: 'Quality gate', restrict: 'Financial data, owner dashboard', color: '#6366f1' },
                ].map(({ role, page, fn, restrict, color }, i, arr) => (
                  <tr key={role} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}>
                    <td className="px-6 py-3">
                      <code className="text-xs font-mono px-2.5 py-1 rounded"
                        style={{ color, background: `${color}15`, border: `1px solid ${color}35` }}>
                        {role}
                      </code>
                    </td>
                    <td className="px-6 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{page}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{fn}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-dim)' }}>{restrict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }}>
            Core Entity Relationship
          </p>
          <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Every entity links back to its origin lead — a single audit chain from first contact to trip reconciliation:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {['Lead', 'Contact', 'Quotation Request', 'Quotation', 'Itinerary Request', 'Itinerary', 'Confirmation Request', 'Client Payments', 'Vendor Transactions', 'Booking Details', 'Tour Guide Expenses'].map((entity, i, arr) => (
                <span key={entity} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 text-xs font-mono"
                    style={{ background: 'rgba(0,170,255,0.07)', color: 'var(--accent)', border: '1px solid var(--border-strong)' }}>
                    {entity}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ImagePlaceholder label="Complete Lead Lifecycle — 5 Teams, 12 Handoff Points" ratio="21/9" />
      </SectionWrapper>

      {/* 06 — Key Design Decisions */}
      <SectionWrapper id="design-decisions" number="06" title="Key Design Decisions">
        <div className="container-pad pb-14">
          <p className="text-base leading-relaxed mb-12 max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            Each decision was derived from a specific research finding — not applied from generic UX best practices.
          </p>

          <div style={{ border: '1px solid var(--border)' }}>
            {[
              {
                num: '01', title: 'Role-Gated Routing',
                desc: 'System reads user role on login and routes to a role-specific landing page. A tour guide never sees the general ledger. An accounts user never encounters lead notes.',
                impact: "Eliminated navigation friction for all 8 roles. Zero 'access denied' errors in production.",
              },
              {
                num: '02', title: 'The Confirmation Gate — Locked Conversion',
                desc: 'Conversion button is physically locked until a backend team member verifies the lead. Employee cannot bypass. Backend must call client, review terms, and mark verified.',
                impact: 'Conversion disputes dropped from ~35% to near zero. Quality control enforced by system constraint, not process recommendation.',
              },
              {
                num: '03', title: 'Dual Status Model',
                desc: 'Employees see badge_stage (personal tracker). Management sees real status (business pipeline). Separate database fields — not filtered views.',
                impact: 'Employees focus on lead quality. Management gets uncontaminated pipeline data. Eliminated behavioural distortion from aggregate metrics.',
              },
              {
                num: '04', title: 'Two-Sided P&L Per Trip',
                desc: 'Every trip has client income (payment installments with proof) and vendor expense (bookings with planned vs actual costs). Gap = trip margin, visible in real time.',
                impact: 'Financial visibility moved from T+14 days (post-trip Excel) to T+0 (real-time). Execution team caught 2–3 overspend situations per month before trips happened.',
              },
              {
                num: '05', title: 'Tour Guide as First-Class User',
                desc: 'Dedicated role with scoped view — only assigned trips. Full operational package: stays, food, transport, activities, confirmed itinerary.',
                impact: 'Information gaps per trip dropped from 2–3 to near zero. Tour guides stopped calling the office 3–4 times per trip for confirmation.',
              },
              {
                num: '06', title: 'Telegram Bot Bridge',
                desc: "Rather than forcing the business to abandon Telegram lead intake, an import bridge was designed. Bot entries appear in admin queue. One-click import to full lead record.",
                impact: 'Zero channel disruption on rollout. 100% of existing lead sources continued working. Adoption resistance eliminated.',
              },
              {
                num: '07', title: 'Real-Time Architecture',
                desc: 'All critical tables subscribed to Supabase Realtime. When execution updates a booking, the tour guide sees it without refreshing.',
                impact: "Cross-team updates went from 'next time someone checks' to instant. Last-minute booking changes propagated immediately.",
              },
            ].map(({ num, title, desc, impact }, i) => (
              <div key={num} className="p-8 flex items-start gap-8"
                style={{ background: 'var(--surface)', borderTop: i > 0 ? '1px solid var(--border)' : undefined }}>
                <span className="font-display font-black shrink-0"
                  style={{ fontSize: '2.25rem', lineHeight: 1, color: 'var(--border-strong)', letterSpacing: '-0.04em', minWidth: '3.5rem' }}>
                  {num}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>{title}</p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest shrink-0 mt-0.5" style={{ color: '#10b981' }}>
                      Impact:
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ImagePlaceholder label="UI Screens — Role-Specific Dashboards & Locked Conversion Gate" ratio="16/9" />
      </SectionWrapper>

      {/* 07 — Results & Impact */}
      <SectionWrapper id="results" number="07" title="Results & Impact">
        <div className="container-pad pb-14">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px mb-14" style={{ background: 'var(--border)' }}>
            {[
              { before: '~35%', after: '0%', label: 'CONVERSION DISPUTES', color: '#10b981' },
              { before: '14 days', after: '0', label: 'FINANCIAL VISIBILITY LAG', color: '#3b82f6' },
              { before: '2–3', after: '0', label: 'INFO GAPS / TOUR GUIDE TRIP', color: '#8b5cf6' },
              { before: '4–6 hrs', after: '0', label: 'WEEKLY MANUAL REPORT TIME', color: '#f59e0b' },
              { before: '~20%', after: '0%', label: 'WRONG QUOTE VERSION TO CLIENT', color: '#06b6d4' },
              { before: '0%', after: '100%', label: 'LEADS WITH AUDIT TRAIL', color: '#10b981' },
            ].map(({ before, after, label, color }) => (
              <div key={label} className="p-8 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
                <p className="font-display font-bold mb-1.5 relative"
                  style={{ fontSize: '1.2rem', lineHeight: 1, color, opacity: 0.3, textDecoration: 'line-through' }}>
                  {before}
                </p>
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1, color, letterSpacing: '-0.03em' }}>
                  {after}
                </p>
                <p className="text-xs font-bold tracking-[0.15em] relative" style={{ color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }}>
            Before & After
          </p>
          <div className="overflow-x-auto mb-14" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em]"
                    style={{ color: '#ef4444', background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid var(--border)' }}>
                    Before AH-CRM
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em]"
                    style={{ color: '#10b981', background: 'rgba(16,185,129,0.06)', borderBottom: '1px solid var(--border)' }}>
                    After AH-CRM
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Leads tracked in WhatsApp — no history', 'All leads in one system with timestamped activity logs'],
                  ['Quotes via WhatsApp — ~20% wrong version sent', 'Structured quotation flow with version control and slot selection'],
                  ['~15% of itineraries needed rework from miscommunication', 'Formal request-response with PDF versioning (v1, v2...)'],
                  ['~35% of conversions disputed (no verification)', 'Mandatory backend verification — conversion locked until verified'],
                  ['Trip P&L known 10–14 days post-trip', 'Live two-sided P&L — income vs vendor costs visible in real time'],
                  ['Tour guides: 2–3 info gaps per trip', 'Dedicated portal with structured stays, food, transport, activities'],
                  ['Owner got stale Friday report (4–6 hrs to compile)', 'Live KPI dashboard — always current, zero compilation time'],
                  ['No role-based access — all or nothing', '8 roles with DB-level access control, auto-routed on login'],
                ].map(([before, after], i, arr) => (
                  <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}>
                    <td className="px-6 py-4 align-top text-sm"
                      style={{ color: 'var(--text-muted)', background: 'rgba(239,68,68,0.03)' }}>{before}</td>
                    <td className="px-6 py-4 align-top text-sm"
                      style={{ color: 'var(--text-muted)', background: 'rgba(16,185,129,0.03)' }}>{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }}>
            System Scale
          </p>
          <div className="space-y-2">
            {[
              '8 user roles with distinct access scopes, each routed automatically on login',
              '26+ database migrations — each reflecting a real business need discovered through use',
              '12 handoff points across 5 teams, all enforced by system sequence',
              'Real-time collaboration via Supabase Realtime — zero-refresh cross-team updates',
              'Two lead intake channels: manual creation and Telegram bot import bridge',
              'Complete financial chain from per-installment client payments to the business general ledger',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 08 — Reflection */}
      <SectionWrapper id="reflection" number="08" title="Reflection">
        <div className="container-pad pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-14" style={{ background: 'var(--border)' }}>
            <div className="p-8" style={{ background: 'var(--surface)' }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: '#10b981' }}>
                What Worked
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Operations-first approach', desc: 'Mapping real workflows before designing anything meant every feature traced to a genuine need, not a guess.' },
                  { title: 'Role-based routing', desc: 'Users feel like they have a purpose-built app for their job, not a generic CRM with permissions toggled.' },
                  { title: 'The confirmation gate', desc: 'A single locked UI element eliminated an entire category of disputes. Simplest design decision, highest impact.' },
                  { title: 'Iterative schema', desc: '26 migrations means the system grew with the business. No big-bang release; every addition was validated by real use.' },
                  { title: 'Research-grounded personas', desc: "Ravi, Meena, Kumar, and Priya aren't hypothetical — they represent real people whose pain points shaped every screen." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: '#10b981' }}>✓</span>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8" style={{ background: 'var(--surface)' }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: '#f59e0b' }}>
                What I Would Do Differently
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Design system from day one', desc: 'Component consistency was retrofitted, not planned. A design system from the start would have saved significant rework.' },
                  { title: 'Mobile-first tour guide interface', desc: 'Kumar is in the field, not at a desk. The tour guide interface should have been built mobile-first from the beginning.' },
                  { title: 'Structured in-app notifications earlier', desc: 'WhatsApp still fills gaps the system should handle. Notifications should have been scoped into the initial design.' },
                  { title: 'Client-facing communication module', desc: 'Sending quotes and itineraries still happens outside the CRM. A built-in module would close this loop completely.' },
                  { title: 'Formal usability testing', desc: 'Relying solely on shadow observations was insufficient. Structured sessions would have caught more edge cases.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: '#f59e0b' }}>→</span>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <EditorialQuote label="Closing Thought">
          Building a CRM is not a software problem — it is an operations design problem. The right architecture
          was not copying HubSpot or Salesforce. It was mapping the actual work that 8 different types of people
          do every day, and designing a system where each of them can do it better — without seeing what the others
          see, without skipping the quality gates, and without needing training to find what they need.
        </EditorialQuote>
      </SectionWrapper>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// AH-ITINERARY FULL CASE STUDY
// ─────────────────────────────────────────────────────────

function AHItineraryCaseStudy() {
  return (
    <>
      {/* 01 — Project Overview */}
      <SectionWrapper id="overview" number="01" title="Project Overview">
        <div className="container-pad pb-20">
          <div className="mb-14" style={{ border: '1px solid var(--border)' }}>
            {[
              { label: 'Client', value: 'Adventure Holidays, Coimbatore, Tamil Nadu' },
              { label: 'My Role', value: 'Product Analyst & System Designer (end-to-end)' },
              { label: 'Product Type', value: 'B2B Internal Tool — Itinerary Quotation Builder' },
              { label: 'Primary Users', value: 'Travel consultants (5–8 itineraries/week each)' },
              { label: 'Duration', value: 'Iterative build — research through deployment, multiple design pivots' },
              { label: 'Tools', value: 'Figma · FigJam · Notion · VS Code' },
              { label: 'Stack', value: 'React 18 · TypeScript · Vite · Supabase · shadcn/ui · Tailwind · jsPDF · Recharts · Vercel' },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className="flex gap-6 px-6 py-4"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}>
                <span className="text-xs font-bold uppercase tracking-[0.12em] shrink-0 w-28 pt-0.5" style={{ color: 'var(--accent)' }}>{label}</span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
            {[
              { value: '4-Step', label: 'GUIDED CREATION WIZARD', color: '#3b82f6' },
              { value: '<5ms', label: 'SEARCH ACROSS 50K RECORDS', color: '#8b5cf6' },
              { value: '1-Click', label: 'BRANDED PDF EXPORT', color: '#10b981' },
            ].map(({ value, label, color }) => (
              <div key={label} className="p-12 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1, color, letterSpacing: '-0.03em' }}>
                  {value}
                </p>
                <p className="text-xs font-bold tracking-[0.18em] relative" style={{ color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 02 — The Problem */}
      <SectionWrapper id="problem" number="02" title="The Problem">
        <div className="container-pad pb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }}>
            Industry Context
          </p>
          <p className="text-lg leading-relaxed max-w-3xl mb-10" style={{ color: 'var(--text-muted)' }}>
            Travel consultants at mid-sized Indian agencies create 5–8 itinerary quotations per week. Each quotation
            covers trip summary, day-by-day plans, pricing, inclusions, exclusions, policies, and bank details.
            Most agencies produce these in Microsoft Word — manually formatting every single time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-14" style={{ background: 'var(--border)' }}>
            {[
              { value: '45–60 min', label: 'TIME TO CREATE ONE ITINERARY MANUALLY', color: '#ef4444' },
              { value: '~15%', label: 'ITINERARY CODES DUPLICATED — NO TRACKING', color: '#ef4444' },
              { value: '0', label: 'ANALYTICS ON VOLUME OR PERFORMANCE', color: '#ef4444' },
            ].map(({ value, label, color }) => (
              <div key={label} className="p-10 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1, color, letterSpacing: '-0.03em' }}>
                  {value}
                </p>
                <p className="text-xs font-bold tracking-[0.15em] relative" style={{ color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Specific Pain Points
          </p>
          <div className="space-y-2 mb-14">
            {[
              'Time sink — each itinerary took 45–60 minutes in Word; consultants created 5–8 per week, spending 6–8 hours weekly just on document formatting',
              'No reusable content — popular destinations had the same day plans re-typed every time; a 5-day Kerala itinerary was built from scratch even though 80% was identical across clients',
              'Inconsistent branding — different consultants used different fonts, layouts, and logo placements; no two PDFs looked the same',
              'Duplicate itinerary codes — no centralised tracking system; consultants maintained their own numbering, leading to ~15% code collisions',
              'No search or retrieval — past itineraries lived in personal folders; finding a 3-month-old quotation meant scrolling through Google Drive',
              'Zero analytics — the business had no visibility into how many itineraries were created, by whom, for which regions, or at what conversion rate',
              'PDF quality inconsistency — manual exports from Word varied in quality, page breaks, and formatting depending on the consultant\'s setup',
            ].map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-5 px-6 py-4 transition-all duration-200"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  borderLeft: '2px solid var(--border-strong)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--accent)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--border-strong)' }}
              >
                <span className="font-display font-black shrink-0 text-sm"
                  style={{ color: 'var(--border-strong)', minWidth: '2rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{point}</span>
              </div>
            ))}
          </div>

          <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-dim)' }}>
              The Design Challenge
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Design a guided itinerary builder that lets a consultant go from a blank screen to a professional, branded PDF quotation in under 12 minutes — with reusable content blocks, automatic code generation, and analytics for the business.
            </p>
          </div>
        </div>

        <EditorialQuote label="Problem Statement">
          Consultants spent more time formatting documents than selling trips. Every itinerary was built from
          scratch — no reusable content, no version tracking, no consistent branding, and no way to know how
          many quotations were going out the door.
        </EditorialQuote>
      </SectionWrapper>

      {/* 03 — Research & Discovery */}
      <SectionWrapper id="research" number="03" title="Research & Discovery">
        <div className="container-pad pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
            {[
              'Map the complete itinerary creation workflow — from client enquiry to PDF delivery',
              'Identify the most time-consuming and repetitive steps in the current process',
              'Quantify content reuse potential — how much of each itinerary is repeated across clients',
              'Understand what analytics the business owner needs but currently lacks',
            ].map((goal, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'var(--accent)' }} />
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{goal}</span>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--accent)' }}>
            Research Methods
          </p>
          <div className="mb-14">
            {[
              { method: 'Shadow Sessions', desc: 'Observed 3 consultants creating itineraries in Word over 2 weeks — timed each step, noted copy-paste patterns and formatting workarounds' },
              { method: 'Content Audit', desc: 'Analysed 40+ past itinerary PDFs to identify content overlap, common structures, and branding inconsistencies' },
              { method: 'Stakeholder Interviews', desc: 'Spoke with the business owner about reporting gaps and with consultants about their biggest friction points' },
              { method: 'Competitive Analysis', desc: 'Reviewed travel CRM tools (Tourwriter, Travefy, Nezasa) to identify what structured itinerary builders look like in the market' },
              { method: 'Time-Motion Study', desc: 'Tracked minute-by-minute breakdown of itinerary creation: ~40% was formatting, ~25% was re-typing reusable content, ~35% was actual customisation' },
            ].map(({ method, desc }, i, arr) => (
              <div key={method} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-display"
                    style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)', background: 'var(--bg)' }}
                  >
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: 'var(--border)' }} />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>{method}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Key Research Findings
          </p>
          <div className="space-y-3 mb-14">
            {[
              { title: '40% of creation time was spent on formatting, not content', desc: 'Consultants spent nearly half their time adjusting margins, fonts, page breaks, and logo placement — work that has zero value to the client. The template should handle all formatting automatically.' },
              { title: '80% of day-plan content was reusable across clients', desc: 'A 5-day Kerala itinerary shared roughly 80% of its day-by-day content with every other Kerala itinerary. Only the client name, dates, group size, and pricing changed. A keyword/snippet library could eliminate most re-typing.' },
              { title: 'Consultants had no retrieval system', desc: 'Past itineraries lived in personal Google Drive folders. Finding a specific quotation meant remembering the file name or scrolling through months of files. A searchable management table was essential.' },
              { title: 'The business had zero operational visibility', desc: 'The owner had no way to know how many itineraries were created last month, which regions were trending, which consultants were most active, or what the average group size was.' },
              { title: 'Itinerary codes were untracked and duplicated', desc: 'Each consultant maintained their own numbering system. Code collisions happened ~15% of the time, causing confusion when clients referenced a quotation number that matched multiple documents.' },
            ].map(({ title, desc }, i) => (
              <div
                key={i}
                className="px-6 py-5"
                style={{ border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)' }}
              >
                <p className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Finding {i + 1} — {title}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <EditorialQuote label="Key Insight">
          Consultants were doing document layout work, not sales work. The tool needed to reduce a 45–60 minute
          formatting exercise to a 10–12 minute content selection and customisation flow.
        </EditorialQuote>
      </SectionWrapper>

      {/* 04 — User Personas */}
      <SectionWrapper id="personas" number="04" title="User Personas">
        <div className="container-pad pb-20">
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            Two primary personas and one secondary persona emerged from the research.
          </p>

          <div className="space-y-8">
            {[
              {
                name: 'Anand K.', role: 'Travel Consultant', age: 26, color: '#3b82f6', badge: 'Primary Persona',
                bio: 'Anand is a junior consultant who handles 15–20 client enquiries per week. He creates 5–8 itinerary quotations weekly, mostly for domestic destinations. Speed and accuracy matter to him — a delayed quotation means a lost client.',
                goals: ['Create a professional itinerary in under 15 minutes', 'Reuse day-plan content from past itineraries', 'Generate a clean, consistent PDF', 'Find any past itinerary instantly'],
                frustrations: ['Spends 45–60 minutes per itinerary in Word', 'Re-types the same Kerala day plans every week', 'Can\'t find old quotations without scrolling for 10 minutes', 'His PDFs look different from other consultants\' PDFs'],
                quote: '"I know exactly what a 5-day Kerala trip should say. But I still spend 40 minutes making it look right in Word."',
              },
              {
                name: 'Deepa R.', role: 'Senior Consultant / Team Lead', age: 35, color: '#7c3aed', badge: 'Primary Persona',
                bio: 'Deepa manages a team of 4 consultants. She reviews their itineraries before they go to clients, handles complex international and corporate group itineraries, and reports to the owner on team output.',
                goals: ['Review any consultant\'s itinerary quickly', 'Track team output this week/month', 'Edit and improve junior consultants\' work', 'Duplicate a past itinerary as a starting point'],
                frustrations: ['Has to ask each consultant individually for output numbers', 'Reviews itineraries as email attachments — no central access', 'Can\'t duplicate a past quotation — each built from scratch', 'No way to enforce consistent quality across team'],
                quote: '"I spend Friday afternoons asking each person how many quotations they sent out this week. Nobody keeps count."',
              },
              {
                name: 'Lakshmi N.', role: 'Business Owner', age: 50, color: '#0f766e', badge: 'Secondary Persona',
                bio: 'Lakshmi founded Adventure Holidays 15 years ago. She wants to understand her business at a glance — which regions are popular, which consultants are productive, what volume trends look like month over month. Currently, she has none of this data.',
                goals: ['Dashboard with KPIs: total itineraries, region breakdown, consultant performance', 'Filter data by date range, region, and group type', 'Export data to Excel for board reviews', 'Know if team output is growing or declining'],
                frustrations: ['Has zero data on itinerary volume — relies on gut feeling', 'Can\'t compare domestic vs international quotation trends', 'No way to identify which group types (FIT, corporate, couples) are growing', 'Pays for tools but can\'t measure if team is using them'],
                quote: '"I run a business with 12 people and I can\'t tell you how many quotations we sent last month."',
              },
            ].map(({ name, role, age, color, badge, bio, goals, frustrations, quote }) => (
              <div key={name} style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div className="px-8 py-5 flex items-center justify-between" style={{ background: color }}>
                  <div>
                    <h3 className="text-xl font-bold text-white">{name}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{role} · Age: {age}</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5"
                    style={{ border: '1px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.85)' }}>{badge}</span>
                </div>
                <div className="px-8 py-8" style={{ background: 'var(--surface)' }}>
                  <p className="text-sm leading-relaxed mb-8 italic" style={{ color: 'var(--text-muted)' }}>{bio}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color }}>Goals</p>
                      <ul className="space-y-2">
                        {goals.map((g, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: color }} />
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#ef4444' }}>Frustrations</p>
                      <ul className="space-y-2">
                        {frustrations.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#ef4444' }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <blockquote className="text-sm italic px-4 py-3"
                    style={{ borderLeft: `3px solid ${color}`, color: 'var(--text-muted)', background: `${color}0D` }}>
                    {quote}
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 05 — User Journey Map */}
      <SectionWrapper id="journey" number="05" title="User Journey Map">
        <div className="container-pad pb-20">
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            The primary journey follows Anand (Travel Consultant) — from receiving a client enquiry to delivering a branded PDF quotation. This is the most frequent interaction path in the system.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  {['Stage', 'Action', 'Thinking', 'Emotion', 'Opportunity'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-[0.15em]"
                      style={{ borderBottom: '2px solid var(--accent)', color: 'var(--text-dim)', border: '1px solid var(--border)', borderBottomColor: 'var(--accent)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { stage: 'Client Enquiry', action: 'Receives a call or WhatsApp from a prospective client', thinking: 'What destination? How many people? What dates?', emotion: 'Engaged — opportunity', opportunity: 'Pre-populated fields from CRM lead data (future integration)' },
                  { stage: 'Open Studio', action: 'Navigates to /studio — CategoryModal fires for region + group type', thinking: 'I need to pick DOM or INTL and the group type first', emotion: 'Neutral — routine', opportunity: 'Live code preview so the consultant sees the code before committing' },
                  { stage: 'Step 1: Summary', action: 'Fills client name, destination, dates, group size, pricing slots', thinking: 'I need to get these details right — this is what the client sees first', emotion: 'Focused — inputting', opportunity: 'Consultant autocomplete, auto-date propagation to day plans' },
                  { stage: 'Step 2: Day Plans', action: 'Builds day-by-day itinerary with keyword search', thinking: 'Is there a saved Kerala Day 3 I can reuse?', emotion: 'Hopeful — wants speed', opportunity: 'Keyword library auto-fills title + activities; Day 0 toggle for arrival' },
                  { stage: 'Step 3: Details', action: 'Adds notes, inclusions, exclusions', thinking: 'Most of this is standard — I just need to tweak 1–2 lines', emotion: 'Slightly bored — repetitive', opportunity: 'Pre-loaded 5 default notes; one-per-line textarea for quick entry' },
                  { stage: 'Step 4: Policies', action: 'Reviews terms and cancellation policy', thinking: 'This almost never changes between clients', emotion: 'Disengaged — wants to finish', opportunity: '17-clause default preloaded; edit only when needed' },
                  { stage: 'Save', action: "Clicks 'Confirm & Save' in sticky footer", thinking: 'Did it save? Can I preview now?', emotion: 'Anxious — wants confirmation', opportunity: 'Unsaved changes detection; save toast; preview unlocks' },
                  { stage: 'Preview', action: 'Opens /preview/:id — sees the full branded layout', thinking: 'Does this look right? Is the page break clean?', emotion: 'Critical — quality check', opportunity: 'Live branded preview matches final PDF exactly' },
                  { stage: 'Export PDF', action: "Clicks 'Download PDF' — file saves to device", thinking: 'I need this PDF in under 10 seconds', emotion: 'Impatient — wants it now', opportunity: 'Auto quality fallback (4 presets) ensures export never fails' },
                  { stage: 'Send to Client', action: 'Shares PDF via WhatsApp or email', thinking: 'I hope the client likes it', emotion: 'Confident — professional output', opportunity: 'Consistent branding across all consultants\' outputs' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                    <td className="px-5 py-4 font-semibold text-xs" style={{ color: 'var(--accent)', minWidth: '110px', border: '1px solid var(--border)' }}>{row.stage}</td>
                    <td className="px-5 py-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', maxWidth: '180px' }}>{row.action}</td>
                    <td className="px-5 py-4 text-xs leading-relaxed italic" style={{ color: 'var(--text-dim)', border: '1px solid var(--border)', maxWidth: '180px' }}>{row.thinking}</td>
                    <td className="px-5 py-4 text-xs font-medium" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', minWidth: '120px' }}>{row.emotion}</td>
                    <td className="px-5 py-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', maxWidth: '200px' }}>{row.opportunity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* 06 — Information Architecture */}
      <SectionWrapper id="ia" number="06" title="Information Architecture">
        <div className="container-pad pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--accent)' }}>
            System Sitemap
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            The application has 6 routes, each serving a distinct function. Navigation is flat — no nested hierarchies. Every page is accessible from the top navigation bar.
          </p>

          <div className="mb-14" style={{ border: '1px solid var(--border)' }}>
            {[
              { route: '/', desc: 'Dashboard — KPI cards, donut charts (region/group type), consultant bar chart. Date range + region + group type filters.' },
              { route: '/studio', desc: 'Itinerary Studio (new) — CategoryModal fires first (region + group type + consultant). Then 4-step wizard.' },
              { route: '/studio/:id', desc: 'Itinerary Studio (edit) — fetches existing itinerary, hydrates all 4 step states. Same 4-step wizard.' },
              { route: '/preview/:id', desc: 'Preview — full branded layout rendered in a div. Download PDF button triggers export pipeline.' },
              { route: '/management', desc: 'Management — data table of all itineraries. Search, sort, view/edit/duplicate/delete actions. XLSX bulk export. Counter admin panel.' },
              { route: '/keywords', desc: 'Keywords — CRUD for reusable day-plan snippets (destination keyword, day title, activity lines).' },
            ].map(({ route, desc }, i, arr) => (
              <div key={route} className="flex gap-6 px-6 py-4"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}>
                <code className="text-xs font-mono font-bold shrink-0 w-32 pt-0.5" style={{ color: 'var(--accent)' }}>{route}</code>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</span>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--accent)' }}>
            Database Schema — 4 Tables
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            The data model is deliberately flat. Complex nested data (day plans, pricing slots, notes, inclusions) is stored as JSONB — no joins, no relational overhead for what is essentially document data.
          </p>

          <div className="overflow-x-auto mb-14">
            <table className="w-full min-w-[600px] text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  {['Table', 'Purpose', 'Key Columns'].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold uppercase tracking-[0.15em]"
                      style={{ border: '1px solid var(--border)', borderBottomColor: 'var(--accent)', borderBottomWidth: 2, color: 'var(--text-dim)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { table: 'itineraries', purpose: 'Main document store', cols: 'itinerary_code (UNIQUE), client_name, destination, day_plans (JSONB), pricing_slots (JSONB), notes/inclusions/exclusions (JSONB)' },
                  { table: 'keywords', purpose: 'Reusable day content', cols: 'keyword (UNIQUE), title (JSONB array), activities (JSONB array)' },
                  { table: 'consultants', purpose: 'Team directory', cols: 'name, phone — used for autocomplete in Studio Step 1' },
                  { table: 'counters', purpose: 'Sequential code tracking', cols: 'key (e.g. AH26-DOM-FIT), count — atomic increment via RPC function' },
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                    <td className="px-5 py-4" style={{ border: '1px solid var(--border)' }}>
                      <code className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>{row.table}</code>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{row.purpose}</td>
                    <td className="px-5 py-4 text-xs leading-relaxed" style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}>{row.cols}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-dim)' }}>
              Technical Decision
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The atomic counter RPC (<code className="text-xs px-1 py-0.5" style={{ background: 'var(--bg)', color: 'var(--accent)' }}>increment_counter</code>) uses{' '}
              <code className="text-xs px-1 py-0.5" style={{ background: 'var(--bg)', color: 'var(--accent)' }}>INSERT ... ON CONFLICT DO UPDATE ... RETURNING</code> — guaranteeing that two simultaneous code generations never produce the same number. This eliminated the ~15% code collision rate entirely.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* 07 — User Flows */}
      <SectionWrapper id="user-flows" number="07" title="User Flows">
        <div className="container-pad pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Primary Flow — Create New Itinerary
          </p>
          <div className="space-y-2 mb-14">
            {[
              { step: 'Navigate', desc: "Consultant clicks 'New Itinerary' from any page — opens /studio" },
              { step: 'Category Modal', desc: 'Phase 1: Select Region (DOM/INTL) + Group Type (FIT/SCH/CLG/COR/CPL/GD). Live code preview updates with 500ms debounce.' },
              { step: 'Consultant Select', desc: 'Phase 2: Select consultant from dropdown (backed by consultants table). Modal closes.' },
              { step: 'Step 1 — Summary', desc: 'Fill client details, destination, dates, transport, group size, pricing slots. Travel date change auto-recalculates all day dates in Step 2.' },
              { step: 'Step 2 — Day Plans', desc: 'Build day-by-day plan. Search keywords (min 2 chars) to auto-fill. Toggle Day 0 for arrival. Add/remove days with auto-renumber.' },
              { step: 'Step 3 — Details', desc: 'Add notes (5 defaults pre-loaded), inclusions, exclusions. One-per-line textareas stored as JSONB arrays.' },
              { step: 'Step 4 — Policies', desc: 'Review/edit terms (17-clause default) and cancellation policy (slab-based default). Rarely changed.' },
              { step: 'Save', desc: "Click 'Confirm & Save' in sticky footer. Unsaved changes flag clears. Preview button unlocks." },
              { step: 'Preview', desc: 'Navigate to /preview/:id. Full branded layout renders. Visual quality check.' },
              { step: 'Export PDF', desc: "Click 'Download PDF'. html-to-image captures layout. jsPDF generates A4 document. Auto quality fallback if >10MB. File saves." },
            ].map(({ step, desc }, i) => (
              <div key={i} className="flex items-start gap-5 px-6 py-4"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span className="font-display font-black shrink-0 text-sm"
                  style={{ color: 'var(--accent)', minWidth: '2.5rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] block mb-1" style={{ color: 'var(--text)' }}>{step}</span>
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Secondary Flow — Duplicate & Edit
          </p>
          <div className="space-y-2 mb-10">
            {[
              'Consultant opens /management → finds a past itinerary by searching client name or destination (<5ms search)',
              "Clicks 'Duplicate' → system generates a new code (atomic), copies all content, strips ID and timestamps",
              'If the duplicate code is higher than the counter, the counter is synced upward automatically',
              'Consultant opens the duplicate → edits client name, dates, and any custom details → saves and exports',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4"
                style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'var(--accent)' }} />
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{point}</span>
              </div>
            ))}
          </div>

          <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid #10b981' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#10b981' }}>UX Impact</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The duplicate flow reduces a 45-minute task to under 5 minutes for repeat destinations — the consultant only changes what's different, not what's the same.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* 08 — The 4-Step Itinerary Studio */}
      <SectionWrapper id="studio" number="08" title="The 4-Step Itinerary Studio">
        <div className="container-pad pb-20">
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            The Studio is the core creation experience. It replaces an unstructured Word document with a guided 4-step wizard. Each step collects a specific category of information, with smart defaults and reusable content to minimise typing.
          </p>

          <div className="space-y-3 mb-14">
            {[
              {
                step: 'Step 1', title: 'Summary — Client & Trip Details', color: '#3b82f6',
                desc: 'Collects consultant (autocomplete from DB), consultant phone, quotation date, destination, duration, travel date, transport details, client name, client phone, group size, and one or more pricing slots (label + price + unit). When the travel date changes, all day-plan dates in Step 2 are automatically recalculated using date arithmetic — no manual re-entry needed.',
              },
              {
                step: 'Step 2', title: 'Itinerary — Day-by-Day Plan Builder', color: '#8b5cf6',
                desc: "Each day card has: a date picker, a keyword search box (queries the keywords table live, minimum 2 characters), a day title field, and a free-text activities textarea. When a keyword is selected, its pre-saved title and activities auto-fill that day's fields — eliminating re-typing for popular destinations. A 'Show Day 0' toggle inserts an Arrival day before Day 1 and renumbers all subsequent days automatically.",
              },
              {
                step: 'Step 3', title: 'Details — Notes, Inclusions, Exclusions', color: '#10b981',
                desc: 'Notes section has a toggle that pre-loads 5 default notes when activated — consultants edit or add to them rather than starting from scratch. Inclusions and Exclusions use one-per-line textareas, stored as JSONB string arrays in Supabase. This structure makes them easy to render as bullet lists in the PDF preview.',
              },
              {
                step: 'Step 4', title: 'Policies — Terms & Cancellation', color: '#f59e0b',
                desc: 'Pre-loaded with a 17-clause Terms & Conditions default and a slab-based Cancellation Policy default. These are edited only when the trip requires custom terms — which happens in roughly 5–10% of cases. The bank details section exists in the data model and PDF preview but was removed from the active UI form based on business feedback.',
              },
            ].map(({ step, title, color, desc }, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div className="px-6 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] px-3 py-1.5"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}50` }}>
                    {step}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{title}</span>
                </div>
                <div className="px-6 py-5" style={{ background: 'var(--bg)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--accent)' }}>
              Unsaved Changes Protection — Triple Lock
            </p>
            <div className="space-y-3">
              {[
                'Preview button disabled — preventing PDF export of stale data',
                'Close (X) button shows a confirmation modal before navigating away',
                "Browser's beforeunload event fires if the tab is closed or refreshed",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>0{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              This triple-layer protection prevents consultants from accidentally losing 10–15 minutes of work — a frustration repeatedly flagged during shadow sessions.
            </p>
          </div>
        </div>

        <ImagePlaceholder label="4-Step Studio — CategoryModal + Guided Wizard Interface" ratio="16/9" />
      </SectionWrapper>

      {/* 09 — Key Design Decisions */}
      <SectionWrapper id="decisions" number="09" title="Key Design Decisions">
        <div className="container-pad pb-20">
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            Each decision was derived from a specific research finding — not applied from a UI pattern library.
          </p>

          <div className="space-y-3">
            {[
              { num: '01', title: 'Keyword Library — Reusable Day-Plan Content', color: '#3b82f6', impact: 'Content reuse went from 0% (everything re-typed) to ~80% for domestic destinations. Average day-plan creation dropped from ~8 minutes to ~2 minutes per day.', desc: "Instead of asking consultants to type day plans from scratch, the keyword system stores destination-specific templates (title + activities). Searching 'Munnar' instantly returns pre-saved day plans. Consultants select and customise rather than create." },
              { num: '02', title: 'Atomic Code Generation — Zero Collisions', color: '#8b5cf6', impact: 'Code collisions dropped from ~15% to 0%. Every itinerary code (e.g. AH26-DOM-FIT007) is globally unique.', desc: 'The increment_counter Postgres RPC uses INSERT ... ON CONFLICT DO UPDATE ... RETURNING to atomically generate unique sequential codes. Two simultaneous requests are guaranteed to get different numbers.' },
              { num: '03', title: 'Live Code Preview in Category Modal', color: '#10b981', impact: 'Consultants see exactly what code will be assigned before committing. Zero confusion about code structure or sequencing.', desc: 'When the consultant selects Region and Group Type, the generated code (e.g. AH26-DOM-FIT007) appears in real time with a 500ms debounce. The counter is fetched from an in-memory cache to avoid redundant Supabase calls.' },
              { num: '04', title: 'Travel Date Propagation', color: '#f59e0b', impact: 'Eliminated a 3–5 minute manual task that was error-prone — consultants previously miscounted dates on longer itineraries.', desc: 'When the travel start date is changed in Step 1, all day-plan dates in Step 2 are recalculated using date-fns/addDays. No manual re-entry of individual day dates.' },
              { num: '05', title: 'PDF Quality Fallback Pipeline', color: '#ef4444', impact: 'PDF export has a 100% success rate regardless of itinerary length. No failed exports, no manual quality adjustments.', desc: 'PDF export uses html-to-image to capture the preview, then jsPDF to render it. If the resulting file exceeds 10MB, the generator automatically retries at lower quality presets (4 tiers: 2x/0.92 to 1x/0.7) until it succeeds.' },
              { num: '06', title: 'In-Memory Search Index', color: '#00AAFF', impact: 'Full-text search across 50,000+ records completes in <5ms. Finding any past itinerary is instant — no more scrolling through Google Drive.', desc: 'The itinerary store builds a lowercase search index across client name, destination, code, and consultant name on fetch. Searching uses String.includes() across this pre-built index.' },
              { num: '07', title: 'Dashboard Analytics from Same Cache', color: '#ec4899', impact: 'Gave the business owner real-time analytics for the first time — itinerary count, region distribution, consultant output — with zero additional database cost.', desc: 'The Dashboard KPIs, donut charts, and consultant bar chart all derive from the same ItineraryStore in-memory cache — no separate analytics queries. Filters (date range, region, group type) are applied client-side.' },
              { num: '08', title: 'Unsaved Changes Triple-Lock', color: '#f59e0b', impact: 'Eliminated accidental data loss — previously the #1 frustration reported by consultants when the Word file crashed or they forgot to save.', desc: 'Preview button disabled + close modal confirmation + browser beforeunload. The Studio compares live state against initial snapshots using JSON.stringify diff to detect any change.' },
            ].map(({ num, title, color, impact, desc }) => (
              <div key={num} style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-5 px-6 py-5" style={{ background: 'var(--surface)' }}>
                  <span className="font-display font-black shrink-0"
                    style={{ fontSize: '2rem', color, lineHeight: 1, letterSpacing: '-0.04em', opacity: 0.8 }}>
                    {num}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold mb-2 text-sm" style={{ color }}>{title}</p>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    <div className="flex items-start gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="text-xs font-bold uppercase tracking-[0.12em] shrink-0" style={{ color }}>Impact</span>
                      <span className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>{impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 10 — Results & Impact */}
      <SectionWrapper id="results" number="10" title="Results & Impact">
        <div className="container-pad pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--accent)' }}>
            Key Metrics
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px mb-14" style={{ background: 'var(--border)' }}>
            {[
              { value: '45→12min', label: 'ITINERARY CREATION (NEW)', color: '#3b82f6' },
              { value: '45→5min', label: 'ITINERARY CREATION (DUPLICATE)', color: '#8b5cf6' },
              { value: '~15%→0%', label: 'CODE COLLISIONS', color: '#10b981' },
              { value: '0→80%', label: 'DAY-PLAN CONTENT REUSE', color: '#f59e0b' },
              { value: '100%', label: 'PDF EXPORT SUCCESS RATE', color: '#10b981' },
              { value: '<5ms', label: 'SEARCH TIME ACROSS ALL RECORDS', color: '#00AAFF' },
            ].map(({ value, label, color }) => (
              <div key={label} className="p-10 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.05]"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }} />
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', lineHeight: 1, color, letterSpacing: '-0.03em' }}>
                  {value}
                </p>
                <p className="text-xs font-bold tracking-[0.15em] relative" style={{ color: 'var(--text-dim)' }}>{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Before & After
          </p>
          <div className="overflow-x-auto mb-14">
            <table className="w-full min-w-[560px] text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid var(--border)', borderBottomColor: '#ef4444', borderBottomWidth: 2 }}>
                    Before AH-Itinerary
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid var(--border)', borderBottomColor: '#10b981', borderBottomWidth: 2 }}>
                    After AH-Itinerary
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['45–60 min per itinerary in Word', '8–12 min via 4-step wizard; ~5 min for duplicates'],
                  ['Every day plan re-typed from scratch', 'Keyword library: search, select, customise — 80% content reuse'],
                  ['Consultants maintained own numbering', 'Atomic sequential codes — globally unique, zero collisions'],
                  ['Inconsistent branding across PDFs', 'Single branded template — every PDF looks identical'],
                  ['Past itineraries buried in Google Drive', 'Instant search across all records in <5ms'],
                  ['Zero analytics on volume or performance', 'Live dashboard — KPIs, region donut, consultant bar chart'],
                  ['PDF exports failed or looked broken', '4-tier quality fallback — 100% export success rate'],
                  ['Accidental data loss from Word crashes', 'Triple-lock: disabled preview + close modal + beforeunload'],
                ].map(([before, after], i) => (
                  <tr key={i}>
                    <td className="px-5 py-4 text-xs leading-relaxed"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                      {before}
                    </td>
                    <td className="px-5 py-4 text-xs leading-relaxed"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                      {after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: 'var(--accent)' }}>
            Time Savings — Weekly Impact
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
            For a team of 4 consultants creating an average of 6 itineraries per week each:
          </p>
          <div style={{ border: '1px solid var(--border)' }}>
            {[
              { label: 'Before', value: '4 consultants × 6 itineraries × 50 min = 20 hours/week on document creation', highlight: false },
              { label: 'After (new)', value: '4 × 6 × 12 min = 4.8 hours/week (saving 15.2 hours)', highlight: false },
              { label: 'After (with duplicates)', value: 'Assuming 50% are duplicates: 4 × 3 × 12 min + 4 × 3 × 5 min = 3.4 hours/week (saving 16.6 hours)', highlight: false },
              { label: 'Weekly Time Saved', value: '15–17 hours/week — redirected from formatting to client conversations and follow-ups', highlight: true },
            ].map(({ label, value, highlight }, i, arr) => (
              <div key={label} className="flex gap-6 px-6 py-4"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined, background: highlight ? 'rgba(0,170,255,0.05)' : 'var(--surface)' }}>
                <span className="text-xs font-bold uppercase tracking-[0.12em] shrink-0 w-40 pt-0.5"
                  style={{ color: highlight ? 'var(--accent)' : 'var(--text-dim)' }}>{label}</span>
                <span className="text-sm leading-relaxed" style={{ color: highlight ? 'var(--text)' : 'var(--text-muted)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 11 — Reflection */}
      <SectionWrapper id="reflection" number="11" title="Reflection">
        <div className="container-pad pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: '#10b981' }}>
                What Worked
              </p>
              <div className="space-y-4">
                {[
                  { title: 'The keyword library', desc: 'This single feature eliminated more wasted time than everything else combined. Consultants went from re-typing to selecting.' },
                  { title: 'The 4-step wizard', desc: 'Breaking the unstructured Word document into 4 discrete steps gave consultants a clear progression and reduced cognitive load.' },
                  { title: 'Atomic code generation', desc: 'A backend-enforced guarantee that solved a business-logic problem no UI-level fix could address.' },
                  { title: 'PDF quality fallback', desc: 'The 4-tier retry pipeline means exports never fail, regardless of itinerary length or image quality.' },
                  { title: 'The management table', desc: 'Instant search transformed retrieval from a 10-minute Google Drive dig to a <5ms query.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: '#10b981' }}>→</span>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: '#f59e0b' }}>
                What I Would Do Differently
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Add collaborative editing', desc: 'Currently only one person can edit an itinerary at a time. Supabase Realtime could enable live collaboration.' },
                  { title: 'Build a template system', desc: 'Beyond keywords, full itinerary templates (entire 5-day Kerala packages) would further reduce creation time.' },
                  { title: 'Add version history', desc: 'Currently, edits overwrite the original. A simple version log would let consultants revert changes.' },
                  { title: 'Implement proper authentication', desc: "The current open-access model works for a small team but won't scale. Role-based access would add accountability." },
                  { title: 'Run formal usability testing', desc: 'Design decisions were validated through shadow sessions and feedback, not structured usability tests with task completion metrics.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-sm shrink-0 mt-0.5" style={{ color: '#f59e0b' }}>→</span>
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 mb-8" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)' }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'var(--text-dim)' }}>
              Design Pivots — Documented in Code
            </p>
            <div className="space-y-3">
              {[
                'Dashboard v1 (~1,400 lines of commented-out code with 20+ widget types) was replaced by a leaner KPI-focused version — reflecting a pivot from complexity to clarity.',
                'Step 1 had an earlier version without the ConsultantSelect integration — the old version is preserved in comments above the active code.',
                'Step 4 bank details section was built, integrated into the data model and PDF preview, then removed from the active form based on business feedback — kept in the schema for potential reactivation.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>0{i + 1}</span>
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <EditorialQuote label="Closing Thought">
          The highest-impact design work in this project was not visual — it was structural. Breaking an
          unstructured 60-minute Word document workflow into a 4-step guided wizard with reusable content,
          automatic formatting, and one-click export transformed document creation from a time sink into a
          competitive advantage. The consultants who used to spend 20 hours a week formatting now spend that
          time talking to clients.
        </EditorialQuote>
      </SectionWrapper>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// GENERIC CASE STUDY
// ─────────────────────────────────────────────────────────

function CaseSection({ id, number, title, subtitle, children }: {
  id: string; number: string; title: string; subtitle: string; children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section ref={ref} id={id} className="relative overflow-hidden border-b border-border scroll-mt-24">
      <div
        aria-hidden
        className="absolute top-0 right-0 font-display font-black select-none pointer-events-none leading-none"
        style={{
          fontSize: 'clamp(8rem, 22vw, 18rem)',
          color: 'var(--border)',
          opacity: 0.5,
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
        }}
      >
        {number}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container-pad relative pt-20 pb-12"
      >
        <span className="block text-xs font-bold uppercase tracking-[0.22em] mb-5" style={{ color: 'var(--accent)' }}>
          {number}
        </span>
        <h2 className="display-md mb-3">{title}</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-dim)' }}>{subtitle}</p>
        <div className="h-px" style={{ background: 'linear-gradient(to right, var(--accent), transparent 55%)' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="container-pad pb-20"
      >
        {children}
      </motion.div>
    </section>
  )
}

function GenericCaseStudy({ project }: { project: typeof projects[0] }) {
  return (
    <>
      <CaseSection id="empathize" number="01" title="Empathize" subtitle="Understanding the people, context, and environment">
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.problem}</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Stakeholder Interviews', 'Workflow Observation', 'Process Documentation', 'Pain Point Mapping'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4" style={{ border: '1px solid var(--border)' }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="define" number="02" title="Define" subtitle="Naming the real problem behind the symptoms">
        <div className="p-8 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--accent)' }}>
            Problem Statement
          </p>
          <p className="text-xl leading-relaxed" style={{ color: 'var(--text)' }}>{project.problem}</p>
        </div>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          After research, the core constraint became clear: the issue was not a lack of tools, but a lack of structure
          in how information flowed through the organization. The problem was systemic, not technological.
        </p>
      </CaseSection>

      <CaseSection id="ideate" number="03" title="Ideate" subtitle="Exploring directions before committing">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {[
            { label: 'Minimal Path', desc: 'Solves the core constraint with least complexity. Fastest to implement, lowest maintenance overhead.' },
            { label: 'Full Path', desc: 'Solves the constraint completely with all identified touchpoints addressed and automation integrated.', selected: true },
            { label: 'Future Path', desc: 'Solves the constraint and enables scale. Designed for 3× current team and operation size.' },
          ].map((opt, i) => (
            <div key={i} className="p-8" style={{ background: opt.selected ? 'var(--surface)' : 'var(--bg)' }}>
              <p className="label mb-3">Option 0{i + 1}</p>
              <h4 className="display-sm mb-3" style={{ color: opt.selected ? 'var(--accent)' : 'var(--text)' }}>
                {opt.label}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
              {opt.selected && (
                <p className="text-xs font-bold uppercase tracking-[0.15em] mt-6" style={{ color: 'var(--accent)' }}>
                  → Selected
                </p>
              )}
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="design" number="04" title="Design" subtitle="Translating decisions into concrete systems">
        <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>{project.solution}</p>
        <div className="relative aspect-[16/9] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <Image src={project.mockup} alt="Design mockup" fill className="object-cover" sizes="80vw" />
        </div>
      </CaseSection>

      <CaseSection id="ia" number="05" title="Information Architecture" subtitle="Structure, hierarchy, and flow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {[
            { layer: 'L1', name: 'Data Input', desc: 'Forms, imports, and manual entry points that feed the system.' },
            { layer: 'L2', name: 'Processing', desc: 'Automation, logic, and routing that processes information.' },
            { layer: 'L3', name: 'Output', desc: 'Dashboards, reports, and views that surface information to users.' },
          ].map((item, i) => (
            <div key={i} className="p-8" style={{ background: 'var(--surface)' }}>
              <p className="font-display font-black mb-5"
                style={{ fontSize: '3rem', lineHeight: 1, color: 'var(--border-strong)', letterSpacing: '-0.04em' }}>
                {item.layer}
              </p>
              <h4 className="display-sm mb-3">{item.name}</h4>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              {i < 2 && (
                <p className="text-xs font-bold uppercase tracking-[0.15em] mt-5" style={{ color: 'var(--text-dim)' }}>
                  → feeds into L{i + 2}
                </p>
              )}
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="build" number="06" title="Build" subtitle="Implementation, tools, and process">
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 text-sm"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--accent)', background: 'rgba(0,170,255,0.06)' }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {['Week 1-2: Data architecture and base structure', 'Week 3-4: Automation flows and integrations', 'Week 5: Interface design and user testing', 'Week 6+: Iteration, documentation, and handoff'].map((phase, i) => (
            <div key={i} className="flex items-start gap-4 px-6 py-4" style={{ border: '1px solid var(--border)' }}>
              <span className="text-xs font-bold uppercase tracking-[0.15em] shrink-0" style={{ color: 'var(--accent)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{phase}</span>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection id="result" number="07" title="Result" subtitle="Metrics, impact, and outcomes">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-12" style={{ background: 'var(--border)' }}>
          {project.metrics.map((m, i) => {
            const { num, unit } = splitMetric(m.value)
            return (
              <div key={i} className="p-10 text-center relative overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ background: 'radial-gradient(circle at 50% 0%, var(--accent), transparent 70%)' }} />
                <p className="font-display font-black mb-3 relative"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--accent)' }}>
                  <CountUp value={num} suffix={unit + m.suffix} />
                </p>
                <p className="text-xs font-bold tracking-[0.15em] relative" style={{ color: 'var(--text-dim)' }}>
                  {m.label}
                </p>
              </div>
            )
          })}
        </div>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.result}</p>
      </CaseSection>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// SECTION NAV CONFIGS
// ─────────────────────────────────────────────────────────

const AH_CRM_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The Problem' },
  { id: 'research', label: 'Research' },
  { id: 'personas', label: 'Personas' },
  { id: 'ia', label: 'Information Architecture' },
  { id: 'design-decisions', label: 'Design Decisions' },
  { id: 'results', label: 'Results' },
  { id: 'reflection', label: 'Reflection' },
]

const AH_ITINERARY_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The Problem' },
  { id: 'research', label: 'Research' },
  { id: 'personas', label: 'Personas' },
  { id: 'journey', label: 'Journey Map' },
  { id: 'ia', label: 'Architecture' },
  { id: 'user-flows', label: 'User Flows' },
  { id: 'studio', label: '4-Step Studio' },
  { id: 'decisions', label: 'Design Decisions' },
  { id: 'results', label: 'Results' },
  { id: 'reflection', label: 'Reflection' },
]

const GENERIC_SECTIONS = [
  { id: 'empathize', label: 'Empathize' },
  { id: 'define', label: 'Define' },
  { id: 'ideate', label: 'Ideate' },
  { id: 'design', label: 'Design' },
  { id: 'ia', label: 'Information Architecture' },
  { id: 'build', label: 'Build' },
  { id: 'result', label: 'Result' },
]

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────

export default function ProjectDetailClient({ project }: { project: typeof projects[0] }) {
  const idx = projects.findIndex((p) => p.id === project.id)
  const prev = projects[idx - 1]
  const next = projects[idx + 1]
  const isAHCRM = project.slug === 'ah-crm'
  const isAHItinerary = project.slug === 'ah-itinerary'
  const sections = isAHCRM ? AH_CRM_SECTIONS : isAHItinerary ? AH_ITINERARY_SECTIONS : GENERIC_SECTIONS

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o?: { offset?: number }) => void } }).lenis
    if (lenis) lenis.scrollTo(el, { offset: -80 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="pt-14">
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative h-[80vh] flex items-end overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image src={project.image} alt={project.name} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(7,7,7,0.96) 0%, rgba(7,7,7,0.6) 45%, rgba(7,7,7,0.1) 100%)' }} />
        </div>

        <div className="relative z-10 container-pad pb-16 w-full">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm mb-10 transition-colors duration-200 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)' }}
          >
            <ChevronLeft className="w-4 h-4" /> All Projects
          </Link>

          {/* Chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            {[project.category, project.duration, project.year].map((chip) => (
              <span key={chip} className="text-xs font-bold uppercase tracking-[0.18em] px-3 py-1.5"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.06)',
                }}>
                {chip}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="display-lg mb-5 text-white"
          >
            {project.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {project.tagline}
          </motion.p>
        </div>
      </section>

      {/* ── Section nav ─────────────────────────────────── */}
      <div className="container-pad border-b border-border">
        <div className="flex flex-wrap gap-1.5 py-5 overflow-x-auto">
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => scrollToSection(e, s.id)}
              className="flex items-center gap-2.5 px-4 py-2 transition-all duration-200 cursor-pointer"
              style={{ border: '1px solid var(--border)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)' }}
            >
              <span className="text-xs font-bold" style={{ color: 'var(--border-strong)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>
                {s.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Case study body ─────────────────────────────── */}
      {isAHCRM ? <AHCRMCaseStudy /> : isAHItinerary ? <AHItineraryCaseStudy /> : <GenericCaseStudy project={project} />}

      {/* ── Project navigation ───────────────────────────── */}
      <div className="container-pad py-16 border-t border-border">
        <div className="flex items-center justify-between">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="btn-secondary cursor-pointer group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150" />
              {prev.name}
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="btn-primary cursor-pointer group">
              {next.name}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </main>
  )
}
