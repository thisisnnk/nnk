'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { projects } from '@/lib/data'
import {
  getCaseStudy,
  type CaseStudy,
  type Persona,
  type Method,
  type Feature,
  type BuildOption,
  type SitemapNode,
} from '@/lib/case-studies'
import CaseHero from '@/components/case/CaseHero'
import SectionShell from '@/components/case/SectionShell'
import { RevealHeading, RevealText, Reveal, Stagger, StaggerItem } from '@/components/case/Reveal'
import EditorialQuote from '@/components/case/EditorialQuote'
import MetricBento from '@/components/case/MetricBento'
import { BentoGrid, BentoCard } from '@/components/case/Bento'
import { Illustration3D } from '@/components/case/Illustration3D'
import AccessArchitecture from '@/components/case/AccessArchitecture'
import AppSitemap from '@/components/case/AppSitemap'
import ItineraryUserFlow from '@/components/case/ItineraryUserFlow'
import GoogleFormMock from '@/components/case/GoogleFormMock'
import EmpathyMap from '@/components/case/EmpathyMap'
import QuantReport from '@/components/case/QuantReport'
import FindingsBento from '@/components/case/FindingsBento'
import ResultCards from '@/components/case/ResultCards'
import SystemBuildScroll from '@/components/case/SystemBuildScroll'
import WireframeBento from '@/components/case/WireframeBento'
import CaseOverview from '@/components/case/CaseOverview'

type Project = (typeof projects)[number]

const EASE = [0.16, 1, 0.3, 1] as const

// Coordinated cascade for inline lists (goals, frustrations, bullets, rows).
const LIST_CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
}
const LIST_ITEM: Variants = {
  hidden: { opacity: 0, x: -10, filter: 'blur(4px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
}
// Vertical-rise item — used where a wrapper div would break a grid's
// equal-height stretch (e.g. the hairline-gap option grid), so the animated
// element must BE the grid cell rather than wrap it.
const CARD_ITEM: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE } },
}

// ─────────────────────────────────────────────────────────
// SHARED — sub-section header (also the in-page scroll anchor)
// ─────────────────────────────────────────────────────────

function SubHead({
  id,
  kicker,
  title,
  desc,
}: {
  id: string
  kicker: string
  title: string
  desc?: string
}) {
  const reduce = useReducedMotion()
  return (
    <div id={id} className="container-pad scroll-mt-28 pt-10 md:pt-16">
      <RevealText
        className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
        style={{ color: 'var(--accent)' }}
        y={12}
      >
        {kicker}
      </RevealText>
      <RevealHeading text={title} as="h3" className="display-sm" style={{ color: 'var(--text)' }} />
      {desc && (
        <RevealText
          className="text-base leading-relaxed mt-4 max-w-3xl"
          style={{ color: 'var(--text-muted)' }}
          delay={0.1}
        >
          {desc}
        </RevealText>
      )}
      <motion.div
        className="h-px w-full mt-7 origin-left"
        style={{ background: 'var(--border)' }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={reduce ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SHARED — building blocks
// ─────────────────────────────────────────────────────────

function MethodsTimeline({ methods }: { methods: Method[] }) {
  const reduce = useReducedMotion()
  return (
    <Stagger className="mb-14" delayChildren={0.05}>
      {methods.map(({ method, desc }, i, arr) => (
        <StaggerItem key={method} className="flex gap-6" y={14}>
          <div className="flex flex-col items-center">
            <motion.div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-display"
              style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)', background: 'var(--bg)' }}
              initial={reduce ? false : { scale: 0.3, opacity: 0 }}
              whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-12%' }}
              transition={reduce ? undefined : { type: 'spring', stiffness: 360, damping: 15, delay: 0.12 }}
            >
              {i + 1}
            </motion.div>
            {i < arr.length - 1 && (
              <motion.div
                className="w-px flex-1 mt-1 origin-top"
                style={{ background: 'var(--border)' }}
                initial={reduce ? false : { scaleY: 0 }}
                whileInView={reduce ? undefined : { scaleY: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
              />
            )}
          </div>
          <div className="pb-8 flex-1">
            <p className="font-semibold mb-2" style={{ color: 'var(--text)' }}>{method}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function PersonaCard({ p }: { p: Persona }) {
  const reduce = useReducedMotion()
  const initials = p.name.split(' ').map((n) => n[0]).join('')

  const listProps = reduce
    ? {}
    : ({
        variants: LIST_CONTAINER,
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once: true, margin: '-8%' },
      } as const)

  return (
    <motion.div
      className="overflow-hidden"
      style={{ border: '1px solid var(--border)', willChange: 'transform, opacity, filter' }}
      initial={reduce ? false : { opacity: 0, y: 28, filter: 'blur(8px)' }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      whileHover={reduce ? undefined : { y: -4, boxShadow: `0 28px 56px -32px ${p.color}80` }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 1.05, ease: EASE }}
    >
      <div className="px-6 py-5 flex items-center justify-between gap-4" style={{ background: p.color }}>
        <div className="flex items-center gap-4">
          <motion.div
            className="w-11 h-11 rounded-full flex items-center justify-center font-display font-black text-sm shrink-0"
            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', letterSpacing: '-0.02em' }}
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={reduce ? undefined : { type: 'spring', stiffness: 320, damping: 16, delay: 0.18 }}
          >
            {initials}
          </motion.div>
          <div>
            <p className="font-bold text-base text-white leading-tight">{p.name}</p>
            <p className="text-sm opacity-75 text-white">{p.role} · {p.age}</p>
          </div>
        </div>
        {p.badge && (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 shrink-0"
            style={{ border: '1px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.9)' }}
          >
            {p.badge}
          </span>
        )}
      </div>

      <div className="p-6" style={{ background: `${p.color}08` }}>
        <p className="text-sm leading-relaxed italic mb-6" style={{ color: 'var(--text-muted)' }}>{p.bio}</p>

        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: p.color }}>Goals</p>
        <motion.ul className="space-y-2 mb-6" {...listProps}>
          {p.goals.map((g, i) => (
            <motion.li
              key={i}
              className="text-sm flex gap-2.5 items-start"
              style={{ color: 'var(--text-muted)' }}
              variants={reduce ? undefined : LIST_ITEM}
            >
              <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: p.color }} />
              {g}
            </motion.li>
          ))}
        </motion.ul>

        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#ef4444' }}>Frustrations</p>
        <motion.ul className="space-y-2 mb-6" {...listProps}>
          {p.frustrations.map((f, i) => (
            <motion.li
              key={i}
              className="text-sm flex gap-2.5 items-start"
              style={{ color: 'var(--text-muted)' }}
              variants={reduce ? undefined : LIST_ITEM}
            >
              <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: '#ef4444' }} />
              {f}
            </motion.li>
          ))}
        </motion.ul>

        <p
          className="text-sm italic leading-relaxed"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
        >
          {p.quote}
        </p>
      </div>
    </motion.div>
  )
}

function FindingsList({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <Stagger className="space-y-3" delayChildren={0.05}>
      {items.map(({ title, desc }, i) => (
        <StaggerItem key={i} y={16}>
          <div
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
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function Sitemap({ nodes }: { nodes: SitemapNode[] }) {
  return (
    <Stagger style={{ border: '1px solid var(--border)' }} delayChildren={0.04}>
      {nodes.map((n, i, arr) => (
        <StaggerItem
          key={i}
          className="flex flex-col sm:flex-row gap-1.5 sm:gap-6 px-6 py-4"
          style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}
          y={12}
        >
          <div className="flex items-center gap-2 shrink-0 sm:w-72 pt-0.5">
            {n.color && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: n.color }} />}
            <code className="text-xs font-mono font-bold break-words" style={{ color: 'var(--accent)' }}>{n.route}</code>
          </div>
          <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{n.desc}</span>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function EntityChain({ items }: { items: string[] }) {
  return (
    <Reveal className="p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
        Every record traces back to its origin — one connected chain, end to end:
      </p>
      <Stagger className="flex flex-wrap items-center gap-2" delayChildren={0.1}>
        {items.map((entity, i, arr) => (
          <StaggerItem key={entity} className="flex items-center gap-2" y={8}>
            <span
              className="px-3 py-1.5 text-xs font-mono"
              style={{ background: 'rgba(0,170,255,0.07)', color: 'var(--accent)', border: '1px solid var(--border-strong)' }}
            >
              {entity}
            </span>
            {i < arr.length - 1 && <span className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>→</span>}
          </StaggerItem>
        ))}
      </Stagger>
    </Reveal>
  )
}

function BuildOptions({ label, options }: { label: string; options: BuildOption[] }) {
  return (
    <div className="mb-14">
      <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }} y={12}>
        {label}
      </RevealText>
      <Stagger
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{ background: 'var(--border)' }}
        delayChildren={0.05}
      >
        {options.map((opt, i) => (
          <motion.div
            key={i}
            className="p-7"
            style={{ background: opt.selected ? 'var(--surface)' : 'var(--bg)' }}
            variants={CARD_ITEM}
          >
            <p className="label mb-3">Option {String(i + 1).padStart(2, '0')}</p>
            <h4
              className="font-display font-bold mb-3"
              style={{ fontSize: '1.15rem', lineHeight: 1.2, letterSpacing: '-0.01em', color: opt.selected ? 'var(--accent)' : 'var(--text)' }}
            >
              {opt.label}
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
            {opt.selected && (
              <p className="text-xs font-bold uppercase tracking-[0.15em] mt-6" style={{ color: 'var(--accent)' }}>→ Selected</p>
            )}
          </motion.div>
        ))}
      </Stagger>
    </div>
  )
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <Stagger style={{ border: '1px solid var(--border)' }} delayChildren={0.05}>
      {features.map((f, i) => (
        <StaggerItem
          key={i}
          className="p-6 md:p-8 flex items-start gap-4 md:gap-6"
          style={{ background: 'var(--surface)', borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
          y={16}
        >
          <span
            className="font-display font-black shrink-0"
            style={{ fontSize: '2rem', lineHeight: 1, color: f.color ?? 'var(--border-strong)', letterSpacing: '-0.04em', minWidth: '3rem', opacity: 0.85 }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="flex-1">
            <p className="font-semibold text-lg mb-3" style={{ color: f.color ?? 'var(--accent)' }}>{f.title}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
            {f.impact && (
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold uppercase tracking-widest shrink-0 mt-0.5" style={{ color: '#10b981' }}>Impact:</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{f.impact}</span>
              </div>
            )}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Stagger className="space-y-2" delayChildren={0.05}>
      {items.map((s, i) => (
        <StaggerItem
          key={i}
          className="flex items-start gap-3 px-5 py-3"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          y={12}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'var(--accent)' }} />
          <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s}</span>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

// ─────────────────────────────────────────────────────────
// THE UNIFIED CASE STUDY — one structure for every project
//   01 Overview · 02 Research · 03 Idea · 04 Results
// ─────────────────────────────────────────────────────────

function CaseStudyView({ cs }: { cs: CaseStudy }) {
  return (
    <>
      {/* 01 — Project Overview */}
      <SectionShell id="overview" number="01" title="Project Overview" subtitle="Adventure Holidays — Coimbatore, Tamil Nadu" compact>
        <div className="container-pad pb-20">
          {cs.overview.projectHero ? (
            <CaseOverview
              problem={cs.overview.projectHero?.problem}
              metaCards={cs.overview.metaCards}
              scaleItems={cs.overview.scaleItems}
              techStack={cs.overview.techStack}
              tools={cs.overview.tools}
              outcome={cs.overview.outcome}
            />
          ) : (
            <>
              {cs.overview.facts.length > 0 && (
                <div className="mb-14" style={{ border: '1px solid var(--border)' }}>
                  {cs.overview.facts.map((f, i, arr) => (
                    <div
                      key={f.label}
                      className="flex flex-col sm:flex-row gap-1 sm:gap-6 px-6 py-4"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : undefined }}
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.12em] shrink-0 sm:w-28 pt-0.5" style={{ color: 'var(--accent)' }}>{f.label}</span>
                      <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {cs.overview.glance.length > 0 && (
                <>
                  <p className="label mb-5">{cs.overview.glanceLabel ?? 'At a Glance'}</p>
                  <BentoGrid cols={3} className="mb-3">
                    {cs.overview.glance.map((g) => (
                      <BentoCard key={g.title} accent={g.accent} className="flex flex-col items-center text-center gap-4">
                        <Illustration3D name={g.name} size={146} />
                        <div>
                          <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>{g.title}</p>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{g.body}</p>
                        </div>
                      </BentoCard>
                    ))}
                  </BentoGrid>
                </>
              )}

              {cs.overview.stats.length > 0 && (
                <MetricBento columns={3} items={cs.overview.stats} className="mt-3" />
              )}
            </>
          )}
        </div>
      </SectionShell>

      {/* 02 — Research */}
      <SectionShell
        id="research"
        number="02"
        title="Research"
        subtitle="Qualitative and quantitative research into how the work actually happens — converging on a refined problem statement."
      >
        {/* Qualitative → User Personas */}
        <SubHead
          id="qualitative"
          kicker="02 · Qualitative Research"
          title="Qualitative Research — User Personas"
          desc={cs.qualitative.intro}
        />
        <div className="container-pad pt-10 pb-4">
          {cs.qualitative.methods && cs.qualitative.methods.length > 0 && (
            <>
              <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: 'var(--accent)' }} y={12}>
                Research Methods
              </RevealText>
              <MethodsTimeline methods={cs.qualitative.methods} />
            </>
          )}
          {cs.qualitative.personas.length > 0 && (
            <div className="space-y-16 md:space-y-28 lg:space-y-48">
              {cs.qualitative.personas.map((p) => (
                <div key={p.name} className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                  <div className="lg:col-span-2">
                    <PersonaCard p={p} />
                  </div>
                  <div className="lg:col-span-3">
                    <EmpathyMap p={p} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantitative → Google Form surveys */}
        <SubHead
          id="quantitative"
          kicker="02 · Quantitative Research"
          title="Quantitative Research — Surveys"
          desc={cs.quantitative.intro}
        />
        <div className="container-pad pt-10 pb-4">
          {cs.quantitative.report ? (
            <div className="mb-12">
              <QuantReport report={cs.quantitative.report} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 items-start">
              {cs.quantitative.surveys.map((s, i) => (
                <GoogleFormMock
                  key={i}
                  title={s.title}
                  description={s.description}
                  responses={s.responses}
                  questions={s.questions}
                />
              ))}
            </div>
          )}
          {cs.quantitative.stats && cs.quantitative.stats.length > 0 && (
            <MetricBento columns={3} items={cs.quantitative.stats} className="mb-10" />
          )}
          {cs.quantitative.takeaways && cs.quantitative.takeaways.length > 0 && (
            <BulletList items={cs.quantitative.takeaways} />
          )}
        </div>

        {/* Research Findings */}
        <SubHead
          id="findings"
          kicker="02 · Research Findings"
          title="Key Findings"
          desc={cs.findings.intro}
        />
        <div className="container-pad pt-10 pb-4">
          {cs.findings.bento && cs.findings.bento.length > 0 ? (
            <FindingsBento items={cs.findings.bento} />
          ) : (
            <FindingsList items={cs.findings.items} />
          )}
        </div>

        {/* Refined Problem Statement */}
        <div id="problem" className="scroll-mt-28 pt-12">
          <EditorialQuote label="Refined Problem Statement">{cs.problemStatement}</EditorialQuote>
        </div>
      </SectionShell>

      {/* 03 — Idea */}
      <SectionShell
        id="idea"
        number="03"
        title="Idea"
        subtitle="The solution to the refined problem — its information architecture and the system built from it."
      >
        <div className="container-pad pt-2 pb-2">
          <RevealText className="text-lg leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            {cs.idea.intro}
          </RevealText>
        </div>

        {/* Information Architecture */}
        <SubHead
          id="ia"
          kicker="03 · Information Architecture"
          title="Information Architecture"
          desc={cs.idea.ia.intro}
        />
        <div className="container-pad pt-10 pb-4">
          {cs.idea.ia.roleSitemaps ? (
            <div className="mb-14">
              <AppSitemap />
            </div>
          ) : (
            cs.idea.ia.sitemap && cs.idea.ia.sitemap.length > 0 && (
              <div className="mb-14">
                <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }} y={12}>
                  System Sitemap
                </RevealText>
                <Sitemap nodes={cs.idea.ia.sitemap} />
              </div>
            )
          )}

          {cs.idea.ia.userFlow && (
            <div className="mb-14">
              <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }} y={12}>
                User Flow
              </RevealText>
              <ItineraryUserFlow />
            </div>
          )}

          {cs.idea.ia.accessArchitecture && (
            <div className="mb-14">
              <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--accent)' }} y={12}>
                Page-Level Access Map
              </RevealText>
              <RevealText className="text-sm leading-relaxed mb-6 max-w-3xl" style={{ color: 'var(--text-muted)' }} delay={0.08}>
                Beneath the role landing pages sits a fully enforced access model — 25 pages across 7 functional modules, each gated at the database level.
              </RevealText>
              <AccessArchitecture />
            </div>
          )}

          {cs.idea.ia.entityChain && cs.idea.ia.entityChain.length > 0 && (
            <div>
              <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }} y={12}>
                Core Entity Relationship
              </RevealText>
              <EntityChain items={cs.idea.ia.entityChain} />
            </div>
          )}
        </div>

        {/* Wireframes */}
        {cs.idea.wireframes && cs.idea.wireframes.length > 0 && (
          <>
            <SubHead
              id="wireframes"
              kicker="03 · Wireframes"
              title="Wireframes"
            />
            <div className="container-pad pt-8 pb-4">
              <WireframeBento images={cs.idea.wireframes} />
            </div>
          </>
        )}

        {/* System Build */}
        <SubHead
          id="system-build"
          kicker="03 · System Build"
          title="System Build"
          desc={cs.idea.systemBuild.what}
        />
        {cs.idea.systemBuild.screens && cs.idea.systemBuild.screens.length > 0 && (
          <div className="container-pad pt-10 pb-4">
            <SystemBuildScroll screens={cs.idea.systemBuild.screens} />
          </div>
        )}
        {((cs.idea.systemBuild.options && cs.idea.systemBuild.options.length > 0) ||
          (cs.idea.systemBuild.features && cs.idea.systemBuild.features.length > 0)) && (
          <div className="container-pad pt-10 pb-4">
            {cs.idea.systemBuild.options && cs.idea.systemBuild.options.length > 0 && (
              <BuildOptions label={cs.idea.systemBuild.optionsLabel ?? 'Options'} options={cs.idea.systemBuild.options} />
            )}
            {cs.idea.systemBuild.features && cs.idea.systemBuild.features.length > 0 && (
              <>
                <RevealText className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color: 'var(--accent)' }} y={12}>
                  Features
                </RevealText>
                <FeatureList features={cs.idea.systemBuild.features} />
              </>
            )}
          </div>
        )}
      </SectionShell>

      {/* 04 — Results */}
      <SectionShell
        id="results"
        number="04"
        title="Results"
        subtitle="What changed once the system was running in the live office environment."
      >
        <div className="container-pad pb-20">
          {cs.results.intro && (
            <RevealText className="text-lg leading-relaxed max-w-3xl mb-12" style={{ color: 'var(--text-muted)' }}>
              {cs.results.intro}
            </RevealText>
          )}

          {cs.results.resultCards && cs.results.resultCards.length > 0 ? (
            <ResultCards items={cs.results.resultCards} />
          ) : cs.results.metrics.length > 0 ? (
            <MetricBento columns={3} items={cs.results.metrics} />
          ) : null}
        </div>
      </SectionShell>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────

export default function ProjectDetailClient({ project }: { project: Project }) {
  const idx = projects.findIndex((p) => p.id === project.id)
  const prev = projects[idx - 1]
  const next = projects[idx + 1]
  const cs = getCaseStudy(project)

  return (
    <main>
      {/* ── Hero — cinematic parallax + floating 3D mockup ── */}
      <CaseHero project={project} />

      {/* ── Case study body — unified 4-phase structure ──── */}
      <CaseStudyView cs={cs} />

      {/* ── Project navigation ───────────────────────────── */}
      <div className="container-pad py-12 md:py-16 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
