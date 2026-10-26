import type {
  ActivityEvent,
  BookingSettings,
  Customer,
  DashboardStats,
  FloorMeta,
  PublicTimeSlot,
  Reservation,
  ReservationStatus,
  RestaurantTable,
  ServiceShift,
  TableStatus,
} from "@/lib/domain/types";

export interface TableRepository {
  listFloors(): Promise<FloorMeta[]>;
  listTables(floorId?: string): Promise<RestaurantTable[]>;
  getTable(id: string): Promise<RestaurantTable | null>;
  updateTableLayout(
    tableId: string,
    layout: RestaurantTable["layout"],
  ): Promise<RestaurantTable>;
  updateTableStatus(
    tableId: string,
    status: TableStatus,
  ): Promise<RestaurantTable>;
  resetDemoLayout(floorId: string): Promise<RestaurantTable[]>;
}

export interface ReservationRepository {
  list(filters?: {
    date?: string;
    status?: ReservationStatus;
    source?: Reservation["source"];
    search?: string;
  }): Promise<Reservation[]>;
  get(id: string): Promise<Reservation | null>;
  listPending(): Promise<Reservation[]>;
  listForTable(tableId: string, date?: string): Promise<Reservation[]>;
  create(
    input: Omit<Reservation, "id" | "createdAt" | "updatedAt">,
  ): Promise<Reservation>;
  updateStatus(id: string, status: ReservationStatus): Promise<Reservation>;
  update(id: string, patch: Partial<Reservation>): Promise<Reservation>;
}

export interface CustomerRepository {
  list(): Promise<Customer[]>;
  get(id: string): Promise<Customer | null>;
}

export interface SettingsRepository {
  getBookingSettings(): Promise<BookingSettings>;
  updateBookingSettings(
    patch: Partial<BookingSettings>,
  ): Promise<BookingSettings>;
  listServiceShifts(): Promise<ServiceShift[]>;
}

export interface ActivityRepository {
  listRecent(limit?: number): Promise<ActivityEvent[]>;
  append(
    event: Omit<ActivityEvent, "id" | "occurredAt">,
  ): Promise<ActivityEvent>;
}

export interface DashboardRepository {
  getStats(forDate: string): Promise<DashboardStats>;
}

export interface PublicBookingRepository {
  listAvailableDates(from: string, to: string): Promise<string[]>;
  listTimeSlots(
    date: string,
    serviceShiftId: string,
  ): Promise<PublicTimeSlot[]>;
  suggestTable(
    guestCount: number,
    startAt: string,
    endAt: string,
  ): Promise<string | null>;
}

export interface MockRepositories {
  tables: TableRepository;
  reservations: ReservationRepository;
  customers: CustomerRepository;
  settings: SettingsRepository;
  activity: ActivityRepository;
  dashboard: DashboardRepository;
  publicBooking: PublicBookingRepository;
}
