import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type CellValue = boolean | string

const comparisonItems: {
  feature: string
  cli: CellValue
  platform: CellValue
  enterprise: CellValue
}[] = [
  { feature: "Local YAML validation and runs", cli: true, platform: true, enterprise: true },
  { feature: "Local CSV STORM and FORECAST", cli: true, platform: true, enterprise: true },
  { feature: "Visual pipeline builder", cli: false, platform: true, enterprise: true },
  { feature: "Managed files, runtime secrets, and API keys", cli: false, platform: true, enterprise: true },
  { feature: "Reports, evidence, and audit history", cli: false, platform: true, enterprise: true },
  { feature: "Scheduled runs, triggers, and reviews", cli: false, platform: true, enterprise: true },
  { feature: "Team access and RBAC", cli: false, platform: true, enterprise: true },
  { feature: "SSO/SAML, HIPAA BAA, air-gapped, SLA", cli: false, platform: "add-on", enterprise: "contract" },
  { feature: "Support model", cli: "docs", platform: "included", enterprise: "dedicated" },
]

function Cell({ value }: { value: CellValue }) {
  if (value === true) return <Check className="h-5 w-5 text-primary" />
  if (value === false) return <X className="h-5 w-5 text-muted-foreground/40" />
  return <span className="text-xs font-medium text-primary">{value}</span>
}

export function Comparison() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pick the surface that matches the workflow
          </h2>
          <p className="text-muted-foreground text-lg">
            The CLI is free forever for local and CI workflows. Upgrade when your team needs the self-hosted Web UI, governance, evidence, scheduling, and support.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[1.5fr_80px_80px_80px] md:grid-cols-[1.5fr_120px_120px_120px] gap-2 p-4 bg-muted/50 border-b border-border">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-center">
              <div className="text-sm font-semibold">CLI</div>
              <div className="text-xs text-muted-foreground">Free</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary">Web UI</div>
              <div className="text-xs text-muted-foreground">$499/mo</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">Enterprise add-on</div>
              <div className="text-xs text-muted-foreground">Custom terms</div>
            </div>
          </div>

          {comparisonItems.map((item, index) => (
            <div
              key={item.feature}
              className={cn(
                "grid grid-cols-[1.5fr_80px_80px_80px] md:grid-cols-[1.5fr_120px_120px_120px] gap-2 p-4 items-center",
                index !== comparisonItems.length - 1 && "border-b border-border"
              )}
            >
              <div className="text-sm">{item.feature}</div>
              <div className="flex justify-center"><Cell value={item.cli} /></div>
              <div className="flex justify-center"><Cell value={item.platform} /></div>
              <div className="flex justify-center"><Cell value={item.enterprise} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
