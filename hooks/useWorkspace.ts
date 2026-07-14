"use client";

import { useCallback, useEffect, useState } from "react";
import { workspaceService } from "@/services/workspace.service";
import type { Workspace } from "@/lib/types/workspace";

interface UseWorkspaceResult {
  workspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<Workspace | undefined>;
}

/** useWorkspace — the active workspace plus the full list, with a switch() action. */
export function useWorkspace(): UseWorkspaceResult {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWorkspace(workspaceService.getActiveWorkspace());
    workspaceService.getWorkspaces().then((result) => {
      setWorkspaces(result);
      setLoading(false);
    });
  }, []);

  const switchWorkspace = useCallback(async (workspaceId: string) => {
    const updated = await workspaceService.setActiveWorkspace(workspaceId);
    if (updated) setWorkspace(updated);
    return updated;
  }, []);

  return { workspace, workspaces, loading, switchWorkspace };
}
