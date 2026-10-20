import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";
import { TerminalTab } from "@/components/ui/terminal-tab";
import { TextField } from "@/components/ui/text-field";

// Internal review page for PTR-14. Not part of the public site: it returns 404 in
// production and is noindex everywhere. See docs/architecture/adr/0005-styleguide-route.md.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  ["obsidian", "#09090B", "bg-obsidian"],
  ["charcoal", "#121214", "bg-charcoal"],
  ["slate", "#18181B", "bg-slate"],
  ["ink", "#FAFAFA", "bg-ink"],
  ["muted", "#A1A1AA", "bg-muted"],
  ["subtle", "#8A8A93", "bg-subtle"],
  ["cyan", "#06B6D4", "bg-cyan"],
  ["purple", "#A855F7", "bg-purple"],
  ["purple-text", "#B17AF8", "bg-purple-text"],
  ["control", "#6B6B75", "bg-control"],
] as const;

const states = ["default", "hover", "active", "focus"] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4 *:justify-self-start md:grid-cols-[140px_repeat(4,minmax(0,1fr))]">
      <span className="col-span-2 font-mono text-xs text-muted md:col-span-1">{label}</span>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line pt-8">
      <h2 className="font-mono text-sm text-purple-text">{title}</h2>
      {children}
    </section>
  );
}

export default function Styleguide() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-sm text-subtle">internal · PTR-14</p>
        <h1 className="text-heading font-bold">Tokens, components, and states</h1>
        <p className="max-w-2xl text-muted">
          Hover, active, and focus columns are forced with static classes so every state is visible
          at once. The live components get the same styles from pointer and keyboard interaction.
        </p>
      </header>

      <Section title="color.tokens">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map(([name, hex, cls]) => (
            <li key={name} className="flex flex-col gap-1.5 font-mono text-xs text-muted">
              <span className={`h-14 rounded-control border border-line-strong ${cls}`} />
              {name}
              <span className="text-subtle">{hex}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="type.scale">
        <p className="text-display font-bold">Display</p>
        <p className="text-heading font-bold">Heading</p>
        <p className="text-title font-semibold">Title</p>
        <p className="text-muted">Body in Geist, muted for descriptive copy.</p>
        <p className="font-mono text-sm text-cyan">
          mono · JetBrains Mono for tags, data, terminal
        </p>
      </Section>

      <Section title="buttons">
        <Row label="state">
          {states.map((s) => (
            <span key={s} className="font-mono text-xs text-subtle">
              {s}
            </span>
          ))}
        </Row>
        <Row label="primary">
          <Button>Send message</Button>
          <Button className="bg-cyan-hover shadow-[0_0_28px_rgb(6_182_212/0.55)]">
            Send message
          </Button>
          <Button className="translate-y-px bg-cyan-active">Send message</Button>
          <Button className="outline-2 outline-offset-3 outline-ink">Send message</Button>
        </Row>
        <Row label="secondary">
          <ButtonLink href="/styleguide" variant="secondary">
            Read case studies
          </ButtonLink>
          <ButtonLink href="/styleguide" variant="secondary" className="border-purple bg-slate">
            Read case studies
          </ButtonLink>
          <ButtonLink href="/styleguide" variant="secondary" className="border-purple bg-purple/15">
            Read case studies
          </ButtonLink>
          <ButtonLink
            href="/styleguide"
            variant="secondary"
            className="outline-2 outline-offset-3 outline-cyan"
          >
            Read case studies
          </ButtonLink>
        </Row>
        <Row label="terminal tab">
          <div role="tablist" aria-label="Idle tab example">
            <TerminalTab selected={false} controls="sg-panel-1">
              ~/operations
            </TerminalTab>
          </div>
          <div role="tablist" aria-label="Hover tab example">
            <TerminalTab
              selected={false}
              controls="sg-panel-2"
              className="border-line-strong bg-slate text-ink"
            >
              ~/operations
            </TerminalTab>
          </div>
          <div role="tablist" aria-label="Selected tab example">
            <TerminalTab selected controls="sg-panel-3">
              ~/operations
            </TerminalTab>
          </div>
          <div role="tablist" aria-label="Focused tab example">
            <TerminalTab
              selected={false}
              controls="sg-panel-4"
              className="text-ink outline-2 outline-offset-2 outline-cyan"
            >
              ~/operations
            </TerminalTab>
          </div>
        </Row>
        {/* Panels for the demo tabs, so every aria-controls points at a real element. */}
        {[1, 2, 3, 4].map((n) => (
          <div key={n} id={`sg-panel-${n}`} role="tabpanel" aria-label="Example panel" hidden />
        ))}
      </Section>

      <Section title="tags and badges">
        <Row label="tech tag">
          <Tag>Docker</Tag>
          <Tag className="border-subtle bg-slate text-ink">Docker</Tag>
          <Tag active>Docker</Tag>
          <Tag className="text-ink outline-2 outline-offset-2 outline-cyan">Docker</Tag>
        </Row>
        <Row label="status">
          <StatusBadge>online</StatusBadge>
          <StatusBadge tone="ok">online</StatusBadge>
          <StatusBadge tone="info">online</StatusBadge>
          <StatusBadge className="outline-2 outline-offset-2 outline-cyan">online</StatusBadge>
        </Row>
      </Section>

      <Section title="form fields">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <TextField id="sg-default" label="Default" placeholder="jordan@company.com" />
          <TextField
            id="sg-focus"
            label="Focus"
            defaultValue="jordan@"
            className="[&_input]:border-cyan [&_input]:shadow-[0_0_0_3px_rgb(6_182_212/0.25)]"
          />
          <TextField
            id="sg-error"
            label="Error"
            defaultValue="jordan@company"
            error="invalid address: expected name@domain"
          />
          <TextField
            id="sg-valid"
            label="Valid"
            defaultValue="jordan@company.com"
            validMessage="address verified"
          />
        </div>
      </Section>
    </main>
  );
}
