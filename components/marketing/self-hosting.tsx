import { Lock, Server, Shield, Zap } from "lucide-react"

const benefits = [
  {
    icon: Lock,
    title: "Your data never leaves your network",
    description: "Run Forge entirely on your infrastructure. No data sent to external servers.",
  },
  {
    icon: Server,
    title: "Deploy anywhere",
    description: "Docker Compose for simple setups. Helm charts for Kubernetes. Your cloud, your rules.",
  },
  {
    icon: Shield,
    title: "Compliance-ready",
    description: "SOC 2 Type 2 in progress. HIPAA BAA available. Air-gapped deployments supported.",
  },
  {
    icon: Zap,
    title: "No per-row fees",
    description: "Mask a million rows or a billion. Flat monthly pricing, no surprises.",
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
              For regulated industries, self-hosting isn&apos;t optional. Forge is designed from day one to run on your infrastructure, with zero external dependencies.
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
                      <div className="text-xs font-medium">Production DB</div>
                      <div className="text-[10px] text-muted-foreground">PostgreSQL</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">→</div>
                    <div className="flex-1 rounded-md border border-primary bg-primary/10 p-3 text-center">
                      <div className="text-xs font-medium text-primary">Forge</div>
                      <div className="text-[10px] text-muted-foreground">CLI / Platform</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">→</div>
                    <div className="flex-1 rounded-md border border-border bg-muted/50 p-3 text-center">
                      <div className="text-xs font-medium">Staging DB</div>
                      <div className="text-[10px] text-muted-foreground">Masked data</div>
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
                    None required · Optional license validation only
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
