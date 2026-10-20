import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type FieldState = "default" | "error" | "valid";

type TextFieldProps = {
  /** Required so the label and message ids are stable on server and client. */
  id: string;
  label: string;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: string;
  /** Confirmation shown after successful validation. */
  validMessage?: string;
  multiline?: boolean;
  className?: string;
} & Omit<ComponentProps<"input">, "className" | "id"> &
  Pick<ComponentProps<"textarea">, "rows">;

const control =
  "w-full rounded-control border bg-slate px-3.5 text-base text-ink placeholder:text-subtle transition-[border-color,box-shadow] duration-150 focus-visible:border-cyan focus-visible:shadow-[0_0_0_3px_rgb(6_182_212/0.25)] focus-visible:outline-none";

const borders: Record<FieldState, string> = {
  default: "border-control hover:border-muted",
  error: "border-error",
  valid: "border-ok",
};

/** A labeled input or textarea with error and valid states wired for screen readers. */
export function TextField({
  label,
  error,
  validMessage,
  multiline = false,
  rows = 5,
  className,
  id,
  type,
  ...props
}: TextFieldProps) {
  const messageId = `${id}-message`;
  const state: FieldState = error ? "error" : validMessage ? "valid" : "default";
  const message = error ?? validMessage;

  const shared = {
    id,
    "aria-invalid": state === "error" ? true : undefined,
    "aria-describedby": message ? messageId : undefined,
    className: cn(control, borders[state], multiline ? "py-3" : "min-h-12"),
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={rows}
          {...(props as ComponentProps<"textarea">)}
          {...shared}
          className={cn(shared.className, "resize-y")}
        />
      ) : (
        <input type={type} {...props} {...shared} />
      )}
      {message && (
        <p
          id={messageId}
          className={cn("font-mono text-xs", state === "error" ? "text-error" : "text-ok")}
        >
          {state === "valid" && <span aria-hidden="true">✓ </span>}
          {message}
        </p>
      )}
    </div>
  );
}
