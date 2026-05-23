"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const terminalLines = [
  { type: "command", content: "$ decoy storm scan patients.csv --out scan.json" },
  { type: "output", content: "OK scanned patients.csv" },
  { type: "output", content: "  rows: 1,247  fields: 11" },
  { type: "output", content: "  detected: ssn, email, us_date, us_phone, us_zip" },
  { type: "output", content: "  saved: scan.json" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy forecast scan.json --out forecast.json" },
  { type: "output", content: "Top recommendation: HIPAA Safe Harbor" },
  { type: "output", content: "  wrote: forecast.json" },
  { type: "output", content: "  pipeline draft: forecast.pipeline.yaml" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy validate forecast.pipeline.yaml" },
  { type: "output", content: "OK config valid" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy run forecast.pipeline.yaml" },
  { type: "output", content: "Running mask..." },
  { type: "output", content: "  email -> faker.email" },
  { type: "output", content: "  ssn   -> hash" },
  { type: "output", content: "  dob   -> date_shift" },
  { type: "output", content: "  phone -> redact" },
  { type: "success", content: "OK wrote masked output" },
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
              A CLI workflow you can inspect.
            </h2>
            <p className="text-muted-foreground text-lg">
              Scan a file, review the recommendation, validate the generated YAML, and run the pipeline when the plan matches your data.
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
              <div className="p-4 font-mono text-sm min-h-[390px] overflow-x-auto code-block">
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
                Replay demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
