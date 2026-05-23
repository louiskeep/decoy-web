import Link from "next/link"
import { Radar, Sparkles, FileCheck, Lock, ArrowRight } from "lucide-react"

const steps = [
  {
    name: "STORM",
    title: "Profile the file.",
    description:
      "Reads a dataset, detects known field patterns, and records column-level statistics for review.",
    detail: [
      "PII / PHI / PCI detector signals",
      "Format and pattern inference",
      "Column distributions and top values",
      "Quasi-identifier and re-id indicators",
    ],
    icon: Radar,
  },
  {
    name: "FORECAST",
    title: "Draft a plan.",
    description:
      "Uses the STORM profile to recommend a Disguise and per-field masking strategies.",
    detail: [
      "Ranked Disguise recommendations",
      "Field-level Mask suggestions",
      "Risk flags and exceptions",
      "Editable pipeline draft",
    ],
    icon: Sparkles,
  },
  {
    name: "Report",
    title: "Record what ran.",
    description:
      "Captures the scan, recommendation, run metadata, and outputs as useful evidence for internal review.",
    detail: [
      "Run history in the platform",
      "HTML report export",
      "Manifest details where available",
      "Useful input to audit reviews",
    ],
    icon: FileCheck,
  },
]

export function Storm() {
  return (
    <section
      id="storm"
      className="py-20 md:py-28 border-t border-border scroll-mt-20"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            <Radar className="h-3 w-3" />
            STORM + FORECAST
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Profile first. Recommend second. Review before running.
          </h2>
          <p className="text-muted-foreground text-lg">
            Decoy's analysis loop turns an unfamiliar file into a concrete masking plan. It is designed to reduce manual setup, not replace engineering or compliance review.
          </p>
        </div>

        {/* 3-step flow */}
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.name}
              className="relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  0{i + 1}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-primary mb-1">
                  {step.name}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <ul className="space-y-2 text-sm">
                {step.detail.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Security anchor */}
        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">FORECAST works from the STORM profile.</h3>
              <p className="text-sm text-muted-foreground">
                FORECAST reads detector matches, field statistics, and profile metadata. It does not need row-level source data to produce a recommendation, and the CLI/platform runs where your data lives.
              </p>
            </div>
            <Link
              href="/security"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline whitespace-nowrap"
            >
              Security notes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
