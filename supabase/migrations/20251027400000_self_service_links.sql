-- I4: tokenized self-service links (no email) — lookup via service role API only

CREATE TABLE IF NOT EXISTS public.reservation_link_tokens (
  token text PRIMARY KEY,
  reservation_id text NOT NULL REFERENCES public.reservations (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reservation_link_tokens_reservation_id_idx
  ON public.reservation_link_tokens (reservation_id);

ALTER TABLE public.reservation_link_tokens ENABLE ROW LEVEL SECURITY;

-- Demo link (same token as legacy U8 docs)
INSERT INTO public.reservation_link_tokens (token, reservation_id, expires_at)
VALUES (
  'demo-valid-token',
  'res-001',
  '2099-01-01T00:00:00+00'::timestamptz
)
ON CONFLICT (token) DO NOTHING;
