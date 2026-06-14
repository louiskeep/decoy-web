import type { Capability } from "@/lib/proof"
import { CapabilityCard } from "./capability-card"

export function CapabilityGrid({ capabilities }: { capabilities: Capability[] }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold">Every strategy, proven</h2>
      <div className="grid gap-5 lg:grid-cols-2">
        {capabilities.map((c) => (
          <CapabilityCard key={c.id} capability={c} />
        ))}
      </div>
    </section>
  )
}
