import { Shield, Database, Sparkles, Link2 } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Mask existing files",
    description: "Read CSV or fixed-width inputs locally, apply explicit masking rules, and write masked output files.",
    code: `# pipeline.yaml
version: "1.0"
mode: mask
input:
  type: csv
  path: data/patients.csv
output:
  type: csv
  path: data/patients_masked.csv
masking_rules:
  - column: email
    type: faker
    faker_type: email
  - column: ssn
    type: hash
    algorithm: sha256`,
  },
  {
    icon: Database,
    title: "Generate synthetic rows",
    description: "Build from scratch or generate replacement columns with faker, sequence, categorical, reference, and formula strategies.",
    code: `# generation pipeline
version: "1.0"
mode: generate
generator_settings:
  seed: 42
tables:
  - name: users
    rows: 1000
    columns:
      - name: user_id
        type: sequence
        start: 1
      - name: plan
        type: categorical
        categories: [free, pro, team]`,
  },
  {
    icon: Sparkles,
    title: "Choose the strategy per field",
    description: "Hash, faker, redact, date_shift, truncate, bucketize, shuffle, FPE, formula, reference, categorical, or passthrough.",
    code: `# strategy examples
masking_rules:
  - column: customer_id
    type: hash
    truncate: 16
  - column: dob
    type: date_shift
    jitter_days: 30
  - column: postal_code
    type: truncate
    length: 3
  - column: notes
    type: redact`,
  },
  {
    icon: Link2,
    title: "Model relationships deliberately",
    description: "Use lock chains, FK rules, self references, many-to-many junctions, composite keys, and PK checks when joins matter.",
    code: `# relationship intent
references:
  - id: customer_identity
    primary:
      table: customers_mask
      column: customer_id
    members:
      - table: orders_mask
        column: customer_id

# Same input + same key maps consistently.`,
  },
]

export function Features() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Specific tools for specific data problems.
          </h2>
          <p className="text-muted-foreground text-lg">
            Decoy is built around inspectable strategies and relationship intent. The goal is not to hide complexity; it is to make the important choices visible before data leaves the pipeline.
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
