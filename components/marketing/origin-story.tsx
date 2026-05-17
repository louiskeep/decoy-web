export function OriginStory() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-sm font-medium text-primary">Origin Story</span>
            </div>
            
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-balance">
              {'"'}We got quoted $40K to mask 3 tables. So we built this.{'"'}
            </blockquote>
            
            <div className="flex flex-col gap-4 text-muted-foreground">
              <p>
                It started with a compliance audit. We needed contractors to have realistic test data without exposing customer PII. Simple enough, right?
              </p>
              <p>
                The enterprise vendors wanted six-figure contracts and 12-week implementations. The open-source tools were abandoned or required a PhD in data engineering to configure.
              </p>
              <p>
                Then a pattern showed up: every healthcare team was rebuilding the same HIPAA Safe Harbor logic. Every fintech team was rebuilding the same PCI tokenization. The answer wasn&apos;t another configuration UI — it was prebuilt Disguises.
              </p>
              <p>
                So we built Decoy: a CLI that ships with eight field-list Disguises, and a paid Web UI when your team is ready for shared pipelines, evidence, audit history, and scheduled runs. No consultants. No six-month implementations. Just <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-sm font-mono">pip install decoy</code> and you&apos;re masking data in five minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
