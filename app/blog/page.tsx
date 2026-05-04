import { Navigation } from "@/components/marketing/navigation"
import { Footer } from "@/components/marketing/footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Forge",
  description: "Updates, tutorials, and insights about data masking, synthetic data, and privacy engineering.",
}

const posts = [
  {
    title: "Introducing Forge: Data masking that doesn't cost $40K",
    excerpt: "We got quoted $40K to mask 3 tables. So we built an open-source alternative that does it in 5 minutes.",
    date: "2026-04-15",
    category: "Announcement",
    slug: "introducing-forge",
  },
  {
    title: "Format-Preserving Encryption Explained",
    excerpt: "How FPE lets you encrypt sensitive data while keeping the same format—and why that matters for downstream systems.",
    date: "2026-04-10",
    category: "Technical",
    slug: "format-preserving-encryption-explained",
  },
  {
    title: "Masking vs. Synthetic Data: When to Use Each",
    excerpt: "A practical guide to choosing between masked production data and fully synthetic datasets for your test environments.",
    date: "2026-04-05",
    category: "Guide",
    slug: "masking-vs-synthetic-data",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section className="py-20 md:py-28">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
              <p className="text-lg text-muted-foreground">
                Updates, tutorials, and insights from the Forge team.
              </p>
            </div>

            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-sm text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
