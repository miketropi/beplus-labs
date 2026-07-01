# BePlus Labs — Implementation Plan

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js v16 (latest) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-based config) |
| Components | shadcn/ui (new-york, neutral) |
| Font | Geist (Next.js default) |
| Content | Local JSON (replace with Headless CMS later) |
| Accent | `#CFFE25` — neon lime, clean white layout |
| Routing | App Router + Turbopack |

---

## Phase 1: Scaffold & Configure

- `npx create-next-app@latest` — TypeScript, Tailwind v4, App Router, src/, Turbopack
- ESLint flat config + Prettier with Tailwind plugin
- `tsconfig.json` path aliases (`@/components`, `@/lib`, `@/data`)
- shadcn/ui `init` + components (Button, Card, Badge, Dialog, Input, Avatar, Separator, Sheet, Tabs)

## Phase 2: Agent Skills (opencode)

```
leonxlnx/taste-skill@design-taste-frontend        (201K)
nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max (243K)
shadcn/ui@shadcn                                   (213K)
wshobson/agents@nextjs-app-router-patterns         (22.7K)
vercel-labs/agent-skills@web-design-guidelines     (427K)
wshobson/agents@tailwind-design-system             (51.7K)
addyosmani/agent-skills@code-review-and-quality    (9.3K)
addyosmani/web-quality-skills@seo                  (29.8K)
addyosmani/web-quality-skills@accessibility        (32.8K)
```

## Phase 3: opencode Configuration

- `.opencode/opencode.json` — project config
- `AGENTS.md` — conventions
- `.opencode/commands/lint.md`, `.opencode/commands/typecheck.md`

## Phase 4: Design System & Layout

- `globals.css` — `--accent: 207 254 37`, Geist, dark mode
- Root Layout — metadata, Header, Footer, `<main>` shell
- Header — "BePlus Labs" logo, nav links, mobile drawer
- Footer — links, copyright

## Phase 5: Data Layer

- `src/data/products.json` — 6 products
- `src/data/changelog.json` — 8-10 entries
- `src/lib/data.ts` — typed loaders (CMS-ready swap)

## Phase 6: Pages

| Route | Content |
|-------|---------|
| `/` | Hero, products grid, beta CTA |
| `/products` | Full grid + status badges + filter tabs |
| `/products/[slug]` | Detail, features, related changelog |
| `/changelog` | Timeline, filterable, grouped by month |
| `/changelog/[slug]` | Single entry |
| `/beta` | Registration form |
| `/about` | Company info |
| `/not-found` | Custom 404 |

## Phase 7: Polish

- Framer Motion animations
- Dynamic `generateMetadata()` per page
- Mobile-first responsive
- Dark mode toggle
- `sitemap.ts` + `robots.ts`
- `loading.tsx` skeletons
