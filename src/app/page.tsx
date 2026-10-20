// Placeholder until the home hub ships in Sprint 2 (PTR-20).
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-6 px-6">
      <p className="font-mono text-sm text-purple-text">~/status</p>
      <h1 className="text-display font-bold">Pierce Rogg</h1>
      <p className="font-mono text-cyan">
        Technical Project Manager · Principal Technologist · Systems Operations Leader
      </p>
      <p className="max-w-xl text-lg text-muted">
        This site is being built in the open as a four-sprint Scrum engagement.
      </p>
    </main>
  );
}
