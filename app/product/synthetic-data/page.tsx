import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, Check, BarChart3, GitBranch, Gauge } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Synthetic Data Generation - Forge",
  description: "Generate realistic test datasets that preserve statistical properties and relationships. Scale from thousands to billions of rows.",
}

const features = [
  {
    icon: BarChart3,
    title: "Statistical Fidelity",
    description: "Preserve distributions, correlations, and patterns from your source data. Generated data looks real because it's statistically similar.",
  },
  {
    icon: GitBranch,
    title: "Referential Integrity",
    description: "Foreign keys, unique constraints, and check constraints are respected. Generated orders have valid user IDs.",
  },
  {
    icon: Gauge,
    title: "Scale Control",
    description: "Generate exactly the volume you need. 10x production, 1000 rows for unit tests, or billions for load testing.",
  },
  {
    icon: Database,
    title: "Schema Introspection",
    description: "Point Forge at your database and it auto-generates a YAML config with sensible defaults for each column type.",
  },
]

const useCases = [
  {
    title: "Dev/Test Environments",
    description: "Give developers realistic data without exposing production PII. Seed staging with millions of synthetic records.",
  },
  {
    title: "Load Testing",
    description: "Generate 10x or 100x your production volume to stress test your infrastructure before launch.",
  },
  {
    title: "AI/ML Training",
    description: "Create large synthetic datasets for training models when production data is sensitive or insufficient.",
  },
  {
    title: "Demo Environments",
    description: "Fill demo instances with realistic-looking data that's safe to show prospects and partners.",
  },
]

export default function SyntheticDataPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
                  <Database className="h-3 w-3" />
                  Synthetic Data
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Generate data that looks real
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Create test datasets from scratch that preserve the statistical properties of your production data. 
                  No PII, no compliance risk, unlimited scale.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/trial">Start free trial</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/docs/concepts/synthetic-data">Read the docs</Link>
                  </Button>
                </div>
              </div>

              {/* Code example */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <span className="text-xs text-muted-foreground font-mono">forge.yaml</span>
                </div>
                <pre className="p-4 text-sm font-mono overflow-x-auto code-block">
                  <code className="text-muted-foreground">{`# Generate synthetic data from schema
generate:
  - table: users
    rows: 100000
    columns:
      id: sequence
      email: faker.email
      name: faker.name
      created_at: timestamp_range
        start: 2023-01-01
        end: 2024-12-31
      plan: categorical
        values: [free, pro, enterprise]
        weights: [0.7, 0.25, 0.05]

  - table: orders
    rows: 500000
    columns:
      id: sequence
      user_id: foreign_key -> users.id
      amount: normal
        mean: 99.0
        std: 45.0
        min: 9.99
      status: categorical
        values: [pending, shipped, delivered]`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Use cases
              </h2>
              <p className="text-muted-foreground text-lg">
                Synthetic data solves problems that masked data can&apos;t.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <div key={useCase.title} className="rounded-lg border border-border bg-card p-6">
                  <h3 className="font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  )
}
