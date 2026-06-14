// The proof manifest is generated in decoy-engine by
// scripts/gen_proof_manifest.py and synced here. To refresh it after an engine
// change, copy the regenerated file:
//   cp ../decoy-engine/docs/proof-manifest.json lib/data/proof-manifest.json
// It is imported as a typed module so any shape drift becomes a build error.
import manifestJson from "@/lib/data/proof-manifest.json"

export type SampleRecord = Record<string, string>

export interface HeroTable {
  name: string
  input: SampleRecord[]
  output: SampleRecord[]
}

export interface ProofHero {
  name: string
  disguise: string
  tables: HeroTable[]
  audit_log: SampleRecord[]
  invariants: string[]
}

export interface Capability {
  id: string
  kind: "mask" | "generate"
  title: string
  column: string
  config_yaml: string
  input: SampleRecord[]
  output: SampleRecord[]
  invariant: string
}

export interface Provider {
  name: string
  backend: string
  deterministic: boolean
  unique: boolean
}

export interface Benchmark {
  shape: string
  throughput: string
  measured_at: string
  note: string
  source: string
}

export interface ProofManifest {
  engine_version: string
  generated_at: string
  surface: { mask: number; generate: number; providers: number }
  hero: ProofHero
  capabilities: Capability[]
  providers: Provider[]
  generation_strategies: string[]
  benchmarks: Benchmark[]
}

export const proofManifest = manifestJson as unknown as ProofManifest

export function maskCapabilities(): Capability[] {
  return proofManifest.capabilities.filter((c) => c.kind === "mask")
}
