export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-brand mb-4">Seller Portal</h1>
        <p className="text-lg text-charcoal/70">
          Your personalized property dashboard
        </p>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-medium text-charcoal mb-4">
          Access Your Portal
        </h2>
        <p className="text-charcoal/70 mb-6">
          Your Keenan Group agent has provided you with a unique link to access
          your property&apos;s weekly updates, showing activity, and market insights.
        </p>
        <p className="text-charcoal/70 text-sm">
          If you haven&apos;t received your link or need assistance, please contact
          your agent directly.
        </p>
      </div>

      <div className="text-sm text-charcoal/50">
        <a href="https://thekeenangroup.com" className="hover:text-brand transition-colors">
          thekeenangroup.com
        </a>
        <span className="mx-2">|</span>
        <a href="tel:+15128887888" className="hover:text-brand transition-colors">
          (512) 888-7888
        </a>
      </div>
    </div>
  )
}
