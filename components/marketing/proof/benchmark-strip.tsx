import type { Benchmark } from "@/lib/proof"

export function BenchmarkStrip({ benchmarks }: { benchmarks: Benchmark[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">Measured throughput</h2>
      {benchmarks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No current benchmark on record for this engine release. Numbers are published only when a
          dated calibration run exists.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benchmarks.map((b) => (
            <div key={`${b.shape}-${b.measured_at}`} className="rounded-xl border border-border p-4">
              <div className="text-lg font-semibold">{b.throughput}</div>
              <div className="text-sm text-muted-foreground">{b.shape}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Last measured {b.measured_at}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{b.note}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
