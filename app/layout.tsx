import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Seller Portal | Keenan Group',
  description: 'Your personalized property dashboard with weekly updates on showings, market activity, and agent insights.',
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

function Header() {
  return (
    <header className="bg-mulberry text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="https://thekeenangroup.com" className="hover:opacity-90 transition-opacity">
            <img src="/logo-white.svg" alt="Keenan Group" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-honed-stone text-xs uppercase tracking-wider">
              Seller Dashboard
            </span>
            <a href="https://thekeenangroup.com" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-honed-stone hover:text-white transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Main Site
            </a>
            <a href="sms:+15124157653"
              className="flex items-center gap-2 text-honed-stone hover:text-white transition-colors text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
    <footer className="bg-mulberry text-honed-stone mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a href="https://thekeenangroup.com" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              <img src="/logo-white.svg" alt="Keenan Group" className="h-8 w-auto" />
            </a>
            <p className="text-sm text-honed-stone/80 italic">Tailored Solutions,<br />Timeless Relationships</p>
          </div>
          <div>
            <h3 className="font-medium text-white text-lg mb-3">Recognition</h3>
            <p className="text-sm leading-relaxed">
              <span className="text-gold font-medium">#1 Team</span><br />
              Austin Board of Realtors 2024<br />
              <span className="text-honed-stone/70">Compass Real Estate</span>
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white text-lg mb-3">Contact</h3>
            <p className="text-sm leading-relaxed">
              <a href="sms:+15124157653" className="hover:text-white transition-colors">(512) 415-7653</a><br />
              <a href="mailto:keenan@compass.com" className="hover:text-white transition-colors">keenan@compass.com</a><br />
              <a href="https://thekeenangroup.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">thekeenangroup.com</a>
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white text-lg mb-3">Office</h3>
            <p className="text-sm leading-relaxed">4206 Venado Dr<br />Austin, TX 78731</p>
          </div>
        </div>
        <div className="border-t border-mulberry-light mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-honed-stone/60">&copy; {new Date().getFullYear()} Keenan Group at Compass. All rights reserved.</p>
          <a href="https://thekeenangroup.com/terms-and-conditions" target="_blank" rel="noopener noreferrer"
            className="text-xs text-honed-stone/60 hover:text-honed-stone transition-colors">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
