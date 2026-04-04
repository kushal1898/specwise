import { useParams, Link, useNavigate } from "react-router-dom"
import { 
  Heart, Plus, Check, Headphones, 
  Youtube, ExternalLink,
  Volume2, Gauge, Zap, ThumbsUp, ThumbsDown
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScoreBadge, ScoreBadgePill } from "@/components/score-badge"
import { FrequencyGraph } from "@/components/frequency-graph"
import { ReviewSection } from "@/components/review-section"
import { BackButton } from "@/components/back-button"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import headphonesData from "@/data/headphones.json"

export default function HeadphoneDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const headphone = headphonesData.find((h) => h.id === slug)

  if (!headphone) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Headphone not found</h2>
        <Button onClick={() => navigate("/headphones")}>Back to Headphones</Button>
      </div>
    )
  }

  const {
    formatPrice,
    savedHeadphones,
    toggleSaveHeadphone,
    compareHeadphones,
    addToCompareHeadphones,
    removeFromCompareHeadphones,
  } = useSpecWise()

  const isSaved = savedHeadphones.includes(headphone.id)
  const isInCompare = compareHeadphones.includes(headphone.id)

  const similarHeadphones = headphonesData
    .filter((h) => h.id !== headphone.id && (h.type === headphone.type || h.signature === headphone.signature))
    .sort((a, b) => Math.abs(a.price_usd - headphone.price_usd) - Math.abs(b.price_usd - headphone.price_usd))
    .slice(0, 3)

  const toggleCompare = () => {
    if (isInCompare) {
      removeFromCompareHeadphones(headphone.id)
    } else {
      addToCompareHeadphones(headphone.id)
    }
  }

  return (
    <div className="pb-16">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <BackButton fallback="/headphones">Back to Headphones</BackButton>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ProductImage 
            src={headphone.image} 
            alt={headphone.name} 
            category="headphone" 
            seed={headphone.id} 
            className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 lg:aspect-[4/3]"
          />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {headphone.brand}
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{headphone.name}</h1>
              </div>
              <ScoreBadge score={headphone.score} size="lg" />
            </div>

            <p className="mt-4 font-display text-3xl font-bold text-primary">
              {formatPrice(headphone.price_inr, headphone.price_usd)}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {headphone.type}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {headphone.driver} Driver
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                {headphone.signature}
              </span>
            </div>

            <Card className="mt-6 bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">SpecWise Verdict</p>
              <p className="mt-2 text-sm leading-relaxed">{headphone.verdict}</p>
            </Card>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Pros
                </p>
                <ul className="space-y-1">
                  {headphone.pros.map((pro, i) => (
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
                  {headphone.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground">- {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant={isSaved ? "default" : "outline"}
                className="gap-2"
                onClick={() => toggleSaveHeadphone(headphone.id)}
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant={isInCompare ? "default" : "outline"}
                className="gap-2"
                onClick={toggleCompare}
                disabled={!isInCompare && compareHeadphones.length >= 3}
              >
                {isInCompare ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {isInCompare ? "In Compare" : "Add to Compare"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Frequency Response</h2>
          <Card className="mt-6 p-6">
            <FrequencyGraph headphones={[headphone]} showHarmanTarget />
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Full Specifications</h2>
          <Card className="mt-6 divide-y divide-border">
            <SpecRow icon={Headphones} label="Type" value={headphone.type} />
            <SpecRow icon={Volume2} label="Driver" value={headphone.driver} />
            <SpecRow icon={Zap} label="Impedance" value={`${headphone.impedance_ohm}\u03A9`} />
            <SpecRow icon={Gauge} label="Sensitivity" value={`${headphone.sensitivity_db}dB`} />
            <SpecRow icon={Volume2} label="Sound Signature" value={headphone.signature} />
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Sound Signature</h2>
          <Card className="mt-6 p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {getSignatureDescription(headphone.signature)}
            </p>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Video Review</h2>
          <Card className="mt-6 overflow-hidden">
            <a
              href={headphone.youtube_review_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <Youtube className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <p className="font-medium">Watch Full Review on YouTube</p>
                <p className="mt-1 text-sm text-muted-foreground">In-depth audio review and comparisons</p>
              </div>
              <ExternalLink className="ml-auto h-5 w-5 text-muted-foreground" />
            </a>
          </Card>
        </div>

        {headphone.resale_value_6m && headphone.resale_value_1y && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Resale Value Estimate</h2>
            <Card className="mt-6 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Original MSRP</p>
                  <p className="mt-2 text-2xl font-bold text-green-500">
                    {formatPrice(headphone.price_inr, headphone.price_usd)}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">6 Months</p>
                  <p className="mt-2 text-2xl font-bold text-yellow-500">
                    {formatPrice(Math.round(headphone.price_inr * (headphone.resale_value_6m / headphone.price_usd)), headphone.resale_value_6m)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((headphone.resale_value_6m / headphone.price_usd) * 100)}% of MSRP
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">1 Year</p>
                  <p className="mt-2 text-2xl font-bold text-red-400">
                    {formatPrice(Math.round(headphone.price_inr * (headphone.resale_value_1y / headphone.price_usd)), headphone.resale_value_1y)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {Math.round((headphone.resale_value_1y / headphone.price_usd) * 100)}% of MSRP
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-center text-muted-foreground">
                \ud83d\udcca Estimated from marketplace pricing data
              </p>
            </Card>
          </div>
        )}

        <ReviewSection productId={headphone.id} />

        {similarHeadphones.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold">Similar Headphones</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarHeadphones.map((similar) => (
                <Link key={similar.id} to={`/headphones/${similar.id}`}>
                  <Card className="group overflow-hidden transition-all hover:shadow-lg flex flex-col">
                    <ProductImage 
                      src={similar.image} 
                      alt={similar.name} 
                      category="headphone" 
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

function getSignatureDescription(signature: string): string {
  const descriptions: Record<string, string> = {
    "Neutral": "A neutral sound signature aims for flat frequency response, reproducing audio as it was recorded without emphasis on any particular frequency range. Ideal for critical listening, mixing, and those who prefer accurate, uncolored sound.",
    "Neutral-Warm": "A neutral-warm signature maintains overall balance but adds subtle warmth in the lower midrange and bass regions. This provides a natural, full-bodied sound while remaining relatively accurate. Great for long listening sessions.",
    "Warm": "A warm sound signature emphasizes the lower frequencies and lower midrange, creating a rich, smooth, and full-bodied sound. Treble is typically relaxed and non-fatiguing. Perfect for genres like jazz, vocal music, and acoustic.",
    "V-Shaped": "The V-shaped signature boosts both bass and treble while recessing the midrange. This creates an exciting, fun sound with punchy lows and sparkling highs. Popular for electronic music, hip-hop, and casual listening.",
    "Bright": "A bright sound signature emphasizes the upper midrange and treble frequencies, resulting in detailed, airy, and forward presentation. Can reveal micro-details but may be fatiguing for some listeners. Best suited for analytical listening.",
  }
  return descriptions[signature] || "A balanced sound signature suitable for various genres."
}

