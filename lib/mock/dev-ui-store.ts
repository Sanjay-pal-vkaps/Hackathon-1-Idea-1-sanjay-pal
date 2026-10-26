const DELAY_KEY = "iturrieta_dev_simulate_delay";
const ERROR_KEY = "iturrieta_dev_simulate_error";

const listeners = new Set<() => void>();

export function subscribeDevUi(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function notify() {
  listeners.forEach((l) => l());
}

export function readSimulateDelay(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DELAY_KEY) === "1";
}

export function readSimulateError(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ERROR_KEY) === "1";
}

export function writeSimulateDelay(on: boolean) {
  window.localStorage.setItem(DELAY_KEY, on ? "1" : "0");
  notify();
}

export function writeSimulateError(on: boolean) {
  window.localStorage.setItem(ERROR_KEY, on ? "1" : "0");
  notify();
}

let cachedDevUiSnapshot = { delay: false, error: false };

/** Stable snapshot for useSyncExternalStore */
export function readDevUiSnapshot() {
  const delay = readSimulateDelay();
  const error = readSimulateError();
  if (cachedDevUiSnapshot.delay === delay && cachedDevUiSnapshot.error === error) {
    return cachedDevUiSnapshot;
  }
  cachedDevUiSnapshot = { delay, error };
  return cachedDevUiSnapshot;
}

export const MOCK_LOAD_DELAY_MS = 800;

export async function withMockLoad<T>(load: () => Promise<T>): Promise<T> {
  if (readSimulateError()) {
    throw new Error("Mock load failure (dev toggle enabled)");
  }
  if (readSimulateDelay()) {
    await new Promise((r) => setTimeout(r, MOCK_LOAD_DELAY_MS));
  }
  return load();
}
