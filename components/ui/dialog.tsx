"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      const focusable = node.querySelector<HTMLElement>(
        "button, [href], input, select, textarea",
      );
      focusable?.focus();
    }
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="w-[min(100%-2rem,32rem)] rounded-xl border border-border-muted bg-warm-ivory p-0 text-charcoal shadow-lg backdrop:bg-charcoal/40"
      onClose={() => onOpenChange(false)}
    >
      <div className="border-b border-border-muted px-5 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-charcoal/70">{description}</p>
        ) : null}
      </div>
      {children ? <div className="px-5 py-4">{children}</div> : null}
      <div className="flex justify-end gap-2 border-t border-border-muted px-5 py-4">
        {footer ?? (
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        )}
      </div>
    </dialog>
  );
}

export function DialogTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <Button className={cn(className)} {...props} />;
}
