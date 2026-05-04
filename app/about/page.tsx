import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - Decoy",
  description: "We got quoted $40K to mask 3 tables. So we built this. The story behind Decoy.",
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
              We got quoted $40K to mask 3 tables
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-12">
              So we built this.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg">
                  It was 2023. We were a 30-person fintech startup preparing for a SOC 2 audit. 
                  The auditor asked a simple question: &quot;How do you ensure developers don&apos;t have access to production PII?&quot;
                </p>

                <p>
                  We didn&apos;t have a great answer. Our staging database was a copy of production, 
                  with real customer data. Every engineer could see real Social Security numbers, 
                  real bank accounts, real addresses. We&apos;d just... never thought about it.
                </p>

                <p>
                  So we went shopping for solutions.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">The enterprise tax</h2>

                <p>
                  Tonic quoted us $35,000/year. Delphix wanted a six-figure contract and a 12-week 
                  implementation. Informatica&apos;s sales team couldn&apos;t even give us a number without 
                  a &quot;discovery call&quot; and a &quot;solution architect engagement.&quot;
                </p>

                <p>
                  We had three tables we needed to mask. Three. And we were looking at $40K minimum 
                  just to make our staging database safe.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">The open source wasteland</h2>

                <p>
                  Surely there was an open-source tool? We found a few. Most were abandoned 
                  (last commit: 3 years ago). The active ones required a PhD in data engineering 
                  to configure. One literally required you to write Java to define transforms.
                </p>

                <p>
                  We wanted something that worked like modern dev tools: install with pip, 
                  configure with YAML, run from the command line. It didn&apos;t exist.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">So we built it</h2>

                <p>
                  We wrote a Python CLI that could mask our three tables in 5 minutes. 
                  Then we added more transforms. Then more connectors. Then we realized 
                  other teams had the same problem.
                </p>

                <p>
                  Decoy is what we wished existed: a free CLI for engineers who just need to 
                  mask data, and a paid Business tier for teams who need scheduling, audit logs, 
                  and collaboration. No consultants. No six-month implementations. No per-row pricing 
                  that punishes you for having customers.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">Our principles</h2>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">The CLI is free forever</div>
                    <p className="text-sm">
                      Single engineers should never pay for test data tooling. The CLI does everything 
                      you need for local development and CI pipelines.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Your data never leaves your network</div>
                    <p className="text-sm">
                      Decoy runs on your infrastructure. We never see your data. The only external call 
                      is optional license validation, which sends zero payload data.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Flat, predictable pricing</div>
                    <p className="text-sm">
                      No per-row fees. No metered billing. No surprises. You know what you&apos;ll pay 
                      before you sign up.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="font-medium text-foreground mb-1">Source-available code</div>
                    <p className="text-sm">
                      The CLI is published under the Business Source License. You can read every line 
                      of code that touches your data. Security teams love this.
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-foreground mt-12 mb-4">The future</h2>

                <p>
                  We&apos;re building the tool we wish we&apos;d had. If you&apos;ve ever been quoted five figures 
                  for basic data masking, or spent weeks configuring an enterprise tool that should 
                  have taken hours, Decoy is for you.
                </p>

                <p>
                  Install it. Run the demo. If it doesn&apos;t work for you, tell us why on GitHub. 
                  We&apos;re listening.
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
