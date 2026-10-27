-- B2: staff helpers + row-level security (customer/guest policies come in B3/B4).

-- ---------------------------------------------------------------------------
-- Helpers (security definer — read staff_profiles for auth.uid())
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_staff_role()
RETURNS public.staff_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.staff_profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_profiles WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.staff_is_manager_or_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_staff_role() IN ('owner', 'manager');
$$;

CREATE OR REPLACE FUNCTION public.staff_is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_staff_role() = 'owner';
$$;

REVOKE ALL ON FUNCTION public.current_staff_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.staff_is_manager_or_owner() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.staff_is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_staff_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_is_manager_or_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.staff_is_owner() TO authenticated;

-- ---------------------------------------------------------------------------
-- staff_profiles
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS staff_profiles_select ON public.staff_profiles;
CREATE POLICY staff_profiles_select
  ON public.staff_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.staff_is_owner()
  );

-- ---------------------------------------------------------------------------
-- Operational data — staff read
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS floors_staff_select ON public.floors;
CREATE POLICY floors_staff_select
  ON public.floors
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS restaurant_tables_staff_select ON public.restaurant_tables;
CREATE POLICY restaurant_tables_staff_select
  ON public.restaurant_tables
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS customers_staff_select ON public.customers;
CREATE POLICY customers_staff_select
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS reservations_staff_select ON public.reservations;
CREATE POLICY reservations_staff_select
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS reservation_tables_staff_select ON public.reservation_tables;
CREATE POLICY reservation_tables_staff_select
  ON public.reservation_tables
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS service_shifts_staff_select ON public.service_shifts;
CREATE POLICY service_shifts_staff_select
  ON public.service_shifts
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

DROP POLICY IF EXISTS booking_settings_staff_select ON public.booking_settings;
CREATE POLICY booking_settings_staff_select
  ON public.booking_settings
  FOR SELECT
  TO authenticated
  USING (public.staff_is_manager_or_owner());

DROP POLICY IF EXISTS activity_events_staff_select ON public.activity_events;
CREATE POLICY activity_events_staff_select
  ON public.activity_events
  FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- ---------------------------------------------------------------------------
-- Writes — aligned with lib/permissions/can.ts (server must still enforce)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS restaurant_tables_staff_update ON public.restaurant_tables;
CREATE POLICY restaurant_tables_staff_update
  ON public.restaurant_tables
  FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS customers_staff_write ON public.customers;
CREATE POLICY customers_staff_write
  ON public.customers
  FOR ALL
  TO authenticated
  USING (public.staff_is_manager_or_owner())
  WITH CHECK (public.staff_is_manager_or_owner());

DROP POLICY IF EXISTS reservations_staff_write ON public.reservations;
CREATE POLICY reservations_staff_write
  ON public.reservations
  FOR ALL
  TO authenticated
  USING (public.staff_is_manager_or_owner())
  WITH CHECK (public.staff_is_manager_or_owner());

DROP POLICY IF EXISTS reservation_tables_staff_write ON public.reservation_tables;
CREATE POLICY reservation_tables_staff_write
  ON public.reservation_tables
  FOR ALL
  TO authenticated
  USING (public.staff_is_manager_or_owner())
  WITH CHECK (public.staff_is_manager_or_owner());

DROP POLICY IF EXISTS booking_settings_owner_update ON public.booking_settings;
CREATE POLICY booking_settings_owner_update
  ON public.booking_settings
  FOR UPDATE
  TO authenticated
  USING (public.staff_is_owner())
  WITH CHECK (public.staff_is_owner());

DROP POLICY IF EXISTS service_shifts_owner_write ON public.service_shifts;
CREATE POLICY service_shifts_owner_write
  ON public.service_shifts
  FOR ALL
  TO authenticated
  USING (public.staff_is_owner())
  WITH CHECK (public.staff_is_owner());

DROP POLICY IF EXISTS activity_events_staff_insert ON public.activity_events;
CREATE POLICY activity_events_staff_insert
  ON public.activity_events
  FOR INSERT
  TO authenticated
  WITH CHECK (public.staff_is_manager_or_owner());

DROP POLICY IF EXISTS floors_manager_write ON public.floors;
CREATE POLICY floors_manager_write
  ON public.floors
  FOR ALL
  TO authenticated
  USING (public.staff_is_manager_or_owner())
  WITH CHECK (public.staff_is_manager_or_owner());
