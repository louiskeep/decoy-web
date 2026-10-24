import {
  HeartPulse,
  CreditCard,
  Globe,
  Landmark,
  ShieldCheck,
  GraduationCap,
  FileSpreadsheet,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const disguises = [
  {
    name: "HIPAA",
    regulation: "45 CFR 164.514(b)",
    title: "Healthcare PHI",
    description:
      "Starts from Safe Harbor identifier categories, then leaves field mapping and policy review in your team's hands.",
    icon: HeartPulse,
    buyer: "Healthcare data teams",
    featured: true,
  },
  {
    name: "PCI DSS",
    regulation: "PCI DSS 4.0",
    title: "Payment card data",
    description:
      "Provides starter handling for PAN, CVV, account numbers, and contact fields using explicit masking strategies.",
    icon: CreditCard,
    buyer: "Fintech & payments",
    featured: true,
  },
  {
    name: "GDPR",
    regulation: "Reg. (EU) 2016/679",
    title: "EU personal data",
    description:
      "A pseudonymisation-oriented starter template. It reduces exposure, but it is not anonymisation or legal compliance by itself.",
    icon: Globe,
    buyer: "Teams serving EU users",
  },
  {
    name: "GLBA",
    regulation: "15 U.S.C. 6801-6809",
    title: "Financial customer info",
    description:
      "Groups common account, SSN, contact, date, and balance fields for financial test-data workflows.",
    icon: Landmark,
    buyer: "Banks & lenders",
  },
  {
    name: "CCPA",
    regulation: "Cal. Civ. Code 1798.100",
    title: "California consumer data",
    description:
      "A broad consumer-data starting point for names, contact data, IPs, device IDs, ZIP codes, SSNs, and dates.",
    icon: ShieldCheck,
    buyer: "Consumer apps",
  },
  {
    name: "FERPA",
    regulation: "20 U.S.C. 1232g",
    title: "Education records",
    description:
      "Includes common student-record fields such as names, IDs, dates of birth, emails, and grade bands.",
    icon: GraduationCap,
    buyer: "EdTech & universities",
  },
  {
    name: "SOX",
    regulation: "Sarbanes-Oxley 404",
    title: "Financial reporting",
    description:
      "A starter field list for sensitive finance and employee data used in internal reporting test sets.",
    icon: FileSpreadsheet,
    buyer: "Public-company finance",
  },
  {
    name: "Default",
    regulation: "General PII",
    title: "Baseline masking",
    description:
      "A practical default for datasets with common PII but no single regulation-specific template.",
    icon: Lock,
    buyer: "General engineering teams",
  },
]

export function Disguises() {
  return (
    <section
      id="disguises"
      className="py-20 md:py-28 border-t border-border scroll-mt-20"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            <ShieldCheck className="h-3 w-3" />
            Disguises
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Starter templates for common masking policies.
          </h2>
          <p className="text-muted-foreground text-lg">
            A Disguise is a reviewable field-list template. It gives you a starting YAML plan for common regulatory contexts, then your team confirms field mappings, edits strategies, and validates the pipeline before running it.
          </p>
        </div>

        {/* Grid of 8 launch Disguises */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {disguises.map((d) => (
            <div
              key={d.name}
              className={cn(
                "relative flex flex-col gap-3 rounded-xl border p-5 transition-colors",
                d.featured
                  ? "border-primary/50 bg-primary/5 hover:border-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {d.featured && (
                <span className="absolute top-3 right-3 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  Common
                </span>
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <d.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold">{d.name}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {d.regulation}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{d.title}</p>
              </div>
              <p className="text-sm text-foreground/80 flex-1">{d.description}</p>
              <div className="mt-1 pt-3 border-t border-border text-[11px] text-muted-foreground">
                {d.buyer}
              </div>
            </div>
          ))}
        </div>

        {/* Apply-it-like-this code preview */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-3">Start from YAML, then review it.</h3>
            <p className="text-muted-foreground">
              Use <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-sm font-mono">decoy init --preset</code> or <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-sm font-mono">decoy templates show</code> to inspect what ships. The template is meant to be edited, validated, and checked against your own policy.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto code-block">
            <pre className="text-xs font-mono text-muted-foreground leading-relaxed">
              <code>{`$ decoy init --preset hipaa --out hipaa_pipeline.yaml
OK wrote hipaa_pipeline.yaml

$ decoy validate hipaa_pipeline.yaml
OK config valid

$ decoy run hipaa_pipeline.yaml`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
