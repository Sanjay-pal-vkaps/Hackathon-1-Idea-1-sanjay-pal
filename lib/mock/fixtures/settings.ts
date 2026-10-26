import type { BookingSettings, ServiceShift } from "@/lib/domain/types";

export const DEMO_BOOKING_SETTINGS: BookingSettings = {
  onlineGuestLimit: 6,
  cleaningBufferMinutes: 15,
  timezone: "Europe/Madrid",
};

export const DEMO_SERVICE_SHIFTS: ServiceShift[] = [
  {
    id: "shift-lunch",
    name: "Lunch",
    startTime: "13:00",
    endTime: "15:30",
    defaultDurationMinutes: 120,
  },
  {
    id: "shift-dinner",
    name: "Dinner",
    startTime: "19:00",
    endTime: "22:30",
    defaultDurationMinutes: 120,
  },
];
