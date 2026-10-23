import {
  capabilityById,
  proofManifest,
  type Capability,
  type SampleRecord,
} from "@/lib/proof"
import { cn } from "@/lib/utils"

// Which output cells differ from the matching input cell. Compared per row and
// per column so the highlight marks the values that actually changed, not the
// whole masked column.
function changedCells(input: SampleRecord[], output: SampleRecord[]): boolean[][] {
  return output.map((outRow, i) => {
    const inRow = input[i] ?? {}
    return Object.keys(outRow).map((col) => inRow[col] !== outRow[col])
  })
}

function DiffTable({
  rows,
  caption,
  changed,
}: {
  rows: SampleRecord[]
  caption: string
  changed?: boolean[][]
}) {
  if (rows.length === 0) return null
  const columns = Object.keys(rows[0])
  return (
    <figure className="overflow-x-auto rounded-lg border border-border">
      <figcaption className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
        {caption}
      </figcaption>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/20">
            {columns.map((c) => (
              <th
                key={c}
                className="px-3 py-2 text-left font-mono text-xs font-medium text-muted-foreground"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {columns.map((c, j) => {
                const isChanged = changed?.[i]?.[j] ?? false
                return (
                  <td
                    key={c}
                    className={cn(
                      "whitespace-nowrap px-3 py-1.5 font-mono text-xs",
                      isChanged && "bg-primary/10 font-medium text-foreground",
                    )}
                  >
                    {row[c]}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

// Renders a strategy's real input and masked output side by side, straight from
// the generated proof manifest. The id is a capability id, e.g. "mask.redact".
export function StrategyExample({ id }: { id: string }) {
  const capability: Capability | undefined = capabilityById(id)

  if (!capability) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        No proof example is available for <code className="font-mono">{id}</code> in the
        current manifest.
      </div>
    )
  }

  const changed = changedCells(capability.input, capability.output)

  return (
    <figure className="not-prose my-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs leading-relaxed">
        <code>{capability.config_yaml}</code>
      </pre>

      <div className="grid gap-3 sm:grid-cols-2">
        <DiffTable rows={capability.input} caption="Input" />
        <DiffTable rows={capability.output} caption="Masked output" changed={changed} />
      </div>

      <p className="border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Guarantee: </span>
        {capability.invariant}
      </p>

      <figcaption className="text-xs text-muted-foreground">
        Generated from the Decoy proof manifest, engine v{proofManifest.engine_version} (
        {proofManifest.generated_at}). Highlighted cells are the values this strategy
        changed.
      </figcaption>
    </figure>
  )
}
