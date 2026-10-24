import "server-only";
import { reasons, type Values } from "./validate";

export type DeliveryResult = "sent" | "failed";

/**
 * Sends one message through Resend's HTTPS API (ADR 0003). The destination and
 * the key exist only as environment variables. Nothing about the message is
 * logged or stored here; on failure only the HTTP status is logged.
 *
 * CONTACT_TRANSPORT=test is for the e2e suite: it skips the network, and a
 * message containing "[[fail]]" simulates a provider failure. It is ignored in
 * production, so production can only ever send for real.
 */
export async function deliver(values: Values): Promise<DeliveryResult> {
  const testMode =
    process.env.CONTACT_TRANSPORT === "test" && process.env.VERCEL_ENV !== "production";
  if (testMode) return values.message.includes("[[fail]]") ? "failed" : "sent";

  const key = process.env.EMAIL_PROVIDER_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.error("contact: delivery is not configured");
    return "failed";
  }

  const reason = reasons.find((r) => r.value === values.reason)?.label ?? values.reason;
  // JSON over HTTPS, so there are no raw mail headers to inject into; the
  // subject is still stripped of line breaks.
  const subject = `Portfolio: ${reason} from ${values.name}`.replace(/[\r\n]+/g, " ");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject,
        text: `${values.name} <${values.email}>\nReason: ${reason}\n\n${values.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`contact: provider returned ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("contact: provider request failed");
    return "failed";
  }
}
