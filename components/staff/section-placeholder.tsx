import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export function SectionPlaceholder({
  title,
  description,
  milestone,
  secondary,
}: {
  title: string;
  description: string;
  milestone?: string;
  secondary?: boolean;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        title={secondary ? "Planned post-MVP UI" : "Coming in a later milestone"}
        description={
          milestone
            ? `${milestone} will implement this screen. Navigation and shell are ready.`
            : "This route is reserved for upcoming UI work."
        }
        action={
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border-muted bg-warm-ivory px-4 text-sm font-medium text-charcoal hover:bg-surface-muted"
          >
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
