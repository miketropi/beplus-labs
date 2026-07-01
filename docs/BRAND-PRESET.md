# Brand Color Preset

Source: `#CFFE25` → `oklch(0.917 0.220 130)`

## Scale

| Token | oklch | Usage |
|-------|-------|-------|
| `brand-50` | `oklch(0.975 0.035 130)` | Ultimate subtle bg |
| `brand-100` | `oklch(0.950 0.060 130)` | Muted bg (cards, badges) |
| `brand-200` | `oklch(0.900 0.095 130)` | Light bg |
| `brand-300` | `oklch(0.850 0.130 130)` | Border tint |
| `brand-400` | `oklch(0.800 0.160 130)` | Muted interactive |
| **`brand-500`** | **`oklch(0.917 0.220 130)`** | **Base = `#CFFE25`** |
| `brand-600` | `oklch(0.780 0.200 130)` | Hover state |
| `brand-700` | `oklch(0.650 0.200 130)` | Active/pressed |
| `brand-800` | `oklch(0.520 0.190 130)` | Text on light (WCAG AA ~5:1) |
| `brand-900` | `oklch(0.400 0.170 130)` | Text emphasis |
| `brand-950` | `oklch(0.280 0.130 130)` | Text heavy |

## Semantic Tokens

| Token | Maps to | Purpose |
|-------|---------|---------|
| `brand` | `brand-800` | Body text on light backgrounds |
| `brand-bright` | `brand-500` | Buttons, accents, decorative borders |
| `brand-foreground` | `oklch(0.10 0 0)` | Text placed on top of `brand-bright` |
| `brand-muted` | `brand-100` | Subtle background wash |

## Dark Mode

In dark mode, use `dark:text-brand-bright` to revert to the bright `#CFFE25`:

```html
<!-- Dark green text (light mode) → bright neon text (dark mode) -->
<span class="text-brand dark:text-brand-bright">Branded text</span>
```

The dark green (`brand-800`) has acceptable contrast on dark backgrounds (~6:1) on its own. Add `dark:text-brand-bright` only where you want the neon to pop.

## Derivation

All scale values share the same hue angle (130°) and reduce chroma proportionally as lightness decreases, keeping every shade perceptually "the same green."
