"use client"

import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import { useState } from "react"

const trialFeatures = [
  "Full Business tier access",
  "14 days, no credit card required",
  "Web UI & visual pipeline builder",
  "Scheduled runs & orchestration",
  "Team access for up to 5 users",
  "Audit logs & compliance reports",
  "Priority email support",
]

export default function TrialPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would create the trial account
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
              <h1 className="text-3xl font-bold mb-4">Check your email</h1>
              <p className="text-muted-foreground mb-8">
                We&apos;ve sent login instructions to <strong className="text-foreground">{email}</strong>. 
                Your 14-day Business trial starts now.
              </p>
              <div className="rounded-lg border border-border bg-card p-4 text-left">
                <div className="text-sm font-medium mb-2">Next steps:</div>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li>1. Check your email for the login link</li>
                  <li>2. Access the Business dashboard at app.decoy.dev</li>
                  <li>3. Run <code className="bg-muted px-1 rounded font-mono">decoy login</code> to connect your CLI</li>
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
                  Start your free trial
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  14 days of full Business tier access. No credit card required.
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
                    Start free trial
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By signing up, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">Terms</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </form>
              </div>

              {/* Right side - features */}
              <div className="lg:pl-8">
                <div className="rounded-xl border border-border bg-card p-8">
                  <h2 className="text-xl font-semibold mb-6">
                    What&apos;s included in your trial
                  </h2>
                  <ul className="space-y-4">
                    {trialFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        <strong className="text-foreground">After your trial:</strong>
                      </p>
                      <p>
                        Continue with Business ($499/mo) or downgrade to the free CLI with no data loss. 
                        Your pipelines work either way.
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
