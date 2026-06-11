'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ApiResponse = {
  portal: { id: string | number; slug: string; displayName: string; mlsNumber: string; isActive: boolean; passcode?: string | null; settings?: { showAgentNamesToSeller?: boolean | null } | null; viewCount?: number; lastViewedAt?: string; createdAt?: string; updatedAt?: string }
  listing: any | null
  updates: SellerUpdate[]
}

type MarketUpdate = {
  id: string | number; headline?: string | null; category?: string | null; effectiveDate?: string | null
  keyStats?: Array<{ label?: string | null; value?: string | null; trend?: string | null }>
  chartImageUrl?: string | null; chartEmbedUrl?: string | null; calloutTitle?: string | null; calloutBody?: string | null
  moreRatesUrl?: string | null; sourceUrl?: string | null; content?: any[] | null
}

type SellerUpdate = {
  id: string | number; weekOf?: string | null; weekEnding?: string | null; isPublished?: boolean; publishedAt?: string | null
  propertyPhotos?: Array<{ url?: string | null }>
  showings?: Array<{ date: string; agentName?: string | null; brokerage: string; duration: number; feedback?: string | null; sentiment?: 'very_positive' | 'positive' | 'neutral' | 'negative' | null; isTeamShowing?: boolean }>
  openHouses?: any[]; webMetrics?: any | null
  sellerFeedback?: Array<{ message: string; sourceName?: string | null; showSourceName?: boolean | null; date?: string | null; channel?: string | null; sentiment?: string | null }>
  agentCommentary?: any[] | null
  priceRecommendation?: { hasRecommendation?: boolean | null; recommendedReduction?: number | null; alternativeReduction?: number | null; rationale?: string | null } | null
  neighborhoodActivity?: { soldProperties?: Array<{ address?: string; price?: number; daysOnMarket?: number }>; pendingProperties?: Array<{ address?: string; listPrice?: number }>; activeCompetition?: Array<{ address?: string; listPrice?: number; daysOnMarket?: number; slug?: string }> } | null
  propertyMaintenance?: Array<{ description?: string; date?: string; completed?: boolean }>
  mortgageUpdate?: MarketUpdate | null; marketConditions?: MarketUpdate | null
  nextSteps?: Array<{ step?: string | null }>
}

function fmt$(a: number) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(a) }
function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }
function fmtDateLong(d: string) { return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }
function fmtDateChi(d: string) { return new Date(d).toLocaleDateString('en-US', { timeZone: 'America/Chicago', weekday: 'short', month: 'short', day: 'numeric' }) }
function daysBetween(a: Date, b: Date) { return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86400000)) }
function within(d: string, n: number, anchor: Date) { const x = new Date(d), c = new Date(anchor); c.setDate(anchor.getDate() - n); return x >= c && x <= anchor }
function parseTrend(t?: string | null): number | null { const s = String(t ?? '').trim(); if (!s) return null; const n = Number(s.replace(/[%↑↓+\s]/g, '')); return Number.isFinite(n) ? n : null }

function RichText({ value }: { value?: any[] | null }) {
  if (!Array.isArray(value) || !value.length) return null
  return (
    <div>
      {value.map((node: any, idx: number) => {
        const children = Array.isArray(node?.children) ? node.children : []
        const text = children.map((c: any, ci: number) => {
          const t = String(c?.text ?? ''); if (!t) return null
          let r: React.ReactNode = t
          if (c?.underline) r = <span className="underline">{r}</span>
          if (c?.italic) r = <em>{r}</em>
          if (c?.bold) r = <strong>{r}</strong>
          return <span key={`${idx}-${ci}`}>{r}</span>
        })
        if (['h1','h2','h3','h4'].includes(node?.type)) {
          const Tag = node.type as any
          return <Tag key={idx} className="text-mulberry font-semibold mt-4 mb-2">{text}</Tag>
        }
        return <p key={idx} className="text-sm text-black/80 leading-relaxed mb-3">{text}</p>
      })}
    </div>
  )
}


function Section({ label, badge, children, right }: { label: string; badge?: string | number; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="section-label">{label}{badge != null && <span className="count-badge">{badge}</span>}</div>
        {right}
      </div>
      {children}
    </div>
  )
}

function Callout({ title, children, variant }: { title: string; children: ReactNode; variant?: 'green' | 'gold' | 'blue' }) {
  const cls = { green: 'bg-green-50 border-green-200 text-green-900', gold: 'bg-amber-50 border-amber-200 text-amber-900', blue: 'bg-sky-50 border-sky-200 text-sky-900' }
  return (
    <div className={`rounded-xl p-5 border ${cls[variant || 'gold']}`}>
      <div className="font-semibold mb-1.5">{title}</div>
      <div className="text-sm leading-relaxed opacity-80">{children}</div>
    </div>
  )
}

function Kpi({ value, label, trend }: { value: string; label: string; trend?: string | null }) {
  const n = parseTrend(trend)
  return (
    <div className="text-center px-2">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {n != null && <div className={`text-xs mt-1.5 font-medium ${n < 0 ? 'text-red-600' : n > 0 ? 'text-green-600' : 'text-black/40'}`}>{n > 0 ? '+' : ''}{n.toFixed(1)}%</div>}
    </div>
  )
}

function Donut({ values, label }: { values: Array<{ pct: number; color: string }>; label: { value: string; subtitle: string } }) {
  const r = 44, sw = 14, c = 2 * Math.PI * r; let off = 0
  return (
    <div className="w-[120px] h-[120px] relative flex-shrink-0">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle r={r} cx="60" cy="60" fill="transparent" stroke="#e8e3dd" strokeWidth={sw} />
        {values.filter(v => v.pct > 0.2).map((v, i) => {
          const len = (v.pct / 100) * c, dash = `${len} ${c - len}`, doff = -off; off += len
          return <circle key={i} r={r} cx="60" cy="60" fill="transparent" stroke={v.color} strokeWidth={sw} strokeDasharray={dash} strokeDashoffset={doff} strokeLinecap="butt" transform="rotate(-90 60 60)" />
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-semibold text-mulberry">{label.value}</div>
        <div className="text-xs text-black/50">{label.subtitle}</div>
      </div>
    </div>
  )
}

const LOC_COLORS = ['#4b2030', '#5e3442', '#a16207', '#d97706', '#f59e0b', '#9ca3af']
const PUB_COLORS = ["#4b2030", "#5e3442", "#833119", "#a16207", "#9F8B72", "#9ca3af"]
function getPubColor(i: number) { return PUB_COLORS[Math.min(i, PUB_COLORS.length - 1)] }

export function SellerPortalDashboard({ slug, streetNumber }: { slug: string; streetNumber: string }) {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | number | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const headerAddr = useMemo(() => slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), [slug])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setError(null)
        const res = await fetch(`/api/portal/${encodeURIComponent(slug)}`, { cache: 'no-store', headers: { 'x-portal-passcode': streetNumber } })
        if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : res.status === 404 ? 'Portal not found' : `Error ${res.status}`)
        const json = (await res.json()) as ApiResponse
        if (!cancel) { setData(json); if (json?.updates?.[0]?.id != null) setSelectedUpdateId(p => p == null ? json.updates[0].id : p) }
      } catch (e: any) { if (!cancel) setError(e?.message || 'Failed to load') }
      finally { if (!cancel) setLoading(false) }
    })()
    return () => { cancel = true }
  }, [slug, streetNumber])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="text-mulberry">Loading portal...</div></div>
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-xl font-medium text-mulberry mb-2">Unable to load this portal</h1>
        <p className="text-sm text-black/60 mb-4">{headerAddr}</p>
        <p className="text-sm text-red-700">{error}</p>
        <p className="text-xs text-black/40 mt-4">If this persists, contact The Keenan Group for help.</p>
      </div>
    </div>
  )
  if (!data) return null

  const listing = data.listing, updates = data.updates || []
  const upd = (selectedUpdateId != null ? updates.find(u => String(u.id) === String(selectedUpdateId)) : null) || updates[0]

  const photos = (upd as any)?.propertyPhotos?.map((p: any) => p.url).filter(Boolean) || listing?.photos?.slice?.(0, 10) || []
  const street = listing?.street_address || listing?.address || headerAddr
  const city = listing?.city || '', state = listing?.state || '', zip = listing?.zip_code || ''
  const neighborhood = listing?.neighborhood || listing?.subdivision || ''
  const price = listing?.list_price ?? listing?.listPrice
  const priceUpdatedAt = listing?.price_updated_at ? new Date(listing.price_updated_at) : null
  const beds = listing?.bedrooms, baths = listing?.bathrooms, sf = listing?.sqft ?? listing?.squareFeet

  const listDate = listing?.list_date ? new Date(listing.list_date) : null
  const dom = listDate ? daysBetween(listDate, new Date()) : null
  const anchor = upd?.weekEnding ? new Date(upd.weekEnding) : new Date()

  const noShow = String(data.portal?.slug ?? '') === '1810-w-35th-st' || Boolean((data.portal as any)?.settings?.hideShowings) || Boolean((data.portal as any)?.settings?.disableShowings)
  const tourOvr = String(data.portal?.slug ?? '') === '1810-w-35th-st' ? { total: 13, last30: 3 } : null
  const showings = noShow ? [] : upd?.showings || []
  const hasSh = showings.length > 0

  const wm = upd?.webMetrics || {}, coStar = wm?.coStarOneHome || null
  const views = typeof wm?.totalViews === 'number' ? wm.totalViews : null
  const visitors = typeof wm?.uniqueVisitors === 'number' ? wm.uniqueVisitors : null
  const avgTime = typeof wm?.avgTimeOnPage === 'number' ? wm.avgTimeOnPage : null
  const vpv = views != null && visitors != null && visitors > 0 ? views / visitors : null
  const syndHC = wm?.syndicationMetrics?.homesDotCom || null
  const lw = wm?.listingWebsite || null
  const sa = wm?.siteAnalytics || null
  const agentSharePct = typeof wm?.compassAgentSharePct === 'number' ? wm.compassAgentSharePct : null
  const topSrc = wm?.topTrafficSource || null
  const topSrcPct = typeof wm?.topTrafficSourcePct === 'number' ? wm.topTrafficSourcePct : null

  const hero = photos[0] || null, dispName = data.portal?.displayName || ''
  const totalSh = hasSh ? showings.length : tourOvr ? tourOvr.total : null

  const comp = upd?.neighborhoodActivity?.activeCompetition || []
  const maxDom = Math.max(...[...comp.map((c: any) => c.daysOnMarket || 0), dom || 0, 1])

  const vtUrl = listing?.virtualTourUrl || null
  const listUrl = listing?.slug && data.portal?.mlsNumber ? `https://thekeenangroup.com/properties/${encodeURIComponent(String(listing.slug))}-${encodeURIComponent(String(data.portal.mlsNumber))}` : null
  const ctaUrl = vtUrl || listUrl, ctaLabel = vtUrl ? 'View Virtual Tour' : listUrl ? 'View Full Listing' : null

  const convRate = coStar && typeof coStar.distinctClientViews === 'number' && typeof coStar.clientPortals === 'number' && coStar.clientPortals > 0
    ? (coStar.distinctClientViews / coStar.clientPortals) * 100 : typeof coStar?.conversionRate === 'number' ? coStar.conversionRate : null

  // Narrative dividers (computed defensively from live data; omit when numbers missing)
  const onlineDivider = (views != null && typeof price === 'number')
    ? `${views.toLocaleString()} ${views === 1 ? 'view' : 'views'} across Compass, Homes.com and thekeenangroup.com — strong discovery for a ${fmt$(price)} listing${neighborhood ? ` in ${neighborhood}` : ''}.`
    : null
  const positionDivider = (comp.length > 0 && dom != null)
    ? `${comp.length} comparable ${comp.length === 1 ? 'home is' : 'homes are'} on the market right now — your listing has been live ${dom} ${dom === 1 ? 'day' : 'days'}.`
    : null

  // Which online-exposure sections actually render (drives chapter 02 visibility)
  const hasHomesCom = Boolean(syndHC)
  const hasListingWebsite = Boolean(lw && (typeof lw.uniqueVisitors === 'number' || typeof lw.totalRequests === 'number'))
  const hasPageViews = Boolean(sa && (typeof sa.pageViews === 'number' || typeof sa.users === 'number'))
  const hasCompactRow = hasHomesCom || hasListingWebsite || hasPageViews
  const compactCount = [hasHomesCom, hasListingWebsite, hasPageViews].filter(Boolean).length

  return (
    <div className="bg-cream">
      {/* HERO */}
      <div className="relative min-h-[280px] md:min-h-[420px] lg:min-h-[460px] overflow-hidden">
        {hero ? (
          <img src={hero} alt={street} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-mulberry to-mulberry-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-10 pt-24 md:pt-32 h-full">
          {ctaUrl && ctaLabel && (
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
              className="self-start bg-white/90 backdrop-blur-sm text-mulberry px-5 py-2 rounded-lg font-medium hover:bg-white transition-colors text-sm mb-4 inline-flex items-center gap-2">
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white drop-shadow-lg mb-2 max-w-3xl">{street}</h1>
          {(city || neighborhood) && (
            <p className="text-white/80 text-lg drop-shadow mb-3">
              {neighborhood}{neighborhood && city ? ' - ' : ''}{city}{city && state ? ', ' : ''}{state} {zip}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/90 text-lg font-medium">
            {typeof price === 'number' && <><span>{fmt$(price)}</span><span className="text-white/40">|</span></>}
            {beds != null && <><span>{beds} BD</span><span className="text-white/40">|</span></>}
            {baths != null && <><span>{baths} BA</span><span className="text-white/40">|</span></>}
            {sf != null && <span>{Number(sf).toLocaleString()} SF</span>}
            {data.portal?.mlsNumber && <><span className="text-white/40">|</span><span className="text-white/60 text-sm">MLS {data.portal.mlsNumber}</span></>}
            {priceUpdatedAt && <><span className="text-white/40">|</span><span className="text-white/60 text-sm">Updated on {priceUpdatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></>}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {(upd?.publishedAt || upd?.weekOf) && (
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-sm">
                Updated {new Date((upd.publishedAt || upd.weekOf) as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {dom != null && (
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                {dom <= 1 ? 'JUST LISTED' : `${dom} DAYS ON MARKET`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-honed-stone/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Kpi value={views == null ? '—' : views.toLocaleString()} label="Total Views" trend={wm?.viewsTrend} />
            <Kpi value={visitors == null ? '—' : visitors.toLocaleString()} label="Unique Visitors" trend={wm?.visitorsTrend} />
            <Kpi value={totalSh == null ? '—' : String(totalSh)} label={hasSh ? 'Total Showings' : tourOvr ? 'Total Tours' : 'Showings'} />
            <Kpi value={dom == null ? '—' : dom <= 1 ? 'NEW' : String(dom)} label="Days on Market" />
          </div>
        </div>
      </div>

      {/* ===== CHAPTER 01 — SHOWING ACTIVITY (cream band) ===== */}
      {(!noShow || (Array.isArray(upd?.openHouses) && upd!.openHouses.length > 0)) && (
      <div className="band band-cream">
        <div className="band-inner space-y-8">
          <div>
            <div className="chapter-eyebrow">Chapter 01</div>
            <h2 className="chapter-title">Showing Activity</h2>
            <div className="chapter-rule" />
          </div>

            {/* SHOWINGS */}
            {!noShow && (
              <Section label="Showing Activity" badge={hasSh ? showings.length : undefined}>
                {!hasSh && !tourOvr ? <p className="text-sm text-black/60">No showings scheduled this period.</p>
                : tourOvr && !hasSh ? (
                  <div className="metric-card py-8"><div className="text-4xl font-semibold text-mulberry">{tourOvr.total}</div><div className="text-sm text-black/60 mt-2">Total Tours</div></div>
                ) : (
                  <div className="space-y-0">
                    {showings.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20).map((s, i, arr) => (
                      <div key={i} className="flex gap-5">
                        <div className="w-32 flex-shrink-0 text-sm text-mulberry font-medium pt-4 text-right">{fmtDate(s.date)}</div>
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full bg-mulberry mt-[18px] flex-shrink-0 ${i === 0 ? 'pulse-dot ring-4 ring-mulberry/15' : ''}`} />
                          {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-honed-stone/50" />}
                        </div>
                        <div className="flex-1 pb-6 pt-3">
                          <div className="flex items-center gap-2">
                            {s.isTeamShowing && <span className="bg-mulberry/10 text-mulberry text-[10px] tracking-widest rounded px-2 py-0.5 uppercase font-bold border border-mulberry/20">KG</span>}
                            <span className="text-black/80 font-medium">{s.agentName || s.brokerage}</span>
                          </div>
                          {s.agentName && s.brokerage && <div className="text-sm text-black/50 mt-0.5">{s.brokerage}</div>}
                          {typeof s.duration === 'number' && <div className="text-sm text-black/50">{s.duration} min</div>}
                          {s.feedback && <div className="text-sm text-black/60 mt-2 italic border-l-2 border-honed-stone pl-3">&ldquo;{s.feedback}&rdquo;</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {Array.isArray(upd?.openHouses) && upd!.openHouses.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-honed-stone">
                    <div className="text-sm text-mulberry uppercase tracking-wider mb-3 font-semibold">Open Houses</div>
                    {upd!.openHouses.map((oh: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-gold/5 border border-gold/20 rounded-xl px-5 py-3 mb-2">
                        <span className="text-gold">&#9670;</span>
                        <span className="font-medium">{oh.date ? fmtDate(oh.date) : 'TBD'}</span>
                        <span className="text-black/50 text-sm">{oh.type || ''}</span>
                        {oh.attendees != null && <span className="text-mulberry text-sm ml-auto font-semibold">{oh.attendees} attendees</span>}
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}
        </div>
      </div>
      )}

      {/* ===== CHAPTER 02 — ONLINE EXPOSURE (white band) ===== */}
      <div className="band band-white">
        <div className="band-inner space-y-8">
          <div>
            <div className="chapter-eyebrow">Chapter 02</div>
            <h2 className="chapter-title">Online Exposure</h2>
            <div className="chapter-rule" />
          </div>

            {/* COMPASS LISTING INSIGHTS — anchor card */}
            <Section label="Compass Listing Insights">
              <p className="text-sm text-black/60 mb-6">Aggregated data from Compass.com, Zillow, Realtor.com, Trulia, and syndicated listing sites showing how buyers are discovering and engaging with your property online.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {([
                  { v: views, l: 'Total Page Views', t: wm?.viewsTrend },
                  { v: visitors, l: 'Unique Visitors', t: wm?.visitorsTrend },
                  { v: avgTime, l: 'Avg Time Spent', t: wm?.timeTrend, suf: 's' },
                  { v: vpv, l: 'Views per Visitor', f: true },
                ] as const).map(({ v, l, t, suf, f }: any) => (
                  <div key={l} className="metric-card">
                    <div className="text-lg font-semibold text-mulberry">{v == null ? '—' : f ? (v as number).toFixed(1) : `${(v as number).toLocaleString()}${suf || ''}`}</div>
                    <div className="text-xs text-black/50 mt-1">{l}</div>
                    {parseTrend(t) != null && <div className="text-xs text-black/50 mt-1">{parseTrend(t)! > 0 ? 'Up' : 'Down'} {Math.abs(parseTrend(t)!).toFixed(1)}% from prior</div>}
                  </div>
                ))}
              </div>

              {/* Platform bars */}
              {Array.isArray(wm?.byPlatform) && wm.byPlatform.length > 0 && (() => {
                const rows = wm.byPlatform.map((p: any) => ({ platform: String(p?.platform ?? ''), views: Number(p?.views ?? 0) })).filter((p: any) => p.platform && Number.isFinite(p.views)).sort((a: any, b: any) => b.views - a.views)
                const total = rows.reduce((s: number, r: any) => s + r.views, 0) || 1
                return (
                  <div className="card-inner p-5 mb-6">
                    <div className="flex items-baseline justify-between mb-4">
                      <div className="font-medium text-mulberry">Views by Publisher</div>
                      <div className="text-sm text-black/50">Total: {total.toLocaleString()}</div>
                    </div>
                    <div className="space-y-5">
                      {rows.map((p: any, i: number) => {
                        const pct = (p.views / total) * 100
                        return (
                          <div key={`${p.platform}-${i}`}>
                            <div className="flex items-center justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3 text-sm font-medium text-black/80">
                                <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: getPubColor(i) }} />
                                {p.platform}
                              </div>
                              <div className="flex items-baseline gap-3">
                                <span className="text-sm font-semibold text-mulberry">{p.views.toLocaleString()}</span>
                                <span className="text-sm text-black/50">{pct.toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="h-10 rounded-xl bg-honed-stone-light relative overflow-hidden">
                              <div className="h-full rounded-xl" style={{ width: `${Math.min(100, Math.max(1, pct))}%`, backgroundColor: getPubColor(i) }} />
                              {i === 0 && <div className="absolute inset-y-0 right-3 flex items-center text-white/90 text-sm font-semibold">{p.views.toLocaleString()}</div>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Locations with donut */}
              {Array.isArray(wm?.topLocations) && wm.topLocations.length > 0 && (() => {
                const locs = wm.topLocations.filter((l: any) => l?.city && l?.percentage > 0).sort((a: any, b: any) => b.percentage - a.percentage).slice(0, 6)
                const donut = locs.map((l: any, i: number) => ({ pct: l.percentage, color: LOC_COLORS[Math.min(i, LOC_COLORS.length - 1)] }))
                return (
                  <div className="card-inner p-5 mb-6">
                    <div className="font-medium text-mulberry mb-4">Viewer Locations</div>
                    <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr] gap-6 items-center">
                      <div className="flex justify-center lg:justify-start"><Donut values={donut} label={{ value: String(locs.length), subtitle: 'Markets' }} /></div>
                      <div className="space-y-4">
                        {locs.map((l: any, i: number) => {
                          const pct = Math.min(100, l.percentage)
                          return (
                            <div key={`${l.city}-${i}`}>
                              <div className="flex items-center justify-between gap-4 mb-1.5">
                                <div className="flex items-center gap-3">
                                  <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: LOC_COLORS[Math.min(i, LOC_COLORS.length - 1)] }} />
                                  <span className="text-sm font-medium text-black/80">{l.city}</span>
                                  {i === 0 && <span className="text-xs px-3 py-1 rounded-full bg-mulberry/10 text-mulberry border border-mulberry/20">Primary Market</span>}
                                </div>
                                <span className="text-sm font-semibold text-mulberry">{pct.toFixed(0)}%</span>
                              </div>
                              <div className="h-4 rounded-full bg-honed-stone-light overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: LOC_COLORS[Math.min(i, LOC_COLORS.length - 1)] }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-honed-stone flex items-start gap-3 text-sm text-black/50">
                      <div className="w-5 h-5 rounded-full border border-black/10 flex items-center justify-center text-xs flex-shrink-0">i</div>
                      <div>Geographic distribution based on IP address analysis of listing page visitors. Strong local interest suggests buyers are familiar with the area.</div>
                    </div>
                  </div>
                )
              })()}
              {(agentSharePct != null || topSrc) && (
                <div className="card-inner p-5 mb-6">
                  <div className="font-medium text-mulberry mb-3">Traffic Insights</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {agentSharePct != null && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-mulberry/10 flex items-center justify-center text-lg font-semibold text-mulberry">{agentSharePct}%</div>
                        <div><div className="text-sm font-medium text-black/80">Compass Agent Share</div><div className="text-xs text-black/50">Views from buyer&apos;s agents vs public</div></div>
                      </div>
                    )}
                    {topSrc && topSrcPct != null && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-lg font-semibold text-amber-700">{topSrcPct}%</div>
                        <div><div className="text-sm font-medium text-black/80">Top Source: {topSrc}</div><div className="text-xs text-black/50">Primary traffic driver</div></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Callout title="What this means" variant="blue">Higher view counts indicate strong market exposure. Average time spent over 15 seconds suggests genuine buyer interest rather than casual browsing.</Callout>
            </Section>

            {/* Compact 3-up exposure row — varied silhouette vs the anchor card above */}
            {hasCompactRow && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${compactCount >= 3 ? 'lg:grid-cols-3' : ''}`}>
                {hasHomesCom && (
                  <div className="stat-card">
                    <div className="section-label mb-4">Homes.com</div>
                    <div className="stat-card-headline">{syndHC.totalViews?.toLocaleString?.() ?? syndHC.detailPageViews?.toLocaleString?.() ?? '—'}</div>
                    <div className="text-xs text-black/50 mt-1.5">{syndHC.totalViews != null ? 'Total Views' : 'Detail Page Views'}</div>
                    <div className="text-sm text-black/60 mt-3 leading-relaxed">
                      {syndHC.detailPageViews != null && <span>{syndHC.detailPageViews.toLocaleString()} detail-page views</span>}
                      {syndHC.detailPageViews != null && syndHC.favorites != null && <span> · </span>}
                      {syndHC.favorites != null && <span>{syndHC.favorites.toLocaleString()} favorites</span>}
                    </div>
                  </div>
                )}
                {hasListingWebsite && (
                  <div className="stat-card">
                    <div className="section-label mb-4">Listing Website</div>
                    <div className="stat-card-headline">{lw.uniqueVisitors != null ? lw.uniqueVisitors.toLocaleString() : lw.totalRequests.toLocaleString()}</div>
                    <div className="text-xs text-black/50 mt-1.5">{lw.uniqueVisitors != null ? 'Unique Visitors' : 'Total Requests'}</div>
                    <div className="text-sm text-black/60 mt-3 leading-relaxed">
                      {lw.uniqueVisitors != null && lw.totalRequests != null && <span>{lw.totalRequests.toLocaleString()} total requests</span>}
                      {(lw.uniqueVisitors == null || lw.totalRequests == null) && <span>via {lw.provider || 'Cloudflare'}</span>}
                    </div>
                    {lw.periodStart && lw.periodEnd && (
                      <div className="text-xs text-black/40 mt-2">{fmtDateChi(lw.periodStart)} — {fmtDateChi(lw.periodEnd)}</div>
                    )}
                  </div>
                )}
                {hasPageViews && (
                  <div className="stat-card">
                    <div className="section-label mb-4">thekeenangroup.com</div>
                    <div className="stat-card-headline">{sa.pageViews != null ? sa.pageViews.toLocaleString() : sa.users.toLocaleString()}</div>
                    <div className="text-xs text-black/50 mt-1.5">{sa.pageViews != null ? 'Page Views (30 days)' : 'Unique Visitors (30 days)'}</div>
                    <div className="text-sm text-black/60 mt-3 leading-relaxed">
                      {sa.pageViews != null && sa.users != null && <span>{sa.users.toLocaleString()} unique visitors</span>}
                      {sa.avgEngagementSec != null && <span>{sa.pageViews != null && sa.users != null ? ' · ' : ''}{sa.avgEngagementSec}s avg engagement</span>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COSTAR — full-width below the compact row */}
            {coStar && (
              <Section label="CoStar OneHome Agent Network">
                <p className="text-sm text-black/60 mb-6">Activity from the agent-to-agent network where real estate professionals share and view listings for their buyer clients. High agent activity often precedes showing requests.</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {[{ v: coStar.agentViews, l: 'Agent Views', s: 'Agents reviewing listing' }, { v: coStar.clientViews, l: 'Client Views', s: 'Buyers via agent portals' }, { v: coStar.distinctClientViews ?? coStar.uniqueClients, l: 'Unique Buyer Clients', s: 'Individual buyers reached' }, { v: coStar.favorites, l: 'Saved to Favorites', s: 'High-intent signal' }].map(({ v, l, s }) => (
                    <div key={l} className="metric-card">
                      <div className="text-3xl font-semibold text-mulberry">{v?.toLocaleString?.() ?? '—'}</div>
                      <div className="text-sm text-black/60 mt-1">{l}</div>
                      <div className="text-xs text-black/40 mt-1">{s}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {[{ v: coStar.autoEmails, l: 'Auto-Email Alerts Sent' }, { v: coStar.clientPortals, l: 'Client Portal Shares' }, { v: coStar.last14DaysViews, l: 'Last 14 Days Activity' }, { v: convRate, l: 'Client Conversion Rate', f: true }].map(({ v, l, f }: any) => (
                    <div key={l} className="bg-white rounded-xl border border-honed-stone p-4">
                      <div className="text-lg font-semibold text-mulberry">{v == null ? '—' : f ? `${(v as number).toFixed(1)}%` : (v as number).toLocaleString?.()}</div>
                      <div className="text-sm text-black/60 mt-1">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="card-inner p-5 mb-4">
                  <div className="font-medium text-mulberry mb-2">Unlock MLS Concierge</div>
                  <div className="flex items-center gap-6 text-sm text-black/70">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" />{coStar.conciergeApproved?.toLocaleString?.() ?? '—'} Approved for Delivery</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" />{coStar.conciergeRejected?.toLocaleString?.() ?? '—'} Not Delivered</div>
                  </div>
                  <p className="text-sm text-black/50 mt-3">Agents review listings before delivering to their buyer clients. Approved means an agent selected your listing to share with their buyer.</p>
                </div>
                <Callout title="Why this matters" variant="green">Agent network activity is a leading indicator. When agents save your listing or share it with clients, showings typically follow within 1-2 weeks.</Callout>
              </Section>
            )}
        </div>
      </div>

      {/* Narrative divider after Chapter 02 */}
      {onlineDivider && (
        <div className="band band-white">
          <p className="chapter-divider">{onlineDivider}</p>
        </div>
      )}

      {/* ===== CHAPTER 03 — MARKET POSITION (mulberry feature band) ===== */}
      {comp.length > 0 && (
      <div className="band band-dark">
        <div className="band-inner space-y-8">
          <div>
            <div className="chapter-eyebrow-dark">Chapter 03</div>
            <h2 className="chapter-title-dark">Market Position</h2>
            <div className="chapter-rule-dark" />
          </div>

            {/* COMPETITION — light-on-dark */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs uppercase tracking-[0.1em] font-semibold text-white/90" style={{ borderLeft: '3px solid rgb(197,162,88)', paddingLeft: '0.875rem' }}>Active Competition</span>
                <span className="text-[0.6875rem] font-semibold px-3 py-0.5 rounded-full" style={{ background: 'rgba(197,162,88,0.2)', color: 'rgb(197,162,88)' }}>{comp.length}</span>
              </div>
              <div className="space-y-3 mb-3">
                {comp.map((c: any, i: number) => {
                  const d2 = c.daysOnMarket || 0
                  return (
                    <div key={i} className="comp-card-dark">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div><div className="font-medium text-white">{c.address || 'Unlisted'}</div><div className="text-white/50 text-sm">{typeof c.listPrice === 'number' ? fmt$(c.listPrice) : ''}</div></div>
                        <div className="font-semibold" style={{ color: 'rgb(197,162,88)' }}>{d2} DOM</div>
                      </div>
                      <div className="h-2 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}><div className="h-2 rounded-md" style={{ width: `${Math.min(100, (d2 / maxDom) * 100)}%`, background: 'rgba(255,255,255,0.35)' }} /></div>
                      {c.slug && <a href={`https://thekeenangroup.com/properties/${c.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-flex items-center gap-1" style={{ color: 'rgb(197,162,88)' }}>View on TheKeenanGroup.com <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg></a>}
                    </div>
                  )
                })}
              </div>
              {/* YOUR LISTING — gold-bordered highlight */}
              <div className="comp-card-you">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3"><span className="text-white font-medium">{street}</span><span className="your-listing-chip">Your Listing</span></div>
                  <div className="font-semibold" style={{ color: 'rgb(197,162,88)' }}>{dom ?? '—'} DOM</div>
                </div>
                <div className="h-2 rounded-md overflow-hidden" style={{ background: 'rgba(197,162,88,0.2)' }}><div className="h-2 rounded-md" style={{ width: `${dom ? Math.min(100, (dom / maxDom) * 100) : 0}%`, background: 'rgb(197,162,88)' }} /></div>
              </div>
            </div>
        </div>
      </div>
      )}

      {/* Narrative divider after Chapter 03 */}
      {positionDivider && comp.length > 0 && (
        <div className="band band-cream">
          <p className="chapter-divider">{positionDivider}</p>
        </div>
      )}

      {/* ===== CHAPTER 04 — RATE OUTLOOK (cream band) ===== */}
      {(upd?.mortgageUpdate || Array.isArray(upd?.agentCommentary) && upd!.agentCommentary.length > 0 || upd?.priceRecommendation?.hasRecommendation || (upd?.sellerFeedback?.length || showings.some(s => s.feedback)) || (Array.isArray(upd?.propertyMaintenance) && upd!.propertyMaintenance.length > 0) || upd?.marketConditions) && (
      <div className="band band-cream">
        <div className="band-inner space-y-8">
          {upd?.mortgageUpdate && (
          <div>
            <div className="chapter-eyebrow">Chapter 04</div>
            <h2 className="chapter-title">Rate Outlook</h2>
            <div className="chapter-rule" />
          </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

            {/* MORTGAGE */}
            {upd?.mortgageUpdate && (
              <Section label="Mortgage Rate Update">
                <div className="space-y-5">
                  {upd.mortgageUpdate.effectiveDate && <div className="text-xs text-black/50">Updated {fmtDateChi(upd.mortgageUpdate.effectiveDate)}</div>}
                  <h3 className="text-xl font-semibold text-mulberry">{upd.mortgageUpdate.headline || 'Mortgage Update'}</h3>
                  {Array.isArray(upd.mortgageUpdate.keyStats) && upd.mortgageUpdate.keyStats.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {upd.mortgageUpdate.keyStats.slice(0, 4).map((s, i) => (
                        <div key={i} className="metric-card">
                          <div className="text-2xl font-semibold text-mulberry">{s.value || '—'}</div>
                          <div className="text-sm text-black/70 mt-1">{s.label || ''}</div>
                          {s.trend && <div className="text-xs text-black/50 mt-1">{s.trend}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {upd.mortgageUpdate.chartEmbedUrl && (
                    <div>
                      <div className="font-medium text-mulberry mb-3">Current Interest Rates</div>
                      <div className="rounded-xl border border-honed-stone overflow-hidden bg-white">
                        <iframe
                          title="Current Interest Rates"
                          src={upd.mortgageUpdate.chartEmbedUrl}
                          style={{ width: "100%", height: 260, border: 0 }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {upd.mortgageUpdate.moreRatesUrl && (
                    <a href={upd.mortgageUpdate.moreRatesUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-mulberry text-sm font-medium hover:text-mulberry-light underline underline-offset-2">
                      View More Interest Rates
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Callout title={upd.mortgageUpdate.calloutTitle || 'What This Means for Buyers'} variant="green">
                      {upd.mortgageUpdate.calloutBody || 'Current rates directly impact buyer purchasing power. Every 0.5% rate change can shift affordability by ~5% on monthly payments.'}
                    </Callout>
                    <Callout title="Why This Matters for Your Sale" variant="gold">
                      Rates are updated daily from lender rate sheets. Lower rates typically increase buyer activity and showing volume, which can directly improve demand for your home.
                    </Callout>
                  </div>
                  <RichText value={upd.mortgageUpdate.content ?? null} />
                </div>
              </Section>
            )}


            {/* AGENT COMMENTARY */}
            {Array.isArray(upd?.agentCommentary) && upd!.agentCommentary.length > 0 && (
              <div className="card border-l-4 border-l-gold">
                <h2 className="section-label mb-4" style={{ borderLeft: 'none', paddingLeft: 0 }}>Keenan Group Analysis</h2>
                <RichText value={upd!.agentCommentary} />
              </div>
            )}

            {/* PRICE REC */}
            {upd?.priceRecommendation?.hasRecommendation && (
              <div className="card border-l-4 border-l-amber-400">
                <h2 className="text-mulberry uppercase tracking-wider text-sm font-semibold mb-4">Price Recommendation</h2>
                {upd.priceRecommendation.recommendedReduction != null && <div className="text-3xl font-semibold text-mulberry mb-2">{fmt$(upd.priceRecommendation.recommendedReduction)}</div>}
                {upd.priceRecommendation.alternativeReduction != null && <div className="text-xl text-black/60 mb-3">Alternative: {fmt$(upd.priceRecommendation.alternativeReduction)}</div>}
                {upd.priceRecommendation.rationale && <p className="text-sm text-black/80 leading-relaxed">{upd.priceRecommendation.rationale}</p>}
              </div>
            )}

            {/* FEEDBACK */}
            {(upd?.sellerFeedback?.length || showings.some(s => s.feedback)) ? (
              <Section label="Seller Feedback" right={<button type="button" className="text-xs text-mulberry underline underline-offset-2" onClick={() => setFeedbackOpen(v => !v)}>{feedbackOpen ? 'Hide' : 'Show'}</button>}>
                {!feedbackOpen ? <p className="text-sm text-black/60">Hidden by default - click &ldquo;Show&rdquo; to view feedback.</p> : (
                  <div className="space-y-3">
                    {(upd?.sellerFeedback || []).map((f, i) => (
                      <div key={`sf-${i}`} className="card-inner"><div className="text-sm text-black/80 leading-relaxed">{f.message}</div>
                        {((f.showSourceName && f.sourceName) || f.date) && <div className="text-xs text-black/50 mt-2">{f.showSourceName && f.sourceName ? f.sourceName : null}{f.showSourceName && f.sourceName && f.date ? ' - ' : null}{f.date ? fmtDateLong(f.date) : null}</div>}
                      </div>
                    ))}
                    {showings.filter(s => s.feedback).slice(0, 12).map((s, i) => (
                      <div key={`shf-${i}`} className="card-inner"><div className="text-sm text-black/80 leading-relaxed italic">&ldquo;{s.feedback}&rdquo;</div><div className="text-xs text-black/50 mt-2">{fmtDateLong(s.date)} - {s.brokerage}{s.agentName ? ` - ${s.agentName}` : ''}</div></div>
                    ))}
                  </div>
                )}
              </Section>
            ) : null}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            {/* Recommended Next Steps removed (Joe 2026-06-10): created
                follow-up work for the team on every report. */}

            {Array.isArray(upd?.propertyMaintenance) && upd!.propertyMaintenance.length > 0 && (
              <Section label="Property Care">
                <div className="space-y-3">
                  {upd!.propertyMaintenance.map((item: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      {item.completed ? <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0 mt-0.5" />}
                      <div><div className="text-sm text-black/80">{item.description || ''}</div>{item.date && <div className="text-xs text-black/50 mt-0.5">{fmtDate(item.date)}</div>}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {upd?.marketConditions && (
              <Section label="Market Conditions">
                <h3 className="text-lg font-semibold text-mulberry mb-3">{upd.marketConditions.headline || 'Market Update'}</h3>
                {Array.isArray(upd.marketConditions.keyStats) && upd.marketConditions.keyStats.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {upd.marketConditions.keyStats.slice(0, 4).map((s, i) => (
                      <div key={i} className="metric-card"><div className="text-lg font-semibold text-mulberry">{s.value || '—'}</div><div className="text-xs text-black/50 mt-1">{s.label || ''}</div></div>
                    ))}
                  </div>
                )}
                <RichText value={upd.marketConditions.content ?? null} />
              </Section>
            )}

            <div className="card bg-honed-stone-light">
              <div className="text-lg font-medium text-mulberry mb-1">Joe and Cara Keenan</div>
              <div className="text-sm text-black/60 mb-4">Keenan Group at Compass</div>
              <div className="space-y-2 mb-4">
                <a href="sms:+15124157653" className="flex items-center gap-2 text-mulberry hover:text-mulberry-light text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  (512) 415-7653
                </a>
                <a href="mailto:keenan@compass.com" className="flex items-center gap-2 text-mulberry hover:text-mulberry-light text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  keenan@compass.com
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="credential-badge">#1 Team 2024 ABoR</span>
                <span className="credential-badge">$1B+ Career Sales</span>
              </div>
            </div>
          </div>
          </div>

          {/* Weekly Updates history removed (Joe 2026-06-10): sellers see the
              latest realtime update only — no prior-update list. */}
        </div>
      </div>
      )}

      {dispName && (
        <div className="band band-cream">
          <div className="text-center px-6 pb-10"><p className="text-xs text-black/40">This portal is exclusively for {dispName}. Please do not share this link.</p></div>
        </div>
      )}
    </div>
  )
}
