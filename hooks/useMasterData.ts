"use client";

import { useEffect, useState } from "react";

/**
 * useMasterData — generic fetch-with-loading hook for master data lists.
 * Pass any masterDataService function (or a closure around one that
 * takes an argument, e.g. `() => masterDataService.getCities(state)`).
 *
 * Include any values the fetcher closes over in `deps` so the list
 * re-fetches when they change (e.g. CitySelect passes `[state]`).
 */
export function useMasterData<T>(fetcher: () => Promise<T[]>, deps: unknown[] = []): { data: T[]; loading: boolean } {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetcher().then((result) => {
      if (cancelled) return;
      setData(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading };
}
