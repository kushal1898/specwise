import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Heart, Laptop, Smartphone, Headphones, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreBadgePill } from "@/components/score-badge"
import { ProductImage } from "@/components/product-image"
import { useSpecWise } from "@/lib/specwise-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

export default function Saved() {
  const {
    savedLaptops,
    savedPhones,
    savedHeadphones,
    toggleSaveLaptop,
    toggleSavePhone,
    toggleSaveHeadphone,
    clearAllSaved,
    formatPrice,
  } = useSpecWise()

  const [activeTab, setActiveTab] = useState("laptops")

  const savedLaptopsList = laptopsData.filter(l => savedLaptops.includes(l.id))
  const savedPhonesList = phonesData.filter(p => savedPhones.includes(p.id))
  const savedHeadphonesList = headphonesData.filter(h => savedHeadphones.includes(h.id))
  const totalSaved = savedLaptopsList.length + savedPhonesList.length + savedHeadphonesList.length

  useEffect(() => {
    if (activeTab === "laptops" && savedLaptopsList.length === 0) {
      if (savedPhonesList.length > 0) setActiveTab("phones")
      else if (savedHeadphonesList.length > 0) setActiveTab("headphones")
    } else if (activeTab === "phones" && savedPhonesList.length === 0) {
      if (savedLaptopsList.length > 0) setActiveTab("laptops")
      else if (savedHeadphonesList.length > 0) setActiveTab("headphones")
    } else if (activeTab === "headphones" && savedHeadphonesList.length === 0) {
      if (savedLaptopsList.length > 0) setActiveTab("laptops")
      else if (savedPhonesList.length > 0) setActiveTab("phones")
    }
  }, [savedLaptopsList.length, savedPhonesList.length, savedHeadphonesList.length, activeTab])

  return (
    <div className="pb-24">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="font-display text-4xl font-bold md:text-5xl">Saved Items</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Your collection of tracked and compared tech
              </p>
            </div>
            {totalSaved > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  clearAllSaved()
                  toast.success("Cleared all saved items")
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {totalSaved === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">No saved items yet</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Items you heart while browsing will appear here for easy access and comparison later.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/laptops">
                <Button variant="outline" className="gap-2">
                  <Laptop className="h-4 w-4" />
                  Browse Laptops
                </Button>
              </Link>
              <Link to="/phones">
                <Button variant="outline" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Browse Phones
                </Button>
              </Link>
              <Link to="/headphones">
                <Button variant="outline" className="gap-2">
                  <Headphones className="h-4 w-4" />
                  Browse Headphones
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="laptops" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="laptops" className="gap-2">
                  <Laptop className="h-4 w-4" />
                  Laptops ({savedLaptops.length})
                </TabsTrigger>
                <TabsTrigger value="phones" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Phones ({savedPhones.length})
                </TabsTrigger>
                <TabsTrigger value="headphones" className="gap-2">
                  <Headphones className="h-4 w-4" />
                  Headphones ({savedHeadphones.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="laptops" className="mt-0">
              {savedLaptopsList.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {savedLaptopsList.map((laptop) => (
                    <Card key={laptop.id} className="group overflow-hidden">
                      <div className="relative aspect-[4/3] bg-muted">
                        <ProductImage src={laptop.image} alt={laptop.name} category="laptop" seed={laptop.id} className="h-full w-full object-cover" />
                        <button
                          onClick={() => toggleSaveLaptop(laptop.id)}
                          className="absolute right-3 top-3 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-110"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">{laptop.brand}</p>
                            <Link to={`/laptops/${laptop.id}`}>
                              <h3 className="mt-1 font-display font-semibold line-clamp-1 hover:text-primary">
                                {laptop.name}
                              </h3>
                            </Link>
                          </div>
                          <ScoreBadgePill score={Math.round(laptop.overallScore * 10)} />
                        </div>
                        <p className="mt-3 font-display font-bold text-lg">
                          {formatPrice(laptop.price_inr, laptop.price_usd)}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Link to={`/laptops/${laptop.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Laptop className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-4 font-medium">No saved laptops</p>
                  <Link to="/laptops" className="mt-2 text-sm text-primary hover:underline">Browse all laptops</Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="phones" className="mt-0">
              {savedPhonesList.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {savedPhonesList.map((phone) => (
                    <Card key={phone.id} className="group overflow-hidden">
                      <div className="relative aspect-square bg-muted">
                        <ProductImage src={phone.image} alt={phone.name} category="phone" seed={phone.id} className="h-full w-full object-cover" />
                        <button
                          onClick={() => toggleSavePhone(phone.id)}
                          className="absolute right-3 top-3 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-110"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">{phone.brand}</p>
                            <Link to={`/phones/${phone.id}`}>
                              <h3 className="mt-1 font-display font-semibold line-clamp-1 hover:text-primary">
                                {phone.name}
                              </h3>
                            </Link>
                          </div>
                          <ScoreBadgePill score={phone.score} />
                        </div>
                        <p className="mt-3 font-display font-bold text-lg">
                          {formatPrice(phone.price_inr, phone.price_usd)}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Link to={`/phones/${phone.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Smartphone className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-4 font-medium">No saved phones</p>
                  <Link to="/phones" className="mt-2 text-sm text-primary hover:underline">Browse all phones</Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="headphones" className="mt-0">
              {savedHeadphonesList.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {savedHeadphonesList.map((headphone) => (
                    <Card key={headphone.id} className="group overflow-hidden">
                      <div className="relative aspect-square bg-muted">
                        <ProductImage src={headphone.image} alt={headphone.name} category="headphone" seed={headphone.id} className="h-full w-full object-cover" />
                        <button
                          onClick={() => toggleSaveHeadphone(headphone.id)}
                          className="absolute right-3 top-3 rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-transform hover:scale-110"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase">{headphone.brand}</p>
                            <Link to={`/headphones/${headphone.id}`}>
                              <h3 className="mt-1 font-display font-semibold line-clamp-1 hover:text-primary">
                                {headphone.name}
                              </h3>
                            </Link>
                          </div>
                          <ScoreBadgePill score={headphone.score} />
                        </div>
                        <p className="mt-3 font-display font-bold text-lg">
                          {formatPrice(headphone.price_inr, headphone.price_usd)}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Link to={`/headphones/${headphone.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Headphones className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-4 font-medium">No saved headphones</p>
                  <Link to="/headphones" className="mt-2 text-sm text-primary hover:underline">Browse all headphones</Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

