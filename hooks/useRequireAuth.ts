"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { AuthUser } from "@/lib/types/auth";

interface UseRequireAuthResult {
  /** The signed-in mock user, once the check has run. Null until then or if redirecting. */
  user: AuthUser | null;
  /** True once the session check has completed (whether or not a user was found). */
  checked: boolean;
}

/**
 * useRequireAuth — client-side mock route guard for dashboard routes.
 *
 * TradeSucro has no backend/real sessions yet, so "authenticated" means
 * "authService.getSession() returns a user" (localStorage-backed — see
 * services/auth.service.ts). If there's no session, this redirects to
 * /login immediately. Consumers should render a loading state while
 * `checked` is false, and only render protected content once `checked`
 * is true and `user` is non-null, to avoid a flash of protected content.
 */
export function useRequireAuth(): UseRequireAuthResult {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setUser(session);
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, checked };
}
