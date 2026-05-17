import { Navigation } from "@/components/marketing/navigation"
import { Pricing } from "@/components/marketing/pricing"
import { Comparison } from "@/components/marketing/comparison"
import { FAQ } from "@/components/marketing/faq"
import { CTA } from "@/components/marketing/cta"
import { Footer } from "@/components/marketing/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - Decoy",
  description: "Simple, predictable pricing for data masking and synthetic data generation. Free CLI forever, paid self-hosted Web UI at $499/month per instance, billed annually.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Simple, predictable pricing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              No per-row fees. No surprise bills. No six-figure quotes from consultants.
            </p>
          </div>
        </section>
        <Pricing />
        <Comparison />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
