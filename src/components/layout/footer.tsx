import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
  { href: "/feedback", label: "Feedback" },
];

const CONNECT_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "https://beplusthemes.com/", label: "BePlus Themes", external: true },
];

export async function Footer() {
  const products = await getAllProducts({ publishedOnly: true });

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Top row: brand + newsletter */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}
            >
              BePlus <span className="text-brand">Labs</span>
            </Link>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Open-source WordPress themes, plugins, and tools — built with
              modern workflows and quality pipelines.
            </p>
          </div>

          <div className="w-full max-w-sm shrink-0">
            <h4 className="font-semibold text-foreground">Stay updated</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Get notified about new releases and updates.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Links row */}
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="meta-label">Products</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  All Products
                </Link>
              </li>
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="meta-label">Company</h4>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="meta-label">Connect</h4>
            <ul className="mt-3 space-y-2">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BePlus Labs. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with WordPress &middot; Open-source on{" "}
            <a
              href="https://github.com/miketropi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
