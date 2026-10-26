"use client";

import { Alert } from "@/components/ui/alert";
import { useEffect } from "react";

export function MockNotice({
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
    <div className="fixed bottom-4 right-4 z-50 max-w-sm shadow-lg">
      <Alert variant="warning">{message}</Alert>
    </div>
  );
}
