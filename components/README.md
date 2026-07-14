# components/

Organized by role. Each folder has an `index.ts` barrel — import from the
folder, not the individual file, unless you're inside that same folder.

| Folder | Contents | Import from |
|---|---|---|
| `ui/` | Core primitives with no domain meaning: Button, IconButton, Typography, Grid, Modal, Toast, Alert, Spinner, Skeleton, EmptyState, StatusBadge, Avatar, CompanyLogoPlaceholder | `@/components/ui` |
| `forms/` | Input (+ Text/Email/Password/Search/Number), Select, Checkbox, Radio, Switch | `@/components/forms` |
| `cards/` | Card, MarketPriceCard, StatisticsCard | `@/components/cards` |
| `tables/` | Table (primitives), DataTable (sorting/pagination/loading/empty/sticky header) | `@/components/tables` |
| `navigation/` | NavLink/NavMenu, Breadcrumb, Pagination, Tabs | `@/components/navigation` |
| `layout/` | TopNav, Sidebar, PageHeader, Footer — the pieces `app/(dashboard)/layout.tsx` is built from | `@/components/layout` |
| `dashboard/` | DashboardWidget | `@/components/dashboard` |
| `charts/` | Sparkline | `@/components/charts` |
| `common/` | Small shared atoms used by both `market/` and `cards/`: Badge, PriceDelta | `@/components/common` |
| `market/` | Homepage-only sections (Navbar, Hero, TickerTape, offer ledgers, etc.) — not intended for reuse elsewhere | `@/components/market` |

No root barrel re-exports everything (some names collide across folders —
e.g. both `layout/Footer.tsx` and `market/Footer.tsx` export `Footer`, by
design: one is the reusable app-shell footer, the other is the homepage's
bespoke one). Import from the specific folder.

## Where things live outside `components/`

- `lib/theme.ts` — the single source of truth for every color, shadow,
  z-index, spacing, and timing token. `tailwind.config.ts` imports from it.
- `lib/constants/` — typed constants for dropdowns and labels (grades,
  states, roles, statuses, permissions, navigation).
- `lib/utils/format.ts` — number/currency/quantity formatting helpers.
- `lib/types/` — shared TypeScript interfaces.
- `hooks/` — `useMediaQuery`/`useIsMobile`, `useDisclosure`, `useTheme`.
- `services/` — the seam where a real backend will plug in (see its README).
- `app/(dashboard)/layout.tsx` — the reusable dashboard shell (no pages yet).
