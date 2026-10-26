import Link from "next/link";
import type { ReactNode } from "react";
import { CustomerAuthProvider } from "@/components/booking/customer-auth-provider";

export default function PublicBookLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerAuthProvider>
    <div className="flex min-h-[calc(100dvh-2.5rem)] flex-col">
      <header className="border-b border-border-muted bg-warm-ivory/95">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4 md:max-w-2xl">
          <Link
            href="/book"
            className="text-sm font-semibold tracking-wide text-forest-green"
          >
            Iturrieta
          </Link>
          <span className="ml-2 text-xs text-charcoal/50">Table reservations</span>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-6 md:max-w-2xl md:py-10">
        {children}
      </main>
      <footer className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-border-muted px-4 py-4 text-center text-sm">
        <Link href="/book/login" className="text-apple-copper hover:underline">
          Sign in
        </Link>
        <Link href="/book/register" className="text-apple-copper hover:underline">
          Register (mock)
        </Link>
        <Link href="/book/account" className="text-charcoal/70 hover:underline">
          My profile
        </Link>
        <Link href="/book/my-bookings" className="text-charcoal/70 hover:underline">
          My bookings
        </Link>
      </footer>
    </div>
    </CustomerAuthProvider>
  );
}
