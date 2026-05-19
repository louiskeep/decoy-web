import { Shield, Database, Sparkles, Link2 } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Data Masking",
    description: "Create PII-safe copies of production data for dev and test environments.",
    code: `# decoy.yaml
masks:
  - column: email
    transform: faker.email
    preserve_uniqueness: true

  - column: ssn
    transform: format_preserving_encryption
    seed: \${MASK_SEED}`,
  },
  {
    icon: Database,
    title: "Synthetic Data",
    description: "Generate realistic test datasets that preserve statistical properties.",
    code: `# decoy.yaml
mode: generate
generator_settings:
  seed: 42
  output_directory: data/generated
tables:
  - name: orders
    rows: 100000
    columns:
      - name: order_id
        type: sequence
        start: 1
      - name: status
        type: categorical
        categories: [pending, shipped, delivered]`,
  },
  {
    icon: Sparkles,
    title: "Field-level Masks",
    description: "Faker, FPE, deterministic hashing, date shifting, conditional logic, and custom Python — the primitives every Disguise is built from.",
    code: `# masks composed inside a Disguise
transforms:
  - faker.email      # realistic emails
  - faker.phone      # locale-aware phones
  - fpe              # format-preserving encryption
  - hash.sha256      # deterministic hashing
  - date_shift       # shift within range
  - categorical_shuffle  # preserve distribution`,
  },
  {
    icon: Link2,
    title: "Referential integrity",
    description: "Foreign keys stay consistent across masked files. Mask the same column in any file — deterministic keying ensures the same input always produces the same masked output.",
    code: `# keyed determinism — same input, same output, every run
key_label: q4-release   # shared key links all masked files

masks:
  - column: user_id
    transform: hash.sha256  # user_id 42 → 7f3a...

# mask customers.csv and orders.csv with the same
# key_label: masked_orders.user_id matches
# masked_customers.user_id automatically`,
  },
]

export function Features() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The engine under every Disguise
          </h2>
          <p className="text-muted-foreground text-lg">
            Disguises are templates. These are the engine primitives they&apos;re built from — and the reason joins, formats, and re-id risk all stay sane after you mask.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Code example */}
              <div className="rounded-lg border border-border bg-muted/30 p-4 overflow-x-auto code-block">
                <pre className="text-xs font-mono text-muted-foreground">
                  <code>{feature.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
