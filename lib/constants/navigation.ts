/** Public marketing site navigation (used by the homepage Navbar). */
export interface NavLinkItem {
  label: string;
  href: string;
}

export const MARKETING_NAV_LINKS: NavLinkItem[] = [
  { label: "Marketplace", href: "#offers" },
  { label: "Market Data", href: "#dashboard" },
  { label: "Mills Directory", href: "#mills" },
  { label: "Insights", href: "#news" },
];

/**
 * Dashboard sidebar navigation, grouped into sections. `icon` is stored as
 * the lucide-react icon name (a string) rather than a pre-built element, so
 * this constants file stays framework/render-agnostic — the component that
 * renders the sidebar resolves the name to an actual icon.
 */
export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
}

export interface DashboardNavSection {
  title: string;
  items: DashboardNavItem[];
}

export const DASHBOARD_NAV: DashboardNavSection[] = [
  {
    title: "Workspace",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" }],
  },
  {
    title: "Master Data",
    items: [
      { label: "Product Master", href: "/admin/products", icon: "Package" },
      { label: "Grade Master", href: "/admin/grades", icon: "Tags" },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { label: "Buy Sugar", href: "/marketplace/buy", icon: "ShoppingCart" },
      { label: "Sell Sugar", href: "/marketplace/sell", icon: "Tag" },
      { label: "Offers", href: "/marketplace/offers", icon: "Package" },
      { label: "Requirements", href: "/marketplace/requirements", icon: "ClipboardList" },
    ],
  },
  {
    title: "Mill Offers",
    items: [
      { label: "Offer Board", href: "/mill-offers", icon: "LayoutList" },
      { label: "Create Offer", href: "/mill-offers/create", icon: "PlusCircle" },
      { label: "History", href: "/mill-offers/history", icon: "History" },
    ],
  },
  {
    title: "Tender Management",
    items: [
      { label: "Tender Board", href: "/tenders", icon: "Gavel" },
      { label: "Create Tender", href: "/tenders/create", icon: "PlusCircle" },
    ],
  },
  {
    title: "Advanced Tenders",
    items: [
      { label: "Tender Board", href: "/mill/tenders", icon: "ScrollText" },
      { label: "Create Tender", href: "/mill/tenders/create", icon: "PlusCircle" },
      { label: "History", href: "/mill/tenders/history", icon: "History" },
    ],
  },
  {
    title: "Mill Operations",
    items: [
      { label: "Mill Profile", href: "/mill-profile", icon: "Factory" },
      { label: "Inventory", href: "/inventory", icon: "Boxes" },
      { label: "Dispatch Calendar", href: "/dispatch-calendar", icon: "CalendarClock" },
      { label: "Price History", href: "/price-board", icon: "LineChart" },
    ],
  },
  {
    title: "Market Intelligence",
    items: [
      { label: "Overview", href: "/market", icon: "LayoutDashboard" },
      { label: "Live Price Board", href: "/market/live", icon: "Activity" },
      { label: "Smart Match Engine", href: "/market/match-engine", icon: "Sparkles" },
      { label: "Opportunities", href: "/market/opportunities", icon: "Lightbulb" },
      { label: "Watchlist", href: "/market/watchlist", icon: "Star" },
      { label: "Price Heat Map", href: "/market/prices", icon: "Map" },
      { label: "Market Trends", href: "/market/trends", icon: "LineChart" },
      { label: "Compare Mills", href: "/market/compare", icon: "Columns3" },
      { label: "Smart Alerts", href: "/market/alerts", icon: "BellRing" },
      { label: "Market News", href: "/market/news", icon: "Newspaper" },
    ],
  },
  {
    title: "Commercial Decision Engine",
    items: [
      { label: "Overview", href: "/commercial", icon: "Calculator" },
      { label: "Parity Engine", href: "/commercial/parity", icon: "Scale" },
      { label: "Opportunities", href: "/commercial/opportunities", icon: "Trophy" },
      { label: "Supplier Comparison", href: "/commercial/comparison", icon: "Columns3" },
    ],
  },
  {
    title: "Contact Network",
    items: [{ label: "Directory", href: "/contacts", icon: "Users" }],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/reports", icon: "FileText" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Company Profile", href: "/company-profile", icon: "Building2" },
      { label: "Team", href: "/dashboard/team", icon: "Users" },
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
];
