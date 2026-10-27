"use client";

import { Alert } from "@/components/ui/alert";
import { useEffect } from "react";

/** Brief full-screen confirmation after staff reservation actions. */
export function ActionNotice({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 p-4"
      role="presentation"
    >
      <div className="max-w-sm shadow-lg" role="alert">
        <Alert variant="info">{message}</Alert>
      </div>
    </div>
  );
}
