import { cn } from "@/lib/utils"

const terminalLines = [
  { type: "command", content: "$ decoy storm scan patients.csv --out scan.json" },
  { type: "output", content: "OK scanned patients.csv" },
  { type: "output", content: "  rows: 1,247  fields: 11" },
  { type: "output", content: "  detected: ssn, email, us_date, us_phone, us_zip" },
  { type: "output", content: "  saved: scan.json" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy templates show hipaa > pipeline.yaml" },
  { type: "output", content: "OK wrote pipeline.yaml from bundled HIPAA template" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy validate pipeline.yaml" },
  { type: "output", content: "OK config valid" },
  { type: "output", content: "" },
  { type: "command", content: "$ decoy run pipeline.yaml" },
  { type: "output", content: "Running mask..." },
  { type: "output", content: "  email -> faker.person_email" },
  { type: "output", content: "  ssn   -> hash" },
  { type: "output", content: "  dob   -> date_shift" },
  { type: "output", content: "  phone -> redact" },
  { type: "success", content: "OK wrote masked output" },
]

export function TerminalDemo() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Section header */}
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A CLI workflow you can inspect.
            </h2>
            <p className="text-muted-foreground text-lg">
              Scan a file with STORM, pick a bundled Disguise template, validate the YAML, run the pipeline when the plan matches your data.
            </p>
          </div>

          {/* Terminal window */}
          <div className="w-full max-w-3xl">
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary/80" />
                  <div className="w-3 h-3 rounded-full bg-accent/70" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/70" />
                </div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  terminal
                </span>
              </div>

              {/* Terminal content */}
              <div className="h-[464px] overflow-x-auto overflow-y-hidden p-4 font-mono text-sm leading-5 code-block">
                {terminalLines.map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "whitespace-pre",
                      line.type === "command" && "text-foreground font-medium",
                      line.type === "output" && "text-muted-foreground",
                      line.type === "success" && "text-primary"
                    )}
                  >
                    {line.content || " "}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
