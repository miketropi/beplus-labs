import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Products",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/products/nextora", label: "Nextora" },
      { href: "/products/beplus-visual-mega-nav", label: "Mega Nav" },
      { href: "/products/prompt-to-pattern", label: "Prompt to Pattern" },
      { href: "/products/beplus-fast-product-filter", label: "Product Filter" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/changelog", label: "Changelog" },
      { href: "/beta", label: "Beta Program" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
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

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {group.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
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
          ))}
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BePlus Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
