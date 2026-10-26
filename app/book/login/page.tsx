import Link from "next/link";
import { CustomerLoginForm } from "@/components/booking/customer-login-form";

export default function BookLoginPage() {
  return (
    <div className="space-y-4">
      <CustomerLoginForm />
      <p className="text-center text-sm text-charcoal/65">
        No account?{" "}
        <Link href="/book/register" className="text-apple-copper hover:underline">
          Register (mock)
        </Link>{" "}
        ·{" "}
        <Link href="/book" className="text-apple-copper hover:underline">
          Book without signing in
        </Link>
      </p>
    </div>
  );
}
