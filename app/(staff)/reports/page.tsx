import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Secondary UI (U8) — analytics deferred post-MVP"
      />
      <EmptyState
        title="Reports not connected"
        description="Exports and occupancy analytics will appear here after backend integration. Mock data only in Phase 1."
      />
    </div>
  );
}
