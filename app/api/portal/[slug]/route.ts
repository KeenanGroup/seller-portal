import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  // Common CDN-specific headers (best-effort; safe if ignored)
  'CDN-Cache-Control': 'no-store',
  'Surrogate-Control': 'no-store',
} as const

function getStreetNumberFromSlug(slug: string): string | null {
  const match = slug.match(/^(\d{1,6})(?:-|$)/)
  return match?.[1] ?? null
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function normalizePasscode(passcode: string | null | undefined) {
  return String(passcode ?? '').trim()
}

function sanitizePortal(portal: any) {
  if (!portal || typeof portal !== 'object') return portal
  // Never expose access tokens or seller contact info to browsers.
  const { sellers: _sellers, accessToken: _accessToken, tokenExpiresAt: _tokenExpiresAt, ...rest } = portal
  return rest
}

function sanitizeShowings(showings: any, opts?: { includeAgentNames?: boolean }) {
  if (!Array.isArray(showings)) return []
  // Contract: never expose seller PII. Agent names are optional and controlled per-portal.
  return showings
    .map((s) => ({
      date: s?.date ?? null,
      agentName: opts?.includeAgentNames ? (s?.agentName ?? null) : null,
      brokerage: s?.brokerage ?? null,
      duration: typeof s?.duration === 'number' ? s.duration : null,
      feedback: s?.feedback ?? null,
      sentiment: s?.sentiment ?? null,
      isTeamShowing: Boolean(s?.isTeamShowing),
    }))
    .filter((s) => Boolean(s.date))
}

function sanitizeMarketUpdate(update: any) {
  if (!update || typeof update !== 'object') return null

  const chartImage = update?.chartImage
  const chartImageUrl =
    chartImage && typeof chartImage === 'object'
      ? (chartImage?.url ?? chartImage?.sizes?.card?.url ?? null)
      : null

  return {
    id: update.id,
    headline: update.headline ?? null,
    category: update.category ?? null,
    effectiveDate: update.effectiveDate ?? null,
    keyStats: Array.isArray(update.keyStats) ? update.keyStats : [],
    chartImageUrl,
    chartEmbedUrl: update.chartEmbedUrl ?? null,
    calloutTitle: update.calloutTitle ?? null,
    calloutBody: update.calloutBody ?? null,
    moreRatesUrl: update.moreRatesUrl ?? null,
    sourceUrl: update.sourceUrl ?? null,
    content: update.content ?? null,
  }
}

function sanitizeUpdate(
  update: any,
  opts?: { includeAgentNames?: boolean; fallbackMortgageUpdate?: any | null }
) {
  if (!update || typeof update !== 'object') return update

  return {
    id: update.id,
    displayName: update.displayName ?? null,
    weekOf: update.weekOf ?? null,
    weekEnding: update.weekEnding ?? null,
    isPublished: Boolean(update.isPublished),
    publishedAt: update.publishedAt ?? null,
    propertyPhotos: Array.isArray(update.propertyPhotos)
      ? update.propertyPhotos.map((p: any) => ({
          ...(p && typeof p === 'object' ? p : {}),
          url: typeof p?.url === 'string' ? p.url.trim() : p?.url ?? null,
        }))
      : [],
    showings: sanitizeShowings(update.showings, { includeAgentNames: opts?.includeAgentNames }),
    openHouses: Array.isArray(update.openHouses) ? update.openHouses : [],
    webMetrics: update.webMetrics ?? null,
    sellerFeedback: Array.isArray(update.sellerFeedback)
      ? update.sellerFeedback.map((f: any) => ({
          ...(f && typeof f === 'object' ? f : {}),
          message: typeof f?.message === 'string' ? f.message.trim() : f?.message ?? null,
          sourceName: typeof f?.sourceName === 'string' ? f.sourceName.trim() : f?.sourceName ?? null,
          showSourceName: Boolean(f?.showSourceName),
          date: f?.date ?? null,
        }))
      : [],
    agentCommentary: update.agentCommentary ?? null,
    priceRecommendation: update.priceRecommendation ?? null,
    neighborhoodActivity: update.neighborhoodActivity ?? null,
    propertyMaintenance: Array.isArray(update.propertyMaintenance) ? update.propertyMaintenance : [],
    mortgageUpdate: sanitizeMarketUpdate(update.mortgageUpdate ?? opts?.fallbackMortgageUpdate),
    marketConditions: sanitizeMarketUpdate(update.marketConditions),
    nextSteps: Array.isArray(update.nextSteps) ? update.nextSteps : [],
  }
}

async function payloadFetch(pathname: string) {
  const baseUrl = process.env.PAYLOAD_API_URL || 'https://cms.thekeenangroup.com/api'
  const apiKey = process.env.PAYLOAD_API_KEY

  if (!apiKey) {
    throw new Error('Missing PAYLOAD_API_KEY')
  }

  const res = await fetch(`${baseUrl}${pathname}`, {
    cache: 'no-store',
    headers: {
      Authorization: `users API-Key ${apiKey}`,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Payload API ${res.status}: ${text}`)
  }

  return res.json()
}

async function getUniversalMortgageUpdate() {
  const mortgage = await payloadFetch(
    `/market-updates?where[category][equals]=mortgage&sort=-effectiveDate&limit=1&depth=1`
  )
  return mortgage?.docs?.[0] ?? null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const provided = normalizePasscode(request.headers.get('x-portal-passcode'))
    const streetNumber = getStreetNumberFromSlug(slug)

    if (!provided) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE_HEADERS })
    }

    // If the passcode matches the street number pattern, we can early accept and then
    // fetch the portal (avoids leaking portal existence when passcode is wrong).
    const streetNumberMatch = streetNumber && provided === streetNumber

    const portals = await payloadFetch(
      `/seller-portals?where[slug][equals]=${encodeURIComponent(slug)}&where[isActive][equals]=true&depth=0&limit=1`
    )

    const portal = portals?.docs?.[0]
    const portalPasscode = normalizePasscode(portal?.passcode)
    const expected = portalPasscode || normalizePasscode(streetNumber)

    // If passcode doesn't match, respond 401 even if portal does not exist
    // (prevents leaking valid slugs via 404).
    if (!expected || provided !== expected) {
      // Special case: if the portal doesn't exist and the passcode doesn't match a street-number,
      // return 401 to avoid enumeration. If it *does* match street number, we can return 404 below.
      if (!portal && !streetNumberMatch) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE_HEADERS })
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE_HEADERS })
    }

    if (!portal) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: NO_STORE_HEADERS })
    }

    const updates = await payloadFetch(
      // depth=0 prevents embedding related portal/sellers in the response.
      `/seller-updates?where[portal][equals]=${portal.id}&where[isPublished][equals]=true&sort=-publishedAt&limit=12&depth=1`
    )

    const universalMortgage = await getUniversalMortgageUpdate().catch((e) => {
      console.warn('Failed to fetch universal mortgage update:', e)
      return null
    })

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let listing: any = null
    if (supabaseUrl && supabaseKey && portal.mlsNumber) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const rawMls = String(portal.mlsNumber ?? '').trim()
      const candidates = new Set<string>()
      if (rawMls) {
        candidates.add(rawMls)
        if (/^\d+$/.test(rawMls)) candidates.add(`ACT${rawMls}`)
        if (/^ACT\d+$/.test(rawMls)) candidates.add(rawMls.replace(/^ACT/, ''))
      }

      for (const mls of candidates) {
        const { data, error } = await supabase
          .from('properties')
          .select(
            [
              'mls_number',
              'slug',
              'address_full',
              'city',
              'state',
              'zip_code',
              'subdivision',
              'status',
              'date_listed',
              'days_on_market',
              'price_list',
              'price_current',
              'price_original',
              'bedrooms',
              'bathrooms_full',
              'bathrooms_half',
              'sqft_total',
              'lot_size_acres',
              'year_built',
              'property_type',
              'garage_spaces',
              'description_public',
              'photos',
              'virtual_tour_url',
            ].join(',')
          )
          .eq('mls_number', mls)
          .maybeSingle()

        if (error) {
          console.warn('Supabase listing lookup failed:', error)
          continue
        }

        if (!data) continue

        const bathroomsFull = toNumber((data as any).bathrooms_full) ?? 0
        const bathroomsHalf = toNumber((data as any).bathrooms_half) ?? 0

        listing = {
          mls_number: (data as any).mls_number ?? null,
          slug: (data as any).slug ?? null,
          street_address: (data as any).address_full ?? null,
          city: (data as any).city ?? null,
          state: (data as any).state ?? null,
          zip_code: (data as any).zip_code ?? null,
          subdivision: (data as any).subdivision ?? null,
          neighborhood: (data as any).subdivision ?? null,
          status: (data as any).status ?? null,
          list_date: (data as any).date_listed ?? null,
          days_on_market: (data as any).days_on_market ?? null,
          list_price: toNumber((data as any).price_list) ?? toNumber((data as any).price_current),
          original_list_price: toNumber((data as any).price_original),
          bedrooms: (data as any).bedrooms ?? null,
          bathrooms: bathroomsFull + bathroomsHalf * 0.5,
          sqft: (data as any).sqft_total ?? null,
          lot_size_acres: toNumber((data as any).lot_size_acres),
          year_built: (data as any).year_built ?? null,
          property_type: (data as any).property_type ?? null,
          garage: (data as any).garage_spaces ?? null,
          description: (data as any).description_public ?? null,
          photos: Array.isArray((data as any).photos) ? (data as any).photos : [],
          virtualTourUrl: (data as any).virtual_tour_url ?? null,
        }
        break
      }
    }

    const safePortal = sanitizePortal(portal)
    const includeAgentNames = Boolean(portal?.settings?.showAgentNamesToSeller)
    const updateDocs: any[] = Array.isArray(updates?.docs) ? updates.docs : []

    const safeUpdates = updateDocs.map((u: any) =>
      sanitizeUpdate(u, { includeAgentNames, fallbackMortgageUpdate: universalMortgage })
    )

    return NextResponse.json(
      {
        portal: safePortal,
        listing,
        updates: safeUpdates,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    )
  } catch (error) {
    console.error('Seller portal API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: NO_STORE_HEADERS })
  }
}
