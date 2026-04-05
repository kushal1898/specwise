import { HeroSection } from "@/components/home/hero-section"
import { CategoryCards } from "@/components/home/category-cards"
import { TopPicks } from "@/components/home/top-picks"
import { WhySpecWise } from "@/components/home/why-specwise"
import { RecentlyReviewed } from "@/components/home/recently-reviewed"
import { Recommendations } from "@/components/home/recommendations"
import { LiveTechDeals } from "@/components/home/live-tech-deals"
import { GlassFooter } from "@/components/home/glass-footer"

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <Recommendations />
      <TopPicks />
      <LiveTechDeals />
      <WhySpecWise />
      <RecentlyReviewed />
      <GlassFooter />
    </>
  )
}

