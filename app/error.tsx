'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the real error in the console for debugging.
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center container-pad pt-14">
      <p className="label mb-4">Something broke</p>
      <h1 className="display-md mb-6 uppercase">An Error Occurred</h1>
      <p className="text-sm max-w-lg mb-10" style={{ color: 'var(--text-muted)' }}>
        {error?.message || 'An unexpected error occurred while rendering this page.'}
        {error?.digest ? ` (ref: ${error.digest})` : ''}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button onClick={() => reset()} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </main>
  )
}
