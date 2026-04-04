"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"

interface HeadphoneData {
  id: string
  name: string
  freq_response: number[][]
}

interface FrequencyGraphProps {
  headphones: HeadphoneData[]
  showHarmanTarget?: boolean
}

const colors = ["var(--graph-1)", "var(--graph-2)", "var(--graph-3)"]

// Harman target curve (simplified approximation)
const harmanTarget = [
  [20, 70],
  [30, 71],
  [50, 72],
  [100, 73],
  [200, 74],
  [500, 74],
  [1000, 74],
  [2000, 73],
  [3000, 72],
  [4000, 70],
  [5000, 68],
  [8000, 65],
  [10000, 63],
  [15000, 58],
  [20000, 52],
]

export function FrequencyGraph({ headphones, showHarmanTarget = true }: FrequencyGraphProps) {
  // Combine all frequency data into a single dataset
  const allFrequencies = new Set<number>()
  headphones.forEach((h) => {
    h.freq_response.forEach(([freq]) => allFrequencies.add(freq))
  })
  if (showHarmanTarget) {
    harmanTarget.forEach(([freq]) => allFrequencies.add(freq))
  }

  const sortedFrequencies = Array.from(allFrequencies).sort((a, b) => a - b)

  const data = sortedFrequencies.map((freq) => {
    const point: Record<string, number | string> = { frequency: freq }

    headphones.forEach((h) => {
      const match = h.freq_response.find(([f]) => f === freq)
      if (match) {
        point[h.id] = match[1]
      }
    })

    if (showHarmanTarget) {
      const harmanMatch = harmanTarget.find(([f]) => f === freq)
      if (harmanMatch) {
        point["harman"] = harmanMatch[1]
      }
    }

    return point
  })

  const formatFrequency = (freq: number) => {
    if (freq >= 1000) {
      return `${freq / 1000}kHz`
    }
    return `${freq}Hz`
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="frequency"
            scale="log"
            domain={[20, 20000]}
            type="number"
            tickFormatter={formatFrequency}
            tick={{ fill: "var(--graph-text)", fontSize: 11, fontWeight: 500 }}
            ticks={[20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <YAxis
            domain={[40, 90]}
            tick={{ fill: "var(--graph-text)", fontSize: 11, fontWeight: 500 }}
            tickFormatter={(v) => `${v}dB`}
            axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
          />
          <ReferenceLine x={250} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
          <ReferenceLine x={4000} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />

          {/* Harman target line */}
          {showHarmanTarget && (
            <Line
              type="monotone"
              dataKey="harman"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
          )}

          {/* Headphone lines */}
          {headphones.map((h, i) => (
            <Line
              key={h.id}
              type="monotone"
              dataKey={h.id}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background/90 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-xl text-xs flex flex-col gap-1">
                    <p className="font-bold border-b pb-1 mb-1">{formatFrequency(label as number)}</p>
                    {payload.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-muted-foreground">
                            {entry.name === "harman" ? "Harman Target" : headphones.find((h) => h.id === entry.name)?.name || entry.name}:
                          </span>
                        </div>
                        <span className="font-bold">{entry.value}dB</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
            wrapperStyle={{ zIndex: 100 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Frequency region labels */}
      <div className="mt-2 flex justify-between px-8 text-xs font-medium" style={{ color: "var(--graph-text)" }}>
        <span>Bass (20Hz-250Hz)</span>
        <span>Mids (250Hz-4kHz)</span>
        <span>Treble (4kHz-20kHz)</span>
      </div>
    </div>
  )
}

