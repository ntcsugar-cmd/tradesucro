"use client";

import { useEffect, useState } from "react";
import { Heading, Subheading } from "@/components/ui/Typography";
import { Spinner } from "@/components/ui/Spinner";
import { WorkspaceSelector } from "@/components/workspace";
import { workspaceService } from "@/services/workspace.service";
import type { Workspace } from "@/lib/types/workspace";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workspaceService.getWorkspaces().then((result) => {
      setWorkspaces(result);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <Heading level={2}>Choose a workspace</Heading>
      <Subheading className="mt-2 max-w-xl">
        Your login has access to {workspaces.length || "several"} workspaces. Select one to continue — you can switch anytime from the top navigation.
      </Subheading>

      <div className="mt-10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" label="Loading workspaces…" />
          </div>
        ) : (
          <WorkspaceSelector workspaces={workspaces} />
        )}
      </div>
    </div>
  );
}
