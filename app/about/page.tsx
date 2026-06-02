import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - Decoy",
  description: "Why Decoy focuses on reviewable masking, generation, and self-hosted test-data workflows.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Practical test-data tooling for teams that need to see the decisions
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Decoy is built around explicit YAML, deterministic strategies, relationship rules, and self-hosted workflows.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg">
                  Most teams do not need a slogan about instant privacy. They need a workflow that lets engineers and reviewers understand what will happen to each field before data is copied into development, QA, demos, or CI.
                </p>

                <p>
                  Decoy started from that need. Existing tools often felt either too heavy for local development or too implicit for policy review. We wanted something that could run from the command line, produce reviewable YAML, and still grow into a shared platform when a team needs schedules, reports, users, and run history.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">What Decoy focuses on</h2>

                <p>
                  Decoy is a masking and synthetic-generation toolkit. It profiles files with STORM, ships bundled Disguise templates as starting points, runs explicit masking/generation pipelines, and supports relationship intent where joins matter.
                </p>

                <p>
                  That means the product talks about concrete capabilities: hash, faker, redaction, date shifting, FPE, bucketization, reference values, formulas, generated rows, lock chains, foreign keys, self references, many-to-many relationships, and primary-key checks.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">What Decoy does not pretend</h2>

                <p>
                  Decoy does not make a dataset automatically compliant. It is not a legal attestation, a certified compliance program, or a substitute for a privacy review. Disguises are starting templates, not finished compliance products.
                </p>

                <p>
                  The point is to make the work more repeatable and easier to review, not to remove the need for judgment.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">Principles</h2>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Local first where possible</div>
                    <p className="text-sm">
                      The CLI handles local development, YAML validation, STORM scans, demos, templates, and CI checks.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Self-hosted for team workflows</div>
                    <p className="text-sm">
                      The paid platform is deployed by the customer. It is meant for shared files, pipelines, jobs, reports, users, runtime secrets, and governance workflows.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Explicit over magical</div>
                    <p className="text-sm">
                      Strategies, relationships, keys, and known limits should be visible. Teams should be able to explain why each field was masked or generated the way it was.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Clear boundaries</div>
                    <p className="text-sm">
                      Decoy V1 is tooling. Customers retain compliance ownership, and release-limited surfaces are documented rather than hidden behind vague claims.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">Where it is going</h2>

                <p>
                  The near-term direction is straightforward: better docs, more runnable examples, clearer screenshots and demos, generated references, and tighter public claims that stay connected to shipped behavior.
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
