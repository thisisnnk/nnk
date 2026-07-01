'use client'

// global-error replaces the root layout entirely, so it must render its own
// <html>/<body> and cannot rely on the site's CSS classes — inline styles only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#0f0f0f',
          color: '#ECECEC',
          fontFamily: 'Montserrat, Poppins, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.25rem',
          padding: '2rem',
          margin: 0,
        }}
      >
        <p style={{ color: '#00AAFF', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
          Application Error
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
          Something Went Wrong
        </h1>
        <p style={{ color: '#8E8E8E', maxWidth: '32rem', lineHeight: 1.6, overflowWrap: 'anywhere' }}>
          {error?.message || 'A critical error occurred.'}
          {error?.digest ? ` (ref: ${error.digest})` : ''}
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: '0.5rem',
            padding: '0.8rem 1.5rem',
            borderRadius: '9999px',
            border: '1px solid rgba(0,170,255,0.55)',
            background: 'rgba(0,170,255,0.22)',
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  )
}
