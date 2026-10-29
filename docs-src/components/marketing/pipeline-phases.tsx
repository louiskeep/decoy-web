import Link from "next/link"
import { Radar, Sparkles, FileCheck, Lock, ArrowRight } from "lucide-react"

const steps = [
  {
    name: "Pre-scan",
    title: "Profile and detect candidates.",
    description:
      "Reads a dataset, records column-level statistics, and flags candidate sensitive fields as suggestions for you to review. A pre-scan never shows that an output is safe.",
    detail: [
      "PII / PHI / PCI detector signals (candidates, not classifications)",
      "Format and pattern inference",
      "Column distributions and top values",
      "Quasi-identifier and re-id indicators",
    ],
    icon: Radar,
  },
  {
    name: "Transform",
    title: "Apply the reviewed rules.",
    description:
      "Applies the masking and generation rules in your reviewed YAML to produce the output. Start from a bundled Disguise template, then edit per-column strategies to fit your data.",
    detail: [
      "5 bundled templates (HIPAA, PCI, GDPR, generate, minimal)",
      "13 mask strategies + 5 generate column types",
      "Reviewable YAML, not a black box",
      "Per-column strategy overrides",
    ],
    icon: Sparkles,
  },
  {
    name: "Post-scan",
    title: "Check what came out.",
    description:
      "Separate, report-only checks on the output: integrity (residual PII, foreign keys, policy) and measured distribution fidelity. Integrity runs in a pipeline only when you enable post_scan.integrity; fidelity is a separate check you request, such as decoy post-scan fidelity.",
    detail: [
      "Integrity findings: residual PII, FK parity, policy",
      "Fidelity: a measurement of similarity, not a privacy guarantee",
      "Each result is its own claim; none is a release decision",
      "Run history and evidence in the platform",
    ],
    icon: FileCheck,
  },
]

export function PipelinePhases() {
  return (
    <section
      id="pipeline-phases"
      className="py-20 md:py-28 border-t border-border scroll-mt-20"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            <Radar className="h-3 w-3" />
            Pre-scan, Transform, Post-scan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Pre-scan. Transform. Post-scan.
          </h2>
          <p className="text-muted-foreground text-lg">
            Decoy compiles reviewed data rules into a repeatable pipeline. Pre-scan profiles the input and surfaces candidate sensitive fields, Transform applies the masking or generation you reviewed, and Post-scan checks the output for supported properties. Each phase records its own scope and limits. Detection candidates, measured fidelity, integrity findings, and a release decision are different claims, and this is designed to reduce manual setup, not replace engineering or compliance review.
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
              <h3 className="text-base font-semibold mb-1">Data stays where it lives.</h3>
              <p className="text-sm text-muted-foreground">
                Pre-scan profiles run locally against your file; Disguise templates ship in the engine and pick by name; masking runs against the local data path your YAML declares. Nothing is uploaded to a Decoy-operated service.
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
