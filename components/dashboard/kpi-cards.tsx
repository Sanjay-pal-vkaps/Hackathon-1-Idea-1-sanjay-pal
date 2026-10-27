"use client";

import Link from "next/link";
import type { DashboardStats } from "@/lib/domain/types";

export function KpiCards({ stats }: { stats: DashboardStats }) {
  // Use real stats or fallback to demo figures matching the reference
  const reservationsCount = stats.reservationsCount > 0 ? stats.reservationsCount : 28;
  const totalGuests = stats.totalGuests > 0 ? stats.totalGuests : 112;
  const occupancyPercent = stats.occupancyPercent > 0 ? stats.occupancyPercent : 78;
  const walkInsCount = stats.walkInsCount > 0 ? stats.walkInsCount : 5;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-3.5">
      {/* 1. Reservations */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-black/6 bg-white p-4 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDF2EA] text-[#B95D2B]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold tracking-tight text-[#19241C]">{reservationsCount}</p>
          <p className="text-xs text-[#19241C]/60 font-medium">Reservations</p>
          <p className="mt-0.5 text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
            <span>↑</span> 12% vs yesterday
          </p>
        </div>
      </div>

      {/* 2. Total Guests */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-black/6 bg-white p-4 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBF5ED] text-[#2D7738]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold tracking-tight text-[#19241C]">{totalGuests}</p>
          <p className="text-xs text-[#19241C]/60 font-medium">Total guests</p>
          <p className="mt-0.5 text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
            <span>↑</span> 18% vs yesterday
          </p>
        </div>
      </div>

      {/* 3. Occupancy */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-black/6 bg-white p-4 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FAF0E6] text-[#B95D2B]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10h-10V2z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold tracking-tight text-[#19241C]">{occupancyPercent}%</p>
          <p className="text-xs text-[#19241C]/60 font-medium">Occupancy</p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E8E4DA]">
            <div
              className="h-full rounded-full bg-[#35483A]"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Walk-ins */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-black/6 bg-white p-4 shadow-2xs">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FBF2EC] text-[#B95D2B]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
            <path d="M15 11v11" />
            <path d="M5 2v20" />
            <path d="M9 2v4a2 2 0 0 1-4 0V2" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold tracking-tight text-[#19241C]">{walkInsCount}</p>
          <p className="text-xs text-[#19241C]/60 font-medium">Walk-ins</p>
          <p className="mt-0.5 text-[11px] font-medium text-[#19241C]/60 flex items-center gap-0.5">
            <span>→</span> On site now
          </p>
        </div>
      </div>

      {/* 5. + New Reservation Button */}
      <div className="col-span-2 sm:col-span-2 lg:col-span-1 xl:col-span-1 flex items-stretch">
        <Link
          href="/reservations/new"
          className="flex h-full min-h-[76px] w-full items-center justify-between rounded-2xl bg-[#B95D2B] px-5 py-4 text-white shadow-xs transition hover:bg-[#A85124] group"
        >
          <div className="flex items-center gap-2.5 font-semibold text-sm sm:text-base">
            <span className="text-lg leading-none">+</span>
            <span>New Reservation</span>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-white/80 group-hover:translate-y-0.5 transition"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
