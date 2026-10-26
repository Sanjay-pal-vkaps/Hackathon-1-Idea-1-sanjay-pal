"use client";

import { useSyncExternalStore } from "react";
import {
  readDevUiSnapshot,
  subscribeDevUi,
  writeSimulateDelay,
  writeSimulateError,
} from "@/lib/mock/dev-ui-store";

function useDevUiSnapshot() {
  return useSyncExternalStore(
    subscribeDevUi,
    readDevUiSnapshot,
    () => ({ delay: false, error: false }),
  );
}

export function StaffDevPanel() {
  const { delay, error } = useDevUiSnapshot();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="rounded-lg border border-dashed border-amber-300/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
      <p className="font-semibold">Dev UI (U7)</p>
      <div className="mt-2 flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={delay}
            onChange={(e) => writeSimulateDelay(e.target.checked)}
          />
          Slow load (800ms)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={error}
            onChange={(e) => writeSimulateError(e.target.checked)}
          />
          Fail next load
        </label>
      </div>
    </div>
  );
}
