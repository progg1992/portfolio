import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-control font-medium transition-[background-color,border-color,box-shadow,transform] duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-cyan font-semibold text-obsidian shadow-[0_0_24px_rgb(6_182_212/0.35)] hover:bg-cyan-hover hover:shadow-[0_0_28px_rgb(6_182_212/0.55)] active:translate-y-px active:bg-cyan-active",
  secondary:
    "border border-line-strong bg-charcoal text-ink hover:border-purple hover:bg-slate active:border-purple active:bg-purple/15",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-[18px] text-sm",
  lg: "min-h-12 px-[22px] text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClasses({
  variant = "primary",
  size = "lg",
  className,
}: Omit<Common, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

/** A real <button>. Use for actions: submit, open, toggle. */
export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: Common & ComponentProps<"button">) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

/** A link styled as a button. Use for navigation: it is an <a>, so it never needs a click handler. */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
