# TradeSucro — Homepage

India's digital sugar marketplace. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Design System

A complete, production-ready UI kit lives under `components/ui`, with a live style guide at `/design-system`. It was built without touching the homepage:

- **Colors** — Gold, Navy, Green (success), Red (danger), and a full warm Gray scale, added additively in `tailwind.config.ts` alongside the homepage's original tokens (`paper`, `charcoal`, `gold`, `ink`, `rise`, `fall`), which are untouched.
- **`Button.tsx`** and **`Badge.tsx`** were extended (not replaced) with new semantic variants — the homepage's existing `variant="gold"` / `"charcoal"` usages still resolve exactly as before.
- Every other file in `components/ui` is new: Typography, IconButton, Input family, Select, Checkbox, Radio, Switch, Card, Table, StatusBadge, Alert, Toast, Modal, Tabs, Breadcrumb, Pagination, Spinner, Skeleton, EmptyState, Avatar, CompanyLogoPlaceholder, MarketPriceCard, StatisticsCard, DashboardWidget, Navigation, Sidebar, TopNav, Footer, Grid.
- Import any of them from the barrel: `import { Button, Card, StatusBadge } from "@/components/ui"`.
- `/design-system` has its own local `layout.tsx` (wrapping it in `ToastProvider`) so the shared root layout — and therefore the homepage — was not modified.
- No auth, no backend: every example on the style guide page uses local state and mock data.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the homepage, or [http://localhost:3000/design-system](http://localhost:3000/design-system) for the style guide.

## Design system

**Palette**
| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAF9F6` | Page background |
| `charcoal` | `#1C1B19` | Text, dark sections, footer |
| `gold` | `#B8933D` | Primary accent, CTAs |
| `gold-bright` | `#D4A94A` | Hover states, dark-surface accent text |
| `rise` / `fall` | `#4B7757` / `#A5473A` | Price movement (muted, not neon) |

**Type**
- Display — *Fraunces* (serif, restrained use): headlines only.
- Body — *Inter*: paragraph and UI copy.
- Data — *IBM Plex Mono*: every price, quantity, stat, and ticker symbol. This is deliberate — it's the thread that ties the ticker tape, dashboard cards, and offer ledgers together into one "exchange tape" visual language.

**Signature element**
The scrolling ticker tape beneath the navigation, and the mono-numeral treatment it introduces, repeats through the market dashboard, the offer ledgers, and the stats band. It's the one motif the page is built around — everything else stays quiet.

## Structure

```
app/
  layout.tsx        Root layout, font loading
  page.tsx           Section composition
  globals.css        Tokens, base styles, utilities
components/
  Navbar.tsx
  TickerTape.tsx
  Hero.tsx
  MarketDashboard.tsx
  SearchOffers.tsx
  SellOffers.tsx
  BuyRequirements.tsx
  WhyChoose.tsx
  FeaturedMills.tsx
  Stats.tsx
  IndustryNews.tsx
  Footer.tsx
  ui/
    Button.tsx
    Badge.tsx
    PriceDelta.tsx
lib/
  types.ts           Shared TypeScript interfaces
  data.ts             Mock data — swap for real API calls
```

## Wiring to real data

All sections read from `lib/data.ts`. Replace each exported array (`tickerItems`, `marketIndices`, `sellOffers`, `buyRequirements`, `mills`, `newsItems`, `stats`) with fetches from your API — the component props and shapes in `lib/types.ts` are the contract to preserve.

## Notes

- Respects `prefers-reduced-motion` (ticker and scroll-reveal animations disable automatically).
- All interactive elements have visible focus rings.
- Fully responsive from 375px up; mill gallery becomes a horizontal scroll on mobile.
