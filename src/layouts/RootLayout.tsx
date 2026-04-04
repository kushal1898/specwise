import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WebGLFluidBackground } from "@/components/webgl-fluid-background"
import { PageViewTracker } from "@/components/page-view-tracker"

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <WebGLFluidBackground />
      <PageViewTracker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

