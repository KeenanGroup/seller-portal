'use client'

interface LocationData {
  city: string
  percentage: number
}

interface ViewsByCityMapProps {
  data: LocationData[]
}

export function ViewsByCityMap({ data }: ViewsByCityMapProps) {
  if (!data || data.length === 0) return null

  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage)
  const total = sortedData.reduce((sum, d) => sum + d.percentage, 0)

  const colors = [
    { bg: 'bg-mulberry', text: 'text-mulberry', fill: '#4C2230' },
    { bg: 'bg-mulberry/70', text: 'text-mulberry/70', fill: '#6B3A4A' },
    { bg: 'bg-gold', text: 'text-gold', fill: '#B8860B' },
    { bg: 'bg-gold/70', text: 'text-gold/70', fill: '#D4A84B' },
    { bg: 'bg-honed-stone', text: 'text-honed-stone', fill: '#9CA3AF' },
  ]

  let cumulativePercentage = 0
  const donutSegments = sortedData.map((location, index) => {
    const startAngle = (cumulativePercentage / 100) * 360
    const sweepAngle = (location.percentage / 100) * 360
    cumulativePercentage += location.percentage

    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (startAngle + sweepAngle - 90) * (Math.PI / 180)

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    const largeArc = sweepAngle > 180 ? 1 : 0

    return {
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[Math.min(index, colors.length - 1)].fill,
      city: location.city,
      percentage: location.percentage,
    }
  })

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-mulberry">Viewer Locations</h4>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {donutSegments.map((segment, index) => (
                <path
                  key={index}
                  d={segment.path}
                  fill={segment.color}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
              <circle cx="50" cy="50" r="24" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-mulberry">{sortedData.length}</div>
                <div className="text-xs text-black/60">Markets</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          {sortedData.map((location, index) => {
            const color = colors[Math.min(index, colors.length - 1)]
            const isTopLocation = index === 0

            return (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color.fill }}
                    />
                    <span className={`text-sm ${isTopLocation ? 'font-semibold text-mulberry' : 'text-black/80'}`}>
                      {location.city}
                    </span>
                    {isTopLocation && (
                      <span className="text-xs bg-mulberry/10 text-mulberry px-2 py-0.5 rounded-full">
                        Primary Market
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${isTopLocation ? 'text-mulberry' : 'text-black/70'}`}>
                    {location.percentage}%
                  </span>
                </div>
                <div className="h-2.5 bg-honed-stone-light/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${location.percentage}%`,
                      backgroundColor: color.fill,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-honed-stone/20">
        <div className="flex items-start gap-2 text-xs text-black/50">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Geographic distribution based on IP address analysis of listing page visitors.
            {sortedData[0] && sortedData[0].percentage > 50 && (
              <> Strong local interest suggests buyers are familiar with the area.</>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
