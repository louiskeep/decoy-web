import type { Provider } from "@/lib/proof"

export function ProviderTable({ providers }: { providers: Provider[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">{providers.length} synthetic providers</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/20 text-left text-xs font-medium text-muted-foreground">
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Backend</th>
              <th className="px-3 py-2">Deterministic</th>
              <th className="px-3 py-2">Unique</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.name} className="border-t border-border">
                <td className="px-3 py-1.5 font-mono text-xs">{p.name}</td>
                <td className="px-3 py-1.5 text-xs text-muted-foreground">{p.backend}</td>
                <td className="px-3 py-1.5 text-xs">{p.deterministic ? "yes" : "no"}</td>
                <td className="px-3 py-1.5 text-xs">{p.unique ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
