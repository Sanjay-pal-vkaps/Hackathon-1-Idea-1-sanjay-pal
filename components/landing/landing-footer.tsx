import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-forest-green/20 bg-forest-green text-warm-ivory">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold tracking-wide">Iturrieta Sagardotegia</p>
            <p className="mt-1 text-sm text-warm-ivory/75">Demo reservation platform · Aramaio</p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            aria-label="Footer"
          >
            <Link href="/book" className="text-warm-ivory/90 hover:text-white hover:underline">
              Book
            </Link>
            <Link
              href="/book/login"
              className="text-warm-ivory/90 hover:text-white hover:underline"
            >
              Customer sign in
            </Link>
            <Link href="/login" className="text-warm-ivory/90 hover:text-white hover:underline">
              Team sign in
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-warm-ivory/60">
          Staff and guest sessions share one browser login with Supabase — use separate browser
          profiles when testing both. Sample data only; not the verified public website for
          Iturrieta.
        </p>
      </div>
    </footer>
  );
}
