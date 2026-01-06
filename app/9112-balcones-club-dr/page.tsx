import { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { PropertyHero } from '../components/property_hero'
import { ViewsByPublisherChart } from '../components/views_by_publisher_chart'
import { ViewsByCityMap } from '../components/views_by_city_map'
import { ProtectedContent } from '../components/protected_content'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatLongDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '9112 Balcones Club Dr - Seller Update | Keenan Group',
    description: 'Weekly market update and showing activity for 9112 Balcones Club Dr',
  }
}

const propertyData = {
  _id: 'balcones-club-9112',
  slug: '9112-balcones-club-dr',
  listing: {
    mlsNumber: 'TBD',
    address: {
      street: '9112 Balcones Club Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78750'
    },
    listPrice: 900000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 1990,
    lotSize: '0.35 acres',
    garage: '2 car',
    propertyType: 'Single Family',
    status: 'active',
    listDate: '2026-01-05',
    compassUrl: 'https://thekeenangroup.com/properties/9112-balcones-club-dr-austin-tx-78750-1117625',
    neighborhood: 'Balcones Club Estates',
    images: [
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/01f68727-4827-41ee-9554-8321fbf8558a',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/045d3a4c-a386-4dc4-8dd2-b6cd0b10a480',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/04b6a2e8-f104-4daf-8c97-804835eb031b',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/09d5a98f-9aa6-48fe-a907-4443593866d7',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/0aee203a-6eef-4fca-a9b5-3bdf46253f6d',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/1484a5dc-639e-4f23-9221-980affb401c6'
    ]
  },
  updates: [{
    _id: 'update-2026-01-05',
    weekOf: '2025-12-30',
    weekEnding: '2026-01-05',
    publishedAt: '2026-01-05T12:00:00.000Z',
    showings: [],
    buyerFeedback: [],
    webMetrics: {
      totalViews: 0,
      viewsTrend: 'Just listed',
      uniqueVisitors: 0,
      visitorsTrend: 'Just listed',
      avgTimeOnPage: 0,
      timeTrend: 'Just listed',
      byPlatform: [
        { _key: 'p1', platform: 'Zillow', views: 0 },
        { _key: 'p2', platform: 'Realtor.com', views: 0 },
        { _key: 'p3', platform: 'Compass', views: 0 },
        { _key: 'p4', platform: 'Trulia', views: 0 },
        { _key: 'p5', platform: 'Other Platforms', views: 0 }
      ],
      topLocations: []
    },
    mortgageUpdate: {
      _id: 'mortgage-2026-01-05',
      headline: 'Mortgage Rates Holding at 2-Month Lows',
      validFrom: '2026-01-05',
      keyStats: [
        { _key: 'k1', label: '30-Year Fixed', value: '6.19%', trend: '↓ Down 0.01%' },
        { _key: 'k2', label: '15-Year Fixed', value: '5.74%', trend: '↓ Down 0.01%' },
        { _key: 'k3', label: 'Market Status', value: '2-Month Lows', trend: 'Favorable conditions' },
        { _key: 'k4', label: 'Trading', value: 'Stable', trend: 'Post-holiday normalization' }
      ],
      content: [
        {
          _key: 'c1',
          _type: 'block',
          children: [{
            _key: 'c1a',
            _type: 'span',
            text: 'Mortgage rates remain near their lowest levels in roughly two months. Both 30-year and 15-year fixed rates declined slightly today, with the 30-year at 6.19% and 15-year at 5.74%. The two days of 2025 with the lowest rates were September 16th and October 28th, both preceding Fed rate cuts.'
          }]
        },
        {
          _key: 'c2',
          _type: 'block',
          children: [{
            _key: 'c2a',
            _type: 'span',
            text: 'Bond markets showed improvement with trading volume back at pre-holiday levels. Despite economic data releases, market movement remained subdued, keeping rates stable in the narrow trading range characteristic of early January. This creates a favorable window for buyers considering financing options.'
          }]
        }
      ]
    },
    agentCommentary: [
      {
        _key: 'a1',
        _type: 'block',
        children: [{
          _key: 'a1a',
          _type: 'span',
          text: 'Property just listed. Market updates will be available after first week of activity.'
        }]
      }
    ],
    nextSteps: [
      'Launch comprehensive marketing campaign across all platforms',
      'Leverage improved mortgage rates (6.19% - at 2-month lows) in marketing materials',
      'Schedule professional photography and virtual tour',
      'Prepare property for first showing appointments'
    ]
  }]
}

export default async function BalconesClubPage() {
  const { listing, updates } = propertyData
  const latestUpdate = updates[0]
  const streetNumber = '9112'
  const propertyAddress = listing.address.street
  const totalShowings = latestUpdate.showings.length
  const daysOnMarket = 0

  return (
    <ProtectedContent streetNumber={streetNumber} propertyAddress={propertyAddress}>
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Property Hero Image */}
      {listing.images && listing.images.length > 0 && (
        <div className="mb-8">
          <PropertyHero
            images={listing.images}
            address={listing.address.street}
            neighborhood={listing.neighborhood}
            status={listing.status}
          />
        </div>
      )}

      {/* Property Header */}
      <div className="card mb-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-black mb-2">
            {listing.address.street}
          </h1>
          <p className="text-honed-stone mb-4">
            {listing.neighborhood} • {listing.address.city}, {listing.address.state} {listing.address.zip}
          </p>
          <div className="flex flex-wrap gap-6 mb-6">
            <div>
              <div className="text-sm text-honed-stone">List Price</div>
              <div className="text-2xl font-bold text-mulberry">{formatCurrency(listing.listPrice)}</div>
            </div>
            <div>
              <div className="text-sm text-honed-stone">Beds / Baths</div>
              <div className="text-lg font-semibold text-black">{listing.bedrooms} / {listing.bathrooms}</div>
            </div>
            <div>
              <div className="text-sm text-honed-stone">Sq Ft</div>
              <div className="text-lg font-semibold text-black">{listing.squareFeet.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-honed-stone">Year Built</div>
              <div className="text-lg font-semibold text-black">{listing.yearBuilt}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={listing.compassUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-mulberry text-white rounded hover:bg-mulberry/90 transition-colors"
            >
              View Full Listing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Market Update Summary */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-black mb-4">This Week&apos;s Update</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card">
            <div className="stat-label">Days on Market</div>
            <div className="stat-value">{daysOnMarket}</div>
            <div className="stat-trend text-blue-600">Just Listed</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Showings</div>
            <div className="stat-value">{totalShowings}</div>
            <div className="stat-trend text-honed-stone">Awaiting first showings</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Web Views (30 days)</div>
            <div className="stat-value">{latestUpdate.webMetrics.totalViews.toLocaleString()}</div>
            <div className="stat-trend text-honed-stone">{latestUpdate.webMetrics.viewsTrend}</div>
          </div>
        </div>
      </div>

      {/* Mortgage Market Update */}
      {latestUpdate.mortgageUpdate && (
        <div className="card mb-8">
          <h3 className="card-header">Mortgage Market Update</h3>
          <h4 className="text-lg font-semibold text-black mb-4">{latestUpdate.mortgageUpdate.headline}</h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {latestUpdate.mortgageUpdate.keyStats.map((stat: any) => (
              <div key={stat._key} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value text-xl">{stat.value}</div>
                <div className="stat-trend text-blue-600">{stat.trend}</div>
              </div>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-black/80">
            <PortableText value={latestUpdate.mortgageUpdate.content} />
          </div>
        </div>
      )}

      {/* Keenan Group Analysis */}
      {latestUpdate.agentCommentary && latestUpdate.agentCommentary.length > 0 && (
        <div className="card mb-8">
          <h3 className="card-header">Keenan Group Analysis</h3>
          <div className="prose prose-sm max-w-none text-black/80">
            <PortableText value={latestUpdate.agentCommentary} />
          </div>
        </div>
      )}

      {/* Next Steps */}
      {latestUpdate.nextSteps && latestUpdate.nextSteps.length > 0 && (
        <div className="card">
          <h3 className="card-header">Recommended Next Steps</h3>
          <ul className="space-y-2">
            {latestUpdate.nextSteps.map((step: string, index: number) => {
              const urlRegex = /(https?:\/\/[^\s]+)/g
              const parts = step.split(urlRegex)

              return (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className="text-mulberry mt-1">→</span>
                  <span>
                    {parts.map((part, i) => {
                      if (part.match(urlRegex)) {
                        return (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mulberry underline hover:opacity-80 transition-opacity"
                          >
                            {part}
                          </a>
                        )
                      }
                      return <span key={i}>{part}</span>
                    })}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
    </ProtectedContent>
  )
}
