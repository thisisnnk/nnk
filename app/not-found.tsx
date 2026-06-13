import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center container-pad pt-14">
      <p className="label mb-4">Error 404</p>
      <h1 className="display-lg mb-6 uppercase">Page Not Found</h1>
      <p className="text-base max-w-md mb-10" style={{ color: 'var(--text-muted)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary">Back Home</Link>
    </main>
  )
}
