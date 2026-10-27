-- Iturrieta B1: core schema aligned with lib/domain/types and mock fixtures.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.staff_role AS ENUM ('owner', 'manager', 'waiter');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.table_status AS ENUM (
    'available',
    'reserved',
    'occupied',
    'cleaning',
    'out_of_service'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.table_shape AS ENUM ('circle', 'rectangle');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.reservation_status AS ENUM (
    'pending',
    'confirmed',
    'arrived',
    'completed',
    'cancelled',
    'rejected',
    'no_show'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.reservation_source AS ENUM (
    'online',
    'walk_in',
    'phone',
    'whatsapp'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.activity_event_type AS ENUM (
    'reservation_created',
    'reservation_updated',
    'check_in',
    'cancellation',
    'table_status_changed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Floors & tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.floors (
  id text PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id text PRIMARY KEY,
  floor_id text NOT NULL REFERENCES public.floors (id) ON DELETE RESTRICT,
  number integer NOT NULL,
  capacity_min integer NOT NULL CHECK (capacity_min > 0),
  capacity_max integer NOT NULL CHECK (capacity_max >= capacity_min),
  zone text NOT NULL,
  shape public.table_shape NOT NULL,
  active boolean NOT NULL DEFAULT true,
  status public.table_status NOT NULL DEFAULT 'available',
  layout_x double precision NOT NULL,
  layout_y double precision NOT NULL,
  layout_width double precision NOT NULL,
  layout_height double precision NOT NULL,
  layout_rotation double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (floor_id, number)
);

CREATE INDEX IF NOT EXISTS restaurant_tables_floor_id_idx
  ON public.restaurant_tables (floor_id);

CREATE INDEX IF NOT EXISTS restaurant_tables_status_idx
  ON public.restaurant_tables (status);

-- ---------------------------------------------------------------------------
-- Customers & reservations
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customers (
  id text PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_email_idx ON public.customers (email);

CREATE TABLE IF NOT EXISTS public.reservations (
  id text PRIMARY KEY,
  customer_id text NOT NULL REFERENCES public.customers (id) ON DELETE RESTRICT,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  guest_count integer NOT NULL CHECK (guest_count > 0),
  status public.reservation_status NOT NULL,
  source public.reservation_source NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_at > start_at)
);

CREATE INDEX IF NOT EXISTS reservations_start_at_idx ON public.reservations (start_at);
CREATE INDEX IF NOT EXISTS reservations_status_idx ON public.reservations (status);
CREATE INDEX IF NOT EXISTS reservations_customer_id_idx ON public.reservations (customer_id);

CREATE TABLE IF NOT EXISTS public.reservation_tables (
  reservation_id text NOT NULL REFERENCES public.reservations (id) ON DELETE CASCADE,
  table_id text NOT NULL REFERENCES public.restaurant_tables (id) ON DELETE RESTRICT,
  PRIMARY KEY (reservation_id, table_id)
);

CREATE INDEX IF NOT EXISTS reservation_tables_table_id_idx
  ON public.reservation_tables (table_id);

-- ---------------------------------------------------------------------------
-- Settings & schedule
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.service_shifts (
  id text PRIMARY KEY,
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  default_duration_minutes integer NOT NULL CHECK (default_duration_minutes > 0)
);

CREATE TABLE IF NOT EXISTS public.booking_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  online_guest_limit integer NOT NULL CHECK (online_guest_limit > 0),
  cleaning_buffer_minutes integer NOT NULL CHECK (cleaning_buffer_minutes >= 0),
  timezone text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Activity feed (dashboard)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.activity_events (
  id text PRIMARY KEY,
  type public.activity_event_type NOT NULL,
  message text NOT NULL,
  occurred_at timestamptz NOT NULL,
  reservation_id text REFERENCES public.reservations (id) ON DELETE SET NULL,
  table_id text REFERENCES public.restaurant_tables (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS activity_events_occurred_at_idx
  ON public.activity_events (occurred_at DESC);

-- ---------------------------------------------------------------------------
-- Staff (B2 auth wiring; table created in B1 for stable migrations)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.staff_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  email text NOT NULL,
  role public.staff_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS staff_profiles_email_idx ON public.staff_profiles (email);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS restaurant_tables_updated_at ON public.restaurant_tables;
CREATE TRIGGER restaurant_tables_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS reservations_updated_at ON public.reservations;
CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS staff_profiles_updated_at ON public.staff_profiles;
CREATE TRIGGER staff_profiles_updated_at
  BEFORE UPDATE ON public.staff_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS (policies added in B2; deny anon/authenticated until then)
-- ---------------------------------------------------------------------------

ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
