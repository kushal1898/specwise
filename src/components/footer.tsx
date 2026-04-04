import { Link } from "react-router-dom"
import { Laptop, Smartphone, Headphones } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-xl font-bold">SpecWise</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The best tech for your budget. Decided.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold">Categories</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/laptops" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Laptop className="h-4 w-4" />
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/phones" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Smartphone className="h-4 w-4" />
                  Phones
                </Link>
              </li>
              <li>
                <Link to="/headphones" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Headphones className="h-4 w-4" />
                  Headphones
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold">Resources</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/laptops/compare" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Compare Laptops
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Saved Items
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Why SpecWise */}
          <div>
            <h3 className="font-display font-semibold">Why SpecWise?</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-muted-foreground">Performance-First Reviews</li>
              <li className="text-sm text-muted-foreground">Value-Rated Products</li>
              <li className="text-sm text-muted-foreground">Data-Driven Comparisons</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SpecWise. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with precision for tech enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  )
}

