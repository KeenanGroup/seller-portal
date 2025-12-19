'use client'

interface LocationData {
  city: string
  percentage: number
}

interface ViewsByCityMapProps {
  data: LocationData[]
}

const TEXAS_CITIES: Record<string, { x: number; y: number }> = {
  'Austin': { x: 45, y: 62 },
  'Round Rock': { x: 46, y: 58 },
  'Cedar Park': { x: 44, y: 56 },
  'Pflugerville': { x: 48, y: 58 },
  'Georgetown': { x: 46, y: 52 },
  'Lakeway': { x: 42, y: 63 },
  'Bee Cave': { x: 41, y: 64 },
  'Dripping Springs': { x: 38, y: 66 },
  'San Antonio': { x: 40, y: 78 },
  'Houston': { x: 70, y: 68 },
  'Dallas': { x: 55, y: 28 },
  'Fort Worth': { x: 50, y: 28 },
  'San Marcos': { x: 43, y: 70 },
  'New Braunfels': { x: 42, y: 72 },
  'Kyle': { x: 44, y: 68 },
  'Buda': { x: 44, y: 66 },
  'Leander': { x: 43, y: 54 },
  'Westlake': { x: 43, y: 62 },
  'Rollingwood': { x: 44, y: 63 },
  'West Lake Hills': { x: 43, y: 63 },
}

const COLORS = ['#5B4B6F', '#7C6A8E', '#9D8AAF', '#BEA9D0', '#DFC9F1']

export function ViewsByCityMap({ data }: ViewsByCityMapProps) {
  if (!data || data.length === 0) return null

  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage)
  const maxPercentage = Math.max(...data.map(d => d.percentage))

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-mulberry">Viewer Locations</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 min-h-[220px]">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path
              d="M10,15 L35,10 L55,5 L75,8 L90,20 L95,35 L92,50 L88,65 L80,80 L65,90 L45,95 L25,92 L15,80 L8,60 L5,40 L10,15"
              fill="#E8F4E8"
              stroke="#9CA3AF"
              strokeWidth="0.5"
              className="drop-shadow-sm"
            />

            {sortedData.map((location, index) => {
              const coords = TEXAS_CITIES[location.city]
              if (!coords) return null

              const size = Math.max(4, (location.percentage / maxPercentage) * 12)
              const color = COLORS[Math.min(index, COLORS.length - 1)]

              return (
                <g key={index}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={size}
                    fill={color}
                    fillOpacity="0.7"
                    stroke={color}
                    strokeWidth="1"
                    className="drop-shadow"
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={size + 2}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                  />
                  {location.percentage > 15 && (
                    <text
                      x={coords.x}
                      y={coords.y - size - 3}
                      textAnchor="middle"
                      className="text-[4px] font-medium fill-black/70"
                    >
                      {location.percentage}%
                    </text>
                  )}
                </g>
              )
            })}

            <circle cx="45" cy="62" r="1.5" fill="#DC2626" />
            <text x="45" y="67" textAnchor="middle" className="text-[3px] fill-red-600 font-medium">
              AUSTIN
            </text>
          </svg>
        </div>

        <div className="space-y-2">
          {sortedData.map((location, index) => {
            const color = COLORS[Math.min(index, COLORS.length - 1)]
            const widthPercent = (location.percentage / maxPercentage) * 100

            return (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-black/80">{location.city}</span>
                    <span className="text-sm font-semibold text-mulberry">{location.percentage}%</span>
                  </div>
                  <div className="h-2 bg-honed-stone-light rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${widthPercent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
