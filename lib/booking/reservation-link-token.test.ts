import { describe, expect, it } from "vitest";

import { generateReservationLinkToken } from "@/lib/booking/reservation-link-token";

describe("generateReservationLinkToken", () => {
  it("returns url-safe tokens", () => {
    const a = generateReservationLinkToken();
    const b = generateReservationLinkToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(20);
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
