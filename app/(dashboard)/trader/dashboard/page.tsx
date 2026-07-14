import { redirect } from "next/navigation";

/** /trader IS the Daily Trading Desk (the brief's "home screen"); this route is kept as its own page per the spec's route list, redirecting rather than duplicating that content. */
export default function TraderDashboardAliasPage() {
  redirect("/trader");
}
