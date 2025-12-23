import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity'
import { getSupabase } from '@/lib/supabase'
import { PortableText } from '@portabletext/react'
import { PropertyHero } from '../components/property_hero'
import { ViewsByPublisherChart } from '../components/views_by_publisher_chart'
import { ViewsByCityMap } from '../components/views_by_city_map'
import { ProtectedContent } from '../components/protected_content'

function extractStreetNumber(address: string): string {
  const match = address?.match(/^(\d+)/)
  return match ? match[1] : ''
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSellerPortal(slug: string) {
  const query = `*[_type == "sellerPortal" && slug.current == $slug && isActive == true][0]{
    _id,
    "slug": slug.current,
    sellers,
    "listing": listing->{
      _id,
      mlsNumber,
      address,
      listPrice,
      originalListPrice,
      bedrooms,
      bathrooms,
      squareFeet,
      lotSize,
      yearBuilt,
      propertyType,
      status,
      listDate,
      compassUrl,
      garage,
      pool,
      description,
      features,
      neighborhood,
      priceHistory,
      "image": images[0].asset->url,
      "images": images[].asset->url
    },
    "updates": *[_type == "sellerUpdate" && portal._ref == ^._id && isPublished == true] | order(weekOf desc)[0...12]{
      _id,
      weekOf,
      weekEnding,
      showings,
      openHouses,
      webMetrics,
      oneHomeMetrics,
      compassMetrics,
      neighborhoodActivity,
      agentCommentary,
      marketAnalysis,
      priceRecommendation,
      propertyMaintenance,
      nextSteps,
      cumulativeStats,
      publishedAt,
      "mortgageUpdate": mortgageUpdate->{
        _id,
        title,
        headline,
        content,
        keyStats,
        validFrom
      }
    }
  }`

  return sanityClient.fetch(query, { slug })
}

async function trackView(portalId: string, slug: string) {
  try {
    const supabase = getSupabase()
    if (!supabase) return

    await supabase.from('seller_portal_views').insert({
      portal_id: portalId,
      slug,
      viewed_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('Failed to track view:', e)
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const portal = await getSellerPortal(slug)

  if (!portal) {
    return { title: 'Seller Portal | Keenan Group' }
  }

  const address = portal.listing?.address?.street || 'Your Property'

  return {
    title: `${address} - Seller Update | Keenan Group`,
    description: `Weekly market update and showing activity for ${address}`,
  }
}

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

function calculateDaysOnMarket(listDate: string) {
  const listed = new Date(listDate)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - listed.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}


function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export default async function SellerPortalPage({ params }: PageProps) {
  const { slug } = await params
  const portal = await getSellerPortal(slug)

  if (!portal || !portal.listing) {
    notFound()
  }

  await trackView(portal._id, slug)

  const { listing, updates } = portal
  const latestUpdate = updates?.[0]
  const isRental = listing.listPrice < 10000
  const daysOnMarket = listing.listDate ? calculateDaysOnMarket(listing.listDate) : null
  const streetNumber = extractStreetNumber(listing.address?.street || '')
  const propertyAddress = listing.address?.street || 'Your Property'

  // Calculate cumulative showings from all updates
  const totalShowings = updates?.reduce((sum: number, update: any) => sum + (update.showings?.length || 0), 0) || 0

  // Calculate showings in last 30 days (by individual showing date)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const last30DaysShowings = updates?.reduce((sum: number, update: any) => {
    if (!update.showings) return sum
    return sum + update.showings.filter((showing: any) => {
      const showingDate = new Date(showing.date)
      return showingDate >= thirtyDaysAgo
    }).length
  }, 0) || 0

  return (
    <ProtectedContent streetNumber={streetNumber} propertyAddress={propertyAddress}>
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Property Hero Image */}
      {listing.images && listing.images.length > 0 && (
        <div className="mb-8">
          <PropertyHero
            images={listing.images}
            address={listing.address?.street || 'Property'}
            neighborhood={listing.neighborhood}
            status={listing.status}
          />
        </div>
      )}

      {/* Property Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {!listing.images?.length && listing.image && (
            <div className="w-full md:w-72 h-52 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={listing.image}
                alt={listing.address?.street}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-medium text-mulberry">
                {listing.address?.street}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {listing.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
            <p className="text-black/70 mb-1">
              {listing.address?.city}, {listing.address?.state} {listing.address?.zip}
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
                <span className="text-black/50 block">{isRental ? 'Rent' : 'List Price'}</span>
                <span className="font-semibold text-mulberry text-lg">
                  {formatCurrency(listing.listPrice)}
                  {isRental && <span className="text-sm font-normal">/mo</span>}
                </span>
              </div>
              <div>
                <span className="text-black/50 block">Beds / Baths</span>
                <span className="font-semibold">{listing.bedrooms} / {listing.bathrooms}</span>
              </div>
              <div>
                <span className="text-black/50 block">Sq Ft</span>
                <span className="font-semibold">{listing.squareFeet?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-black/50 block">Year Built</span>
                <span className="font-semibold">{listing.yearBuilt}</span>
              </div>
              {daysOnMarket && (
                <div>
                  <span className="text-black/50 block">Days on Market</span>
                  <span className="font-semibold">{daysOnMarket}</span>
                </div>
              )}
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
              {listing.pool && (
                <div>
                  <span className="text-black/50">Pool:</span> Yes
                </div>
              )}
              {listing.propertyType && (
                <div>
                  <span className="text-black/50">Type:</span> {listing.propertyType}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Listed Date */}
        {listing.listDate && (
          <div className="mt-4 pt-4 border-t border-honed-stone/30 text-sm text-black/60">
            Listed on {formatLongDate(listing.listDate)}
          </div>
        )}
      </div>

      {/* Mortgage News Daily Update - Only for Sales, Not Rentals */}
      {!isRental && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-header mb-0">Mortgage Rate Update</h3>
            <span className="text-xs text-black/50">
              {latestUpdate?.mortgageUpdate?.validFrom
                ? `Updated ${formatDate(latestUpdate.mortgageUpdate.validFrom)}`
                : 'Live rates updated daily'}
            </span>
          </div>

          {/* Full Article Content from Sanity */}
          {latestUpdate?.mortgageUpdate && (
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
          )}

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
      )}

      {latestUpdate && (
        <>
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
            {latestUpdate.webMetrics && (
              <>
                <div className="stat-card">
                  <div className="stat-value">{latestUpdate.webMetrics.totalViews?.toLocaleString()}</div>
                  <div className="stat-label">Compass Views</div>
                  {latestUpdate.webMetrics.viewsTrend && (
                    <div className={`text-xs mt-1 ${latestUpdate.webMetrics.viewsTrend.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                      {latestUpdate.webMetrics.viewsTrend} vs prior
                    </div>
                  )}
                </div>
                <div className="stat-card">
                  <div className="stat-value">{latestUpdate.webMetrics.uniqueVisitors?.toLocaleString()}</div>
                  <div className="stat-label">Unique Visitors</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{latestUpdate.webMetrics.avgTimeOnPage || 0}s</div>
                  <div className="stat-label">Avg Time on Page</div>
                </div>
              </>
            )}
          </div>

          {/* Compass Listing Insights - Detailed Breakdown */}
          {latestUpdate.webMetrics && (
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="card-header mb-0">Compass Listing Insights</h3>
                {latestUpdate.webMetrics.compassInsightsPdfUrl && (
                  <a
                    href={latestUpdate.webMetrics.compassInsightsPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-mulberry text-white text-sm rounded-lg hover:bg-mulberry-light transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Full Report
                  </a>
                )}
              </div>
              <p className="text-sm text-black/60 mb-4">
                Aggregated data from Compass.com, Zillow, Realtor.com, Trulia, and syndicated listing sites showing how buyers are discovering and engaging with your property online.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.webMetrics.totalViews?.toLocaleString()}</div>
                  <div className="text-sm text-black/70">Total Page Views</div>
                  {latestUpdate.webMetrics.viewsTrend && (
                    <div className={`text-sm font-medium mt-1 ${latestUpdate.webMetrics.viewsTrend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {latestUpdate.webMetrics.viewsTrend} from previous period
                    </div>
                  )}
                </div>
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.webMetrics.uniqueVisitors?.toLocaleString()}</div>
                  <div className="text-sm text-black/70">Unique Visitors</div>
                </div>
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.webMetrics.avgTimeOnPage || 0}s</div>
                  <div className="text-sm text-black/70">Avg Time Spent</div>
                </div>
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">
                    {latestUpdate.webMetrics.uniqueVisitors && latestUpdate.webMetrics.totalViews
                      ? (latestUpdate.webMetrics.totalViews / latestUpdate.webMetrics.uniqueVisitors).toFixed(1)
                      : '-'}
                  </div>
                  <div className="text-sm text-black/70">Views per Visitor</div>
                </div>
              </div>

              {/* Traffic Source Breakdown - Enhanced Chart */}
              {latestUpdate.webMetrics?.byPlatform && latestUpdate.webMetrics.byPlatform.length > 0 && (
                <div className="mt-6 pt-6 border-t border-honed-stone/30">
                  <ViewsByPublisherChart
                    data={latestUpdate.webMetrics.byPlatform}
                    totalViews={latestUpdate.webMetrics.totalViews}
                  />
                </div>
              )}

              {/* Geographic Distribution - Enhanced Map */}
              {latestUpdate.webMetrics?.topLocations && latestUpdate.webMetrics.topLocations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-honed-stone/30">
                  <ViewsByCityMap data={latestUpdate.webMetrics.topLocations} />
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <span className="font-medium text-blue-800">What this means:</span>
                <span className="text-blue-700"> Higher view counts indicate strong market exposure. Average time spent over 15 seconds suggests genuine buyer interest rather than casual browsing.</span>
              </div>
            </div>
          )}

          {/* OneHome Agent Network Activity - Comprehensive */}
          {latestUpdate.oneHomeMetrics && (
            <div className="card mb-6">
              <h3 className="card-header">CoStar OneHome Agent Network</h3>
              <p className="text-sm text-black/60 mb-4">
                Activity from the agent-to-agent network where real estate professionals share and view listings for their buyer clients. High agent activity often precedes showing requests.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.oneHomeMetrics.agentViews?.toLocaleString()}</div>
                  <div className="text-sm text-black/70">Agent Views</div>
                  <div className="text-xs text-black/50 mt-1">Agents reviewing listing</div>
                </div>
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.oneHomeMetrics.clientViews?.toLocaleString()}</div>
                  <div className="text-sm text-black/70">Client Views</div>
                  <div className="text-xs text-black/50 mt-1">Buyers via agent portals</div>
                </div>
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.oneHomeMetrics.distinctClientViews?.toLocaleString()}</div>
                  <div className="text-sm text-black/70">Unique Buyer Clients</div>
                  <div className="text-xs text-black/50 mt-1">Individual buyers reached</div>
                </div>
                <div className="text-center p-4 bg-honed-stone-light rounded-lg">
                  <div className="text-3xl font-bold text-mulberry">{latestUpdate.oneHomeMetrics.favorites?.toLocaleString()}</div>
                  <div className="text-sm text-black/70">Saved to Favorites</div>
                  <div className="text-xs text-black/50 mt-1">High-intent signal</div>
                </div>
              </div>

              {/* Detailed OneHome Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 border border-honed-stone/30 rounded-lg">
                  <div className="text-lg font-semibold text-mulberry">{latestUpdate.oneHomeMetrics.autoEmails?.toLocaleString()}</div>
                  <div className="text-xs text-black/60">Auto-Email Alerts Sent</div>
                </div>
                <div className="p-3 border border-honed-stone/30 rounded-lg">
                  <div className="text-lg font-semibold text-mulberry">{latestUpdate.oneHomeMetrics.clientPortals?.toLocaleString()}</div>
                  <div className="text-xs text-black/60">Client Portal Shares</div>
                </div>
                <div className="p-3 border border-honed-stone/30 rounded-lg">
                  <div className="text-lg font-semibold text-mulberry">{latestUpdate.oneHomeMetrics.last14DaysViews?.toLocaleString()}</div>
                  <div className="text-xs text-black/60">Last 14 Days Activity</div>
                </div>
                <div className="p-3 border border-honed-stone/30 rounded-lg">
                  <div className="text-lg font-semibold text-mulberry">
                    {latestUpdate.oneHomeMetrics.agentViews && latestUpdate.oneHomeMetrics.clientViews
                      ? ((latestUpdate.oneHomeMetrics.clientViews / latestUpdate.oneHomeMetrics.agentViews) * 100).toFixed(1) + '%'
                      : '-'}
                  </div>
                  <div className="text-xs text-black/60">Client Conversion Rate</div>
                </div>
              </div>

              {/* Concierge Status */}
              {(latestUpdate.oneHomeMetrics.conciergeApproved > 0 || latestUpdate.oneHomeMetrics.conciergeRejected > 0) && (
                <div className="mt-4 p-4 bg-honed-stone-light rounded-lg">
                  <h4 className="font-medium text-mulberry mb-2">Compass Concierge Inquiries</h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-green-700">{latestUpdate.oneHomeMetrics.conciergeApproved}</span>
                      <span className="text-sm text-black/60">Approved Buyers</span>
                    </div>
                    {latestUpdate.oneHomeMetrics.conciergeRejected > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span className="font-semibold text-red-600">{latestUpdate.oneHomeMetrics.conciergeRejected}</span>
                        <span className="text-sm text-black/60">Did Not Qualify</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-black/50 mt-2">
                    Concierge pre-qualifies buyers before they can request showings, ensuring only serious, qualified buyers tour your home.
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
                <span className="font-medium text-green-800">Why this matters:</span>
                <span className="text-green-700"> Agent network activity is a leading indicator. When agents save your listing or share it with clients, showings typically follow within 1-2 weeks.</span>
              </div>
            </div>
          )}

          {/* Showing Activity - Detailed */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-header mb-0">Showing Activity</h3>
              <div className="text-sm">
                <span className="text-black/50">This week:</span>
                <span className="font-semibold text-mulberry ml-1">{latestUpdate.showings?.length || 0}</span>
                <span className="text-black/30 mx-2">|</span>
                <span className="text-black/50">Total:</span>
                <span className="font-semibold text-mulberry ml-1">{totalShowings}</span>
              </div>
            </div>

            {latestUpdate.showings && latestUpdate.showings.length > 0 ? (
              <div className="space-y-4">
                {latestUpdate.showings.map((showing: any, i: number) => (
                  <div key={i} className="p-4 bg-honed-stone-light rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-white px-3 py-2 rounded-lg shadow-sm">
                          <div className="text-xs text-black/50 uppercase">{formatDate(showing.date).split(',')[0]}</div>
                          <div className="font-bold text-mulberry">{formatDate(showing.date).split(' ')[1]} {formatDate(showing.date).split(' ')[2]}</div>
                          <div className="text-sm text-black/70">{formatTime(showing.date)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-mulberry">{showing.brokerage}</div>
                          {showing.duration && (
                            <div className="text-sm text-black/50">Duration: {formatDuration(showing.duration)}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {showing.feedbackReceived ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Feedback Received</span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Awaiting Feedback</span>
                        )}
                      </div>
                    </div>

                    {showing.feedback && showing.feedbackReceived && (
                      <div className="mt-3 p-3 bg-white rounded-lg border-l-4 border-mulberry">
                        <div className="text-sm font-medium text-mulberry mb-1">Agent Feedback:</div>
                        <p className="text-sm text-black/80">{showing.feedback}</p>
                        {showing.buyerInterestLevel && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-black/50">Interest Level:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-4 h-4 rounded-full ${level <= showing.buyerInterestLevel ? 'bg-mulberry' : 'bg-honed-stone'}`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-black/50">
                <svg className="w-12 h-12 mx-auto mb-3 text-honed-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No showings scheduled this week</p>
                <p className="text-sm mt-1">Online activity remains strong - showings typically follow interest spikes</p>
              </div>
            )}
          </div>

          {/* Price Recommendation */}
          {latestUpdate.priceRecommendation?.hasRecommendation && (
            <div className="card mb-6 border-l-4 border-gold">
              <h3 className="card-header">Price Strategy Recommendation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-black/70">Recommended Adjustment:</span>
                  <span className="text-2xl font-bold text-mulberry">
                    -{formatCurrency(latestUpdate.priceRecommendation.recommendedReduction)}
                  </span>
                  <span className="text-black/50">
                    (New price: {formatCurrency(listing.listPrice - latestUpdate.priceRecommendation.recommendedReduction)})
                  </span>
                </div>
                {latestUpdate.priceRecommendation.alternativeReduction && (
                  <div className="flex items-center gap-4">
                    <span className="text-black/70">Alternative Option:</span>
                    <span className="text-xl font-semibold text-black">
                      -{formatCurrency(latestUpdate.priceRecommendation.alternativeReduction)}
                    </span>
                    <span className="text-black/50">
                      (New price: {formatCurrency(listing.listPrice - latestUpdate.priceRecommendation.alternativeReduction)})
                    </span>
                  </div>
                )}
                {latestUpdate.priceRecommendation.rationale && (
                  <div className="mt-4 p-4 bg-honed-stone-light rounded-lg">
                    <div className="font-medium text-mulberry mb-2">Rationale:</div>
                    <p className="text-black/70">{latestUpdate.priceRecommendation.rationale}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Market Analysis */}
          {latestUpdate.marketAnalysis && (
            <div className="card mb-6">
              <h3 className="card-header">Market Context</h3>
              <div className="prose prose-sm max-w-none text-black/80">
                <PortableText value={latestUpdate.marketAnalysis} />
              </div>
            </div>
          )}

          {/* Agent Commentary */}
          {latestUpdate.agentCommentary && (
            <div className="card mb-6">
              <h3 className="card-header">Our Analysis & Recommendations</h3>
              <div className="prose prose-sm max-w-none text-black/80">
                <PortableText value={latestUpdate.agentCommentary} />
              </div>
            </div>
          )}

          {/* Property Maintenance */}
          {latestUpdate.propertyMaintenance && latestUpdate.propertyMaintenance.length > 0 && (
            <div className="card mb-6">
              <h3 className="card-header">Property Maintenance & Updates</h3>
              <ul className="space-y-3">
                {latestUpdate.propertyMaintenance.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-honed-stone-light rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <div className="text-sm text-black/50">{formatDate(item.date)}</div>
                      <div className="font-medium">{item.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {latestUpdate.nextSteps && latestUpdate.nextSteps.length > 0 && (
            <div className="card mb-6">
              <h3 className="card-header">Action Items & Next Steps</h3>
              <ul className="space-y-3">
                {latestUpdate.nextSteps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-mulberry text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Neighborhood Activity */}
          {latestUpdate.neighborhoodActivity && (
            <div className="card mb-6">
              <h3 className="card-header">Neighborhood Market Activity</h3>
              <div className="prose prose-sm max-w-none text-black/80">
                <PortableText value={latestUpdate.neighborhoodActivity} />
              </div>
            </div>
          )}
        </>
      )}

      {/* No Updates State */}
      {(!updates || updates.length === 0) && (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-medium text-mulberry mb-2">Your First Report Is Coming Soon</h3>
          <p className="text-black/70 max-w-md mx-auto">
            We're gathering data on showings, online activity, and market conditions.
            Your first comprehensive weekly report will be published within 7 days of listing.
          </p>
        </div>
      )}

      {/* Update History */}
      {updates && updates.length > 1 && (
        <div className="mt-8 card">
          <h3 className="card-header">Previous Weekly Reports</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {updates.slice(1).map((update: any) => (
              <div
                key={update._id}
                className="p-3 bg-honed-stone-light rounded-lg text-center hover:bg-honed-stone transition-colors cursor-pointer"
              >
                <div className="font-medium text-mulberry">Week of {formatDate(update.weekOf)}</div>
                <div className="text-sm text-black/50">
                  {update.showings?.length || 0} showings
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="mt-8 card bg-mulberry text-white">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Questions About Your Report?</h3>
          <p className="text-white/80 mb-4">
            Your Keenan Group team is here to discuss any aspect of your listing strategy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="sms:+15124157653"
              className="inline-flex items-center gap-2 bg-white text-mulberry px-6 py-3 rounded-lg font-medium hover:bg-honed-stone transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Text Us
            </a>
            <a
              href="tel:+15124157653"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (512) 415-7653
            </a>
            <a
              href="mailto:keenan@compass.com"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
    </ProtectedContent>
  )
}
