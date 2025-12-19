export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-6">🏠</div>
      <h1 className="text-3xl font-medium text-mulberry mb-4">Portal Not Found</h1>
      <p className="text-black/70 mb-8">
        This seller portal link may have expired or the property may no longer be active.
        Please contact your Keenan Group agent for assistance.
      </p>
      <div className="space-y-4">
        <a
          href="sms:+15124157653"
          className="btn-primary inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Text (512) 415-7653
        </a>
        <p className="text-sm text-black/50">
          or email{' '}
          <a href="mailto:keenan@compass.com" className="text-mulberry hover:underline">
            keenan@compass.com
          </a>
        </p>
      </div>
    </div>
  )
}
