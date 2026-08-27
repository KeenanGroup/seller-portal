import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function payloadFetch(pathname: string) {
  const baseUrl = process.env.PAYLOAD_API_URL || 'https://cms.thekeenangroup.com/api'
  const apiKey = process.env.PAYLOAD_API_KEY
  if (!apiKey) return null
  try {
    const res = await fetch(`${baseUrl}${pathname}`, {
      cache: 'no-store',
      headers: {
        Authorization: `users API-Key ${apiKey}`,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
      },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

type Listing = {
  slug: string
  name: string
  price: number | null
  status: string
  beds: number | null
  baths: number | null
  sqft: number | null
  hood: string | null
}

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : null
}

async function getListings(): Promise<Listing[]> {
  const data = await payloadFetch(
    '/seller-portals?where[isActive][equals]=true&sort=displayName&limit=60&depth=0'
  )
  const portals: any[] = data?.docs || []

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const mlsMap: Record<string, any> = {}
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const mlsList = Array.from(
        new Set(
          portals
            .flatMap((p) => {
              const raw = String(p.mlsNumber ?? '').trim()
              const alt = raw.replace(/^ACT/, '')
              return [raw, alt]
            })
            .filter(Boolean)
        )
      )
      const { data: rows } = await supabase
        .from('properties')
        .select(
          'mls_number,price_current,price_list,status,bedrooms,bathrooms_full,bathrooms_half,sqft_total,subdivision'
        )
        .in('mls_number', mlsList)
      for (const r of rows || []) mlsMap[String((r as any).mls_number)] = r
    } catch {
      /* fall back to snapshot below */
    }
  }

  return portals.map((p): Listing => {
    const snap = p.listingSnapshot || {}
    const raw = String(p.mlsNumber ?? '').trim()
    const row = mlsMap[raw] || mlsMap[raw.replace(/^ACT/, '')]
    const bathsFull = num(row?.bathrooms_full)
    const bathsHalf = num(row?.bathrooms_half)
    const baths =
      bathsFull !== null ? bathsFull + (bathsHalf ?? 0) * 0.5 : num(snap.bathrooms)
    return {
      slug: p.slug,
      name: p.displayName || p.slug,
      price: num(row?.price_current) ?? num(row?.price_list) ?? num(snap.listPrice),
      status: String(row?.status || p.listingStatus || '').toLowerCase(),
      beds: num(row?.bedrooms) ?? num(snap.bedrooms),
      baths,
      sqft: num(row?.sqft_total) ?? num(snap.sqft),
      hood: row?.subdivision || null,
    }
  })
}

function money(n: number | null): string {
  return n ? `$${Number(n).toLocaleString('en-US')}` : 'Price on request'
}

function specLine(l: Listing): string {
  const parts: string[] = []
  if (l.beds && l.beds > 0) {
    parts.push(`${l.beds} bd`)
    if (l.baths) parts.push(`${l.baths} ba`)
  } else {
    parts.push('Commercial')
  }
  if (l.sqft) parts.push(`${Number(l.sqft).toLocaleString('en-US')} sqft`)
  return parts.join('  ·  ')
}

function Card({ l, pending }: { l: Listing; pending?: boolean }) {
  return (
    <a
      href={`/${l.slug}`}
      className="group block rounded-2xl border border-gold/20 bg-mulberry/50 p-6 transition duration-200 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_18px_44px_-22px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-[10px] uppercase tracking-[0.14em] rounded-full px-3 py-1 border ${
            pending
              ? 'text-honed-stone border-honed-stone/30'
              : 'text-gold border-gold/40'
          }`}
        >
          {pending ? 'Under Contract' : 'Active'}
        </span>
        <span className="text-xs text-sandstone opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gold-light">
          View dashboard &rarr;
        </span>
      </div>
      <h3 className="font-sans font-medium text-xl text-cream mb-1 leading-tight">{l.name}</h3>
      {l.hood && <div className="text-sm text-sandstone mb-4">{l.hood}</div>}
      {!l.hood && <div className="mb-4" />}
      <div className="text-2xl font-sans font-medium text-gold-light mb-1">{money(l.price)}</div>
      <div className="text-sm text-honed-stone">{specLine(l)}</div>
    </a>
  )
}

const ACTIVE = new Set(['active', 'coming soon', 'coming-soon', ''])
const PENDING = new Set([
  'pending',
  'active under contract',
  'activeuc',
  'active_under_contract',
  'under contract',
])

export default async function HomePage() {
  const listings = await getListings()
  const active = listings
    .filter((l) => ACTIVE.has(l.status))
    .sort((a, b) => (b.price || 0) - (a.price || 0))
  const pending = listings
    .filter((l) => PENDING.has(l.status))
    .sort((a, b) => (b.price || 0) - (a.price || 0))

  return (
    <div className="bg-evening-plum min-h-screen">
      <section className="pt-16 pb-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-gold uppercase tracking-[0.12em]">
              #1 Team &middot; Austin Board of Realtors 2024
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-sans font-medium text-white mb-4">Seller Portals</h1>
          <p className="text-lg text-honed-stone mb-2">
            Your private property dashboard &mdash; showings, engagement, and market insight.
          </p>
          <p className="text-sandstone italic">Tailored solutions, timeless relationships.</p>
          <div className="w-12 h-px bg-gold/70 mx-auto mt-7" />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-8">
        {active.length > 0 && (
          <section className="mb-10">
            <div className="flex items-baseline gap-4 mb-5">
              <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-cream">Active Listings</h2>
              <span className="text-xs text-sandstone">{active.length} homes</span>
              <span className="flex-1 h-px bg-gold/20" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((l) => (
                <Card key={l.slug} l={l} />
              ))}
            </div>
          </section>
        )}

        {pending.length > 0 && (
          <section className="mb-6">
            <div className="flex items-baseline gap-4 mb-5">
              <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-cream">Under Contract</h2>
              <span className="text-xs text-sandstone">{pending.length} homes</span>
              <span className="flex-1 h-px bg-gold/20" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((l) => (
                <Card key={l.slug} l={l} pending />
              ))}
            </div>
          </section>
        )}

        {active.length === 0 && pending.length === 0 && (
          <p className="text-center text-honed-stone py-16">
            Listings are loading. If this persists, please contact your Keenan Group agent.
          </p>
        )}

        <p className="text-center text-sandstone/80 text-xs mt-10">
          Each dashboard is protected by a private access code provided by your Keenan Group agent.
        </p>
      </main>

      <section className="py-12 border-t border-gold/15">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '#1', label: 'Austin Team 2024' },
              { value: '$1B+', label: 'Career Sales' },
              { value: '25+', label: 'Years Experience' },
              { value: '1,000+', label: 'Transactions' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-sans font-medium text-gold mb-1">{stat.value}</div>
                <div className="text-sm text-sandstone">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
