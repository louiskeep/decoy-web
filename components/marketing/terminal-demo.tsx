"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const terminalLines = [
  { type: "command", content: "$ decoy storm scan patients.csv" },
  { type: "output", content: "✓ Scanned patients.csv — 1,247 rows, 11 columns" },
  { type: "output", content: "  Detected: SSN, email, DOB, phone, address" },
  { type: "output", content: "  Saved: scan.json" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy forecast scan.json" },
  { type: "output", content: "► Top match: HIPAA Safe Harbor (score 0.96)" },
  { type: "output", content: "  18 Safe Harbor identifiers covered out of the box" },
  { type: "output", content: "  Wrote: decoy.yaml" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy run decoy.yaml" },
  { type: "output", content: "► Reading patients.csv (1,247 rows)" },
  { type: "output", content: "✓ Source loaded · masking starting" },
  { type: "output", content: "" },
  { type: "output", content: "► Masking patients (1,247 rows)" },
  { type: "output", content: "  mrn          → fpe (format-preserving)" },
  { type: "output", content: "  ssn          → fpe" },
  { type: "output", content: "  email        → faker.email (unique-preserving)" },
  { type: "output", content: "  dob          → date_shift (±15 days)" },
  { type: "output", content: "  phone        → faker.phone" },
  { type: "output", content: "  address      → faker.address (geo-aware)" },
  { type: "output", content: "" },
  { type: "output", content: "✓ HIPAA Safe Harbor identifiers neutralized" },
  { type: "output", content: "✓ Deterministic seed preserves cross-file joins" },
  { type: "output", content: "" },
  { type: "success", content: "✓ Complete · 1,247 rows masked in 0.4s" },
  { type: "success", content: "  Output → patients_masked.csv" },
]

export function TerminalDemo() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
      }, 150)
      return () => clearTimeout(timeout)
    }
  }, [visibleLines])

  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Section header */}
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From install to masked output in minutes
            </h2>
            <p className="text-muted-foreground text-lg">
              No configuration files to puzzle over. STORM finds the sensitive fields, FORECAST recommends the right Disguise, and you run it.
            </p>
          </div>

          {/* Terminal window */}
          <div className="w-full max-w-3xl">
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  terminal
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-4 font-mono text-sm min-h-[460px] overflow-x-auto code-block">
                {terminalLines.slice(0, visibleLines).map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "whitespace-pre",
                      line.type === "command" && "text-foreground font-medium",
                      line.type === "output" && "text-muted-foreground",
                      line.type === "success" && "text-primary"
                    )}
                  >
                    {line.content || " "}
                  </div>
                ))}
                {visibleLines < terminalLines.length && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
                )}
              </div>
            </div>

            {/* Replay button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleLines(0)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ↻ Replay demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
