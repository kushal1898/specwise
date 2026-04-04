import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { TrendingUp, Activity, Star, Eye } from "lucide-react"
import { useAnalytics } from "@/lib/analytics-context"
import { Card } from "@/components/ui/card"
import { ScoreBadgePill } from "@/components/score-badge"
import { useSpecWise } from "@/lib/specwise-context"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

export default function Trending() {
  const [mounted, setMounted] = useState(false)
  const { getTopViewed, getTopCompared, getTopSaved } = useAnalytics()
  const { formatPrice } = useSpecWise()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const topViewed = getTopViewed(5)
  const topCompared = getTopCompared(5)
  const topSaved = getTopSaved(5)

  const allProducts: any[] = [
    ...laptopsData.map(l => ({ ...l, type: "laptop", href: `/laptops/${l.id}` })),
    ...phonesData.map(p => ({ ...p, type: "phone", href: `/phones/${p.id}` })),
    ...headphonesData.map(h => ({ ...h, type: "headphone", href: `/headphones/${h.id}` })),
  ]

  const getProduct = (id: string) => allProducts.find((p) => p.id === id)

  return (
    <div className="pb-24">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Trending Now</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            What's hot right now based on real SpecWise usage data.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <section>
            <div className="mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">Most Viewed</h2>
            </div>
            <div className="space-y-4">
              {topViewed.length > 0 ? (
                topViewed.map(({ id, count }, index) => {
                  const product = getProduct(id)
                  if (!product) return null
                  return (
                    <ProductRow
                      key={id}
                      product={product}
                      formatPrice={formatPrice}
                      metric={`${count} views`}
                      rank={index + 1}
                    />
                  )
                })
              ) : (
                <EmptyState message="No views yet! Start browsing to see what's popular." />
              )}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <h2 className="font-display text-2xl font-bold">Most Compared</h2>
            </div>
            <div className="space-y-4">
              {topCompared.length > 0 ? (
                topCompared.map(({ id, count }, index) => {
                  const product = getProduct(id)
                  if (!product) return null
                  return (
                    <ProductRow
                      key={id}
                      product={product}
                      formatPrice={formatPrice}
                      metric={`${count} compares`}
                      rank={index + 1}
                    />
                  )
                })
              ) : (
                <EmptyState message="No comparisons yet! Start comparing items." />
              )}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <h2 className="font-display text-2xl font-bold">Most Wishlisted</h2>
            </div>
            <div className="space-y-4">
              {topSaved.length > 0 ? (
                topSaved.map(({ id, count }, index) => {
                  const product = getProduct(id)
                  if (!product) return null
                  return (
                    <ProductRow
                      key={id}
                      product={product}
                      formatPrice={formatPrice}
                      metric={`${count} saves`}
                      rank={index + 1}
                    />
                  )
                })
              ) : (
                <EmptyState message="Nobody has saved anything yet." />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ProductRow({ product, formatPrice, metric, rank }: { product: any, formatPrice: any, metric: string, rank: number }) {
  const score = 'overallScore' in product ? Math.round(product.overallScore * 10) : product.score
  const priceDisplay = 'price' in product ? `$${product.price.toLocaleString()}` : formatPrice(product.price_inr, product.price_usd)
  
  return (
    <Link to={product.href}>
      <Card className="group flex items-center gap-4 p-4 transition-all hover:bg-muted/50 hover:shadow-md">
        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-background font-display font-bold shadow-sm">
          #{rank}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight group-hover:text-primary">
            {product.name}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{priceDisplay}</span>
            <span className="text-[10px] text-muted-foreground">•</span>
            <span className="text-xs text-primary font-medium">{metric}</span>
          </div>
        </div>
        <ScoreBadgePill score={score} />
      </Card>
    </Link>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

