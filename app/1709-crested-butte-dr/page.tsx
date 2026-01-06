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
    title: '1709 Crested Butte Dr - Seller Update | Keenan Group',
    description: 'Weekly market update and showing activity for 1709 Crested Butte Dr',
  }
}

const propertyData = {
  _id: 'crested-butte-1709',
  slug: '1709-crested-butte-dr',
  listing: {
    mlsNumber: '2776945',
    address: {
      street: '1709 Crested Butte Dr',
      city: 'Austin',
      state: 'TX',
      zip: '78746'
    },
    listPrice: 1300000,
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 3200,
    yearBuilt: 1985,
    lotSize: '0.42 acres',
    garage: '2 car',
    propertyType: 'Single Family',
    status: 'active',
    listDate: '2025-10-12',
    compassUrl: 'https://www.compass.com/listing/1709-crested-butte-drive-austin-tx-78746/2776945/',
    neighborhood: 'Barton Hills',
    images: [
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/4d47e0f5-4415-4ef4-a92f-46699c118ab2',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/d21c792c-7725-433c-bfe4-3208292bcdd7',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/310325ad-6281-473b-aaf7-6dcf9607f8fe',
      'https://media-production.lp-cdn.com/cdn-cgi/image/format=auto,quality=85/https://media-production.lp-cdn.com/media/344dc60a-c74f-4cb4-b7d1-146c9a533490'
    ]
  },
  updates: [{
    _id: 'update-2026-01-05',
    weekOf: '2025-12-30',
    weekEnding: '2026-01-05',
    publishedAt: '2026-01-05T12:00:00.000Z',
    showings: [
      { _key: 's1', date: '2026-01-04T15:30:00', agentName: 'Tyler Smith', brokerage: 'All City Real Estate Ltd Co', duration: 60, isTeamShowing: false },
      { _key: 's2', date: '2026-01-02T14:49:00', agentName: 'Camille Palafox', brokerage: 'Keller Williams Realty', duration: 60, isTeamShowing: false },
      { _key: 's3', date: '2025-12-29T12:58:00', agentName: 'Megan Willis', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's4', date: '2025-12-27T13:17:00', agentName: 'Barbara Ditlow', brokerage: 'Barbara Ditlow Broker', duration: 60, isTeamShowing: false },
      { _key: 's5', date: '2025-12-27T12:54:00', agentName: 'Barbara Ditlow', brokerage: 'Barbara Ditlow Broker', duration: 23, isTeamShowing: false },
      { _key: 's6', date: '2025-12-20T14:52:00', agentName: 'Chet Smith', brokerage: 'CBSrealty', duration: 60, isTeamShowing: false },
      { _key: 's7', date: '2025-12-20T12:00:00', agentName: 'Tory Wortham', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's8', date: '2025-12-19T13:27:00', agentName: 'Matt Holm', brokerage: 'Compass RE Texas LLC', duration: 42, isTeamShowing: false },
      { _key: 's9', date: '2025-12-19T12:47:00', agentName: 'Leslie Odom', brokerage: 'Propertysmith Realty', duration: 40, isTeamShowing: false },
      { _key: 's10', date: '2025-12-17T12:18:00', agentName: 'Andrea Amico', brokerage: 'Compass RE Texas LLC', duration: 47, isTeamShowing: false },
      { _key: 's11', date: '2025-12-14T12:27:00', agentName: 'Roseann JosephCiani', brokerage: 'Redfin Corporation', duration: 60, isTeamShowing: false },
      { _key: 's12', date: '2025-12-12T11:54:00', agentName: 'Beth Carter', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's13', date: '2025-12-07T13:57:00', agentName: 'Terence McNeil', brokerage: 'Teifke Real Estate', duration: 60, isTeamShowing: false },
      { _key: 's14', date: '2025-12-06T13:55:00', agentName: 'Charles Runnels', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's15', date: '2025-11-28T14:05:00', agentName: 'Ashley Stucki', brokerage: 'Ashley Austin Homes', duration: 17, isTeamShowing: false },
      { _key: 's16', date: '2025-11-23T14:55:00', agentName: 'Anthony Harris', brokerage: 'Compass RE Texas LLC', duration: 131, isTeamShowing: false },
      { _key: 's17', date: '2025-11-22T14:11:00', agentName: 'Jeffrey McElroy', brokerage: 'Real Broker LLC', duration: 60, isTeamShowing: false },
      { _key: 's18', date: '2025-11-10T17:31:00', agentName: 'Angie Faulhaber', brokerage: 'All City Real Estate Ltd Co', duration: 60, isTeamShowing: false },
      { _key: 's19', date: '2025-11-07T14:27:00', agentName: 'Reed Henderson', brokerage: 'Sunny Day Real Estate LLC', duration: 60, isTeamShowing: false },
      { _key: 's20', date: '2025-11-02T14:13:00', agentName: 'Grace MiralleWilkens', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's21', date: '2025-10-26T14:30:00', agentName: 'Joe Keenan', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: true },
      { _key: 's22', date: '2025-10-25T13:42:00', agentName: 'Audrey Romano', brokerage: 'Moreland Properties', duration: 60, isTeamShowing: false },
      { _key: 's23', date: '2025-10-23T12:25:00', agentName: 'Linda Traylor', brokerage: 'AustinRealEstatecom', duration: 60, isTeamShowing: false },
      { _key: 's24', date: '2025-10-19T15:56:00', agentName: 'Brad Brown', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's25', date: '2025-10-19T15:55:00', agentName: 'Brad Brown', brokerage: 'Compass RE Texas LLC', duration: 1, isTeamShowing: false },
      { _key: 's26', date: '2025-10-18T13:04:00', agentName: 'Charla Housson', brokerage: 'Compass RE Texas LLC', duration: 60, isTeamShowing: false },
      { _key: 's27', date: '2025-10-17T17:15:00', agentName: 'Brittney Montgomery', brokerage: 'Keller Williams Realty', duration: 60, isTeamShowing: false },
      { _key: 's28', date: '2025-10-13T16:06:00', agentName: 'Ben Goudy', brokerage: 'Texas Crossway Realty LLC', duration: 60, isTeamShowing: false }
    ],
    buyerFeedback: [
      { _key: 'f1', feedback: 'Buyers liked the layout of the home and the private backyard. They know it still needs some updating and are going to look over the SD. They have a few more homes to look tour. Thank you for letting me show' },
      { _key: 'f2', feedback: 'thank you for letting us see it - has potential for sure! We noticed the sloping in the foundation throughout the home and the sunroom so great you have quotes for this as well as the roof and associated plumbing. Will stay in touch after the holidays when my clients return from being out of state. Happy Holidays!' },
      { _key: 'f3', feedback: 'The road noise was a no go for my client.' },
      { _key: 'f4', feedback: 'The noise from the freeway was the big issue' },
      { _key: 'f5', feedback: 'The home showed beautifully! It was the proximity to Mopac and the sound of the highway that made my buyers lose interest!' },
      { _key: 'f6', feedback: 'Client went in knowing there would be a little work needed down the road. Unfortunately, he feels there\'s a little too much he would need to do and this is top of his budget.' }
    ],
    webMetrics: {
      totalViews: 3839,
      viewsTrend: '↑ 36.7% over 30 days',
      uniqueVisitors: 77,
      visitorsTrend: '↑ 4.1% over 30 days',
      avgTimeOnPage: 25,
      timeTrend: '↓ 11.8% over 30 days',
      byPlatform: [
        { _key: 'p1', platform: 'Zillow', views: 2650 },
        { _key: 'p2', platform: 'Realtor.com', views: 324 },
        { _key: 'p3', platform: 'Compass', views: 161 },
        { _key: 'p4', platform: 'Trulia', views: 74 },
        { _key: 'p5', platform: 'Other Platforms', views: 630 }
      ],
      topLocations: [
        { _key: 'l1', city: 'Concierge Approved', percentage: 12 },
        { _key: 'l2', city: 'Favorites Saved', percentage: 6 },
        { _key: 'l3', city: 'Last 14 Days', percentage: 10 }
      ]
    },
    mortgageUpdate: {
      _id: 'mortgage-2026-01-02',
      headline: 'Mortgage Rates Stay Flat to End The Week',
      validFrom: '2026-01-02',
      keyStats: [
        { _key: 'k1', label: '30-Year Fixed', value: '6.20%', trend: 'Unchanged' },
        { _key: 'k2', label: '15-Year Fixed', value: '5.75%', trend: '↓ Down 0.01%' },
        { _key: 'k3', label: 'Weekly Trend', value: 'Flat', trend: 'Minimal movement' },
        { _key: 'k4', label: 'Outlook', value: 'Volatility Expected', trend: 'January jobs report key' }
      ],
      content: [
        {
          _key: 'c1',
          _type: 'block',
          children: [{
            _key: 'c1a',
            _type: 'span',
            text: 'Mortgage rates remained largely flat to end the week, with MBS prices increasing slightly. Bond yields and mortgage rates have been locked in a narrow, sideways range since September, creating a stable environment for potential buyers.'
          }]
        },
        {
          _key: 'c2',
          _type: 'block',
          children: [{
            _key: 'c2a',
            _type: 'span',
            text: 'The market anticipates more volatility once major economic reports resume in January. The 30-year fixed rate remains at 6.20%, while the 15-year dropped slightly to 5.75%.'
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
          text: 'Strong showing activity continues with 28 tours since listing. The property attracts serious buyers, with several agents returning for second showings. January has already seen 2 showings, indicating sustained interest as we enter the spring market.'
        }]
      },
      {
        _key: 'a2',
        _type: 'block',
        children: [{
          _key: 'a2a',
          _type: 'span',
          text: 'Feedback highlights the home\'s layout and private backyard as key selling points. Buyers acknowledge the updating needed but appreciate the transparency around foundation work and seller\'s disclosure. Road noise from Mopac remains the primary concern for some buyers, though it hasn\'t deterred showing activity.'
        }]
      },
      {
        _key: 'a3',
        _type: 'block',
        children: [{
          _key: 'a3a',
          _type: 'span',
          text: 'UnLock MLS metrics show exceptional reach: 1,226 agent views and 283 direct client views demonstrate strong market exposure. With 530 client portal shares and 579 automated emails, the property is circulating widely among active buyer networks.'
        }]
      }
    ],
    nextSteps: [
      'Recommendation of $50,000 price reduction to compete with 1407 Spring Garden and as a comparison to 2943 Thousand Oaks: https://portal.onehome.com/en-US/share/1268697B81949',
      'Leverage improved mortgage rates (6.20%) in follow-up communications with interested buyers',
      'Capitalize on strong UnLock MLS engagement with targeted outreach to high-interest agents',
      'Prepare for increased spring market activity with updated showing availability'
    ]
  }]
}

export default async function CresstedButtePage() {
  const { listing, updates } = propertyData
  const latestUpdate = updates[0]
  const streetNumber = '1709'
  const propertyAddress = listing.address.street
  const totalShowings = latestUpdate.showings.length
  const daysOnMarket = 85

  // Calculate showings in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const last30DaysShowings = latestUpdate.showings.filter((showing: any) => {
    const showingDate = new Date(showing.date)
    return showingDate >= thirtyDaysAgo
  }).length

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
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-medium text-mulberry">
              {listing.address.street}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {listing.status.toUpperCase()}
            </span>
          </div>
          <p className="text-black/70 mb-1">
            {listing.address.city}, {listing.address.state} {listing.address.zip}
          </p>
          {listing.neighborhood && (
            <p className="text-sm text-mulberry mb-2">{listing.neighborhood}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {listing.compassUrl && (
              <a
                href={listing.compassUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-mulberry hover:text-mulberry-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Compass
              </a>
            )}
            {listing.mlsNumber && (
              <span className="text-sm text-black/50">MLS# {listing.mlsNumber}</span>
            )}
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-black/50 block">List Price</span>
              <span className="font-semibold text-mulberry text-lg">
                {formatCurrency(listing.listPrice)}
              </span>
            </div>
            <div>
              <span className="text-black/50 block">Beds / Baths</span>
              <span className="font-semibold">{listing.bedrooms} / {listing.bathrooms}</span>
            </div>
            <div>
              <span className="text-black/50 block">Sq Ft</span>
              <span className="font-semibold">{listing.squareFeet.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-black/50 block">Year Built</span>
              <span className="font-semibold">{listing.yearBuilt}</span>
            </div>
            <div>
              <span className="text-black/50 block">Days on Market</span>
              <span className="font-semibold">{daysOnMarket}</span>
            </div>
          </div>

          {/* Additional Property Details */}
          <div className="mt-4 pt-4 border-t border-honed-stone/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {listing.lotSize && (
              <div>
                <span className="text-black/50">Lot:</span> {listing.lotSize}
              </div>
            )}
            {listing.garage && (
              <div>
                <span className="text-black/50">Garage:</span> {listing.garage}
              </div>
            )}
            {listing.propertyType && (
              <div>
                <span className="text-black/50">Type:</span> {listing.propertyType}
              </div>
            )}
          </div>
        </div>

        {/* Listed Date */}
        {listing.listDate && (
          <div className="mt-4 pt-4 border-t border-honed-stone/30 text-sm text-black/60">
            Listed on {formatLongDate(listing.listDate)}
          </div>
        )}
      </div>

      {/* Mortgage News Daily Update */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-header mb-0">Mortgage Rate Update</h3>
          <span className="text-xs text-black/50">
            {latestUpdate.mortgageUpdate.validFrom
              ? `Updated ${formatDate(latestUpdate.mortgageUpdate.validFrom)}`
              : 'Live rates updated daily'}
          </span>
        </div>

        {/* Full Article Content */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-mulberry mb-3">
            {latestUpdate.mortgageUpdate.headline}
          </h4>
          <div className="prose prose-sm max-w-none text-black/80 mb-4">
            <PortableText value={latestUpdate.mortgageUpdate.content} />
          </div>

          {/* Key Rate Stats */}
          {latestUpdate.mortgageUpdate.keyStats && latestUpdate.mortgageUpdate.keyStats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {latestUpdate.mortgageUpdate.keyStats.map((stat: any) => (
                <div key={stat._key} className="text-center p-3 bg-honed-stone-light rounded-lg">
                  <div className="text-2xl font-bold text-mulberry">{stat.value}</div>
                  <div className="text-sm text-black/70">{stat.label}</div>
                  {stat.trend && (
                    <div className="text-xs text-black/50 mt-1">{stat.trend}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Live MND Widget */}
          <div className="mnd-rates-widget" style={{ width: 250, height: 330, fontSize: 12 }}>
            <div style={{ textAlign: 'center', padding: '4px 0', backgroundColor: '#4C2230', color: '#FFFFFF' }}>
              <a href="https://www.mortgagenewsdaily.com/mortgage-rates" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', textDecoration: 'none' }}>Current Interest Rates</a>
            </div>
            <iframe
              src="//widgets.mortgagenewsdaily.com/widget/f/rates?t=small&sc=true&c=4C2230&u=&cbu=&w=248&h=280"
              width={250}
              height={280}
              frameBorder={0}
              scrolling="no"
              style={{ border: 'solid 1px #4C2230', borderWidth: '0 1px', boxSizing: 'border-box', width: 250, height: 280, display: 'block' }}
              title="MortgageNewsDaily Live Rates"
            />
            <div style={{ textAlign: 'center', padding: '4px 0', backgroundColor: '#4C2230', color: '#FFFFFF' }}>
              View More <a href="https://www.mortgagenewsdaily.com/mortgage-rates" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', textDecoration: 'none' }}>Interest Rates</a>
            </div>
          </div>

          {/* Context for Buyers */}
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-800 mb-2">What This Means for Buyers</h5>
              <p className="text-sm text-green-700">
                Current rates directly impact buyer purchasing power. Every 0.5% rate change can shift affordability by ~5% on monthly payments.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">Why This Matters for Your Sale</h5>
              <p className="text-sm text-blue-700">
                Rates updated in real-time from actual lender rate sheets. Lower rates typically increase buyer activity and showing volume.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Week Summary Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-mulberry">
            Weekly Report: {formatDate(latestUpdate.weekOf)} - {formatDate(latestUpdate.weekEnding)}
          </h2>
          {latestUpdate.publishedAt && (
            <span className="text-sm text-black/50">
              Published {formatLongDate(latestUpdate.publishedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="stat-card">
          <div className="stat-value">{last30DaysShowings}</div>
          <div className="stat-label">Last 30 Days</div>
          <div className="text-xs text-white/70 mt-1">Showings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalShowings}</div>
          <div className="stat-label">Total</div>
          <div className="text-xs text-white/70 mt-1">All Showings</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{latestUpdate.webMetrics.totalViews.toLocaleString()}</div>
          <div className="stat-label">Compass Views</div>
          {latestUpdate.webMetrics.viewsTrend && (
            <div className="text-xs text-white/70 mt-1">
              {latestUpdate.webMetrics.viewsTrend}
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-value">{latestUpdate.webMetrics.uniqueVisitors.toLocaleString()}</div>
          <div className="stat-label">Unique Visitors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{latestUpdate.webMetrics.avgTimeOnPage || 0}s</div>
          <div className="stat-label">Avg Time on Page</div>
          {latestUpdate.webMetrics.timeTrend && (
            <div className="text-xs text-white/70 mt-1">
              {latestUpdate.webMetrics.timeTrend}
            </div>
          )}
        </div>
      </div>

      {/* Compass Listing Insights - Detailed Breakdown */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="card-header mb-0">Compass Listing Insights</h3>
        </div>
        <p className="text-sm text-black/60 mb-6">
          UnLock MLS platform provides detailed engagement metrics across the agent network and buyer platforms.
        </p>

        {/* Platform Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-mulberry mb-3">Engagement by Platform</h4>
          <div className="space-y-2">
            {latestUpdate.webMetrics.byPlatform.map((platform: any) => (
              <div key={platform._key} className="flex items-center justify-between p-3 bg-honed-stone-light rounded-lg">
                <span className="text-sm font-medium">{platform.platform}</span>
                <span className="text-lg font-bold text-mulberry">{platform.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {latestUpdate.webMetrics.topLocations.map((loc: any) => (
            <div key={loc._key} className="text-center p-4 bg-honed-stone-light rounded-lg">
              <div className="text-2xl font-bold text-mulberry">{loc.percentage}</div>
              <div className="text-sm text-black/70">{loc.city}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Showing Activity */}
      <div className="card mb-6">
        <h3 className="card-header">Showing Activity</h3>
        <p className="text-sm text-black/60 mb-4">
          Detailed showing history tracked via ShowingTime. Total: {totalShowings} showings
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-honed-stone">
                <th className="text-left py-2 px-3 font-medium text-black/70">Date</th>
                <th className="text-left py-2 px-3 font-medium text-black/70">Time</th>
                <th className="text-left py-2 px-3 font-medium text-black/70">Brokerage</th>
                <th className="text-right py-2 px-3 font-medium text-black/70">Duration</th>
              </tr>
            </thead>
            <tbody>
              {latestUpdate.showings.map((showing: any) => (
                <tr key={showing._key} className={`border-b border-honed-stone/30 ${showing.isTeamShowing ? 'bg-yellow-50' : ''}`}>
                  <td className="py-2 px-3">{formatDate(showing.date)}</td>
                  <td className="py-2 px-3">{formatTime(showing.date)}</td>
                  <td className="py-2 px-3 text-black/70">{showing.brokerage}</td>
                  <td className="py-2 px-3 text-right">{formatDuration(showing.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seller Feedback */}
      {latestUpdate.buyerFeedback && latestUpdate.buyerFeedback.length > 0 && (
        <div className="card mb-6">
          <h3 className="card-header">Seller Feedback</h3>
          <p className="text-sm text-black/60 mb-4">
            Recent buyer feedback from showing agents
          </p>

          <div className="space-y-4">
            {latestUpdate.buyerFeedback.map((feedback: any) => (
              <div key={feedback._key} className="p-4 bg-honed-stone-light rounded-lg">
                <p className="text-sm text-black/80 leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keenan Group Analysis */}
      {latestUpdate.agentCommentary && (
        <div className="card mb-6">
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
