"use server";

import { headers } from "next/headers";
import { deliver } from "@/lib/contact/deliver";
import { allow } from "@/lib/contact/rate-limit";
import { validate, type Errors, type Values } from "@/lib/contact/validate";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: Errors; values: Values }
  | { status: "limited"; values: Values }
  | { status: "failed"; values: Values }
  | { status: "sent" };

const text = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === "string" ? v : "";
};

/**
 * Contact form server action (PTR-27). Callable by any POST, so it trusts
 * nothing from the browser: it validates every field again, checks the
 * honeypot, and applies the rate limit before anything is sent.
 */
export async function sendMessage(_prev: ContactState, data: FormData): Promise<ContactState> {
  const values: Values = {
    name: text(data, "name").trim(),
    email: text(data, "email").trim(),
    reason: text(data, "reason").trim(),
    message: text(data, "message").trim(),
  };

  // Honeypot: people never see this field. Report success so bots learn nothing.
  if (text(data, "website")) return { status: "sent" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!allow(ip)) return { status: "limited", values };

  const errors = validate(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors, values };

  return (await deliver(values)) === "sent" ? { status: "sent" } : { status: "failed", values };
}
