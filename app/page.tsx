import { Navigation } from "@/components/marketing/navigation"
import { Hero } from "@/components/marketing/hero"
import { OriginStory } from "@/components/marketing/origin-story"
import { Disguises } from "@/components/marketing/disguises"
import { Storm } from "@/components/marketing/storm"
import { TerminalDemo } from "@/components/marketing/terminal-demo"
import { Features } from "@/components/marketing/features"
import { Integrations } from "@/components/marketing/integrations"
import { SelfHosting } from "@/components/marketing/self-hosting"
import { Comparison } from "@/components/marketing/comparison"
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
        <Disguises />
        <Storm />
        <TerminalDemo />
        <Features />
        <Integrations />
        <SelfHosting />
        <Comparison />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
