export default function HomePage() {
  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-mulberry via-mulberry to-mulberry-light text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-2 mb-6">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gold">#1 Team - Austin Board of Realtors 2024</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-medium mb-4">
            Seller Portal
          </h1>
          <p className="text-xl text-honed-stone mb-2">
            Your Personalized Property Dashboard
          </p>
          <p className="text-honed-stone/80 italic">
            Tailored Solutions, Timeless Relationships
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Access Portal Card */}
            <div className="bg-honed-stone-light rounded-xl p-8">
              <div className="w-14 h-14 bg-mulberry rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-black mb-3">Access Your Portal</h2>
              <p className="text-black/70 mb-4">
                Your Keenan Group agent has provided you with a unique link to access your
                property&apos;s weekly updates, showing activity, and market insights.
              </p>
              <p className="text-black/60 text-sm">
                Check your email or contact your agent for your personalized portal link.
              </p>
            </div>

            {/* What You'll Find Card */}
            <div className="bg-honed-stone-light rounded-xl p-8">
              <div className="w-14 h-14 bg-gold rounded-xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-black mb-3">What You&apos;ll Find</h2>
              <ul className="space-y-3 text-black/70">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-mulberry flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Weekly showing activity & buyer feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-mulberry flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Online engagement metrics & trends</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-mulberry flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Price strategy recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-mulberry flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Agent commentary & next steps</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <a
                href="sms:+15124157653"
                className="bg-mulberry text-white px-6 py-3 rounded-lg font-medium hover:bg-mulberry-light transition-colors flex items-center gap-2"
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
                className="bg-honed-stone text-black px-6 py-3 rounded-lg font-medium hover:bg-honed-stone-light transition-colors flex items-center gap-2"
              >
                Visit Our Website
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-honed-stone py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-medium text-mulberry mb-1">#1</div>
              <div className="text-sm text-black/60">Austin Team 2024</div>
            </div>
            <div>
              <div className="text-3xl font-medium text-mulberry mb-1">$800M+</div>
              <div className="text-sm text-black/60">Career Sales</div>
            </div>
            <div>
              <div className="text-3xl font-medium text-mulberry mb-1">25+</div>
              <div className="text-sm text-black/60">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-medium text-mulberry mb-1">530+</div>
              <div className="text-sm text-black/60">Properties Sold</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
