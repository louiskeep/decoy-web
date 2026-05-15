import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type CellValue = boolean | string

const comparisonItems: {
  feature: string
  cli: CellValue
  business: CellValue
  enterprise: CellValue
}[] = [
  { feature: "8 compliance Disguises (HIPAA, PCI, GDPR...)", cli: true, business: true, enterprise: "+ custom" },
  { feature: "All masking transforms (Faker, FPE, hash, date-shift)", cli: true, business: true, enterprise: true },
  { feature: "All synthetic generators", cli: true, business: true, enterprise: true },
  { feature: "File and cloud object connectors (CSV, Parquet, S3, GCS, SFTP)", cli: true, business: true, enterprise: true },
  { feature: "YAML pipelines & local runs", cli: true, business: true, enterprise: true },
  { feature: "STORM dataset analysis", cli: false, business: true, enterprise: true },
  { feature: "FORECAST recommendations", cli: false, business: true, enterprise: true },
  { feature: "Reports (in-app + export)", cli: false, business: true, enterprise: true },
  { feature: "Audit history", cli: false, business: true, enterprise: true },
  { feature: "Scheduled runs", cli: false, business: true, enterprise: true },
  { feature: "Team access (RBAC)", cli: false, business: "up to 25", enterprise: "unlimited" },
  { feature: "SSO/SAML, HIPAA BAA, air-gapped", cli: false, business: false, enterprise: true },
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
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pick the tier that matches the team
          </h2>
          <p className="text-muted-foreground text-lg">
            The CLI is free forever. Upgrade when your team needs STORM analysis, audit-ready Reports, or BAA-backed deployments.
          </p>
        </div>

        {/* Comparison table */}
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_80px_80px_80px] md:grid-cols-[1.5fr_120px_120px_120px] gap-2 p-4 bg-muted/50 border-b border-border">
            <div className="text-sm font-medium text-muted-foreground">Feature</div>
            <div className="text-center">
              <div className="text-sm font-semibold">CLI</div>
              <div className="text-xs text-muted-foreground">Free</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-primary">Business</div>
              <div className="text-xs text-muted-foreground">$499/mo</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">Enterprise</div>
              <div className="text-xs text-muted-foreground">Custom</div>
            </div>
          </div>

          {/* Rows */}
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
              <div className="flex justify-center"><Cell value={item.business} /></div>
              <div className="flex justify-center"><Cell value={item.enterprise} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
