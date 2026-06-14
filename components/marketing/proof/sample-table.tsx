import type { SampleRecord } from "@/lib/proof"
import { cn } from "@/lib/utils"

export function SampleTable({
  rows,
  highlight,
  caption,
}: {
  rows: SampleRecord[]
  highlight?: string
  caption?: string
}) {
  if (rows.length === 0) return null
  const columns = Object.keys(rows[0])
  return (
    <figure className="overflow-x-auto rounded-lg border border-border">
      {caption ? (
        <figcaption className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/20">
            {columns.map((c) => (
              <th
                key={c}
                className={cn(
                  "px-3 py-2 text-left font-mono text-xs font-medium text-muted-foreground",
                  c === highlight && "text-foreground",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {columns.map((c) => (
                <td
                  key={c}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 font-mono text-xs",
                    c === highlight && "bg-primary/5 font-medium text-foreground",
                  )}
                >
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
