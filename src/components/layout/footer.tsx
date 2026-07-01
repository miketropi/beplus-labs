import Link from "next/link";
import { getAllProducts } from "@/lib/data";

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
  { href: "/beta", label: "Beta Program" },
];

const CONNECT_LINKS = [
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const products = await getAllProducts();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="col-span-full sm:col-span-1">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              BePlus <span className="text-brand">Labs</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Open-source WordPress themes, plugins, and tools — built with modern workflows and quality pipelines.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Products</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted-foreground transition-colors hover:text-brand"
                >
                  All Products
                </Link>
              </li>
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <ul className="mt-3 space-y-2">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BePlus Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
