"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react"

interface SpecWiseContextType {
  currency: "INR" | "USD"
  setCurrency: (currency: "INR" | "USD") => void
  savedLaptops: string[]
  savedPhones: string[]
  savedHeadphones: string[]
  compareLaptops: string[]
  comparePhones: string[]
  compareHeadphones: string[]
  savedComparisons: { ids: string[]; name: string; date: string; type: string }[]
  toggleSaveLaptop: (id: string) => void
  toggleSavePhone: (id: string) => void
  toggleSaveHeadphone: (id: string) => void
  addToCompareLaptops: (id: string) => void
  removeFromCompareLaptops: (id: string) => void
  addToComparePhones: (id: string) => void
  removeFromComparePhones: (id: string) => void
  addToCompareHeadphones: (id: string) => void
  removeFromCompareHeadphones: (id: string) => void
  clearCompareLaptops: () => void
  clearComparePhones: () => void
  clearCompareHeadphones: () => void
  saveComparison: (ids: string[], name: string, type: string) => void
  removeComparison: (index: number) => void
  clearAllSaved: () => void
  formatPrice: (priceInr: number, priceUsd: number) => string
}

const SpecWiseContext = createContext<SpecWiseContextType | undefined>(undefined)

export function SpecWiseProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<"INR" | "USD">("USD")
  const [savedLaptops, setSavedLaptops] = useState<string[]>([])
  const [savedPhones, setSavedPhones] = useState<string[]>([])
  const [savedHeadphones, setSavedHeadphones] = useState<string[]>([])
  const [compareLaptops, setCompareLaptops] = useState<string[]>([])
  const [comparePhones, setComparePhones] = useState<string[]>([])
  const [compareHeadphones, setCompareHeadphones] = useState<string[]>([])
  const [savedComparisons, setSavedComparisons] = useState<{ ids: string[]; name: string; date: string; type: string }[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    const storedCurrency = localStorage.getItem("specwise_currency") as "INR" | "USD" | null
    const storedLaptops = localStorage.getItem("specwise_saved_laptops")
    const storedPhones = localStorage.getItem("specwise_saved_phones")
    const storedHeadphones = localStorage.getItem("specwise_saved_headphones")
    const storedComparisons = localStorage.getItem("specwise_saved_comparisons")

    if (storedCurrency) setCurrencyState(storedCurrency)
    if (storedLaptops) setSavedLaptops(JSON.parse(storedLaptops))
    if (storedPhones) setSavedPhones(JSON.parse(storedPhones))
    if (storedHeadphones) setSavedHeadphones(JSON.parse(storedHeadphones))
    if (storedComparisons) setSavedComparisons(JSON.parse(storedComparisons))
    
    setIsHydrated(true)

    const handleStorage = (e: StorageEvent) => {
      if (!e.newValue) return
      
      switch (e.key) {
        case "specwise_currency":
          setCurrencyState(e.newValue as "INR" | "USD")
          break
        case "specwise_saved_laptops":
          setSavedLaptops(JSON.parse(e.newValue))
          break
        case "specwise_saved_phones":
          setSavedPhones(JSON.parse(e.newValue))
          break
        case "specwise_saved_headphones":
          setSavedHeadphones(JSON.parse(e.newValue))
          break
        case "specwise_saved_comparisons":
          setSavedComparisons(JSON.parse(e.newValue))
          break
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_currency", currency)
  }, [currency, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_saved_laptops", JSON.stringify(savedLaptops))
  }, [savedLaptops, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_saved_phones", JSON.stringify(savedPhones))
  }, [savedPhones, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_saved_headphones", JSON.stringify(savedHeadphones))
  }, [savedHeadphones, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem("specwise_saved_comparisons", JSON.stringify(savedComparisons))
  }, [savedComparisons, isHydrated])

  const setCurrency = useCallback((newCurrency: "INR" | "USD") => {
    setCurrencyState(newCurrency)
  }, [])

  const toggleSaveLaptop = useCallback((id: string) => {
    setSavedLaptops(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const toggleSavePhone = useCallback((id: string) => {
    setSavedPhones(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const toggleSaveHeadphone = useCallback((id: string) => {
    setSavedHeadphones(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }, [])

  const addToCompareLaptops = useCallback((id: string) => {
    setCompareLaptops(prev => {
      if (prev.includes(id) || prev.length >= 3) return prev
      return [...prev, id]
    })
  }, [])

  const removeFromCompareLaptops = useCallback((id: string) => {
    setCompareLaptops(prev => prev.filter(i => i !== id))
  }, [])

  const addToComparePhones = useCallback((id: string) => {
    setComparePhones(prev => {
      if (prev.includes(id) || prev.length >= 3) return prev
      return [...prev, id]
    })
  }, [])

  const removeFromComparePhones = useCallback((id: string) => {
    setComparePhones(prev => prev.filter(i => i !== id))
  }, [])

  const addToCompareHeadphones = useCallback((id: string) => {
    setCompareHeadphones(prev => {
      if (prev.includes(id) || prev.length >= 3) return prev
      return [...prev, id]
    })
  }, [])

  const removeFromCompareHeadphones = useCallback((id: string) => {
    setCompareHeadphones(prev => prev.filter(i => i !== id))
  }, [])

  const clearCompareLaptops = useCallback(() => setCompareLaptops([]), [])
  const clearComparePhones = useCallback(() => setComparePhones([]), [])
  const clearCompareHeadphones = useCallback(() => setCompareHeadphones([]), [])

  const saveComparison = useCallback((ids: string[], name: string, type: string) => {
    setSavedComparisons(prev => [
      ...prev,
      { ids, name, date: new Date().toISOString(), type }
    ])
  }, [])

  const removeComparison = useCallback((index: number) => {
    setSavedComparisons(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearAllSaved = useCallback(() => {
    setSavedLaptops([])
    setSavedPhones([])
    setSavedHeadphones([])
    setSavedComparisons([])
  }, [])

  const formatPrice = useCallback((priceInr: number, priceUsd: number) => {
    if (currency === "INR") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(priceInr)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(priceUsd)
  }, [currency])

  const value = useMemo(() => ({
    currency,
    setCurrency,
    savedLaptops,
    savedPhones,
    savedHeadphones,
    compareLaptops,
    comparePhones,
    compareHeadphones,
    savedComparisons,
    toggleSaveLaptop,
    toggleSavePhone,
    toggleSaveHeadphone,
    addToCompareLaptops,
    removeFromCompareLaptops,
    addToComparePhones,
    removeFromComparePhones,
    addToCompareHeadphones,
    removeFromCompareHeadphones,
    clearCompareLaptops,
    clearComparePhones,
    clearCompareHeadphones,
    saveComparison,
    removeComparison,
    clearAllSaved,
    formatPrice,
  }), [
    currency,
    setCurrency,
    savedLaptops,
    savedPhones,
    savedHeadphones,
    compareLaptops,
    comparePhones,
    compareHeadphones,
    savedComparisons,
    toggleSaveLaptop,
    toggleSavePhone,
    toggleSaveHeadphone,
    addToCompareLaptops,
    removeFromCompareLaptops,
    addToComparePhones,
    removeFromComparePhones,
    addToCompareHeadphones,
    removeFromCompareHeadphones,
    clearCompareLaptops,
    clearComparePhones,
    clearCompareHeadphones,
    saveComparison,
    removeComparison,
    clearAllSaved,
    formatPrice,
  ])

  return (
    <SpecWiseContext.Provider value={value}>
      {children}
    </SpecWiseContext.Provider>
  )
}

export function useSpecWise() {
  const context = useContext(SpecWiseContext)
  if (context === undefined) {
    throw new Error("useSpecWise must be used within a SpecWiseProvider")
  }
  return context
}

