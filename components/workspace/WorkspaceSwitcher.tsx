"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useWorkspace } from "@/hooks/useWorkspace";
import { WORKSPACE_ROLE_META } from "@/lib/constants/workspaceRoles";

/**
 * WorkspaceSwitcher — passed into TopNav's `rightSlot` (an existing
 * extension point) rather than modifying TopNav itself, per the "do
 * not modify the Design System" constraint.
 */
export function WorkspaceSwitcher() {
  const router = useRouter();
  const { workspace, workspaces, switchWorkspace } = useWorkspace();
  const menu = useDisclosure(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu.isOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) menu.close();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu.isOpen]);

  if (!workspace || workspaces.length === 0) return null;

  const meta = WORKSPACE_ROLE_META[workspace.role];

  async function handleSwitch(id: string) {
    if (id === workspace!.id) {
      menu.close();
      return;
    }
    const updated = await switchWorkspace(id);
    menu.close();
    if (updated) router.push(updated.defaultLandingPage);
  }

  return (
    <div className="relative" ref={ref}>
      <Button variant="subtle" size="sm" onClick={menu.toggle}>
        <span>{meta.emoji}</span>
        <span className="hidden sm:inline">{meta.label}</span>
        <ChevronDown size={13} />
      </Button>

      {menu.isOpen && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-72 rounded-sm border border-line bg-white shadow-modal py-1.5 z-dropdown">
          <div className="px-3.5 py-2.5 border-b border-line">
            <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink-faint">Switch Workspace</p>
          </div>
          <div className="py-1">
            {workspaces.map((w) => {
              const wMeta = WORKSPACE_ROLE_META[w.role];
              const active = w.id === workspace!.id;
              return (
                <button
                  key={w.id}
                  role="menuitem"
                  onClick={() => handleSwitch(w.id)}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-charcoal/[0.04] transition-colors"
                >
                  <span className="text-lg">{wMeta.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-medium text-charcoal truncate">{wMeta.label}</span>
                    <span className="block text-xs text-ink-faint truncate">{w.companyName}</span>
                  </span>
                  {active && <Check size={15} className="text-gold-dim shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-line pt-1">
            <button
              onClick={() => {
                menu.close();
                router.push("/workspaces");
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-ink-soft hover:bg-charcoal/[0.04] hover:text-charcoal transition-colors"
            >
              <LayoutGrid size={15} /> View all workspaces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
