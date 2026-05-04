import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

const comparisonItems = [
  {
    feature: "All masking transforms",
    cli: true,
    business: true,
  },
  {
    feature: "All synthetic generators",
    cli: true,
    business: true,
  },
  {
    feature: "All connectors (Postgres, MySQL, S3, Snowflake...)",
    cli: true,
    business: true,
  },
  {
    feature: "YAML pipelines & local runs",
    cli: true,
    business: true,
  },
  {
    feature: "Web UI & visual pipeline builder",
    cli: false,
    business: true,
  },
  {
    feature: "Scheduled runs & orchestration",
    cli: false,
    business: true,
  },
  {
    feature: "Team access & RBAC",
    cli: false,
    business: true,
  },
  {
    feature: "Audit logs & compliance reports",
    cli: false,
    business: true,
  },
]

function FeatureCheck({ available }: { available: boolean }) {
  return available ? (
    <Check className="h-5 w-5 text-primary" />
  ) : (
    <X className="h-5 w-5 text-muted-foreground/50" />
  )
}

export function Comparison() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            CLI vs Business
          </h2>
          <p className="text-muted-foreground text-lg">
            The CLI is free forever. Upgrade when your team needs collaboration, scheduling, and audit trails.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_120px_120px] gap-4 p-4 bg-muted/50 border-b border-border">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-center">
              <div className="text-sm font-semibold">CLI</div>
              <div className="text-xs text-muted-foreground">Free forever</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary">Business</div>
              <div className="text-xs text-muted-foreground">$499/mo</div>
            </div>
          </div>

          {/* Rows */}
          {comparisonItems.map((item, index) => (
            <div
              key={item.feature}
              className={cn(
                "grid grid-cols-[1fr_100px_100px] md:grid-cols-[1fr_120px_120px] gap-4 p-4 items-center",
                index !== comparisonItems.length - 1 && "border-b border-border"
              )}
            >
              <div className="text-sm">{item.feature}</div>
              <div className="flex justify-center">
                <FeatureCheck available={item.cli} />
              </div>
              <div className="flex justify-center">
                <FeatureCheck available={item.business} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
