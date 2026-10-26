export type StaffRole = "owner" | "manager" | "waiter";

export type TableStatus =
  | "available"
  | "reserved"
  | "occupied"
  | "cleaning"
  | "out_of_service";

export type TableShape = "circle" | "rectangle";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "arrived"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_show";

export type ReservationSource = "online" | "walk_in" | "phone" | "whatsapp";

export interface StaffProfile {
  id: string;
  displayName: string;
  email: string;
  role: StaffRole;
}

export interface RestaurantTable {
  id: string;
  number: number;
  capacityMin: number;
  capacityMax: number;
  zone: string;
  shape: TableShape;
  active: boolean;
  status: TableStatus;
  layout: {
    floorId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  };
}

export interface FloorMeta {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  startAt: string;
  endAt: string;
  guestCount: number;
  status: ReservationStatus;
  source: ReservationSource;
  notes?: string;
  tableIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceShift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  defaultDurationMinutes: number;
}

export interface BookingSettings {
  onlineGuestLimit: number;
  cleaningBufferMinutes: number;
  timezone: string;
}

export type ActivityEventType =
  | "reservation_created"
  | "reservation_updated"
  | "check_in"
  | "cancellation"
  | "table_status_changed";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  message: string;
  occurredAt: string;
  reservationId?: string;
  tableId?: string;
}

export interface DashboardStats {
  reservationsCount: number;
  reservationsTrendPercent: number;
  totalGuests: number;
  guestsTrendPercent: number;
  occupancyPercent: number;
  walkInsCount: number;
}

export interface PublicTimeSlot {
  id: string;
  startAt: string;
  endAt: string;
  available: boolean;
  reason?: string;
}
