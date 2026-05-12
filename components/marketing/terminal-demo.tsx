"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const terminalLines = [
  { type: "command", content: "$ decoy init --disguise hipaa" },
  { type: "output", content: "✓ Wrote decoy.yaml — HIPAA Disguise applied" },
  { type: "output", content: "  18 Safe Harbor identifiers covered out of the box" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy run decoy.yaml" },
  { type: "output", content: "► Connecting to prod-db.internal:5432..." },
  { type: "output", content: "✓ Connected · STORM scan starting" },
  { type: "output", content: "" },
  { type: "output", content: "► Masking patients table (1,247 rows)" },
  { type: "output", content: "  mrn          → fpe (format-preserving)" },
  { type: "output", content: "  ssn          → fpe + tokenize" },
  { type: "output", content: "  email        → faker.email (unique-preserving)" },
  { type: "output", content: "  dob          → date_shift (±15 days)" },
  { type: "output", content: "  phone        → faker.phone" },
  { type: "output", content: "  address      → faker.address (geo-aware)" },
  { type: "output", content: "" },
  { type: "output", content: "► Masking encounters table (8,429 rows)" },
  { type: "output", content: "  patient_id   → linked via referential integrity" },
  { type: "output", content: "" },
  { type: "output", content: "✓ HIPAA Safe Harbor identifiers neutralized" },
  { type: "output", content: "✓ Referential integrity preserved across 2 tables" },
  { type: "output", content: "" },
  { type: "success", content: "✓ Complete · 9,676 rows masked in 2.3s" },
  { type: "success", content: "  Output → staging-db.internal:5432" },
  { type: "success", content: "  Report → reports/2026-05-10-hipaa-run.pdf" },
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
              From install to filed Report in minutes
            </h2>
            <p className="text-muted-foreground text-lg">
              No configuration files to puzzle over. Pick a Disguise, run the CLI, get a masked dataset and a Report you can hand a compliance officer.
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
                    {line.content || " "}
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
