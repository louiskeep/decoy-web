import { Navigation } from "@/components/marketing/navigation"
import { Hero } from "@/components/marketing/hero"
import { OriginStory } from "@/components/marketing/origin-story"
import { TerminalDemo } from "@/components/marketing/terminal-demo"
import { Features } from "@/components/marketing/features"
import { Comparison } from "@/components/marketing/comparison"
import { Integrations } from "@/components/marketing/integrations"
import { SelfHosting } from "@/components/marketing/self-hosting"
import { Pricing } from "@/components/marketing/pricing"
import { FAQ } from "@/components/marketing/faq"
import { CTA } from "@/components/marketing/cta"
import { Footer } from "@/components/marketing/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <OriginStory />
        <TerminalDemo />
        <Features />
        <Comparison />
        <Integrations />
        <SelfHosting />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
