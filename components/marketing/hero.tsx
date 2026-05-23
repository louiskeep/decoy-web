"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Copy, Github, ShieldCheck } from "lucide-react"

export function Hero() {
  const [copied, setCopied] = useState(false)
  const installCommand = "decoy demo --ref"

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Local CLI + self-hosted platform</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Explicit YAML workflows</span>
          </div>

          {/* Headline */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              Useful test data,
              <span className="text-primary"> fewer raw-data risks.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground text-balance">
              Decoy helps teams profile files, mask sensitive fields, and generate synthetic rows with reviewable strategies, relationship rules, and self-hosted workflows.
            </p>
          </div>

          {/* CLI command - the centerpiece */}
          <div className="w-full max-w-md">
            <div className="group relative">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 font-mono text-sm">
                <span className="text-muted-foreground select-none">$</span>
                <span className="flex-1 text-foreground">{installCommand}</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Relationship-preserving CLI walkthrough after installation
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/docs">
                Read the docs
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="https://github.com/louiskeep/decoy" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>

          {/* Trust strip - factual capabilities, not certification claims. */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Local YAML validation and runs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              STORM profile + FORECAST recommendations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Relationship-aware masking rules
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Docker Compose self-hosting
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Disguise templates are starting points for review, not legal attestations.
          </p>
        </div>
      </div>
    </section>
  )
}
