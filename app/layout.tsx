import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import RevealShell from '@/components/layout/RevealShell'
import LenisProvider from '@/components/ui/LenisProvider'
import PageTransition from '@/components/ui/PageTransition'
import CustomCursor from '@/components/ui/CustomCursor'


export const metadata: Metadata = {
  title: 'NNK — Product & Systems Designer',
  description: 'Helping growing businesses solve operational challenges through system design.',
  keywords: ['product design', 'systems design', 'no-code', 'business operations', 'NNK'],
  openGraph: {
    title: 'NNK — Product & Systems Designer',
    description: 'Helping growing businesses solve operational challenges through system design.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <CustomCursor />
        <LenisProvider>
          <Navbar />
          <RevealShell>
            <PageTransition>
              {children}
            </PageTransition>
          </RevealShell>
        </LenisProvider>
      </body>
    </html>
  )
}
