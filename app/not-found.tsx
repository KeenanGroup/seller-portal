import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-6">🏠</div>
      <h1 className="text-3xl font-serif text-brand mb-4">Portal Not Found</h1>
      <p className="text-charcoal/70 mb-8">
        This seller portal link may have expired or the property may no longer be active.
        Please contact your Keenan Group agent for assistance.
      </p>
      <div className="space-y-4">
        <a
          href="tel:+15128887888"
          className="btn-primary inline-block"
        >
          Call (512) 888-7888
        </a>
        <p className="text-sm text-charcoal/50">
          or email{' '}
          <a href="mailto:info@thekeenangroup.com" className="text-brand hover:underline">
            info@thekeenangroup.com
          </a>
        </p>
      </div>
    </div>
  )
}
