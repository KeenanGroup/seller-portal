import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Seller Portal | Keenan Group',
  description: 'Your personalized property dashboard with weekly updates on showings, market activity, and agent insights.',
  robots: { index: false, follow: false },
}

function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="https://thekeenangroup.com" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-champagne rounded-full flex items-center justify-center">
              <span className="text-brand font-serif font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-medium">Keenan Group</h1>
              <p className="text-champagne text-xs">Seller Portal</p>
            </div>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="https://thekeenangroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-champagne hover:text-white transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Main Site
            </a>
            <a
              href="tel:+15124157653"
              className="flex items-center gap-2 text-champagne hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm">(512) 415-7653</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-brand text-champagne mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-champagne rounded-full flex items-center justify-center">
                <span className="text-brand font-serif font-bold text-lg">K</span>
              </div>
              <div>
                <h3 className="font-serif text-white text-lg">Keenan Group</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-champagne/80 italic">
              Tailored Solutions,<br />Timeless Relationships
            </p>
          </div>

          {/* Recognition */}
          <div>
            <h3 className="font-serif text-white text-lg mb-3">Recognition</h3>
            <p className="text-sm leading-relaxed">
              <span className="text-gold font-medium">#1 Team</span><br />
              Austin Board of Realtors 2024<br />
              <span className="text-champagne/70">Compass Real Estate</span>
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-white text-lg mb-3">Contact</h3>
            <p className="text-sm leading-relaxed">
              <a href="tel:+15124157653" className="hover:text-white transition-colors">(512) 415-7653</a><br />
              <a href="mailto:keenan@compass.com" className="hover:text-white transition-colors">keenan@compass.com</a><br />
              <a href="https://thekeenangroup.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">thekeenangroup.com</a>
            </p>
          </div>

          {/* Office */}
          <div>
            <h3 className="font-serif text-white text-lg mb-3">Office</h3>
            <p className="text-sm leading-relaxed">
              4001 N Lamar Blvd<br />
              Austin, TX 78756
            </p>
            <a
              href="https://maps.google.com/?q=4001+N+Lamar+Blvd+Austin+TX+78756"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-champagne/70 hover:text-white transition-colors mt-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>

        <div className="border-t border-brand-light mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-champagne/60">
              &copy; {new Date().getFullYear()} Keenan Group. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://thekeenangroup.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-champagne/60 hover:text-champagne transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-champagne/30">|</span>
              <a
                href="https://thekeenangroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-champagne/60 hover:text-champagne transition-colors"
              >
                thekeenangroup.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
