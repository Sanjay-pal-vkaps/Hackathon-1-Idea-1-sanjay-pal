import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Secondary UI (U8) — providers not wired in prototype"
      />
      <EmptyState
        title="No integrations configured"
        description="WhatsApp, email, and POS hooks are placeholders. Nothing is sent or paid in this demo."
      />
    </div>
  );
}
