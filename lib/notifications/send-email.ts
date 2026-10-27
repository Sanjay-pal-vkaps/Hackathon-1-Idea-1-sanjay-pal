export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendEmailResult =
  | { ok: true; id?: string; skipped?: boolean }
  | { ok: false; error: string };

function emailFromAddress(): string {
  return (
    process.env.EMAIL_FROM?.trim() || "Iturrieta <onboarding@resend.dev>"
  );
}

function notificationsEnabled(): boolean {
  const flag = process.env.EMAIL_NOTIFICATIONS?.trim().toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return true;
}

/** Sends via Resend when `RESEND_API_KEY` is set; otherwise logs in dev (booking still succeeds). */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!notificationsEnabled()) {
    return { ok: true, skipped: true };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info("[email] RESEND_API_KEY not set — would send:", {
      to: input.to,
      subject: input.subject,
      text: input.text.slice(0, 200),
    });
    return { ok: true, skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFromAddress(),
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
  };

  if (!res.ok) {
    const message = body.message ?? `Resend HTTP ${res.status}`;
    console.error("[email] send failed:", message);
    return { ok: false, error: message };
  }

  return { ok: true, id: body.id };
}
