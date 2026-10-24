import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { external, resume } from "@/lib/site";

// Contact page (PTR-24, CR-1) from the approved Contact artboard. The form and
// its server action are PTR-27.

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Interviews, consulting, or a technical question. Every message reaches me directly.",
};

const links = [
  { href: external.linkedin, label: "linkedin/pierce-rogg", dot: "text-cyan" },
  { href: external.github, label: "github/progg1992", dot: "text-purple-text" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1240px] items-start gap-14 px-6 pt-22 pb-28 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <p className="font-mono text-[13px] text-purple-text">~/contact</p>
        <h1 className="text-[clamp(2.5rem,5.6vw,4rem)] leading-[1.02] font-bold tracking-[-0.04em]">
          Initiate a secure connection.
        </h1>
        <p className="max-w-[460px] text-lg text-muted">
          Interviews, consulting, or a technical question. Every message reaches me directly.
        </p>
        {resume.live && (
          <a
            href={resume.path}
            download
            className="inline-flex min-h-12 items-center gap-2.5 self-start rounded-control border border-line-strong bg-charcoal px-5 font-medium text-ink transition-colors hover:border-subtle hover:bg-slate"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-cyan"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download resume (PDF)
          </a>
        )}
        <ul className="mt-2 flex flex-col font-mono text-sm">
          {links.map((l) => (
            <li key={l.href} className="border-t border-line last:border-b">
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[52px] items-center justify-between hover:text-cyan"
              >
                <span>
                  <span aria-hidden="true" className={l.dot}>
                    ●──{" "}
                  </span>
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <span aria-hidden="true" className="text-subtle">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
