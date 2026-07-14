"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, GridItem } from "@/components/ui/Grid";
import { WorkspaceCard } from "./WorkspaceCard";
import { workspaceService } from "@/services/workspace.service";
import type { Workspace } from "@/lib/types/workspace";

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
}

export function WorkspaceSelector({ workspaces }: WorkspaceSelectorProps) {
  const router = useRouter();
  const [entering, setEntering] = useState<string | null>(null);

  async function handleEnter(workspace: Workspace) {
    setEntering(workspace.id);
    const updated = await workspaceService.setActiveWorkspace(workspace.id);
    setEntering(null);
    router.push(updated?.defaultLandingPage ?? "/dashboard");
  }

  return (
    <Grid cols={1} colsMd={2} colsLg={3} gap="md">
      {workspaces.map((w) => (
        <GridItem key={w.id}>
          <WorkspaceCard workspace={w} onEnter={handleEnter} entering={entering === w.id} />
        </GridItem>
      ))}
    </Grid>
  );
}
