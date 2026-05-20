import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import { CTA } from "@/components/marketing/cta"
import { Cpu, MemoryStick, Clock, ArrowRight, AlertCircle } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Performance - Decoy",
  description: "V1 canonical workflow benchmark numbers for Decoy. STORM scan, graph masking, and memory figures from the R6.11 baseline run.",
}

const baseline = {
  date: "2026-05-17",
  commit: "decoy-engine 0.1.0 / decoy-platform 0.1.0",
  rows: 10_000,
  inputKb: 451,
  outputKb: 1443,
  hardware: {
    cpu: "Intel Core i7-1265U (Intel64 Family 6 Model 154)",
    cores: "10 physical / 12 logical",
    ram: "32 GB",
    os: "Windows 10",
    python: "3.10.7",
  },
  timings: {
    fixtureGenerationMs: 24.83,
    stormScanMs: 389.62,
    graphMaskMs: 287.09,
    peakMemoryMb: 4.64,
  },
}

export default function PerformancePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                V1 Performance Benchmarks
              </h1>
              <p className="text-lg text-muted-foreground">
                Canonical workflow numbers from the R6.11 baseline run.
                These figures reflect development-machine performance against a
                10,000-row CSV fixture. They are not cloud-VM or production-server baselines.
              </p>
            </div>

            {/* Hardware disclosure */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 mb-10">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">Development machine numbers</p>
                  <p className="text-sm text-muted-foreground">
                    Benchmark ran on a Windows 10 laptop (Intel Core i7-1265U, 32 GB RAM).
                    Results on a Linux server or different hardware will differ.
                    A second baseline on a Linux host is scheduled before RC1 to establish
                    cross-machine variance. Until then, treat the numbers below as a
                    V1 floor, not a ceiling.
                  </p>
                </div>
              </div>
            </div>

            {/* Timing cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold">STORM Scan</h2>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">390 ms</div>
                <p className="text-sm text-muted-foreground">
                  Profile 10,000 rows across 5 columns (id, first_name, last_name, email, amount).
                  Detects field types, value distributions, and PII signals.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold">Graph Mask Run</h2>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">287 ms</div>
                <p className="text-sm text-muted-foreground">
                  End-to-end graph-mode pipeline: source.file &rarr; mask (SHA-256 hash on email +
                  last_name) &rarr; target.file. 10,000 rows, 461 KB input.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MemoryStick className="h-5 w-5" />
                  </div>
                  <h2 className="font-semibold">Peak Memory</h2>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">4.6 MB</div>
                <p className="text-sm text-muted-foreground">
                  Peak RSS memory for the engine process during the graph mask run.
                  The engine processes in streaming chunks; memory footprint stays
                  bounded for larger files.
                </p>
              </div>
            </div>

            {/* Hardware detail */}
            <div className="rounded-xl border border-border bg-card p-6 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cpu className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">Benchmark hardware</h2>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "CPU", value: baseline.hardware.cpu },
                  { label: "Cores", value: baseline.hardware.cores },
                  { label: "RAM", value: baseline.hardware.ram },
                  { label: "OS", value: baseline.hardware.os },
                  { label: "Python", value: baseline.hardware.python },
                  { label: "Run date", value: baseline.date },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs text-muted-foreground mb-1">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canonical workload */}
            <div className="rounded-xl border border-border bg-card p-6 mb-10">
              <h2 className="font-semibold mb-4">Canonical workload</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Rows", value: "10,000" },
                  { label: "Input size", value: "461 KB CSV" },
                  { label: "Output size", value: "1.4 MB CSV" },
                  { label: "Columns masked", value: "2 of 5" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs text-muted-foreground mb-1">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Workflow: generate fixture &rarr; STORM scan &rarr; graph-mode mask
                (SHA-256 hash on email and last_name columns) &rarr; target.file.
                Output determinism is verified via SHA-256 of the output file;
                identical engine version + same input produces identical output hash.
              </p>
            </div>

            {/* How we measure */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-4">How we measure</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Benchmarks run via <code className="font-mono text-xs bg-muted px-1 rounded">scripts/benchmark_canonical.py</code>.
                  Each run records hardware metadata, version strings, per-stage timings,
                  and a SHA-256 of the output file alongside the performance numbers.
                </p>
                <p>
                  The catastrophic-regression threshold (R6.11 release gate) flags any run
                  where STORM scan time, graph-run time, or peak memory exceeds 2x the prior
                  baseline. The threshold is intentionally loose for V1; tighter bounds land
                  once stable run history exists across multiple releases.
                </p>
                <p>
                  A second baseline run on a Linux host is required before RC1 freeze to
                  document cross-machine variance. Until that run lands, comparison against
                  these numbers requires matching the hardware disclosure above.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
                <Link
                  href="https://github.com/louiskeep/decoy-platform/blob/main/docs/product/benchmarks/2026-05-17-baseline.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Baseline JSON on GitHub <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com/louiskeep/decoy-platform/blob/main/docs/product/benchmarks/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Benchmark methodology <ArrowRight className="h-4 w-4" />
                </Link>
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
