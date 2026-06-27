'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * GoogleFormMock — a styled, theme-aware mock of a Google Form used to present
 * the *quantitative research* instrument inside a case study. It is purely
 * presentational (no real inputs) but reads unmistakably as a Google Form:
 * the signature purple header band, the white question cards, radio / checkbox
 * / linear-scale / short-answer controls, and a "required" asterisk.
 *
 * Sample answers can be pre-marked via `answer` (index) so the form reads as a
 * *response*, which sells the "we ran a survey" story better than a blank form.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** Google Forms signature purple. */
const FORM_PURPLE = '#673AB7'

export type FormQuestionType = 'choice' | 'checkbox' | 'scale' | 'short'

export interface FormQuestion {
  q: string
  type: FormQuestionType
  /** Options for choice / checkbox. For scale, the count of points (defaults 5). */
  options?: string[]
  /** Pre-selected option index (choice / scale) so the form reads as answered. */
  answer?: number
  /** Pre-checked option indexes for checkbox questions. */
  answers?: number[]
  /** End labels for a linear-scale question, e.g. ['Never','Always']. */
  scaleLabels?: [string, string]
  /** Number of scale points (scale type only). Defaults to 5. */
  scale?: number
  required?: boolean
}

export interface GoogleFormMockProps {
  title: string
  description?: string
  /** Small response-count chip rendered in the header, e.g. "128 responses". */
  responses?: string
  questions: FormQuestion[]
  className?: string
}

function Radio({ filled }: { filled: boolean }) {
  return (
    <span
      className="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{ border: `2px solid ${filled ? FORM_PURPLE : 'var(--border-strong)'}` }}
      aria-hidden
    >
      {filled && (
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: FORM_PURPLE }}
        />
      )}
    </span>
  )
}

function Check({ filled }: { filled: boolean }) {
  return (
    <span
      className="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px]"
      style={{
        border: `2px solid ${filled ? FORM_PURPLE : 'var(--border-strong)'}`,
        background: filled ? FORM_PURPLE : 'transparent',
      }}
      aria-hidden
    >
      {filled && (
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
          <path
            d="M3 8.5l3 3 7-7"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

function QuestionBlock({ question }: { question: FormQuestion }) {
  const { q, type, options = [], answer, answers = [], scaleLabels, scale = 5, required } = question

  return (
    <div
      className="rounded-xl px-5 py-5 sm:px-6"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${FORM_PURPLE}`,
      }}
    >
      <p className="text-sm font-medium leading-snug mb-4" style={{ color: 'var(--text)' }}>
        {q}
        {required && <span style={{ color: '#d93025' }}> *</span>}
      </p>

      {(type === 'choice' || type === 'checkbox') && (
        <ul className="space-y-3">
          {options.map((opt, i) => {
            const filled = type === 'choice' ? answer === i : answers.includes(i)
            return (
              <li key={i} className="flex items-center gap-3">
                {type === 'choice' ? <Radio filled={filled} /> : <Check filled={filled} />}
                <span
                  className="text-sm"
                  style={{ color: filled ? 'var(--text)' : 'var(--text-muted)' }}
                >
                  {opt}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {type === 'scale' && (
        <div className="flex items-center gap-2 sm:gap-4">
          {scaleLabels?.[0] && (
            <span className="text-xs shrink-0" style={{ color: 'var(--text-dim)' }}>
              {scaleLabels[0]}
            </span>
          )}
          <div className="flex items-center justify-between flex-1 gap-1">
            {Array.from({ length: scale }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                  {i + 1}
                </span>
                <Radio filled={answer === i} />
              </div>
            ))}
          </div>
          {scaleLabels?.[1] && (
            <span className="text-xs shrink-0" style={{ color: 'var(--text-dim)' }}>
              {scaleLabels[1]}
            </span>
          )}
        </div>
      )}

      {type === 'short' && (
        <div
          className="h-7 w-2/3 max-w-xs"
          style={{ borderBottom: '1px dotted var(--border-strong)' }}
          aria-hidden
        />
      )}
    </div>
  )
}

export default function GoogleFormMock({
  title,
  description,
  responses,
  questions,
  className,
}: GoogleFormMockProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: EASE }}
      className={['mx-auto w-full max-w-2xl', className].filter(Boolean).join(' ')}
    >
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -36px rgba(0,0,0,0.45)',
        }}
      >
        {/* Header band — purple top rule + title card */}
        <div style={{ height: '10px', background: FORM_PURPLE }} aria-hidden />
        <div
          className="px-6 py-6 sm:px-7"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {/* Forms glyph */}
              <span
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px]"
                style={{ background: FORM_PURPLE }}
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M7 8h2M7 12h2M7 16h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 8h5M12 12h5M12 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                </svg>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: FORM_PURPLE }}>
                Google Form
              </span>
            </div>
            {responses && (
              <span
                className="text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0"
                style={{ color: FORM_PURPLE, background: `${FORM_PURPLE}14`, border: `1px solid ${FORM_PURPLE}33` }}
              >
                {responses}
              </span>
            )}
          </div>

          <h4 className="text-lg font-bold mt-4 leading-tight" style={{ color: 'var(--text)' }}>
            {title}
          </h4>
          {description && (
            <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-muted)' }}>
              {description}
            </p>
          )}
          <p className="text-[11px] mt-4" style={{ color: '#d93025' }}>
            * Indicates required question
          </p>
        </div>

        {/* Questions */}
        <div className="px-4 py-5 sm:px-6 space-y-3" style={{ background: 'var(--bg)' }}>
          {questions.map((question, i) => (
            <QuestionBlock key={i} question={question} />
          ))}

          {/* Submit row (decorative) */}
          <div className="flex items-center justify-between pt-2">
            <span
              className="text-sm font-semibold rounded-md px-5 py-2"
              style={{ background: FORM_PURPLE, color: '#fff' }}
            >
              Submit
            </span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
              Never submit passwords through Google Forms.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
