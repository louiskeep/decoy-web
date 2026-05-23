import { notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { getDisguise, DISGUISE_IDS } from "@/lib/disguises"
import type { Metadata } from "next"

export function generateStaticParams() {
  return DISGUISE_IDS.map((id) => ({ id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const disguise = getDisguise(id)
  if (!disguise) return {}
  return {
    title: `${disguise.name} - Decoy`,
    description: disguise.metaDescription,
    openGraph: {
      title: `${disguise.name} - Decoy`,
      description: disguise.metaDescription,
    },
  }
}

export default async function DisguisePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const disguise = getDisguise(id)
  if (!disguise) notFound()

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-24 border-b border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <Link
              href="/disguises"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <span>&lt;-</span> All Disguises
            </Link>
            <div className="text-sm font-medium text-primary uppercase tracking-wide mb-2">
              {disguise.regulation}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{disguise.name}</h1>
            <p className="text-base text-muted-foreground font-mono">{disguise.citation}</p>
          </div>
        </section>

        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 space-y-14">

          {/* Who it's for */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Who this template is for</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-medium text-primary mb-1">Typical user</div>
              <div className="text-lg font-semibold mb-3">{disguise.primaryBuyer}</div>
              <p className="text-muted-foreground">{disguise.summary}</p>
            </div>
          </section>

          {/* What it includes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              What the template includes
              <span className="ml-3 text-base font-normal text-muted-foreground">
                {disguise.identifiers.length} field patterns
              </span>
            </h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Field pattern</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Detector</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Default strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {disguise.identifiers.map((id, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{id.label}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">
                        {id.detector ?? <span className="italic">name-hint</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{id.strategy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* The YAML */}
          <section>
            <h2 className="text-2xl font-bold mb-2">The template YAML</h2>
            <p className="text-muted-foreground mb-4">
              Inspect the bundled template before use. In the CLI, start with{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                decoy templates show {disguise.id}
              </code>{" "}
              or scaffold an editable file with{" "}
              <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                decoy init --preset {disguise.id}
              </code>.
            </p>
            <div className="rounded-xl border border-border bg-muted/30 overflow-x-auto">
              <pre className="p-5 text-xs font-mono text-foreground leading-relaxed">
                <code>{disguise.yamlSample}</code>
              </pre>
            </div>
          </section>

          {/* Sample input -> output */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Illustrative output</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Column</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Input value</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Masked value</th>
                  </tr>
                </thead>
                <tbody>
                  {disguise.sampleRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.column}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.input}</td>
                      <td className="px-4 py-3 font-mono text-xs text-primary">{row.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sample data is static and illustrative. Deterministic strategies require consistent keying to reproduce the same output across runs.
            </p>
          </section>

          {/* Regulation citation */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Regulation reference</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-lg font-semibold mb-1">{disguise.regulation}</div>
              <div className="font-mono text-sm text-primary">{disguise.citation}</div>
            </div>
          </section>

          {/* Honesty section */}
          <section>
            <h2 className="text-2xl font-bold mb-2">What this template does not do</h2>
            <p className="text-muted-foreground mb-4">
              Review these boundaries before treating a template as part of a compliance workflow.
            </p>
            <ul className="space-y-3">
              {disguise.honesty.map((item, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick start */}
          <section className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Try the template locally</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Scaffold an editable pipeline, validate it, then run it once the input/output paths and field choices match your data.
            </p>
            <div className="space-y-3 max-w-md mx-auto text-left font-mono text-sm mb-6">
              <div className="flex gap-2">
                <span className="text-primary select-none">$</span>
                <span>decoy init --preset {disguise.id} --out {disguise.id}_pipeline.yaml</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary select-none">$</span>
                <span>decoy validate {disguise.id}_pipeline.yaml</span>
              </div>
              <div className="flex gap-2">
                <span className="text-primary select-none">$</span>
                <span>decoy run {disguise.id}_pipeline.yaml</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Read the docs
              </Link>
              <Link
                href="/disguises"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                All Disguises
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
