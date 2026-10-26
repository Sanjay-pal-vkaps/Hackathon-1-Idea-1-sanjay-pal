import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-muted bg-white px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-charcoal/70">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
