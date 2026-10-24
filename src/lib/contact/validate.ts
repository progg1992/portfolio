/**
 * Contact form rules (PTR-27). One implementation runs in the browser for
 * feedback on blur and again in the server action, which never trusts the
 * browser. Plain functions, so the client bundle carries no schema library.
 */

export const reasons = [
  { value: "interview", label: "Interview or role" },
  { value: "consulting", label: "Consulting engagement" },
  { value: "question", label: "Technical question" },
] as const;

export type Reason = (typeof reasons)[number]["value"];
export type Field = "name" | "email" | "reason" | "message";
export type Values = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

export const limits = { name: 100, email: 254, messageMin: 20, messageMax: 2000 } as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isReason(value: string | null | undefined): value is Reason {
  return reasons.some((r) => r.value === value);
}

export function validateField(field: Field, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "Enter your name.";
      if (value.length > limits.name) return `Use ${limits.name} characters or fewer.`;
      return undefined;
    case "email":
      if (!value) return "Enter your email address.";
      if (value.length > limits.email || !emailPattern.test(value))
        return "Enter an address like name@company.com.";
      return undefined;
    case "reason":
      return isReason(value) ? undefined : "Choose a reason.";
    case "message":
      if (value.length < limits.messageMin)
        return `Write at least ${limits.messageMin} characters (${value.length} so far).`;
      if (value.length > limits.messageMax)
        return `Keep it to ${limits.messageMax.toLocaleString("en-US")} characters (${value.length.toLocaleString("en-US")} now).`;
      return undefined;
  }
}

export function validate(values: Values): Errors {
  const errors: Errors = {};
  for (const field of ["name", "email", "reason", "message"] as const) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
