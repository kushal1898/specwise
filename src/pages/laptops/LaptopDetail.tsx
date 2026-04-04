import { useParams, Link, useNavigate } from "react-router-dom"
import { 
  Heart, Plus, Check, Laptop, 
  Cpu, HardDrive, Monitor, Battery, Scale, Layers,
  ThumbsUp, ThumbsDown
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadge, ScoreBadgePill } from "@/components/score-badge"
import { ReviewSection } from "@/components/review-section"
import { BackButton } from "@/components/back-button"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import laptopsData from "@/data/laptops.json"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts"

export default function LaptopDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const laptop = laptopsData.find((l) => l.id === slug)

  if (!laptop) {
    // In a real app, you might redirect to a 404 page
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Laptop not found</h2>
        <Button onClick={() => navigate("/laptops")}>Back to Laptops</Button>
      </div>
    )
  }

  const {
    formatPrice,
    savedLaptops,
    toggleSaveLaptop,
    compareLaptops,
    addToCompareLaptops,
    removeFromCompareLaptops,
  } = useSpecWise()

  const isSaved = savedLaptops.includes(laptop.id)
  const isInCompare = compareLaptops.includes(laptop.id)
  const score = Math.round(laptop.overallScore * 10)

  const radarData = [
    { metric: "Performance", value: laptop.scores.performance * 10, fullMark: 100 },
    { metric: "Display", value: laptop.scores.display * 10, fullMark: 100 },
    { metric: "Battery", value: laptop.scores.battery * 10, fullMark: 100 },
    { metric: "Build", value: laptop.scores.build * 10, fullMark: 100 },
    { metric: "Value", value: laptop.scores.value * 10, fullMark: 100 },
  ]

  const benchmarkData = [
    { name: "Performance", score: laptop.scores.performance * 10 },
    { name: "Display", score: laptop.scores.display * 10 },
    { name: "Battery", score: laptop.scores.battery * 10 },
    { name: "Build", score: laptop.scores.build * 10 },
    { name: "Value", score: laptop.scores.value * 10 },
  ]

  const similarLaptops = laptopsData
    .filter((l) => l.id !== laptop.id && l.category === laptop.category)
    .sort((a, b) => Math.abs(a.price - laptop.price) - Math.abs(b.price - laptop.price))
    .slice(0, 3)

  const toggleCompare = () => {
    if (isInCompare) {
      removeFromCompareLaptops(laptop.id)
    } else {
      addToCompareLaptops(laptop.id)
    }
  }

  return (
    <div className="pb-16">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <BackButton fallback="/laptops">Back to Laptops</BackButton>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImage 
            src={laptop.image} 
            alt={laptop.name} 
            category={laptop.category} 
            seed={laptop.id} 
            className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50"
          />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {laptop.brand}
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{laptop.name}</h1>
              </div>
              <ScoreBadge score={score} size="lg" />
            </div>

            <p className="mt-4 font-display text-3xl font-bold text-primary">
              {formatPrice(laptop.price_inr, laptop.price_usd)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {laptop.category}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {laptop.specs.processor}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Pros
                </p>
                <ul className="space-y-1">
                  {laptop.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-muted-foreground">+ {pro}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                  Cons
                </p>
                <ul className="space-y-1">
                  {laptop.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground">- {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant={isSaved ? "default" : "outline"}
                className="gap-2"
                onClick={() => toggleSaveLaptop(laptop.id)}
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant={isInCompare ? "default" : "outline"}
                className="gap-2"
                onClick={toggleCompare}
                disabled={!isInCompare && compareLaptops.length >= 3}
              >
                {isInCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isInCompare ? "In Compare" : "Add to Compare"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Performance Scorecard</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-display font-semibold">Performance Overview</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--graph-text)", fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="var(--graph-1)"
                      fill="var(--graph-1)"
                      fillOpacity={0.6}
                    >
                      <LabelList dataKey="value" position="top" fill="var(--graph-text)" fontSize={10} fontWeight="bold" />
                    </Radar>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background/80 backdrop-blur-sm border border-border px-2 py-1 rounded shadow-sm text-[10px] font-bold">
                              {payload[0].payload.metric}: {payload[0].value}
                            </div>
                          )
                        }
                        return null
                      }}
                      wrapperStyle={{ zIndex: 100 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-display font-semibold">Category Scores</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} layout="vertical">
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: "var(--graph-text)", fontSize: 11, fontWeight: 500 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} tickLine={false} />
                    <Bar 
                      dataKey="score" 
                      fill="var(--graph-1)" 
                      stroke="var(--graph-1)" 
                      strokeWidth={1}
                      radius={[0, 4, 4, 0]}
                    >
                      <LabelList 
                        dataKey="score" 
                        position="insideRight" 
                        fill="white" 
                        fontSize={10} 
                        fontWeight="bold"
                        offset={10}
                        formatter={(val: number) => `score : ${val}`}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Full Specifications</h2>
          <Card className="mt-6 divide-y divide-border">
            <SpecRow icon={Cpu} label="Processor" value={laptop.specs.processor} />
            <SpecRow icon={Layers} label="Graphics" value={laptop.specs.gpu} />
            <SpecRow icon={HardDrive} label="Memory" value={laptop.specs.ram} />
            <SpecRow icon={HardDrive} label="Storage" value={laptop.specs.storage} />
            <SpecRow icon={Monitor} label="Display" value={laptop.specs.display} />
            <SpecRow icon={Battery} label="Battery" value={laptop.specs.battery} />
            <SpecRow icon={Scale} label="Weight" value={laptop.specs.weight} />
          </Card>
        </div>

        {laptop.resaleData && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Resale Value Estimate</h2>
            <Card className="mt-6 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Current Value</p>
                  <p className="mt-2 text-2xl font-bold text-green-500">
                    {formatPrice(Math.round(laptop.price_inr * (laptop.resaleData.current / laptop.price)), laptop.resaleData.current)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((laptop.resaleData.current / laptop.price) * 100)}% of MSRP
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">6 Months</p>
                  <p className="mt-2 text-2xl font-bold text-yellow-500">
                    {formatPrice(Math.round(laptop.price_inr * (laptop.resaleData.sixMonths / laptop.price)), laptop.resaleData.sixMonths)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((laptop.resaleData.sixMonths / laptop.price) * 100)}% of MSRP
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">1 Year</p>
                  <p className="mt-2 text-2xl font-bold text-red-400">
                    {formatPrice(Math.round(laptop.price_inr * (laptop.resaleData.oneYear / laptop.price)), laptop.resaleData.oneYear)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((laptop.resaleData.oneYear / laptop.price) * 100)}% of MSRP
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                📊 Estimated from eBay, Swappa, and marketplace pricing data
              </p>
            </Card>
          </div>
        )}

        <ReviewSection productId={laptop.id} />

        {similarLaptops.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Similar Laptops</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarLaptops.map((similar) => (
                <Link key={similar.id} to={`/laptops/${similar.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg flex flex-col">
                    <ProductImage 
                      src={similar.image} 
                      alt={similar.name} 
                      category={similar.category} 
                      seed={similar.id} 
                      className="aspect-[4/3] w-full"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{similar.brand}</p>
                          <h3 className="font-display font-medium group-hover:text-primary">{similar.name}</h3>
                        </div>
                        <ScoreBadgePill score={Math.round(similar.overallScore * 10)} />
                      </div>
                      <p className="mt-2 font-display font-bold">
                        {formatPrice(similar.price_inr, similar.price_usd || similar.price)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

