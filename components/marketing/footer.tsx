import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Data Masking", href: "/product/masking" },
    { label: "Synthetic Data", href: "/product/synthetic-data" },
    { label: "Transforms", href: "/product/transforms" },
    { label: "Analytics", href: "/product/analytics" },
    { label: "Pricing", href: "/pricing" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Changelog", href: "/changelog" },
    { label: "GitHub", href: "https://github.com/forgeio/forge" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Security", href: "/security" },
    { label: "Self-Hosting", href: "/self-hosting" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
}

const socialLinks = [
  { icon: Github, href: "https://github.com/forgeio/forge", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/forgedata", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/forgedata", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">F</span>
              </div>
              <span className="text-xl font-semibold">Forge</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Data masking and synthetic data generation. Self-hosted, sanely priced.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Forge. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with frustration, shipped with love.
          </p>
        </div>
      </div>
    </footer>
  )
}
