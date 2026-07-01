'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { COUNTRIES, formatNational, type Country } from '@/lib/countries'

type Props = {
  country: Country
  national: string
  onCountryChange: (c: Country) => void
  onNationalChange: (digits: string) => void
}

/**
 * Phone field with a searchable country-code dropdown. The trigger shows the
 * selected flag + dial code; the text field formats the national number to
 * match that country's example grouping (see lib/countries.ts).
 */
export default function CountryPhoneInput({
  country,
  national,
  onCountryChange,
  onNationalChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Focus the search box when the menu opens.
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.iso2.toLowerCase() === q
    )
  }, [query])

  const select = (c: Country) => {
    onCountryChange(c)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={rootRef} className="relative">
      <div
        className="flex items-stretch rounded-2xl border overflow-hidden transition-colors duration-200 focus-within:border-accent"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Country trigger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-1.5 pl-4 pr-3 py-3 text-sm leading-none shrink-0 cursor-pointer border-r transition-colors duration-200 hover:text-accent"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {/* Windows renders flag emoji as low-sitting letters (e.g. "IN"); nudge up to center on the dial/number line. */}
          <span style={{ fontSize: '1.1em', lineHeight: 1, display: 'inline-flex', alignItems: 'center', transform: 'translateY(-1.5px)' }}>{country.flag}</span>
          <span style={{ lineHeight: 1 }}>{country.dial}</span>
          <svg
            width="10" height="10" viewBox="0 0 12 12" aria-hidden
            style={{ display: 'block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', opacity: 0.6 }}
          >
            <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* National number */}
        <input
          type="tel"
          inputMode="numeric"
          value={formatNational(national, country.example)}
          onChange={(e) => onNationalChange(e.target.value.replace(/\D/g, ''))}
          placeholder={country.example}
          className="flex-1 min-w-0 px-4 py-3 text-sm bg-transparent outline-none"
          style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-2xl border shadow-xl overflow-hidden"
          style={{ background: 'var(--bg)', borderColor: 'var(--border-strong)' }}
        >
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code…"
              className="w-full rounded-xl px-3 py-2 text-sm bg-transparent border outline-none transition-colors duration-200 focus:border-accent"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                No match
              </li>
            )}
            {filtered.map((c) => {
              const active = c.iso2 === country.iso2 && c.dial === country.dial
              return (
                <li key={`${c.iso2}-${c.dial}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => select(c)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm cursor-pointer transition-colors duration-150 hover:bg-[var(--accent-dim)]"
                    style={{ color: active ? 'var(--accent)' : 'var(--text)' }}
                  >
                    <span style={{ fontSize: '1.15em', lineHeight: 1 }}>{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{c.dial}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
