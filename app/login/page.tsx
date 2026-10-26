import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/staff/login-form";
import { StaffAuthProvider } from "@/components/staff/staff-auth-provider";

export default function LoginPage() {
  return (
    <StaffAuthProvider>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-forest-green">
            Iturrieta
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-charcoal">Staff workspace</h1>
        </div>
        <Suspense fallback={<p className="text-sm text-charcoal/70">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <Link href="/" className="text-sm text-apple-copper hover:underline">
          Back to U1 foundation home
        </Link>
      </div>
    </StaffAuthProvider>
  );
}
