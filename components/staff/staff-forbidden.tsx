"use client";

import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export function StaffForbidden({ title = "Not available for your role" }: { title?: string }) {
  const router = useRouter();
  return (
    <EmptyState
      title={title}
      description="Permissions are UI-only in Phase 1. Server enforcement arrives in Phase 2."
      action={
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      }
    />
  );
}
