"use client";

import Link from "next/link";
import { useActionState, useState, useSyncExternalStore, type FormEvent } from "react";
import { sendMessage, type ContactState } from "@/app/contact/actions";
import { buttonClasses } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { cn } from "@/lib/cn";
import {
  isReason,
  limits,
  reasons,
  validateField,
  type Errors,
  type Field,
} from "@/lib/contact/validate";
import { external, pages } from "@/lib/site";

// The reason can be preselected with ?reason=consulting (PTR-24). Read in the
// browser so the page stays static; the server snapshot is the default.
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
const presetReason = () => {
  const r = new URLSearchParams(window.location.search).get("reason");
  return isReason(r) ? r : reasons[0].value;
};

const fields: Field[] = ["name", "email", "reason", "message"];

/**
 * Contact form (PTR-27). Fields validate on blur; the server action validates
 * again and decides. Works without JavaScript as a plain form post.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, {
    status: "idle",
  });
  const preset = useSyncExternalStore(subscribe, presetReason, () => reasons[0].value);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [clientErrors, setClientErrors] = useState<Errors>({});
  const [valid, setValid] = useState<Partial<Record<Field, boolean>>>({});

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const values = "values" in state ? state.values : undefined;
  const errorFor = (f: Field) => (touched[f] ? clientErrors[f] : undefined) ?? serverErrors[f];

  function check(field: Field, value: string) {
    const error = validateField(field, value);
    setTouched((t) => ({ ...t, [field]: true }));
    setClientErrors((e) => ({ ...e, [field]: error }));
    setValid((v) => ({ ...v, [field]: !error }));
    return error;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const firstBad = fields.find((f) => {
      const el = form.elements.namedItem(f) as HTMLInputElement | null;
      return check(f, el?.value ?? "");
    });
    if (firstBad) {
      event.preventDefault();
      (form.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
    }
  }

  if (state.status === "sent") {
    return (
      <div className="flex flex-col gap-4 rounded-[14px] border border-ok/40 bg-charcoal p-8">
        <p role="status" className="font-mono text-sm text-ok">
          <span aria-hidden="true">● </span>message sent
        </p>
        <p className="text-lg">Thanks. Your message is on its way to my inbox.</p>
      </div>
    );
  }

  const invalidCount = Object.keys(serverErrors).length;

  return (
    <form
      action={action}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      className="relative flex flex-col gap-[18px] rounded-[14px] border border-line bg-charcoal p-6 sm:p-8"
    >
      <div className="flex justify-between font-mono text-xs text-subtle">
        <span id="contact-form-title">secure_message.form</span>
        <span className="text-ok">
          <span aria-hidden="true">● </span>https only
        </span>
      </div>

      <TextField
        id="contact-name"
        name="name"
        label="Name"
        autoComplete="name"
        placeholder="Jordan Lee"
        maxLength={limits.name}
        defaultValue={values?.name}
        error={errorFor("name")}
        onBlur={(e) => check("name", e.currentTarget.value)}
      />
      <TextField
        id="contact-email"
        name="email"
        type="email"
        label="Work email"
        autoComplete="email"
        placeholder="jordan@company.com"
        maxLength={limits.email}
        defaultValue={values?.email}
        error={errorFor("email")}
        validMessage={valid.email && !errorFor("email") ? "format looks right" : undefined}
        onBlur={(e) => check("email", e.currentTarget.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-reason" className="text-sm font-medium text-ink">
          Reason
        </label>
        <select
          key={values?.reason ?? preset}
          id="contact-reason"
          name="reason"
          defaultValue={values?.reason ?? preset}
          className="min-h-12 w-full rounded-control border border-control bg-slate px-3 text-base text-ink hover:border-muted focus-visible:border-cyan focus-visible:shadow-[0_0_0_3px_rgb(6_182_212/0.25)] focus-visible:outline-none"
        >
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <TextField
        id="contact-message"
        name="message"
        label="Message"
        multiline
        rows={5}
        placeholder="What are you working on?"
        maxLength={limits.messageMax}
        defaultValue={values?.message}
        error={errorFor("message")}
        onBlur={(e) => check("message", e.currentTarget.value)}
      />

      {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={pending} className={cn(buttonClasses({}), "w-full")}>
        {pending ? "Sending" : "Send message"}
      </button>

      <div role="status" className="empty:hidden">
        {state.status === "invalid" && (
          <p className="text-sm text-error">
            {invalidCount === 1
              ? "One field needs attention."
              : `${invalidCount} fields need attention.`}
          </p>
        )}
        {state.status === "limited" && (
          <p className="text-sm text-error">
            Too many messages from this connection in the last hour. Try again later, or reach me on{" "}
            <a
              href={external.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              LinkedIn
            </a>
            .
          </p>
        )}
        {state.status === "failed" && (
          <p className="text-sm text-error">
            The message did not send. Your text is still here. Try again, or reach me on{" "}
            <a
              href={external.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              LinkedIn
            </a>
            .
          </p>
        )}
      </div>

      <p className="text-[13px] text-subtle">
        Your message is emailed to me and not stored on this site.
        {pages.privacy.live && (
          <>
            {" "}
            <Link href={pages.privacy.href} className="text-muted underline underline-offset-4">
              Privacy
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
