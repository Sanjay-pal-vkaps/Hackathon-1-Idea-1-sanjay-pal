export type StaffNavItem = {
  href: string;
  label: string;
  section?: "main" | "system";
  secondary?: boolean;
};

export const STAFF_NAV_MAIN: StaffNavItem[] = [
  { href: "/dashboard", label: "Dashboard", section: "main" },
  { href: "/floor-plan", label: "Floor Plan", section: "main" },
  { href: "/reservations", label: "Reservations", section: "main" },
  { href: "/schedule", label: "Calendar", section: "main" },
  { href: "/customers", label: "Customers", section: "main" },
  { href: "/events", label: "Events", section: "main" },
  { href: "/menu-services", label: "Menu & Services", section: "main" },
  { href: "/reports", label: "Reports", section: "main" },
];

export const STAFF_NAV_SYSTEM: StaffNavItem[] = [
  { href: "/settings", label: "Settings", section: "system" },
  { href: "/staff", label: "Users & Roles", section: "system" },
  { href: "/integrations", label: "Integrations", section: "system" },
];

export const STAFF_NAV_ALL = [...STAFF_NAV_MAIN, ...STAFF_NAV_SYSTEM];

