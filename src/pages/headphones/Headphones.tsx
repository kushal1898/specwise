import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Headphones as HeadphonesIcon, Heart, LineChart, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScoreBadgePill } from "@/components/score-badge"
import { FrequencyGraph } from "@/components/frequency-graph"
import { CompareBar } from "@/components/compare-bar"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import headphonesData from "@/data/headphones.json"

const typeFilters = [
  { label: "All", value: "all" },
  { label: "IEM", value: "IEM" },
  { label: "Over-Ear", value: "Over-Ear" },
  { label: "TWS", value: "TWS" },
]

const driverFilters = [
  { label: "All", value: "all" },
  { label: "Dynamic", value: "Dynamic" },
  { label: "Planar", value: "Planar" },
  { label: "Hybrid", value: "Hybrid" },
]

const signatureFilters = [
  { label: "All", value: "all" },
  { label: "Neutral", value: "Neutral" },
  { label: "Neutral-Warm", value: "Neutral-Warm" },
  { label: "Warm", value: "Warm" },
  { label: "V-Shaped", value: "V-Shaped" },
  { label: "Bright", value: "Bright" },
]

const sortOptions = [
  { label: "Best Score", value: "score-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]

export default function Headphones() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [driverFilter, setDriverFilter] = useState("all")
  const [signatureFilter, setSignatureFilter] = useState("all")
  const [sortBy, setSortBy] = useState("score-desc")
  const [selectedForGraph, setSelectedForGraph] = useState<string[]>([])
  const [showGraph, setShowGraph] = useState(false)

  const {
    formatPrice,
    savedHeadphones,
    toggleSaveHeadphone,
    compareHeadphones,
    addToCompareHeadphones,
    removeFromCompareHeadphones,
  } = useSpecWise()

  const filteredHeadphones = useMemo(() => {
    let result = [...headphonesData]

    // Search
    if (searchQuery) {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((h) => h.type === typeFilter)
    }

    // Driver filter
    if (driverFilter !== "all") {
      result = result.filter((h) => h.driver === driverFilter)
    }

    // Signature filter
    if (signatureFilter !== "all") {
      result = result.filter((h) => h.signature === signatureFilter)
    }

    // Sorting
    if (sortBy === "score-desc") {
      result.sort((a, b) => b.score - a.score)
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price_usd - b.price_usd)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price_usd - a.price_usd)
    }

    return result
  }, [searchQuery, typeFilter, driverFilter, signatureFilter, sortBy])

  const toggleGraphSelection = (id: string) => {
    setSelectedForGraph((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id].slice(-4)
    )
  }

  const selectedHeadphonesData = selectedForGraph
    .map((id) => headphonesData.find((h) => h.id === id))
    .filter(Boolean)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Headphones</h1>
          <p className="mt-2 text-muted-foreground">
            IEMs, over-ears, and TWS with frequency response graphs
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search headphones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Type:</span>
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  typeFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Driver:</span>
            {driverFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setDriverFilter(filter.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  driverFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Signature:</span>
            {signatureFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSignatureFilter(filter.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  signatureFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredHeadphones.length} {filteredHeadphones.length === 1 ? "headphone" : "headphones"}
          </p>
          <div className="flex items-center gap-2">
            {selectedForGraph.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedForGraph.length} selected for graph
              </span>
            )}
            <Button
              variant={showGraph ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setShowGraph(!showGraph)}
              disabled={selectedForGraph.length === 0}
            >
              <LineChart className="h-4 w-4" />
              {showGraph ? "Hide Graph" : "Show Graph"}
            </Button>
          </div>
        </div>

        {showGraph && selectedHeadphonesData.length > 0 && (
          <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold">Frequency Response Comparison</h3>
              <button
                onClick={() => setSelectedForGraph([])}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
            <FrequencyGraph headphones={selectedHeadphonesData as typeof headphonesData} />
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedHeadphonesData.map((h, i) => {
                const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]
                return (
                  <div
                    key={h!.id}
                    className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    />
                    <span className="text-sm">{h!.name}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-12 px-4 py-3 text-left text-xs font-medium text-muted-foreground">Graph</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Signature</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Score</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHeadphones.map((headphone) => (
                  <tr
                    key={headphone.id}
                    className={cn(
                      "group transition-colors hover:bg-muted/50",
                      selectedForGraph.includes(headphone.id) && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleGraphSelection(headphone.id)}
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded border transition-colors",
                          selectedForGraph.includes(headphone.id)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {selectedForGraph.includes(headphone.id) && (
                          <LineChart className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/headphones/${headphone.id}`} className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
                          <ProductImage src={headphone.image} alt={headphone.name} category="headphone" seed={headphone.id} className="absolute inset-0 h-full w-full" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{headphone.brand}</p>
                          <p className="font-medium group-hover:text-primary">{headphone.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                        {headphone.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{headphone.driver}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{headphone.signature}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(headphone.price_inr, headphone.price_usd)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ScoreBadgePill score={headphone.score} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSaveHeadphone(headphone.id)}
                        className={cn(
                          "rounded-full p-1.5 transition-colors",
                          savedHeadphones.includes(headphone.id)
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Heart
                          className={cn("h-4 w-4", savedHeadphones.includes(headphone.id) && "fill-current")}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredHeadphones.length === 0 && (
          <div className="py-16 text-center">
            <HeadphonesIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No headphones found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <CompareBar type="headphones" />
    </div>
  )
}

