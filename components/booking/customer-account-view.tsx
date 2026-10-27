"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/components/booking/customer-auth-provider";
import { CustomerProfileForm } from "@/components/booking/customer-profile-form";

export function CustomerAccountView() {
  const router = useRouter();
  const { user, loading, signOut, refreshProfile } = useCustomerAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-green border-t-transparent" />
        <p className="mt-3 text-sm text-charcoal/60">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-border-muted bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-green/10 text-2xl">
          👤
        </div>
        <h2 className="mt-4 font-serif text-2xl font-medium text-forest-green">
          Guest Account
        </h2>
        <p className="mt-2 text-sm text-charcoal/65">
          Sign in or register to manage your contact details and preferences.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row justify-center">
          <Link
            href="/book/login"
            className="rounded-xl bg-forest-green px-6 py-2.5 text-sm font-medium text-warm-ivory transition hover:bg-forest-green/90"
          >
            Sign In
          </Link>
          <Link
            href="/book/register"
            className="rounded-xl border border-border-muted px-6 py-2.5 text-sm font-medium text-charcoal transition hover:bg-surface-muted"
          >
            Register Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-border-muted bg-white p-6 sm:p-8 shadow-sm">
      <CustomerProfileForm
        key={user.id}
        user={user}
        onSaved={refreshProfile}
        onMyBookings={() => router.push("/book/my-bookings")}
        onSignOut={() => {
          void signOut();
          router.push("/book");
        }}
      />
    </div>
  );
}
