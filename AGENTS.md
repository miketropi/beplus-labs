<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# BePlus Labs — Project Conventions

## Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (CSS-first config, `@theme inline`)
- **Components**: shadcn/ui (base-nova style, neutral base)
- **Font**: Geist (sans + mono)
- **Icons**: lucide-react
- **Animation**: framer-motion
- **Accent**: `#CFFE25` (neon lime, hsl: 72 98% 57%)

## File Structure
```
src/
  app/            # App Router pages & layouts
  components/
    ui/           # shadcn/ui primitives
    layout/       # Header, Footer, Shell
    shared/       # Reusable domain components
  lib/            # Utilities, data loaders
  data/           # JSON dummy data (swap to CMS later)
  hooks/          # Custom React hooks
```

## Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Functions/vars: `camelCase`
- Types: `PascalCase`

## Rules
- Use `cn()` from `@/lib/utils` for class merging
- Use `lucide-react` for all icons
- All pages export `generateMetadata()` for SEO
- Use Tailwind v4 `@theme inline {}` for extending tokens
- Use `@custom-variant dark (&:is(.dark *))` for dark mode
- Prefer Server Components; add `"use client"` only when needed
- Never commit secrets
- Use absolute imports with `@/` alias

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tools** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them. `codegraph_node` returns one symbol's source + callers, or reads a whole file with line numbers. If the tools are listed but deferred, load them by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` and `codegraph node <symbol-or-file>` print the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
