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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-champagne rounded-full flex items-center justify-center">
              <span className="text-brand font-serif font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-medium">Keenan Group</h1>
              <p className="text-champagne text-xs">Seller Portal</p>
            </div>
          </div>
          <a
            href="tel:+15128887888"
            className="hidden sm:flex items-center gap-2 text-champagne hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm">(512) 888-7888</span>
          </a>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-brand text-champagne mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-white text-lg mb-3">Keenan Group</h3>
            <p className="text-sm leading-relaxed">
              #1 Team Austin Board of Realtors 2024<br />
              Compass Real Estate
            </p>
          </div>
          <div>
            <h3 className="font-serif text-white text-lg mb-3">Contact</h3>
            <p className="text-sm leading-relaxed">
              <a href="tel:+15128887888" className="hover:text-white transition-colors">(512) 888-7888</a><br />
              <a href="mailto:info@thekeenangroup.com" className="hover:text-white transition-colors">info@thekeenangroup.com</a>
            </p>
          </div>
          <div>
            <h3 className="font-serif text-white text-lg mb-3">Office</h3>
            <p className="text-sm leading-relaxed">
              1209 W 5th Street<br />
              Austin, TX 78703
            </p>
          </div>
        </div>
        <div className="border-t border-brand-light mt-8 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Keenan Group. All rights reserved.</p>
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
