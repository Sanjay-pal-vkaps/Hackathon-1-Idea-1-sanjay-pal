import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingLink } from "@/components/landing/landing-link";

const roles = [
  {
    title: "Guest",
    description: "Book a table without creating an account. Receive a link to view your reservation.",
    primary: { href: "/book", label: "Book a table" },
    secondary: null,
  },
  {
    title: "Customer",
    description: "Register to see past and upcoming bookings, and manage your profile.",
    primary: { href: "/book/login", label: "Sign in" },
    secondary: { href: "/book/register", label: "Create account" },
  },
  {
    title: "Restaurant team",
    description:
      "Owners, managers, and waiters — floor plan, reservations, and approvals in one dashboard.",
    primary: { href: "/login", label: "Staff sign in" },
    secondary: null,
  },
] as const;

export function LandingRoleCards() {
  return (
    <section id="get-started" className="scroll-mt-20 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            Who are you visiting as?
          </h2>
          <p className="mt-2 text-charcoal/70">
            Choose the path that fits — guest booking, customer account, or team operations.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {roles.map((role) => (
            <li key={role.title}>
              <Card className="flex h-full flex-col border-border-muted">
                <CardHeader>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-charcoal/70">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex flex-wrap gap-2 pt-2">
                  <LandingLink href={role.primary.href} className="w-full sm:w-auto">
                    {role.primary.label}
                  </LandingLink>
                  {role.secondary ? (
                    <LandingLink
                      href={role.secondary.href}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {role.secondary.label}
                    </LandingLink>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
