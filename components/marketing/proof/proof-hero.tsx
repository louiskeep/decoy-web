import type { ProofHero as ProofHeroData } from "@/lib/proof"
import { SampleTable } from "./sample-table"

export function ProofHero({ hero }: { hero: ProofHeroData }) {
  const members = hero.tables.find((t) => t.name === "members") ?? hero.tables[0]
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {hero.disguise} disguise
        </span>
        <h2 className="text-2xl font-semibold">{hero.name}</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A real multi-table run: foreign keys stay joinable, identifiers keep their shape, and the
          audit log is generated from scratch. Every row below is produced by the engine, not written by hand.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SampleTable rows={members.input} caption={`${members.name}: source`} />
        <SampleTable rows={members.output} caption={`${members.name}: masked`} />
      </div>

      <SampleTable rows={hero.audit_log} caption="audit_log: generated" />

      <ul className="flex flex-col gap-2">
        {hero.invariants.map((inv) => (
          <li key={inv} className="flex gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="text-primary">✓</span>
            {inv}
          </li>
        ))}
      </ul>
    </section>
  )
}
