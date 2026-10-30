'use client'
import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import { gmailCompose, whatsappLink } from '@/lib/utils'

/**
 * Global "how do you want to reach NNK?" chooser. Any CTA calls
 * `useContact().open({...})` with its own prefilled messages; the visitor
 * picks WhatsApp (wa.me chat with the text typed in) or Email (Gmail compose
 * with subject + body filled in) and only has to hit send.
 */

export interface ContactRequest {
  /** Heading shown in the chooser. */
  title?: string
  /** Text prefilled in the WhatsApp chat. */
  whatsapp: string
  /** Email subject line. */
  subject: string
  /** Email body. */
  body: string
}

/** Default messages for every "Build My System" button. */
export const BUILD_MY_SYSTEM: ContactRequest = {
  title: 'Build my system',
  whatsapp: "Hi NNK, I'd like to build a system for my business. Could we set up a time to talk?",
  subject: 'Build My System — Enquiry',
  body: [
    'Hi NNK,',
    '',
    "I'd like to build a system for my business.",
    '',
    'Business name: ',
    'What we do: ',
    "The problem we're facing: ",
    '',
    'Could we set up a time to talk?',
    '',
    'Thanks,',
  ].join('\n'),
}

const ContactContext = createContext<{ open: (req: ContactRequest) => void } | null>(null)

export function useContact() {
  const ctx = useContext(ContactContext)
  if (!ctx) throw new Error('useContact must be used inside <ContactProvider>')
  return ctx
}

type LenisLike = { stop: () => void; start: () => void }
const getLenis = () => (window as unknown as { lenis?: LenisLike }).lenis

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [req, setReq] = useState<ContactRequest | null>(null)
  const firstBtn = useRef<HTMLButtonElement>(null)

  const open = useCallback((r: ContactRequest) => setReq(r), [])
  const close = useCallback(() => setReq(null), [])

  // Freeze smooth-scroll behind the dialog, close on Esc, focus the first option.
  useEffect(() => {
    if (!req) return
    getLenis()?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstBtn.current?.focus(), 50)
    return () => {
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [req, close])

  const go = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    close()
  }

  return (
    <ContactContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {req && (
          <motion.div
            key="contact-chooser"
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-chooser-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm rounded-2xl p-6 sm:p-7"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 p-1 rounded-full transition-colors duration-200 hover:text-accent"
                style={{ color: 'var(--text-dim)' }}
              >
                <X size={18} />
              </button>

              <p className="label-muted mb-2">{req.title ?? 'Get in touch'}</p>
              <h3
                id="contact-chooser-title"
                className="font-display font-semibold"
                style={{ fontSize: '1.5rem', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--text)' }}
              >
                How would you like to reach me?
              </h3>
              <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                Your message is already written — just hit send.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <ChooserOption
                  ref={firstBtn}
                  onClick={() => go(whatsappLink(req.whatsapp))}
                  icon={<WhatsAppIcon />}
                  label="WhatsApp"
                  hint="Opens a chat with the message typed in"
                />
                <ChooserOption
                  onClick={() => go(gmailCompose(req.subject, req.body))}
                  icon={<Mail size={20} />}
                  label="Email"
                  hint="Opens Gmail with subject and message filled in"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ContactContext.Provider>
  )
}

interface OptionProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  hint: string
}

const ChooserOption = forwardRef<HTMLButtonElement, OptionProps>(function ChooserOption({ onClick, icon, label, hint }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className="group w-full flex items-center gap-4 rounded-xl px-4 py-3.5 text-left cursor-pointer transition-colors duration-200 hover:border-[color:var(--accent)] focus-visible:border-[color:var(--accent)]"
      style={{ border: '1px solid var(--border)', background: 'transparent' }}
    >
      <span
        className="flex-none w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</span>
      </span>
    </button>
  )
})

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.38 9.38 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.32 11.32 0 0 0 5.43 1.38h.01c6.26 0 11.35-5.09 11.35-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  )
}
