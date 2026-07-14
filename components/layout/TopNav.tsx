"use client";

import { ReactNode, useEffect, useRef } from "react";
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";

interface ProfileMenuItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

interface TopNavProps {
  logo: ReactNode;
  rightSlot?: ReactNode;
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  profileItems?: ProfileMenuItem[];
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

/** TopNav — the in-app header for authenticated/dashboard views. */
export function TopNav({
  logo,
  rightSlot,
  userName,
  userRole,
  notificationCount = 0,
  onSearchClick,
  onMenuClick,
  onNotificationClick,
  profileItems,
  theme,
  onToggleTheme,
}: TopNavProps) {
  const profileMenu = useDisclosure(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileMenu.isOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) profileMenu.close();
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") profileMenu.close();
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileMenu.isOpen]);

  const defaultProfileItems: ProfileMenuItem[] = profileItems ?? [
    { label: "Your profile", icon: <User size={15} /> },
    { label: "Settings", icon: <Settings size={15} /> },
    { label: "Log out", icon: <LogOut size={15} />, destructive: true },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-line dark:border-white/10 bg-white dark:bg-charcoal px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <IconButton variant="ghost" size="md" aria-label="Open menu" className="lg:hidden" onClick={onMenuClick}>
            <Menu size={19} />
          </IconButton>
        )}
        {logo}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="subtle"
          size="sm"
          onClick={onSearchClick}
          className="hidden sm:inline-flex dark:text-white/60 dark:border-white/15 dark:hover:border-white/30 dark:hover:text-white"
        >
          <Search size={15} />
          <span className="text-xs font-mono">Search…</span>
          <kbd className="ml-2 rounded-[3px] bg-charcoal/5 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-ink-faint dark:text-white/40">
            ⌘K
          </kbd>
        </Button>

        <IconButton
          variant="ghost"
          size="md"
          aria-label={onSearchClick ? "Search" : "Search — unavailable"}
          className="sm:hidden dark:text-white/60 dark:hover:bg-white/5"
          onClick={onSearchClick}
        >
          <Search size={17} />
        </IconButton>

        {onToggleTheme && (
          <IconButton
            variant="ghost"
            size="md"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggleTheme}
            className="dark:text-white/60 dark:hover:bg-white/5"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>
        )}

        <div className="relative">
          <IconButton variant="ghost" size="md" aria-label="Notifications" className="dark:text-white/60 dark:hover:bg-white/5" onClick={onNotificationClick}>
            <Bell size={17} />
          </IconButton>
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-mono text-[9px] text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </div>

        {rightSlot}

        {userName && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={profileMenu.toggle}
              aria-haspopup="menu"
              aria-expanded={profileMenu.isOpen}
              className="flex items-center gap-1.5 rounded-sm py-1 pl-1 pr-1.5 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
            >
              <Avatar name={userName} size="sm" />
              <ChevronDown size={14} className="text-ink-faint dark:text-white/40" />
            </button>

            {profileMenu.isOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-sm border border-line dark:border-white/10 bg-white dark:bg-charcoal-soft shadow-modal py-1.5 z-dropdown"
              >
                <div className="px-3.5 py-2.5 border-b border-line dark:border-white/10">
                  <p className="text-[13px] font-medium text-charcoal dark:text-white">{userName}</p>
                  {userRole && <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{userRole}</p>}
                </div>
                <div className="py-1">
                  {defaultProfileItems.map((item) => (
                    <button
                      key={item.label}
                      role="menuitem"
                      onClick={() => {
                        item.onClick?.();
                        profileMenu.close();
                      }}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-left transition-colors ${
                        item.destructive
                          ? "text-danger hover:bg-danger/5"
                          : "text-ink-soft dark:text-white/70 hover:bg-charcoal/5 dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
