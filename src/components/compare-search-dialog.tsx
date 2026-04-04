"use client"

import { useState } from "react"
import { Search, Plus, Laptop, Smartphone, Headphones } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ProductImage } from "@/components/product-image"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

interface CompareSearchDialogProps {
  category: "laptops" | "phones" | "headphones"
  unavailableIds: string[]
  onSelect: (id: string) => void
  children: React.ReactNode
}

export function CompareSearchDialog({ category, unavailableIds, onSelect, children }: CompareSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const data = category === "laptops" ? laptopsData : category === "phones" ? phonesData : headphonesData

  const results = data.filter(
    (item) => 
      !unavailableIds.includes(item.id) &&
      (item.name.toLowerCase().includes(query.toLowerCase()) || item.brand.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 10) // Limit to 10 for performance

  const handleSelect = (id: string) => {
    onSelect(id)
    setOpen(false)
    setQuery("")
  }

  const getCatType = () => {
    if (category.includes("phone")) return "phone"
    if (category.includes("headphone")) return "headphone"
    return "laptop"
  }

  const IconMap = {
    laptops: Laptop,
    phones: Smartphone,
    headphones: Headphones
  }
  const CategoryIcon = IconMap[category]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {category} to comparison</DialogTitle>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search by brand or name...`} 
            className="pl-9" 
            autoFocus
          />
        </div>
        <div className="mt-4 flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-2">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No matches found.</p>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:border-border hover:bg-muted/50"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted overflow-hidden">
                  <ProductImage src={item.image} alt={item.name} category={getCatType()} seed={item.id} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

