/** Demo self-service link tokens (U8) */
export const MOCK_SELF_SERVICE_TOKENS = {
  valid: {
    token: "demo-valid-token",
    reservationId: "res-001",
    label: "Valid link — shows one booking",
  },
  invalid: {
    token: "expired-demo",
    reservationId: null as string | null,
    label: "Invalid or expired token",
  },
} as const;
