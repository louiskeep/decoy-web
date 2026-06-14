import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { ProofHero } from "@/components/marketing/proof/proof-hero"
import { CapabilityGrid } from "@/components/marketing/proof/capability-grid"
import { ProviderTable } from "@/components/marketing/proof/provider-table"
import { BenchmarkStrip } from "@/components/marketing/proof/benchmark-strip"
import { proofManifest, maskCapabilities } from "@/lib/proof"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Proof - Decoy",
  description:
    "Every capability shown here is generated from the engine's own test runs and registries. Before and after samples, configs, guarantees, and dated benchmarks.",
}

export default function ProofPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-6 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">Proof, not promises</h1>
          <p className="max-w-2xl text-muted-foreground">
            Nothing on this page is hand-written. The engine runs over real data, asserts what it
            guarantees, and emits these samples. Generated from engine {proofManifest.engine_version},
            last refreshed {proofManifest.generated_at}.
          </p>
        </header>

        <ProofHero hero={proofManifest.hero} />
        <CapabilityGrid capabilities={maskCapabilities()} />
        <ProviderTable providers={proofManifest.providers} />
        <BenchmarkStrip benchmarks={proofManifest.benchmarks} />

        <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/20 p-6">
          <h2 className="text-xl font-semibold">Reproduce it yourself</h2>
          <p className="text-sm text-muted-foreground">
            The hero pipeline above is runnable end to end from the engine repo:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-background p-3 text-xs">
            <code>python examples/runnable_demo.py</code>
          </pre>
        </section>
      </main>
      <CTA />
      <Footer />
    </div>
  )
}
