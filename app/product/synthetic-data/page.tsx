import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, BarChart3, GitBranch, Gauge } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Synthetic Data Generation - Decoy",
  description: "Generate synthetic rows and replacement columns with explicit faker, sequence, categorical, reference, and formula strategies.",
}

const features = [
  {
    icon: BarChart3,
    title: "Multiple generation strategies",
    description: "Use faker, sequence, categorical, formula, and reference-backed generation depending on the column.",
  },
  {
    icon: GitBranch,
    title: "Relationship modeling",
    description: "Generate foreign keys, self references, many-to-many junctions, composite keys, and primary-key checks when the relationship is modeled.",
  },
  {
    icon: Gauge,
    title: "From scratch or with source context",
    description: "Generate standalone tables, or fill/replace configured columns while preserving an upstream row count in graph workflows.",
  },
  {
    icon: Database,
    title: "Profile-informed setup",
    description: "Use STORM output and existing schemas as inputs to decide which columns should be generated, masked, referenced, or passed through.",
  },
]

const useCases = [
  {
    title: "Local development",
    description: "Create repeatable fixtures without checking sensitive source data into a development workflow.",
  },
  {
    title: "Demo environments",
    description: "Populate demos with data that looks plausible and is clearly not copied directly from customers.",
  },
  {
    title: "Pipeline testing",
    description: "Exercise transforms, joins, and validation rules with generated data that follows expected shapes.",
  },
  {
    title: "Relationship-heavy fixtures",
    description: "Model parent-child, self-reference, many-to-many, and composite-key cases explicitly instead of hand-editing CSVs.",
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
                  Generate data with declared structure
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Decoy can generate synthetic rows from explicit strategies, or replace selected columns in an existing pipeline. The useful part is the declaration: fields, distributions, formulas, and relationships are visible before the run.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/trial">Request a demo</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/docs">Read the docs</Link>
                  </Button>
                </div>
              </div>

              {/* Code example */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                  <span className="text-xs text-muted-foreground font-mono">generate.yaml</span>
                </div>
                <pre className="p-4 text-sm font-mono overflow-x-auto code-block">
                  <code className="text-muted-foreground">{`version: "1.0"
mode: generate
generator_settings:
  seed: 42
tables:
  - name: users
    rows: 1000
    columns:
      - name: user_id
        type: sequence
        start: 1
      - name: email
        type: faker
        faker_type: email
      - name: plan
        type: categorical
        categories: [free, pro, team]
        weights: [0.7, 0.2, 0.1]
      - name: account_code
        type: formula
        formula: "'ACCT-' + str(index)"`}</code>
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
                Where generation helps
              </h2>
              <p className="text-muted-foreground text-lg">
                Synthetic data is useful when copying and masking a source dataset is not the right fit.
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
