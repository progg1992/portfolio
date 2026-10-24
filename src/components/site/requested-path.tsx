"use client";

import { usePathname } from "next/navigation";

/** The path the visitor asked for, shown in the 404 prompt line. */
export function RequestedPath() {
  return <>{usePathname()}</>;
}
