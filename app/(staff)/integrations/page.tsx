import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Guest booking emails via Resend · WhatsApp and POS not wired yet"
      />
      <EmptyState
        title="Partial integrations"
        description="Reservation emails send through Resend when RESEND_API_KEY is set (see .env.example). WhatsApp, POS, and payments are still placeholders."
      />
    </div>
  );
}
