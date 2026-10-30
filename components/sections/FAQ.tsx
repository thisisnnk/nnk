'use client'
import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { faqs } from '@/lib/data'
import ShinyButton from '@/components/ui/ShinyButton'
import { useContact } from '@/components/ui/ContactChooser'

const PER_PAGE = 5
const PAGES = Math.ceil(faqs.length / PER_PAGE)
const EASE = [0.16, 1, 0.3, 1] as const

/* ── Looping landscape scene — ask → WhatsApp chat → reply comes back ─────
   One shared 7s SMIL clock keeps every beat in sync:
   0.00 question bubble pops by her head → 0.08–0.28 flies to the phone →
   0.40 typing dots → 0.58 reply + read ticks → 0.66–0.84 reply flies back →
   0.84 check burst → 0.94 phone clears and the loop restarts. */
const LOOP = '7s'

function Beat({ on, off, still, children }: { on: number; off: number; still: boolean; children: React.ReactNode }) {
  if (still) return <g>{children}</g>
  return (
    <g opacity="0">
      <animate
        attributeName="opacity"
        values="0;0;1;1;0;0"
        keyTimes={`0;${on};${on + 0.03};${off - 0.02};${off};1`}
        dur={LOOP}
        repeatCount="indefinite"
      />
      {children}
    </g>
  )
}

/** Small accent chat bubble drawn around (0,0) so it can ride an <animateMotion> path. */
function FlyingBubble({ label }: { label: string }) {
  return (
    <g>
      <rect x="-14" y="-10" width="28" height="20" rx="7" fill="var(--accent)" />
      <path d="M-6 9l-4 7 9-6Z" fill="var(--accent)" />
      <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight={700} fontFamily="Poppins, sans-serif" fill="#fff">
        {label}
      </text>
    </g>
  )
}

const FLIGHT = 'M168 70C230 -6 330 -4 414 62'

function AskLoopAnimation() {
  const reduce = useReducedMotion()
  const still = !!reduce
  const A = 'var(--accent)'
  const MUTED = 'var(--text-muted)'
  const BUBBLE = 'var(--border-strong)'

  return (
    <svg viewBox="0 0 480 200" className="w-full h-full" aria-hidden="true">
      {/* wide soft backdrop */}
      <ellipse cx="240" cy="112" rx="232" ry="84" fill={A} opacity="0.07" />
      <ellipse cx="240" cy="186" rx="200" ry="5" fill={A} opacity="0.12" />

      {/* drifting small question marks */}
      {[
        { x: 236, y: 120, s: 18, d: 0 },
        { x: 290, y: 160, s: 14, d: 0.8 },
        { x: 312, y: 96, s: 13, d: 1.6 },
      ].map((m, i) => (
        <motion.text
          key={i}
          x={m.x}
          y={m.y}
          fontSize={m.s}
          fontWeight={700}
          fontFamily="Poppins, sans-serif"
          fill={A}
          opacity={0.3}
          animate={still ? undefined : { y: [m.y, m.y - 6, m.y] }}
          transition={{ duration: 4, delay: m.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          ?
        </motion.text>
      ))}

      {/* big rocking question mark */}
      <g transform="translate(-105 44) scale(0.85)">
        <motion.g
          animate={still ? undefined : { rotate: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        >
          <path
            d="M150 52c0-20 16-34 36-34s36 14 36 32c0 16-10 24-20 30-7 4-10 8-10 15v6"
            fill="none"
            stroke={A}
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="192" cy="128" r="9" fill={A} />
        </motion.g>
      </g>

      {/* person — feet on the ground line, arm raised toward the flight path */}
      <g transform="translate(-95.5 -30.7) scale(1.1)">
        <path d="M200 172v24M210 172v24" stroke="#3b2a24" strokeWidth="4" strokeLinecap="round" />
        <path d="M195 197h8M207 197h8" stroke="#1a1a2e" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M194 148h22l4 26h-30Z" fill="#1a1a2e" />
        <path d="M193 152c-1-12 1-22 6-26h12c5 4 7 14 6 26Z" fill="#3d3a7a" />
        <path d="M203 126l2 10 2-10" fill="#fff" />
        <path d="M212 130l10-10 6-12" fill="none" stroke="#3d3a7a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="228.5" cy="106" r="3" fill="#7a4a3a" />
        <path d="M197 130l-4 16" fill="none" stroke="#3d3a7a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="205" cy="116" r="7" fill="#7a4a3a" />
        <path d="M197 117c-1-9 4-13 9-13s10 4 8 10c-3-3-7-4-11-3 0 4-2 8-6 6Z" fill="#1a1a2e" />
        <path d="M198 116c-3 4-3 10 0 13" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* flight path */}
      <path d={FLIGHT} fill="none" stroke={A} strokeWidth="1.5" strokeDasharray="3 7" opacity="0.35">
        {!still && <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2s" repeatCount="indefinite" />}
      </path>

      {/* question bubble pops beside her, then flies to the phone */}
      {!still && (
        <>
          <Beat on={0.01} off={0.29} still={false}>
            <g>
              <animateMotion
                path={FLIGHT}
                dur={LOOP}
                repeatCount="indefinite"
                keyPoints="0;0;1;1"
                keyTimes="0;0.08;0.28;1"
                calcMode="linear"
              />
              <FlyingBubble label="?" />
            </g>
          </Beat>
          {/* reply flies back */}
          <Beat on={0.66} off={0.85} still={false}>
            <g>
              <animateMotion
                path={FLIGHT}
                dur={LOOP}
                repeatCount="indefinite"
                keyPoints="1;1;0;0"
                keyTimes="0;0.66;0.84;1"
                calcMode="linear"
              />
              <FlyingBubble label="✓" />
            </g>
          </Beat>
          {/* check burst by her head when the answer lands */}
          <Beat on={0.84} off={0.97} still={false}>
            <circle cx="170" cy="70" r="11" fill={A} opacity="0.25">
              <animate attributeName="r" values="11;11;20;11" keyTimes="0;0.84;0.92;1" dur={LOOP} repeatCount="indefinite" />
            </circle>
            <circle cx="170" cy="70" r="9" fill={A} />
            <path d="M165.5 70l3 3 6-6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Beat>
        </>
      )}

      {/* phone with a chat */}
      <g>
        <rect x="362" y="22" width="88" height="162" rx="14" fill="var(--bg)" stroke={BUBBLE} strokeWidth="2" />
        <path d="M362 36a14 14 0 0 1 14-14h60a14 14 0 0 1 14 14v10h-88Z" fill={A} />
        <circle cx="377" cy="35" r="5" fill="#fff" opacity="0.9" />
        <rect x="387" y="31" width="34" height="4" rx="2" fill="#fff" opacity="0.85" />
        <rect x="387" y="38" width="20" height="3" rx="1.5" fill="#fff" opacity="0.55" />

        {/* incoming question */}
        <Beat on={0.28} off={0.95} still={still}>
          <rect x="396" y="56" width="46" height="20" rx="6" fill={A} />
          <rect x="402" y="62" width="32" height="3" rx="1.5" fill="#fff" opacity="0.9" />
          <rect x="402" y="68" width="20" height="3" rx="1.5" fill="#fff" opacity="0.7" />
        </Beat>

        {/* typing dots */}
        {!still && (
          <Beat on={0.4} off={0.58} still={false}>
            <rect x="370" y="84" width="32" height="16" rx="6" fill={BUBBLE} />
            {[379, 386, 393].map((cx, i) => (
              <circle key={cx} cx={cx} cy="92" r="2" fill={MUTED}>
                <animate attributeName="cy" values="92;89;92" dur="0.6s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </Beat>
        )}

        {/* reply with read ticks */}
        <Beat on={0.58} off={0.95} still={still}>
          <rect x="370" y="84" width="58" height="34" rx="6" fill={BUBBLE} />
          <rect x="376" y="90" width="44" height="3" rx="1.5" fill={MUTED} />
          <rect x="376" y="97" width="38" height="3" rx="1.5" fill={MUTED} />
          <rect x="376" y="104" width="26" height="3" rx="1.5" fill={MUTED} />
          <path d="M408 111l2 2 4-4M412 111l2 2 4-4" fill="none" stroke={A} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </Beat>

        {/* input bar */}
        <rect x="370" y="164" width="72" height="12" rx="6" fill="none" stroke={BUBBLE} strokeWidth="1.2" />
        <circle cx="436" cy="170" r="3" fill={A} />
      </g>
    </svg>
  )
}

function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: (typeof faqs)[number]
  open: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="rounded-xl transition-colors duration-300"
      style={{
        background: 'var(--surface-2)',
        border: `1px solid ${open ? 'rgba(var(--accent-rgb), 0.5)' : 'var(--border)'}`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left"
      >
        <span className="text-sm sm:text-[0.95rem] font-medium" style={{ color: 'var(--text)' }}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
        >
          <Plus size={16} strokeWidth={2.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className="px-5 sm:px-7 pb-5 text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PageArrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous questions' : 'More questions'}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
    >
      <Icon size={18} strokeWidth={2.5} />
    </button>
  )
}

export default function FAQ() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const [page, setPage] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [question, setQuestion] = useState('')
  const contact = useContact()

  const visible = faqs.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const goTo = (p: number) => {
    setPage(p)
    setOpenIndex(null)
  }

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = question.trim()
    if (!text) return
    contact.open({
      title: 'Ask a question',
      whatsapp: `Hi NNK, I have a question: ${text}`,
      subject: 'Question from your website',
      body: `Hi NNK,\n\nI have a question:\n\n${text}\n\nThanks,`,
    })
    setQuestion('')
  }

  return (
    <section ref={ref} className="pt-28 md:pt-44 pb-24 md:pb-36">
      <div className="container-pad">
        {/* ── Heading with ghosted backdrop word ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative text-center mb-8 md:mb-10"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 -translate-y-[60%] select-none pointer-events-none whitespace-nowrap uppercase overflow-hidden"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(3rem, 11vw, 9rem)',
              lineHeight: 1,
              color: 'var(--text)',
              opacity: 0.04,
            }}
          >
            Questions
          </span>
          <div
            className="relative inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded-full text-xs font-medium uppercase"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>/</span>
            FAQ
          </div>
          <h2 className="relative display-md">
            <span style={{ fontWeight: 400, fontSize: '0.7em' }}>frequently asked </span>
            <span className="uppercase" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}>
              questions
            </span>
          </h2>
          <p className="relative mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Who I am, what I build, and how I solve your operational problems.
          </p>
        </motion.div>

        {/* Pager sits in its own row so the right panel spans exactly first card → last card.
            Mobile order: cards → pager → ask panel. */}
        <div className="grid md:grid-cols-[7fr_5fr] gap-x-16 gap-y-8">
          {/* ── Left: accordion ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="order-1"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex flex-col gap-3 sm:gap-4"
              >
                {visible.map((item, i) => (
                  <FaqItem
                    key={item.q}
                    item={item}
                    open={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Right: illustration + ask on WhatsApp — stretches to the cards' height ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="order-3 md:order-2 mt-6 md:mt-0 flex flex-col items-center gap-4 text-center"
          >
            {/* Illustration absorbs whatever height the cards add (e.g. an open answer) */}
            <div className="relative w-full flex-1 min-h-[150px]">
              <div className="absolute inset-0">
                <AskLoopAnimation />
              </div>
            </div>

            <div>
              <h3
                className="font-display font-semibold"
                style={{ fontSize: 'clamp(1.5rem, 2.2vw, 1.875rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text)' }}
              >
                Any Question?
              </h3>
              <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                Ask anything about your business problem — I&apos;ll reply on WhatsApp or email.
              </p>
            </div>

            <form onSubmit={send} className="w-full flex flex-col gap-4 text-left">
              <div>
                <label htmlFor="faq-question" className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  Let me know.
                </label>
                <div
                  className="flex items-center rounded-lg transition-colors duration-300 focus-within:border-[color:var(--accent)]"
                  style={{ border: '1px solid var(--border-strong)', background: 'var(--surface-2)' }}
                >
                  <input
                    id="faq-question"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here"
                    maxLength={500}
                    className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm outline-none"
                    style={{ color: 'var(--text)' }}
                  />
                  {question && (
                    <button
                      type="button"
                      onClick={() => setQuestion('')}
                      aria-label="Clear question"
                      className="px-3"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <ShinyButton type="submit" disabled={!question.trim()} className="disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Send question">
                  Send
                </ShinyButton>
              </div>
            </form>
          </motion.div>

          {/* ── Pager — under the cards ───────────────────────────── */}
          {PAGES > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
              className="order-2 md:order-3 flex items-center justify-center gap-4"
            >
              <PageArrow dir="prev" disabled={page === 0} onClick={() => goTo(page - 1)} />
              <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {page + 1} / {PAGES}
              </span>
              <PageArrow dir="next" disabled={page === PAGES - 1} onClick={() => goTo(page + 1)} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
