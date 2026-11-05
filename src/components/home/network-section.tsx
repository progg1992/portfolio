import { NetworkScene } from "./network-scene";

/**
 * PTR-28 spike, hybrid variant: the 3D topology in its own section below the
 * fold, desktop only. Hidden below 1024 px; the client loader also checks for
 * a fine pointer, WebGL 2 and motion preferences before it loads anything.
 */
export function NetworkSection() {
  return (
    <section aria-labelledby="network-heading" className="hidden lg:block">
      <div className="mx-auto flex max-w-[1040px] flex-col gap-6 px-6 py-26">
        <h2 id="network-heading" className="font-display text-3xl font-semibold text-ink">
          The network I run
        </h2>
        <div
          role="img"
          aria-label="Three-dimensional view of the network topology shown in the hero"
          className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-line bg-charcoal"
        >
          <NetworkScene />
        </div>
      </div>
    </section>
  );
}
