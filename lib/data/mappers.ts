import type {
  ActivityEvent,
  BookingSettings,
  Customer,
  Reservation,
  ReservationSource,
  ReservationStatus,
  RestaurantTable,
  ServiceShift,
  TableShape,
  TableStatus,
} from "@/lib/domain/types";

export type TableRow = {
  id: string;
  floor_id: string;
  number: number;
  capacity_min: number;
  capacity_max: number;
  zone: string;
  shape: TableShape;
  active: boolean;
  status: TableStatus;
  layout_x: number;
  layout_y: number;
  layout_width: number;
  layout_height: number;
  layout_rotation: number | null;
};

export type ReservationRow = {
  id: string;
  customer_id: string;
  start_at: string;
  end_at: string;
  guest_count: number;
  status: ReservationStatus;
  source: ReservationSource;
  notes: string | null;
  created_at: string;
  updated_at: string;
  reservation_tables?: { table_id: string }[];
};

export function mapTableRow(row: TableRow): RestaurantTable {
  return {
    id: row.id,
    number: row.number,
    capacityMin: row.capacity_min,
    capacityMax: row.capacity_max,
    zone: row.zone,
    shape: row.shape,
    active: row.active,
    status: row.status,
    layout: {
      floorId: row.floor_id,
      x: row.layout_x,
      y: row.layout_y,
      width: row.layout_width,
      height: row.layout_height,
      rotation: row.layout_rotation ?? undefined,
    },
  };
}

export function mapReservationRow(row: ReservationRow): Reservation {
  const tableIds =
    row.reservation_tables?.map((rt) => rt.table_id) ??
    [];
  return {
    id: row.id,
    customerId: row.customer_id,
    startAt: row.start_at,
    endAt: row.end_at,
    guestCount: row.guest_count,
    status: row.status,
    source: row.source,
    notes: row.notes ?? undefined,
    tableIds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCustomerRow(row: {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
  };
}

export function mapServiceShiftRow(row: {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  default_duration_minutes: number;
}): ServiceShift {
  return {
    id: row.id,
    name: row.name,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    defaultDurationMinutes: row.default_duration_minutes,
  };
}

export function mapBookingSettingsRow(row: {
  online_guest_limit: number;
  cleaning_buffer_minutes: number;
  timezone: string;
}): BookingSettings {
  return {
    onlineGuestLimit: row.online_guest_limit,
    cleaningBufferMinutes: row.cleaning_buffer_minutes,
    timezone: row.timezone,
  };
}

export function mapActivityRow(row: {
  id: string;
  type: ActivityEvent["type"];
  message: string;
  occurred_at: string;
  reservation_id: string | null;
  table_id: string | null;
}): ActivityEvent {
  return {
    id: row.id,
    type: row.type,
    message: row.message,
    occurredAt: row.occurred_at,
    reservationId: row.reservation_id ?? undefined,
    tableId: row.table_id ?? undefined,
  };
}
