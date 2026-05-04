import { Shield, Database, Sparkles, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Data Masking",
    description: "Create PII-safe copies of production data for dev and test environments.",
    code: `masks:
  - table: users
    column: email
    transform: faker.email
    preserve_uniqueness: true

  - table: users
    column: ssn
    transform: format_preserving_encryption
    seed: \${MASK_SEED}`,
  },
  {
    icon: Database,
    title: "Synthetic Data",
    description: "Generate realistic test datasets that preserve statistical properties and relationships.",
    code: `generate:
  table: orders
  rows: 100000
  preserve:
    - distributions
    - correlations
  constraints:
    - foreign_key: user_id -> users.id
    - check: total > 0`,
  },
  {
    icon: Sparkles,
    title: "50+ Transforms",
    description: "Faker-based, FPE, hashing, date shifting, conditional masking, and custom Python functions.",
    code: `transforms:
  - faker.email      # realistic emails
  - faker.phone      # locale-aware phones
  - fpe              # format-preserving encryption
  - hash.sha256      # deterministic hashing
  - date_shift       # shift within range
  - categorical_shuffle  # preserve distribution`,
  },
  {
    icon: BarChart3,
    title: "Pipeline Analytics",
    description: "Track runs, audit who masked what, and debug pipeline issues from one dashboard.",
    code: `# Business tier only
options:
  audit_log: true
  retention_days: 90
  
schedule:
  cron: "0 2 * * *"
  notify:
    - slack: #data-team`,
  },
]

export function Features() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="text-muted-foreground text-lg">
            A focused toolset for data masking and synthetic generation. No bloat.
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
