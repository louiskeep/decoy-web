"use client"

import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { useState } from "react"

const demoIncludes = [
  "30-minute live walkthrough of the canonical Web UI workflow",
  "Upload -> STORM scan -> Disguise template -> reviewed pipeline -> masked output",
  "Q&A on V1 packaging, deployment, security model, and limits",
  "Pricing + pilot scoping conversation",
  "CLI workflow you can keep experimenting with afterward",
]

export default function RequestDemoPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this routes to sales.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main>
          <section className="py-20 md:py-32">
            <div className="container mx-auto max-w-lg px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Thanks - we&apos;ll be in touch.</h1>
              <p className="text-muted-foreground mb-8">
                Sales will reach out to <strong className="text-foreground">{email}</strong> within one business day to schedule the demo.
              </p>
              <div className="rounded-lg border border-border bg-card p-4 text-left">
                <div className="text-sm font-medium mb-2">While you wait:</div>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li>1. Install the CLI from the current release channel.</li>
                  <li>2. Try <code className="font-mono">decoy demo</code> for a 30-second end-to-end walkthrough</li>
                  <li>3. Read the docs at <a href="/docs" className="text-primary hover:underline">/docs</a></li>
                </ol>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left side - form */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Join the Web UI waitlist
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Self-hosted Web UI for teams. Pre-release. We&apos;ll reach out when the early-access window opens with a live walkthrough of the workflow, deployment options, and pricing.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Acme Inc."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Request demo
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">Terms</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              </div>

              {/* Right side - what's in the demo */}
              <div className="lg:pl-8">
                <div className="rounded-xl border border-border bg-card p-8">
                  <h2 className="text-xl font-semibold mb-6">
                    What the demo covers
                  </h2>
                  <ul className="space-y-4">
                    {demoIncludes.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        <strong className="text-foreground">Pricing:</strong>
                      </p>
                      <p>
                        $499/month per Web UI instance, billed annually. The CLI is available
                        separately for local workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
