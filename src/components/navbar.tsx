"use client"

import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { Laptop, Smartphone, Headphones, Heart, Search, Menu, X, DollarSign, TrendingUp, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpecWise } from "@/lib/specwise-context"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import laptopsData from "@/data/laptops.json"
import phonesData from "@/data/phones.json"
import headphonesData from "@/data/headphones.json"

const navLinks = [
  { href: "/laptops", label: "Laptops", icon: Laptop },
  { href: "/phones", label: "Phones", icon: Smartphone },
  { href: "/headphones", label: "Headphones", icon: Headphones },
  { href: "/trending", label: "Trending", icon: TrendingUp },
]

export function Navbar() {
  const { pathname } = useLocation()
  const { currency, setCurrency, savedLaptops, savedPhones, savedHeadphones } = useSpecWise()
  const { user, setShowLoginModal, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const totalSaved = savedLaptops.length + savedPhones.length + savedHeadphones.length

  // Search across all products
  const searchResults = searchQuery.length > 1 ? [
    ...laptopsData
      .filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(l => ({ ...l, type: "laptop" as const, href: `/laptops/${l.id}` })),
    ...phonesData
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(p => ({ ...p, type: "phone" as const, href: `/phones/${p.id}` })),
    ...headphonesData
      .filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(h => ({ ...h, type: "headphone" as const, href: `/headphones/${h.id}` })),
  ].slice(0, 8) : []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/40 backdrop-blur-md transition-all duration-300 hover:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-display text-xl font-bold">SpecWise</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                pathname.startsWith(link.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-display">Search Products</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Search laptops, phones, headphones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-base"
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {searchResults.map((result) => (
                      <Link key={result.id}
                        to={result.href}
                        onClick={() => {
                          setSearchOpen(false)
                          setSearchQuery("")
                        }}
                        className="flex items-center gap-3 rounded-lg p-3 hover:bg-secondary"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          {result.type === "laptop" && <Laptop className="h-5 w-5 text-muted-foreground" />}
                          {result.type === "phone" && <Smartphone className="h-5 w-5 text-muted-foreground" />}
                          {result.type === "headphone" && <Headphones className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.name}</p>
                          <p className="text-xs text-muted-foreground">{result.brand} • {result.type}</p>
                        </div>
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          ('score' in result ? result.score : (result as any).overallScore) >= 80 ? "score-excellent" : ('score' in result ? result.score : (result as any).overallScore) >= 60 ? "score-good" : "score-average"
                        )}>
                          {'score' in result ? result.score : Math.round((result as any).overallScore * 10)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No products found for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* User Profile / Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoginModal(true)}
              className="flex gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
              <span className="sm:hidden">Sign in</span>
            </Button>
          )}

          {/* Currency Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="hidden gap-1.5 text-xs font-medium sm:flex"
          >
            <DollarSign className="h-4 w-4" />
            {currency}
          </Button>


          {/* Saved */}
          <Link to="/saved">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {totalSaved > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalSaved}
                </span>
              )}
              <span className="sr-only">Saved items</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="container mx-auto space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname.startsWith(link.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="px-4 pb-2">
                <Button
                  className="w-full justify-center gap-3 py-6 text-lg font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setShowLoginModal(true)
                  }}
                >
                  <User className="h-5 w-5" />
                  Sign In to SpecWise
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
                className="flex-1"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {currency === "INR" ? "Switch to USD" : "Switch to INR"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

