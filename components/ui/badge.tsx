import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";
import type { ReservationStatus, TableStatus } from "@/lib/domain/types";

const tableStatusStyles: Record<TableStatus, string> = {
  available: "bg-emerald-100 text-emerald-900 border-emerald-200",
  reserved: "bg-orange-100 text-orange-900 border-orange-200",
  occupied: "bg-red-100 text-red-900 border-red-200",
  cleaning: "bg-sky-100 text-sky-900 border-sky-200",
  out_of_service: "bg-zinc-200 text-zinc-800 border-zinc-300",
};

const reservationStatusStyles: Record<ReservationStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-900 border-emerald-200",
  arrived: "bg-sky-100 text-sky-900 border-sky-200",
  completed: "bg-zinc-200 text-zinc-800 border-zinc-300",
  cancelled: "bg-zinc-200 text-zinc-600 border-zinc-300 line-through",
  rejected: "bg-red-100 text-red-900 border-red-200",
  no_show: "bg-red-50 text-red-800 border-red-200",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "table" | "reservation";
  tableStatus?: TableStatus;
  reservationStatus?: ReservationStatus;
};

export function Badge({
  className,
  variant = "default",
  tableStatus,
  reservationStatus,
  children,
  ...props
}: BadgeProps) {
  const tone =
    variant === "table" && tableStatus
      ? tableStatusStyles[tableStatus]
      : variant === "reservation" && reservationStatus
        ? reservationStatusStyles[reservationStatus]
        : "bg-surface-muted text-charcoal border-border-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        tone,
        className,
      )}
      {...props}
    >
      {children ??
        (tableStatus?.replaceAll("_", " ") ||
          reservationStatus?.replaceAll("_", " "))}
    </span>
  );
}
