// The proof manifest is generated in decoy-engine by
// scripts/gen_proof_manifest.py and synced here. To refresh it after an engine
// change, copy the regenerated file:
//   cp ../decoy-engine/docs/proof-manifest.json lib/data/proof-manifest.json
// It is parsed with a Zod schema at module load, so a missing or wrong-typed
// field fails the build with a clear error instead of surfacing as a runtime
// surprise. (Unknown extra keys are stripped, not rejected.)
import { z } from "zod"
import manifestJson from "@/lib/data/proof-manifest.json"

const sampleRecordSchema = z.record(z.string(), z.string())

const heroTableSchema = z.object({
  name: z.string(),
  input: z.array(sampleRecordSchema),
  output: z.array(sampleRecordSchema),
})

const proofHeroSchema = z.object({
  name: z.string(),
  disguise: z.string(),
  tables: z.array(heroTableSchema),
  audit_log: z.array(sampleRecordSchema),
  invariants: z.array(z.string()),
})

const capabilitySchema = z.object({
  id: z.string(),
  kind: z.enum(["mask", "generate"]),
  title: z.string(),
  column: z.string(),
  config_yaml: z.string(),
  input: z.array(sampleRecordSchema),
  output: z.array(sampleRecordSchema),
  invariant: z.string(),
})

const providerSchema = z.object({
  name: z.string(),
  backend: z.string(),
  deterministic: z.boolean(),
  unique: z.boolean(),
})

const benchmarkSchema = z.object({
  shape: z.string(),
  throughput: z.string(),
  measured_at: z.string(),
  note: z.string(),
  source: z.string(),
})

const proofManifestSchema = z.object({
  engine_version: z.string(),
  generated_at: z.string(),
  surface: z.object({
    mask: z.number(),
    generate: z.number(),
    providers: z.number(),
  }),
  hero: proofHeroSchema,
  capabilities: z.array(capabilitySchema),
  providers: z.array(providerSchema),
  generation_strategies: z.array(z.string()),
  benchmarks: z.array(benchmarkSchema),
})

export type SampleRecord = z.infer<typeof sampleRecordSchema>
export type HeroTable = z.infer<typeof heroTableSchema>
export type ProofHero = z.infer<typeof proofHeroSchema>
export type Capability = z.infer<typeof capabilitySchema>
export type Provider = z.infer<typeof providerSchema>
export type Benchmark = z.infer<typeof benchmarkSchema>
export type ProofManifest = z.infer<typeof proofManifestSchema>

function parseManifest(): ProofManifest {
  const result = proofManifestSchema.safeParse(manifestJson)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join(".") || "<root>"}: ${i.message}`)
      .join("\n")
    throw new Error(
      `Invalid proof manifest (lib/data/proof-manifest.json). ` +
        `Re-sync it from decoy-engine and check the schema in lib/proof.ts:\n${issues}`,
    )
  }
  // Capability ids must be unique so a page can look one up by id.
  const seen = new Set<string>()
  for (const cap of result.data.capabilities) {
    if (seen.has(cap.id)) {
      throw new Error(`Duplicate capability id in proof manifest: ${cap.id}`)
    }
    seen.add(cap.id)
  }
  return result.data
}

export const proofManifest: ProofManifest = parseManifest()

export function maskCapabilities(): Capability[] {
  return proofManifest.capabilities.filter((c) => c.kind === "mask")
}

/** Look up one capability by id (e.g. "mask.redact"); undefined if absent. */
export function capabilityById(id: string): Capability | undefined {
  return proofManifest.capabilities.find((c) => c.id === id)
}
