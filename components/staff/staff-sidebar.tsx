"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { staffRoleLabel } from "@/lib/mock/staff-session";
import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { navItemsForRole } from "@/components/staff/staff-nav-access";
import { RoleSwitcher } from "@/components/staff/role-switcher";
import { Button } from "@/components/ui/button";

function NavLink({
  href,
  label,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:bg-white/10 hover:text-white",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? label : undefined}
    >
      <span
        className={cn(
          "flex h-2 w-2 shrink-0 rounded-full",
          active ? "bg-apple-copper" : "bg-white/30",
        )}
        aria-hidden
      />
      {!collapsed ? <span>{label}</span> : null}
    </Link>
  );
}

export function StaffSidebar({
  collapsed,
  mobile,
  onNavigate,
}: {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { session, signOut } = useStaffAuth();
  const role = session?.role ?? "waiter";
  const { main, system } = navItemsForRole(role);

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-forest-green text-white",
        mobile ? "w-full" : collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className={cn("border-b border-white/10 p-4", collapsed && "px-2")}>
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-apple-copper text-sm font-bold"
            aria-hidden
          >
            I
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold leading-tight">Iturrieta</p>
              <p className="text-[10px] uppercase tracking-wide text-white/70">
                Sagardotegia · Aramaio
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        <div className="space-y-1">
          {!collapsed ? (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Operations
            </p>
          ) : null}
          {main.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <div className="space-y-1">
          {!collapsed ? (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/50">
              System
            </p>
          ) : null}
          {system.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className={cn("border-t border-white/10 p-3", collapsed && "px-2")}>
        {!collapsed && session ? (
          <div className="mb-3 space-y-2 rounded-lg bg-white/10 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{session.displayName}</p>
              <p className="text-xs text-white/70">{staffRoleLabel(session.role)}</p>
            </div>
            <RoleSwitcher compact />
          </div>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full border-white/30 bg-transparent text-white hover:bg-white/10",
            collapsed && "px-2",
          )}
          onClick={signOut}
        >
          {collapsed ? "Out" : "Sign out (mock)"}
        </Button>
      </div>
    </aside>
  );
}
