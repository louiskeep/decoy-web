export function OriginStory() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="text-sm font-medium text-primary">Why Decoy Exists</span>
            </div>

            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-balance">
              Data masking should be inspectable enough for engineers and clear enough for policy review.
            </blockquote>

            <div className="flex flex-col gap-4 text-muted-foreground">
              <p>
                Teams usually arrive at test-data masking after a practical problem: developers, QA, contractors, or demo environments need useful data without handing everyone a full copy of production.
              </p>
              <p>
                The hard part is not only replacing values. It is choosing the right strategy per field, keeping related columns joinable, knowing what was changed, and being honest about what a tool can and cannot prove.
              </p>
              <p>
                Decoy is built around that workflow. The CLI runs local YAML pipelines, STORM profiles files, Disguise templates give you a defensible starting point, and the self-hosted platform adds review, schedules, reports, and team controls.
              </p>
              <p>
                Disguises are part of that system, but they are not magic compliance switches. They are bundled templates for common field lists that your team can inspect, edit, validate, and run.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
