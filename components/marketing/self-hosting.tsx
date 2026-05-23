import { Lock, Server, Shield, Zap } from "lucide-react"

const benefits = [
  {
    icon: Lock,
    title: "Runs in your environment",
    description: "Use the CLI locally or run the paid platform on your infrastructure.",
  },
  {
    icon: Server,
    title: "Docker Compose first",
    description: "Single-host Docker Compose is the supported V1 deployment path.",
  },
  {
    icon: Shield,
    title: "Tooling for regulated workflows",
    description: "Air-gapped deployments supported. Tooling-only: not SOC 2 certified, no BAA in V1. Your team retains compliance ownership.",
  },
  {
    icon: Zap,
    title: "No per-row fees",
    description: "The paid platform is priced per Web UI instance, billed annually.",
  },
]

export function SelfHosting() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
              <Lock className="h-3 w-3" />
              Self-hosted
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Runs where your data lives
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Decoy is designed for teams that want the data plane inside their own environment. The CLI runs locally; the paid Web UI is deployed by the customer rather than hosted as SaaS.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{benefit.title}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - architecture diagram */}
          <div className="relative">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-medium text-muted-foreground mb-4">
                Your Infrastructure
              </div>
              
              {/* Diagram */}
              <div className="space-y-4">
                {/* VPC boundary */}
                <div className="rounded-lg border-2 border-dashed border-primary/30 p-4 space-y-4">
                  <div className="text-xs text-primary font-mono">VPC / Private Network</div>
                  
                  {/* Data sources */}
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-md border border-border bg-muted/50 p-3 text-center">
                      <div className="text-xs font-medium">Source files</div>
                      <div className="text-[10px] text-muted-foreground">CSV &middot; Parquet</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">&rarr;</div>
                    <div className="flex-1 rounded-md border border-primary bg-primary/10 p-3 text-center">
                      <div className="text-xs font-medium text-primary">Decoy</div>
                      <div className="text-[10px] text-muted-foreground">CLI / Platform</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">&rarr;</div>
                    <div className="flex-1 rounded-md border border-border bg-muted/50 p-3 text-center">
                      <div className="text-xs font-medium">Masked files</div>
                      <div className="text-[10px] text-muted-foreground">Masked output</div>
                    </div>
                  </div>
                </div>

                {/* External */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="h-px w-8 bg-border"></span>
                  <span>Internet boundary</span>
                  <span className="h-px w-8 bg-border"></span>
                </div>

                <div className="rounded-md border border-border bg-muted/30 p-3 text-center">
                  <div className="text-xs font-medium text-muted-foreground">External Access</div>
                  <div className="text-[10px] text-muted-foreground">
                    None required &middot; Optional license validation only
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
