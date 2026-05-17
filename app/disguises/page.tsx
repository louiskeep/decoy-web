import Link from "next/link"
import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { DISGUISES } from "@/lib/disguises"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compliance Disguises - Decoy",
  description:
    "8 regulation-aware data masking bundles: HIPAA, PCI DSS, GLBA, GDPR, CCPA, FERPA, SOX, and a generic default. " +
    "One YAML file per regulation. Free CLI, self-hosted.",
  openGraph: {
    title: "Compliance Disguises - Decoy",
    description:
      "8 pre-built masking policies for HIPAA, PCI, GLBA, GDPR, CCPA, FERPA, SOX. Apply a Disguise and get a masking run report.",
  },
}

export default function DisguisesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
              8 regulation bundles shipped
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Compliance Disguises
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Each Disguise is a named, regulation-aware field-list template. STORM scans your data;
              FORECAST recommends the right one. Apply it with one line of YAML.
            </p>
            <div className="flex items-center justify-center gap-3 font-mono text-sm text-muted-foreground bg-muted/30 border border-border rounded-lg px-4 py-3 max-w-xs mx-auto">
              <span className="text-primary select-none">$</span>
              <span>decoy run --disguise hipaa</span>
            </div>
          </div>
        </section>

        {/* Disguise grid */}
        <section className="pb-20 md:pb-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DISGUISES.map((disguise) => (
                <Link
                  key={disguise.id}
                  href={`/disguises/${disguise.id}`}
                  className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                        {disguise.regulation}
                      </div>
                      <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {disguise.name}
                      </h2>
                    </div>
                    <div className="flex-shrink-0 mt-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
                      {disguise.identifiers.length} fields
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {disguise.primaryBuyer}
                  </p>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    Fires on: {disguise.triggerDescription.split('—')[0].trim()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-2xl font-bold text-center mb-12">How Disguises work</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">STORM scans</h3>
                <p className="text-sm text-muted-foreground">
                  Run <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">decoy scan</code> on your tables.
                  STORM profiles every column and detects SSNs, emails, PANs, IBANs, and 18 more PII types.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">FORECAST recommends</h3>
                <p className="text-sm text-muted-foreground">
                  FORECAST reads the scan result and recommends the most appropriate Disguise,
                  ranked by how well the detection signals match each regulation.
                </p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">Apply and report</h3>
                <p className="text-sm text-muted-foreground">
                  Apply the Disguise with one YAML line. Each run produces a masking run report
                  showing what was masked, with which strategy, under which regulation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  )
}
