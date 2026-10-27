-- I2: link guest customers to Supabase Auth + RLS for self-service

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE
  REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS customers_auth_user_id_idx
  ON public.customers (auth_user_id);

-- Guest profile: read/update own row
DROP POLICY IF EXISTS customers_self_select ON public.customers;
CREATE POLICY customers_self_select
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS customers_self_update ON public.customers;
CREATE POLICY customers_self_update
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Own reservations (staff policies still apply via separate permissive rules)
DROP POLICY IF EXISTS reservations_customer_select ON public.reservations;
CREATE POLICY reservations_customer_select
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.customers c
      WHERE c.id = customer_id
        AND c.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS reservation_tables_customer_select ON public.reservation_tables;
CREATE POLICY reservation_tables_customer_select
  ON public.reservation_tables
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.reservations r
      INNER JOIN public.customers c ON c.id = r.customer_id
      WHERE r.id = reservation_id
        AND c.auth_user_id = auth.uid()
    )
  );
