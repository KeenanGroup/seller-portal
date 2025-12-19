'use client'

interface PlatformData {
  platform: string
  views: number
}

interface ViewsByPublisherChartProps {
  data: PlatformData[]
  totalViews?: number
}

const PLATFORM_COLORS: Record<string, string> = {
  'Compass': '#5B4B6F',
  'Realtor.com': '#E57373',
  'Zillow': '#1D4ED8',
  'Trulia': '#16A34A',
  'Redfin': '#DC2626',
  'Others': '#9CA3AF',
}

export function ViewsByPublisherChart({ data, totalViews }: ViewsByPublisherChartProps) {
  if (!data || data.length === 0) return null

  const maxViews = Math.max(...data.map(d => d.views))
  const computedTotal = totalViews || data.reduce((sum, d) => sum + d.views, 0)

  const sortedData = [...data].sort((a, b) => b.views - a.views)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-mulberry">Views by Publisher</h4>
        <span className="text-sm text-black/50">Total: {computedTotal.toLocaleString()}</span>
      </div>

      <div className="space-y-3">
        {sortedData.map((item, index) => {
          const percentage = maxViews > 0 ? (item.views / maxViews) * 100 : 0
          const sharePercent = computedTotal > 0 ? Math.round((item.views / computedTotal) * 100) : 0
          const color = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS['Others']

          return (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-black/80">{item.platform}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-mulberry">{item.views.toLocaleString()}</span>
                  <span className="text-xs text-black/40 w-10 text-right">{sharePercent}%</span>
                </div>
              </div>
              <div className="h-6 bg-honed-stone-light rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max(percentage, 5)}%`,
                    backgroundColor: color
                  }}
                >
                  {percentage > 15 && (
                    <span className="text-xs font-medium text-white/90">{item.views}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-honed-stone/30 flex flex-wrap gap-3">
        {sortedData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: PLATFORM_COLORS[item.platform] || PLATFORM_COLORS['Others'] }}
            />
            <span className="text-black/60">{item.platform}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
