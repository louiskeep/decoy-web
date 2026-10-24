"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"

export function CTA() {
  const [copied, setCopied] = useState(false)
  const installCommand = "decoy demo"

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try the local workflow, then adapt the YAML.
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            The demo shows the CLI shape: a sample CSV scanned with STORM, masked through a V2 PipelineConfig, written back as masked CSV. Real pipelines should be reviewed against your data and policy before use.
          </p>

          {/* Install command */}
          <div className="max-w-md mx-auto mb-8">
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
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/docs">Read the docs</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/trial">Request a demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
