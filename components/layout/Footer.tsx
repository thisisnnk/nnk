'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gmailCompose } from '@/lib/utils'
import CountryPhoneInput from '@/components/ui/CountryPhoneInput'
import { DEFAULT_COUNTRY, type Country } from '@/lib/countries'

const NAV: [string, string][] = [
  ['Blogs', '/blog'],
  ['Projects', '/projects'],
]

const block = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Footer() {
  // The footer lives beneath the page (fixed, in RevealShell) and is uncovered
  // as the last section slides up. Animate its contents in once revealed.
  const [revealed, setRevealed] = useState(false)
  const [name, setName] = useState('')
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY)
  const [national, setNational] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'invalid'>('idle')

  // Full E.164 number — dial code + national digits.
  const fullNumber = `${country.dial}${national}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || status === 'sending') return
    // National number must be a plausible length (country code is always present).
    if (national.length < 6 || national.length > 14) {
      setStatus('invalid')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          subject: 'New enquiry from portfolio',
          from_name: 'NNK Portfolio',
          name: name.trim(),
          'WhatsApp Number': fullNumber,
          Country: country.name,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('sent')
        setName('')
        setNational('')
        setCountry(DEFAULT_COUNTRY)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    const onScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      if (distanceFromBottom < 220) setRevealed(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <footer className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>

      <motion.div
        initial="hidden"
        animate={revealed ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="relative container-pad pt-20 pb-10 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8"
      >
        {/* Block 3 · Social */}
        <motion.div variants={block} className="md:col-span-3 md:order-2">
          <p className="label-muted mb-4">Social</p>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.linkedin.com/in/thenameisnnk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
              style={{ color: 'var(--text-muted)' }}
            >
              LinkedIn
            </a>
            <a
              href={gmailCompose()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
              style={{ color: 'var(--text-muted)' }}
            >
              Gmail
            </a>
            <a
              href={`https://wa.me/917339648320?text=${encodeURIComponent(
                "Hi NNK, I'd like to discuss developing a system. Could we talk?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
              style={{ color: 'var(--text-muted)' }}
            >
              WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Block 4 · Navigation */}
        <motion.nav variants={block} className="md:col-span-2 md:order-3">
          <p className="label-muted mb-4">Navigation</p>
          <div className="flex flex-col gap-3">
            {NAV.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.nav>

        {/* Block 5 · Quick enquiry form */}
        <motion.div variants={block} className="col-span-2 md:col-span-3 md:order-4">
          <p className="label-muted mb-4">Get in touch</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xs">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-2xl px-4 py-3 text-sm bg-transparent border outline-none transition-colors duration-200 focus:border-accent"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
            <CountryPhoneInput
              country={country}
              national={national}
              onCountryChange={setCountry}
              onNationalChange={setNational}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-2xl px-4 py-3 text-base font-bold uppercase tracking-wide cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'var(--accent)', color: 'var(--bg)', fontFamily: 'var(--font-display)' }}
            >
              {status === 'sending' ? 'Sending…' : 'Submit'}
            </button>
            {status === 'sent' && (
              <p className="text-xs" style={{ color: 'var(--accent)' }}>
                Thanks — NNK will be in touch shortly.
              </p>
            )}
            {status === 'invalid' && (
              <p className="text-xs" style={{ color: '#ff5470' }}>
                Enter a valid phone number, e.g. {country.example}.
              </p>
            )}
            {status === 'error' && (
              <p className="text-xs" style={{ color: '#ff5470' }}>
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </motion.div>

        {/* Block 1 · Brand / Statement — bottom left, name at the very bottom */}
        <motion.div variants={block} className="col-span-2 md:col-span-4 md:order-1 flex flex-col justify-start">
          <Link
            href="/"
            className="leading-none cursor-pointer transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src="/nnk-logo.png"
              alt="NNK"
              style={{ height: 'clamp(1.75rem, 4vw, 3rem)', width: 'auto', display: 'block' }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Baseline bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative container-pad py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>© {new Date().getFullYear()} NNK — Product &amp; Systems Design</span>
        <span className="label-muted">Built with intention.</span>
      </motion.div>
    </footer>
  )
}
