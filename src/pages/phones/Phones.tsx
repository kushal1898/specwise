import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Smartphone, Camera, Battery, Monitor, Cpu, Heart, Plus, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadgePill } from "@/components/score-badge"
import { CompareBar } from "@/components/compare-bar"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import phonesData from "@/data/phones.json"

const budgetFilters = [
  { label: "All", value: "all" },
  { label: "Under $500", value: "under-500" },
  { label: "$500 - $800", value: "500-800" },
  { label: "$800 - $1000", value: "800-1000" },
  { label: "Flagship ($1000+)", value: "flagship" },
]

const categoryFilters = [
  { label: "All", value: "all" },
  { label: "Flagship", value: "flagship" },
  { label: "Best Camera", value: "camera" },
  { label: "Best Battery", value: "battery" },
  { label: "Gaming", value: "gaming" },
  { label: "Compact", value: "compact" },
  { label: "5G", value: "5g" },
]

const brandFilters = ["All", "Apple", "Samsung", "OnePlus", "Google", "Nothing", "Xiaomi", "Realme"]

const sortOptions = [
  { label: "Best Score", value: "score-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]

export default function Phones() {
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("All")
  const [sortBy, setSortBy] = useState("score-desc")

  const {
    formatPrice,
    savedPhones,
    toggleSavePhone,
    comparePhones,
    addToComparePhones,
    removeFromComparePhones,
  } = useSpecWise()

  const filteredPhones = useMemo(() => {
    let result = [...phonesData]

    // Budget filter
    if (budgetFilter !== "all") {
      result = result.filter((phone) => {
        const price = phone.price_usd
        if (budgetFilter === "under-500") return price < 500
        if (budgetFilter === "500-800") return price >= 500 && price < 800
        if (budgetFilter === "800-1000") return price >= 800 && price < 1000
        if (budgetFilter === "flagship") return price >= 1000
        return true
      })
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((phone) => phone.category.includes(categoryFilter))
    }

    // Brand filter
    if (brandFilter !== "All") {
      result = result.filter((phone) => phone.brand === brandFilter)
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
  }, [budgetFilter, categoryFilter, brandFilter, sortBy])

  const toggleCompare = (id: string) => {
    if (comparePhones.includes(id)) {
      removeFromComparePhones(id)
    } else {
      addToComparePhones(id)
    }
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Phones</h1>
          <p className="mt-2 text-muted-foreground">
            Compare {phonesData.length} phones across all price ranges
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
          Showing {filteredPhones.length} {filteredPhones.length === 1 ? 'phone' : 'phones'}
        </p>

        {/* Phone Grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPhones.map((phone) => (
            <Card key={phone.id} className="group overflow-hidden">
              {/* Image placeholder */}
              <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <ProductImage src={phone.image} alt={phone.name} category="phone" seed={phone.id} className="absolute inset-0 h-full w-full" />
                
                {/* Actions overlay */}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                  <button
                    onClick={() => toggleSavePhone(phone.id)}
                    className={cn(
                      "rounded-full p-2 backdrop-blur transition-colors",
                      savedPhones.includes(phone.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/80 hover:bg-background"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", savedPhones.includes(phone.id) && "fill-current")} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {phone.brand}
                    </p>
                    <Link to={`/phones/${phone.id}`}>
                      <h3 className="mt-1 font-display font-semibold leading-tight hover:text-primary">
                        {phone.name}
                      </h3>
                    </Link>
                  </div>
                  <ScoreBadgePill score={phone.score} />
                </div>

                <p className="mt-3 font-display text-lg font-bold">
                  {formatPrice(phone.price_inr, phone.price_usd)}
                </p>

                {/* Key Specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    <span className="truncate">{phone.processor.split(" ").slice(-2).join(" ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5" />
                    <span>{phone.camera_mp}MP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Battery className="h-3.5 w-3.5" />
                    <span>{phone.battery_mah}mAh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" />
                    <span>{phone.display_hz}Hz</span>
                  </div>
                </div>

                {/* Category Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {phone.category.slice(0, 2).map((cat: string) => (
                    <span
                      key={cat}
                      className="rounded-full bg-secondary px-2 py-0.5 text-xs capitalize text-secondary-foreground"
                    >
                      {cat.replace("-", " ")}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link to={`/phones/${phone.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant={comparePhones.includes(phone.id) ? "default" : "secondary"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleCompare(phone.id)}
                    disabled={!comparePhones.includes(phone.id) && comparePhones.length >= 3}
                  >
                    {comparePhones.includes(phone.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPhones.length === 0 && (
          <div className="py-16 text-center">
            <Smartphone className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No phones found</p>
            <p className="mt-2 text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <CompareBar type="phones" />
    </div>
  )
}

