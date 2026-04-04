import { useParams, Link, useNavigate } from "react-router-dom"
import { 
  Heart, Plus, Check, Smartphone, 
  Cpu, Camera, Battery, Monitor, HardDrive,
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
import { VideoReviewModal } from "@/components/video-review-modal"
import phonesData from "@/data/phones.json"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts"

export default function PhoneDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const phone = phonesData.find((p) => p.id === slug)

  if (!phone) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Phone not found</h2>
        <Button onClick={() => navigate("/phones")}>Back to Phones</Button>
      </div>
    )
  }

  const {
    formatPrice,
    savedPhones,
    toggleSavePhone,
    comparePhones,
    addToComparePhones,
    removeFromComparePhones,
  } = useSpecWise()

  const isSaved = savedPhones.includes(phone.id)
  const isInCompare = comparePhones.includes(phone.id)

  const radarData = [
    { metric: "Performance", value: phone.score, fullMark: 100 },
    { metric: "Camera", value: Math.min(100, phone.camera_mp), fullMark: 100 },
    { metric: "Battery", value: Math.round(Math.min(100, phone.battery_mah / 50)), fullMark: 100 },
    { metric: "Display", value: phone.display_hz >= 120 ? 90 : 70, fullMark: 100 },
    { metric: "Value", value: Math.round(Math.min(100, (phone.score / phone.price_usd) * 120)), fullMark: 100 },
  ]

  const similarPhones = phonesData
    .filter((p) => p.id !== phone.id && p.category.some((c) => phone.category.includes(c)))
    .sort((a, b) => Math.abs(a.price_usd - phone.price_usd) - Math.abs(b.price_usd - phone.price_usd))
    .slice(0, 3)

  const toggleCompare = () => {
    if (isInCompare) {
      removeFromComparePhones(phone.id)
    } else {
      addToComparePhones(phone.id)
    }
  }

  return (
    <div className="pb-16">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <BackButton fallback="/phones">Back to Phones</BackButton>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImage 
            src={phone.image} 
            alt={phone.name} 
            category="phone" 
            seed={phone.id} 
            className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 lg:aspect-[4/3]"
          />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {phone.brand}
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{phone.name}</h1>
              </div>
              <ScoreBadge score={phone.score} size="lg" />
            </div>

            <p className="mt-4 font-display text-3xl font-bold text-primary">
              {formatPrice(phone.price_inr, phone.price_usd)}
            </p>

            <Card className="mt-6 bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">SpecWise Verdict</p>
              <p className="mt-2 text-sm leading-relaxed">{phone.verdict}</p>
            </Card>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Pros
                </p>
                <ul className="space-y-1">
                  {phone.pros.map((pro, i) => (
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
                  {phone.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground">- {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant={isSaved ? "default" : "outline"}
                className="gap-2"
                onClick={() => toggleSavePhone(phone.id)}
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant={isInCompare ? "default" : "outline"}
                className="gap-2"
                onClick={toggleCompare}
                disabled={!isInCompare && comparePhones.length >= 3}
              >
                {isInCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isInCompare ? "In Compare" : "Add to Compare"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Performance Overview</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-display font-semibold">Performance Radar</h3>
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
              <h3 className="font-display font-semibold">Key Highlights</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <HighlightCard
                  icon={Cpu}
                  label="Processor"
                  value={phone.processor}
                />
                <HighlightCard
                  icon={Camera}
                  label="Main Camera"
                  value={`${phone.camera_mp}MP`}
                />
                <HighlightCard
                  icon={Battery}
                  label="Battery"
                  value={`${phone.battery_mah}mAh`}
                />
                <HighlightCard
                  icon={Monitor}
                  label="Display"
                  value={`${phone.display_inches}" ${phone.display_hz}Hz`}
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Full Specifications</h2>
          <Card className="mt-6 divide-y divide-border">
            <SpecRow icon={Cpu} label="Processor" value={phone.processor} />
            <SpecRow icon={Camera} label="Main Camera" value={`${phone.camera_mp}MP`} />
            <SpecRow icon={Battery} label="Battery" value={`${phone.battery_mah}mAh`} />
            <SpecRow icon={Monitor} label="Display" value={`${phone.display_inches}" • ${phone.display_hz}Hz`} />
            <SpecRow icon={HardDrive} label="RAM" value={`${phone.ram_gb}GB`} />
            <SpecRow icon={HardDrive} label="Storage" value={`${phone.storage_gb}GB`} />
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Video Review</h2>
          <div className="mt-6">
            <VideoReviewModal 
              url={phone.youtube_review_url} 
              reviewer={(phone as any).reviewer || (phone.brand === "Apple" || phone.brand === "Google" || phone.brand === "Samsung" ? "Marques Brownlee" : "Mrwhosetheboss")}
            />
          </div>
        </div>

        {phone.resale_value_6m && phone.resale_value_1y && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Resale Value Estimate</h2>
            <Card className="mt-6 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Original MSRP</p>
                  <p className="mt-2 text-2xl font-bold text-green-500">
                    {formatPrice(phone.price_inr, phone.price_usd)}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">6 Months</p>
                  <p className="mt-2 text-2xl font-bold text-yellow-500">
                    {formatPrice(Math.round(phone.price_inr * (phone.resale_value_6m / phone.price_usd)), phone.resale_value_6m)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((phone.resale_value_6m / phone.price_usd) * 100)}% of MSRP
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">1 Year</p>
                  <p className="mt-2 text-2xl font-bold text-red-400">
                    {formatPrice(Math.round(phone.price_inr * (phone.resale_value_1y / phone.price_usd)), phone.resale_value_1y)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((phone.resale_value_1y / phone.price_usd) * 100)}% of MSRP
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                📊 Estimated from marketplace pricing data
              </p>
            </Card>
          </div>
        )}

        <ReviewSection productId={phone.id} />

        {similarPhones.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Similar Phones</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarPhones.map((similar) => (
                <Link key={similar.id} to={`/phones/${similar.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg flex flex-col">
                    <ProductImage 
                      src={similar.image} 
                      alt={similar.name} 
                      category="phone" 
                      seed={similar.id} 
                      className="aspect-square w-full"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{similar.brand}</p>
                          <h3 className="font-display font-medium group-hover:text-primary">{similar.name}</h3>
                        </div>
                        <ScoreBadgePill score={similar.score} />
                      </div>
                      <p className="mt-2 font-display font-bold">
                        {formatPrice(similar.price_inr, similar.price_usd)}
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

function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <span className="w-32 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function HighlightCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}

