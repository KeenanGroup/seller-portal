export default function HomePage() {
  return (
    <div className="min-h-[80vh]">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gold">#1 Team - Austin Board of Realtors 2024</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-light text-white mb-4">
            Seller Portal
          </h1>
          <p className="text-xl text-honed-stone mb-2">
            Your Personalized Property Dashboard
          </p>
          <p className="text-sandstone italic">
            Tailored Solutions, Timeless Relationships
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card">
              <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <h2 className="text-xl font-display text-honed-stone mb-3">Access Your Portal</h2>
              <p className="text-honed-stone/80 mb-4 text-sm leading-relaxed">
                Your Keenan Group agent has provided you with a unique link to access your
                property&apos;s weekly updates, showing activity, and market insights.
              </p>
              <p className="text-sandstone text-sm">
                Check your email or contact your agent for your personalized portal link.
              </p>
            </div>

            <div className="glass-card">
              <div className="w-14 h-14 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h2 className="text-xl font-display text-honed-stone mb-3">What You&apos;ll Find</h2>
              <ul className="space-y-3 text-honed-stone/80 text-sm">
                {[
                  'Weekly showing activity & buyer feedback',
                  'Online engagement metrics & trends',
                  'Price strategy recommendations',
                  'Agent commentary & next steps',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <a
                href="sms:+15124157653"
                className="bg-gold text-evening-plum px-6 py-3 rounded-xl font-medium hover:bg-gold-light transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Text (512) 415-7653
              </a>
              <a
                href="https://thekeenangroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gold/30 text-gold px-6 py-3 rounded-xl font-medium hover:bg-gold/10 transition-colors flex items-center gap-2"
              >
                Visit Our Website
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '#1', label: 'Austin Team 2024' },
              { value: '$1B+', label: 'Career Sales' },
              { value: '25+', label: 'Years Experience' },
              { value: '1,000+', label: 'Transactions' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-display font-light text-gold mb-1">{stat.value}</div>
                <div className="text-sm text-sandstone">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
