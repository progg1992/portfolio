import type { Metadata } from "next";
import Link from "next/link";
import { Stats, SystemsGrid } from "@/components/home/status-cards";
import { buttonClasses } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { intro, roles, skills, type Segment } from "@/content/experience";
import { operations } from "@/content/system-status";
import { cn } from "@/lib/cn";
import { pages, resume } from "@/lib/site";

// Experience page (PTR-49, CR-1). Roles, the infrastructure record, and skills,
// all from typed data files; the record reuses the home terminal's data.

export const metadata: Metadata = {
  title: "Experience",
  alternates: { canonical: "/experience" },
  description: intro.body,
};

function Outcome({ parts }: { parts: Segment[] }) {
  return parts.map((p, i) =>
    typeof p === "string" ? (
      p
    ) : (
      <strong key={i} className="font-semibold text-ink">
        {p.figure}
      </strong>
    ),
  );
}

function ResumeButton({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  if (!resume.live) return null;
  return (
    <a href={resume.path} download className={buttonClasses({ variant })}>
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      Download resume
    </a>
  );
}

function SectionHeading({
  n,
  label,
  id,
  title,
}: {
  n: string;
  label: string;
  id: string;
  title: string;
}) {
  return (
    <>
      <p className="font-mono text-[13px] text-purple-text">
        {n} / {label}
      </p>
      <h2 id={id} className="text-[32px] font-bold tracking-[-0.03em]">
        {title}
      </h2>
    </>
  );
}

export default function ExperiencePage() {
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-24 px-6 pt-18 pb-22">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[760px] flex-col gap-4">
          <p className="font-mono text-[13px] text-purple-text">~/experience</p>
          <h1 className="text-[clamp(2.5rem,5.6vw,4.5rem)] leading-none font-bold tracking-[-0.04em]">
            {intro.heading}
          </h1>
          <p className="text-[19px] text-muted">{intro.body}</p>
        </div>
        <ResumeButton />
      </header>

      <section aria-labelledby="roles-heading" className="grid gap-x-16 gap-y-8 lg:grid-cols-3">
        <div className="flex flex-col gap-2.5">
          <SectionHeading n="01" label="roles" id="roles-heading" title="Role history" />
          <p className="text-[15px] text-muted">
            Newest first. Several roles were remote and ran at the same time.
          </p>
        </div>
        <ol className="border-l border-line lg:col-span-2">
          {roles.map((r, i) => (
            <li key={`${r.organization}-${r.title}`} className="relative pb-10 pl-8 last:pb-0">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1.5 -left-1.5 size-[11px] rounded-full",
                  r.end === null ? "bg-cyan shadow-[0_0_12px_var(--color-cyan)]" : "bg-line-strong",
                  i === 1 && "bg-purple",
                )}
              />
              <p
                className={cn("font-mono text-[13px]", r.end === null ? "text-cyan" : "text-muted")}
              >
                <time dateTime={String(r.start)}>{r.start}</time>
                {r.end === null ? (
                  " to present"
                ) : r.end !== r.start ? (
                  <>
                    {" to "}
                    <time dateTime={String(r.end)}>{r.end}</time>
                  </>
                ) : null}
              </p>
              <h3 className="mt-1 mb-0.5 text-[22px] font-bold">{r.title}</h3>
              <p className="mb-3 text-muted">
                {r.organization} · {r.location}
              </p>
              <ul className="flex list-disc flex-col gap-1.5 pl-[18px] text-[15px] text-muted">
                {r.outcomes.map((o, j) => (
                  <li key={j}>
                    <Outcome parts={o} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="record-heading" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <SectionHeading
            n="02"
            label="infrastructure_record"
            id="record-heading"
            title="Systems I have run"
          />
        </div>
        <div className="flex flex-col gap-3 font-mono">
          <SystemsGrid />
          <Stats items={operations} />
        </div>
      </section>

      <section aria-labelledby="skills-heading" className="flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <SectionHeading n="03" label="skills" id="skills-heading" title="Areas of expertise" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((g) => (
            <div
              key={g.group}
              className="glow flex flex-col gap-3 rounded-xl border border-line bg-charcoal p-6"
            >
              <h3 className="font-mono text-xs text-muted">{g.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="closing-heading"
        className="flex flex-wrap items-center justify-between gap-6 rounded-[14px] border border-line bg-charcoal p-8"
      >
        <h2 id="closing-heading" className="text-[26px] font-bold tracking-[-0.02em]">
          Want the full record in one file?
        </h2>
        <div className="flex flex-wrap gap-3">
          <ResumeButton />
          {pages.contact.live && (
            <Link
              href={`${pages.contact.href}?reason=interview`}
              className={buttonClasses({ variant: "secondary" })}
            >
              Schedule a conversation
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
