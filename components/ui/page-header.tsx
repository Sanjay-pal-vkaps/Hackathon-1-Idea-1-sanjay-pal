import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type PageHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border-muted pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-charcoal">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-charcoal/70">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
