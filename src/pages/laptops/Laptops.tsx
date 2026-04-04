import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Laptop, Cpu, HardDrive, Monitor, Battery, Heart, Plus, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadgePill } from "@/components/score-badge"
import { CompareBar } from "@/components/compare-bar"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import laptopsData from "@/data/laptops.json"

const budgetFilters = [
  { label: "All", value: "all" },
  { label: "Under $500", value: "under-500" },
  { label: "$500 - $1000", value: "500-1000" },
  { label: "$1000 - $1500", value: "1000-1500" },
  { label: "$1500+", value: "over-1500" },
]

const categoryFilters = [
  { label: "All", value: "all" },
  { label: "Ultrabook", value: "Ultrabook" },
  { label: "Gaming", value: "Gaming" },
  { label: "Creator", value: "Creator" },
  { label: "Business", value: "Business" },
  { label: "Budget", value: "Budget" },
  { label: "2-in-1", value: "2-in-1" },
  { label: "Workstation", value: "Workstation" },
  { label: "Chromebook", value: "Chromebook" },
]

const brandFilters = ["All", "Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Razer", "Microsoft", "Framework", "LG", "Samsung", "Gigabyte", "Alienware"]

const sortOptions = [
  { label: "Best Score", value: "score-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Value", value: "value" },
]

export default function Laptops() {
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("All")
  const [sortBy, setSortBy] = useState("score-desc")

  const {
    savedLaptops,
    toggleSaveLaptop,
    compareLaptops,
    addToCompareLaptops,
    removeFromCompareLaptops,
    formatPrice,
  } = useSpecWise()

  const filteredLaptops = useMemo(() => {
    let result = [...laptopsData]

    // Budget filter
    if (budgetFilter !== "all") {
      result = result.filter((laptop) => {
        const price = laptop.price
        if (budgetFilter === "under-500") return price < 500
        if (budgetFilter === "500-1000") return price >= 500 && price < 1000
        if (budgetFilter === "1000-1500") return price >= 1000 && price < 1500
        if (budgetFilter === "over-1500") return price >= 1500
        return true
      })
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((laptop) => laptop.category === categoryFilter)
    }

    // Brand filter
    if (brandFilter !== "All") {
      result = result.filter((laptop) => laptop.brand === brandFilter)
    }

    // Sorting
    const score = (l: typeof laptopsData[0]) => Math.round(l.overallScore * 10)
    if (sortBy === "score-desc") {
      result.sort((a, b) => score(b) - score(a))
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "value") {
      result.sort((a, b) => (score(b) / b.price) - (score(a) / a.price))
    }

    return result
  }, [budgetFilter, categoryFilter, brandFilter, sortBy])

  const toggleCompare = (id: string) => {
    if (compareLaptops.includes(id)) {
      removeFromCompareLaptops(id)
    } else {
      addToCompareLaptops(id)
    }
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Laptops</h1>
          <p className="mt-2 text-muted-foreground">
            Compare {laptopsData.length} laptops across all price ranges
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="space-y-6">
          {/* Budget */}
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">Budget</p>
            <div className="flex flex-wrap gap-2">
              {budgetFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setBudgetFilter(filter.value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    budgetFilter === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">Category</p>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setCategoryFilter(filter.value)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    categoryFilter === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand & Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Brand:</label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {brandFilters.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mt-8 text-sm text-muted-foreground">
          Showing {filteredLaptops.length} {filteredLaptops.length === 1 ? "laptop" : "laptops"}
        </p>

        {/* Laptop Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLaptops.map((laptop) => {
            const score = Math.round(laptop.overallScore * 10)
            return (
              <Card key={laptop.id} className="group overflow-hidden">
                <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <ProductImage src={laptop.image} alt={laptop.name} category={laptop.category} seed={laptop.id} className="absolute inset-0 h-full w-full" />
                  
                  <div className="absolute right-3 top-3 flex flex-col gap-2">
                    <button
                      onClick={() => toggleSaveLaptop(laptop.id)}
                      className={cn(
                        "rounded-full p-2 backdrop-blur transition-colors",
                        savedLaptops.includes(laptop.id)
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/80 hover:bg-background"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", savedLaptops.includes(laptop.id) && "fill-current")} />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {laptop.brand}
                      </p>
                      <Link to={`/laptops/${laptop.id}`}>
                        <h3 className="mt-1 font-display font-semibold leading-tight hover:text-primary">
                          {laptop.name}
                        </h3>
                      </Link>
                    </div>
                    <ScoreBadgePill score={score} />
                  </div>

                  <p className="mt-3 font-display text-lg font-bold">
                    {formatPrice(laptop.price_inr, laptop.price_usd)}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Cpu className="h-4 w-4" />
                      <span>{laptop.specs.processor}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span>{laptop.specs.ram}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Monitor className="h-3.5 w-3.5" />
                        <span>{laptop.specs.gpu.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Battery className="h-3.5 w-3.5" />
                        <span>{laptop.specs.battery}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground">
                      {laptop.category}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Link to={`/laptops/${laptop.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant={compareLaptops.includes(laptop.id) ? "default" : "secondary"}
                      size="icon"
                      onClick={() => toggleCompare(laptop.id)}
                      disabled={!compareLaptops.includes(laptop.id) && compareLaptops.length >= 3}
                    >
                      {compareLaptops.includes(laptop.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredLaptops.length === 0 && (
          <div className="py-16 text-center">
            <Laptop className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No laptops found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <CompareBar type="laptops" />
    </div>
  )
}

