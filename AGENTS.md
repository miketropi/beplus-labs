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
