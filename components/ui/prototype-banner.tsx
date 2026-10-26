import { MOCK_DISCLAIMER } from "@/lib/constants/design-tokens";

export function PrototypeBanner() {
  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-950"
      role="status"
    >
      {MOCK_DISCLAIMER}
    </div>
  );
}
