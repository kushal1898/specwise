import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Share2, Save, Check, X, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadgePill } from "@/components/score-badge"
import { useSpecWise } from "@/lib/specwise-context"
import { AiComparisonAdvisor } from "@/components/ai-comparison-advisor"
import { ProductImage } from "@/components/product-image"
import { CompareSearchDialog } from "@/components/compare-search-dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import laptopsData from "@/data/laptops.json"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"

export default function LaptopCompare() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const idsParam = searchParams.get("ids")
  const [mounted, setMounted] = useState(false)
  
  const { 
    compareLaptops, 
    addToCompareLaptops,
    removeFromCompareLaptops, 
    clearCompareLaptops,
    saveComparison,
    formatPrice
  } = useSpecWise()

  useEffect(() => {
    if (idsParam && compareLaptops.length === 0) {
      const ids = idsParam.split(",")
      ids.forEach(id => {
        if (!compareLaptops.includes(id)) {
          addToCompareLaptops(id)
        }
      })
    }
    setMounted(true)
  }, [idsParam])

  if (!mounted) return null

  const laptops = compareLaptops
    .map((id) => laptopsData.find((l) => l.id === id))
    .filter(Boolean)

  const handleShare = () => {
    const url = `${window.location.origin}/laptops/compare?ids=${compareLaptops.join(",")}`
    navigator.clipboard.writeText(url)
    toast.success("Comparison link copied to clipboard!")
  }

  const handleSaveComparison = () => {
    if (laptops.length < 2) {
      toast.error("Add at least 2 laptops to save.")
      return
    }
    const name = laptops.map((l) => l!.name.split(" ").slice(0, 2).join(" ")).join(" vs ")
    saveComparison(compareLaptops, name, "laptops")
    toast.success("Comparison saved!")
  }

  const MAX_SLOTS = 3
  const slots = Array.from({ length: MAX_SLOTS }).map((_, i) => laptops[i] || null)

  const scoreCategories = ["performance", "display", "battery", "build", "value"]
  
  const benchmarkData = scoreCategories.map((cat) => {
    const row: any = { name: cat.charAt(0).toUpperCase() + cat.slice(1) }
    laptops.forEach((l, i) => {
      // @ts-ignore
      row[`laptop${i + 1}`] = l.scores[cat] * 10
    })
    return row
  })

  const colors = ["var(--graph-1)", "var(--graph-2)", "var(--graph-3)"]

  const getBestValue = (values: number[], higher = true) => {
    if (higher) return Math.max(...values)
    return Math.min(...values)
  }

  const specs = [
    { label: "Overall Score", key: "overallScore", higher: true, isNested: false },
    { label: "Price", key: "price", higher: false, isNested: false },
    { label: "Processor", key: "processor", isNested: true, isString: true },
    { label: "GPU", key: "gpu", isNested: true, isString: true },
    { label: "RAM", key: "ram", isNested: true, isString: true },
    { label: "Storage", key: "storage", isNested: true, isString: true },
    { label: "Display", key: "display", isNested: true, isString: true },
    { label: "Battery", key: "battery", isNested: true, isString: true },
    { label: "Weight", key: "weight", isNested: true, isString: true },
  ]

  return (
    <div className="pb-16 bg-muted/10 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Laptops Compare Tool</h1>
            <p className="mt-1 text-muted-foreground">
              Evaluate laptops side-by-side to find the best fit.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-background" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share URL
            </Button>
            <Button variant="outline" className="gap-2 bg-background" onClick={handleSaveComparison}>
              <Save className="h-4 w-4" />
              Save Layout
            </Button>
            <Button variant="ghost" onClick={clearCompareLaptops}>
              Clear All
            </Button>
          </div>
        </div>

        {compareLaptops.length > 0 && <AiComparisonAdvisor items={laptops} category="laptops" />}

        <div className="mt-8 grid gap-4 lg:gap-6" style={{ gridTemplateColumns: `minmax(150px, 1fr) repeat(${MAX_SLOTS}, 2fr)` }}>
          <div className="hidden md:flex items-end pb-4 font-medium text-sm text-muted-foreground">Product Models</div>
          
          {slots.map((laptop, idx) => (
            <div key={idx} className="h-full">
              {laptop ? (
                <Card className="relative p-4 h-full flex flex-col justify-between group bg-background shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => removeFromCompareLaptops(laptop.id)}
                    className="absolute right-2 top-2 rounded-full p-1.5 bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 rounded-xl overflow-hidden bg-muted">
                      <ProductImage src={laptop.image} alt={laptop.name} category="laptop" seed={laptop.id} className="absolute inset-0 h-full w-full" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{laptop.brand}</p>
                    <Link to={`/laptops/${laptop.id}`}>
                      <h3 className="font-display font-semibold hover:text-primary transition-colors text-sm sm:text-base leading-tight mb-3">
                        {laptop.name}
                      </h3>
                    </Link>
                    <ScoreBadgePill score={Math.round(laptop.overallScore * 10)} />
                    <p className="mt-3 font-display text-lg font-bold text-primary">
                      {formatPrice(laptop.price_inr, laptop.price_usd)}
                    </p>
                  </div>
                </Card>
              ) : (
                <CompareSearchDialog category="laptops" unavailableIds={compareLaptops} onSelect={addToCompareLaptops}>
                  <Card className="h-full min-h-[250px] p-4 flex flex-col items-center justify-center border-dashed border-2 bg-transparent hover:bg-muted/30 cursor-pointer transition-colors group">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-muted-foreground">Add Laptop</p>
                  </Card>
                </CompareSearchDialog>
              )}
            </div>
          ))}
        </div>

        {compareLaptops.length > 0 ? (
          <>
            <Card className="mt-8 p-6 bg-background">
              <h3 className="font-display font-semibold mb-6">Visual Performance Comparison</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} layout="vertical" margin={{ left: 0 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fill: "var(--graph-text)", fontSize: 11 }} />
                    {laptops.map((laptop, i) => (
                      <Bar
                        key={laptop!.id}
                        dataKey={`laptop${i + 1}`}
                        name={laptop!.name.split(" ").slice(0, 2).join(" ")}
                        fill={colors[i]}
                        stroke="hsl(var(--border))"
                        strokeWidth={1}
                        radius={[0, 4, 4, 0]}
                        barSize={16}
                      >
                        <LabelList 
                          dataKey={`laptop${i + 1}`} 
                          position="right" 
                          fill="var(--graph-text)" 
                          fontSize={9} 
                          fontWeight="bold"
                          offset={8}
                        />
                      </Bar>
                    ))}
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background/90 backdrop-blur-sm border border-border px-3 py-2 rounded-lg shadow-xl text-xs flex flex-col gap-1">
                              <p className="font-bold border-b pb-1 mb-1">{payload[0].payload.name}</p>
                              {payload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-muted-foreground">{entry.name}:</span>
                                  </div>
                                  <span className="font-bold">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="mt-8 overflow-hidden bg-background">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="w-1/4 p-4 font-medium text-muted-foreground text-sm uppercase tracking-wider sticky left-0 bg-muted/80 backdrop-blur z-10">
                        Specification
                      </th>
                      {slots.map((laptop, i) => (
                        <th key={i} className="p-4 font-semibold text-sm w-1/4 text-center border-l border-border/50">
                          {laptop ? laptop.name.split(" ").slice(0, 2).join(" ") : "-"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {specs.map((spec) => {
                      const values = laptops.map((l) => 
                        spec.isNested ? (l!.specs as Record<string, any>)[spec.key] : (l as Record<string, any>)[spec.key]
                      )
                      const numericValues = values.filter((v): v is number => typeof v === "number")
                      const bestValue = numericValues.length > 1 && !spec.isString
                        ? getBestValue(numericValues, spec.higher)
                        : null

                      return (
                        <tr key={spec.label} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 text-sm font-medium text-foreground sticky left-0 bg-background md:bg-transparent shadow-[1px_0_0_hsl(var(--border)_/_0.5)] md:shadow-none">
                            {spec.label}
                          </td>
                          {slots.map((laptop, i) => {
                            if (!laptop) return <td key={i} className="p-4 border-l border-border/50 text-center">-</td>
                            
                            const value = values[i]
                            const isBest = bestValue !== null && value === bestValue
                            const displayValue = spec.key === "price"
                              ? formatPrice(laptop.price_inr, laptop.price_usd)
                              : String(value)

                            return (
                              <td
                                key={laptop.id}
                                className={cn(
                                  "p-4 text-sm text-center border-l border-border/50 transition-colors",
                                  isBest && "bg-green-500/10 text-green-700 dark:text-green-400 font-semibold"
                                )}
                              >
                                <div className="flex items-center justify-center gap-1.5">
                                  {displayValue}
                                  {isBest && <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-xl mt-8">
            <h2 className="text-xl font-display font-semibold mb-2">No Laptops to Compare</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Start by clicking the placeholders above or browse the catalog to add laptops to your comparison board.
            </p>
            <Link to="/laptops">
              <Button>Browse Laptops</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

