import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity'
import { getSupabase } from '@/lib/supabase'
import { PortableText } from '@portabletext/react'

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
      bedrooms,
      bathrooms,
      squareFeet,
      yearBuilt,
      propertyType,
      status,
      listDate,
      "image": images[0].asset->url
    },
    "updates": *[_type == "sellerUpdate" && portal._ref == ^._id && isPublished == true] | order(weekOf desc)[0...12]{
      _id,
      weekOf,
      weekEnding,
      showings,
      openHouses,
      webMetrics,
      neighborhoodActivity,
      agentCommentary,
      priceRecommendation,
      propertyMaintenance,
      nextSteps,
      publishedAt
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

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Property Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {listing.image && (
            <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={listing.image}
                alt={listing.address?.street}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-grow">
            <h1 className="text-2xl font-serif text-brand mb-2">
              {listing.address?.street}
            </h1>
            <p className="text-charcoal/70 mb-4">
              {listing.address?.city}, {listing.address?.state} {listing.address?.zip}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-charcoal/50 block">
                  {listing.listPrice < 10000 ? 'Rent' : 'List Price'}
                </span>
                <span className="font-semibold text-brand">
                  {formatCurrency(listing.listPrice)}
                  {listing.listPrice < 10000 && <span className="text-sm font-normal">/mo</span>}
                </span>
              </div>
              <div>
                <span className="text-charcoal/50 block">Beds / Baths</span>
                <span className="font-semibold">{listing.bedrooms} / {listing.bathrooms}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block">Sq Ft</span>
                <span className="font-semibold">{listing.squareFeet?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block">Year Built</span>
                <span className="font-semibold">{listing.yearBuilt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {latestUpdate && (
        <>
          {/* Week Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-serif text-brand mb-4">
              Week of {formatDate(latestUpdate.weekOf)} - {formatDate(latestUpdate.weekEnding)}
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="stat-card">
                <div className="stat-value">{latestUpdate.showings?.length || 0}</div>
                <div className="stat-label">Showings</div>
              </div>
              {latestUpdate.webMetrics && (
                <>
                  <div className="stat-card">
                    <div className="stat-value">{latestUpdate.webMetrics.totalViews?.toLocaleString()}</div>
                    <div className="stat-label">Online Views</div>
                    {latestUpdate.webMetrics.viewsTrend && (
                      <div className={`text-xs mt-1 ${latestUpdate.webMetrics.viewsTrend.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                        {latestUpdate.webMetrics.viewsTrend}
                      </div>
                    )}
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{latestUpdate.webMetrics.uniqueVisitors?.toLocaleString()}</div>
                    <div className="stat-label">Unique Visitors</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{Math.floor((latestUpdate.webMetrics.avgTimeOnPage || 0) / 60)}:{String((latestUpdate.webMetrics.avgTimeOnPage || 0) % 60).padStart(2, '0')}</div>
                    <div className="stat-label">Avg Time</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Showings */}
          {latestUpdate.showings && latestUpdate.showings.length > 0 && (
            <div className="card mb-6">
              <h3 className="card-header">Showing Activity</h3>
              <div className="space-y-4">
                {latestUpdate.showings.map((showing: any, i: number) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-16 text-center flex-shrink-0">
                      <div className="text-xs text-charcoal/50 uppercase">{formatDate(showing.date).split(',')[0]}</div>
                      <div className="font-semibold text-brand">{formatDate(showing.date).split(' ')[1]} {formatDate(showing.date).split(' ')[2]}</div>
                      <div className="text-xs text-charcoal/50">{formatTime(showing.date)}</div>
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{showing.brokerage}</div>
                      {showing.feedback && showing.feedbackReceived && (
                        <div className="mt-2 bg-champagne-light rounded-lg p-3 text-sm">
                          <span className="font-medium text-brand">Feedback:</span> {showing.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Recommendation */}
          {latestUpdate.priceRecommendation?.hasRecommendation && (
            <div className="card mb-6 border-l-4 border-gold">
              <h3 className="card-header">Price Strategy Recommendation</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-charcoal/70">Recommended Adjustment:</span>
                  <span className="text-xl font-bold text-brand">
                    -{formatCurrency(latestUpdate.priceRecommendation.recommendedReduction)}
                  </span>
                </div>
                {latestUpdate.priceRecommendation.alternativeReduction && (
                  <div className="flex items-center gap-4">
                    <span className="text-charcoal/70">Alternative Option:</span>
                    <span className="text-lg font-semibold text-charcoal">
                      -{formatCurrency(latestUpdate.priceRecommendation.alternativeReduction)}
                    </span>
                  </div>
                )}
                {latestUpdate.priceRecommendation.rationale && (
                  <p className="text-charcoal/70 text-sm mt-3 pt-3 border-t border-champagne">
                    {latestUpdate.priceRecommendation.rationale}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Agent Commentary */}
          {latestUpdate.agentCommentary && (
            <div className="card mb-6">
              <h3 className="card-header">Our Take</h3>
              <div className="prose prose-sm max-w-none text-charcoal/80">
                <PortableText value={latestUpdate.agentCommentary} />
              </div>
            </div>
          )}

          {/* Property Maintenance */}
          {latestUpdate.propertyMaintenance && latestUpdate.propertyMaintenance.length > 0 && (
            <div className="card mb-6">
              <h3 className="card-header">Property Maintenance</h3>
              <ul className="space-y-2">
                {latestUpdate.propertyMaintenance.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <span className="text-charcoal/50 text-sm">{formatDate(item.date)}:</span>{' '}
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {latestUpdate.nextSteps && latestUpdate.nextSteps.length > 0 && (
            <div className="card">
              <h3 className="card-header">Next Steps</h3>
              <ul className="space-y-2">
                {latestUpdate.nextSteps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* No Updates */}
      {(!updates || updates.length === 0) && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-serif text-brand mb-2">Updates Coming Soon</h3>
          <p className="text-charcoal/70">
            Your first weekly update will be published shortly. Check back soon!
          </p>
        </div>
      )}

      {/* Update History */}
      {updates && updates.length > 1 && (
        <div className="mt-8">
          <h3 className="text-lg font-serif text-brand mb-4">Previous Updates</h3>
          <div className="flex flex-wrap gap-2">
            {updates.slice(1).map((update: any) => (
              <div
                key={update._id}
                className="bg-white px-4 py-2 rounded-lg text-sm border border-champagne"
              >
                Week of {formatDate(update.weekOf)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
