/** Decorative orchard motif — no external assets */
export function OrchardAccent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 320"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="160" r="120" className="fill-surface-muted" />
      <circle cx="200" cy="160" r="88" className="fill-warm-ivory stroke-border-muted" strokeWidth="1" />
      <path
        d="M200 72c-28 36-42 68-42 88 0 24 19 44 42 44s42-20 42-44c0-20-14-52-42-88z"
        className="fill-forest-green/15"
      />
      <circle cx="168" cy="128" r="14" className="fill-apple-copper/35" />
      <circle cx="232" cy="140" r="11" className="fill-apple-copper/25" />
      <circle cx="200" cy="168" r="9" className="fill-apple-copper/40" />
      <path
        d="M200 48v24M200 248v24M88 160h24M288 160h24"
        className="stroke-border-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
