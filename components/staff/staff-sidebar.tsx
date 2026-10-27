"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useStaffAuth } from "@/components/staff/staff-auth-provider";
import { navItemsForRole } from "@/components/staff/staff-nav-access";

function NavIcon({ href }: { href: string }) {
  switch (href) {
    case "/dashboard":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );
    case "/floor-plan":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="12" cy="16" r="2.5" />
        </svg>
      );
    case "/reservations":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "/schedule":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "/customers":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "/activity":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "/events":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M12 14v4" />
          <path d="M10 16h4" />
        </svg>
      );
    case "/menu-services":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
          <path d="M15 11v11" />
          <path d="M5 2v20" />
          <path d="M9 2v4a2 2 0 0 1-4 0V2" />
        </svg>
      );
    case "/reports":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "/settings":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "/staff":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      );
    case "/integrations":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16.5 9.4 7.55 4.24a1.48 1.48 0 0 0-2.22 1.3v12.92a1.48 1.48 0 0 0 2.22 1.3l8.95-5.16a1.48 1.48 0 0 0 0-2.6z" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

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
        "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-[#29382E] text-white shadow-xs font-semibold"
          : "text-white/70 hover:bg-white/8 hover:text-white",
        collapsed && "justify-center px-2",
      )}
      title={collapsed ? label : undefined}
    >
      <span className={cn("shrink-0", active ? "text-apple-copper" : "text-white/60")}>
        <NavIcon href={href} />
      </span>
      {!collapsed ? <span className="truncate">{label}</span> : null}
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
  const role = session?.role ?? "owner";
  const { main, system } = navItemsForRole(role);

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-[#18221B] text-white transition-all duration-200 select-none",
        mobile ? "w-full" : collapsed ? "w-[76px]" : "w-64",
      )}
    >
      {/* Brand Header */}
      <div className={cn("p-5 border-b border-white/8", collapsed && "px-3")}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-green/60 border border-white/10 text-emerald-400">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path d="M10 2c1 .5 2 2 2 5" />
            </svg>
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="font-serif text-lg font-medium leading-none tracking-tight text-white group-hover:text-apple-copper transition">
                Iturrieta
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/50">
                Sagardotegia · Aramaio
              </p>
            </div>
          ) : null}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3.5 py-4">
        <div className="space-y-1">
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

        <div className="space-y-1 border-t border-white/8 pt-4">
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

      {/* Bottom Profile Pill */}
      <div className={cn("border-t border-white/8 p-3.5", collapsed && "px-2")}>
        {!collapsed ? (
          <div className="flex items-center justify-between rounded-2xl bg-[#233025] px-3 py-2.5 hover:bg-[#2B3B2E] transition group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#35483A] text-xs font-bold text-white shadow-xs border border-white/10">
                SP
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">Sanju Pal</p>
                <p className="truncate text-[11px] text-white/55">Administrator</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              title="Sign out / Switch user"
              className="text-white/40 group-hover:text-white/80 p-1 rounded-lg transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => void signOut()}
            title="Sign out"
            className="flex h-10 w-full items-center justify-center rounded-xl bg-[#233025] text-white/70 hover:bg-[#2B3B2E] hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#35483A] text-xs font-bold text-white">
              SP
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}
