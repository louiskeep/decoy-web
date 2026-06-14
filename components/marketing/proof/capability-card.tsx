import type { Capability } from "@/lib/proof"
import { SampleTable } from "./sample-table"

export function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold">{capability.title}</h3>
        <code className="font-mono text-xs text-muted-foreground">{capability.id}</code>
      </header>

      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs leading-relaxed">
        <code>{capability.config_yaml}</code>
      </pre>

      <div className="grid gap-3 sm:grid-cols-2">
        <SampleTable rows={capability.input} highlight={capability.column} caption="Input" />
        <SampleTable rows={capability.output} highlight={capability.column} caption="Masked output" />
      </div>

      <p className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Guarantee: </span>
        {capability.invariant}
      </p>
    </article>
  )
}
