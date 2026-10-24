/**
 * Static network topology for the home hero (ADR 0004). The interactive 3D
 * version is post-launch (PTR-47). Colors are the design tokens as literals,
 * since SVG presentation attributes cannot read Tailwind classes.
 */
export function Topology() {
  return (
    <figure className="relative m-0 aspect-[1/0.9] overflow-hidden rounded-2xl border border-line bg-charcoal">
      <figcaption className="absolute top-3.5 left-4 font-mono text-[11px] text-subtle">
        topology.svg
      </figcaption>
      <svg
        viewBox="0 0 520 470"
        role="img"
        aria-label="Network topology: an edge firewall linked to a core switch and a hypervisor cluster, which connect to directory, Linux, container, and virtual machine hosts and a database"
        className="absolute inset-x-3 top-9 bottom-3 h-[calc(100%-48px)] w-[calc(100%-24px)]"
      >
        <g stroke="#27272A" strokeWidth="1">
          {[60, 140, 220, 300, 380].map((y) => (
            <line key={y} x1="40" y1={y} x2="480" y2={y} />
          ))}
        </g>
        <g fill="none" strokeWidth="1.5">
          <path d="M260 80 L130 200" stroke="#06B6D4" strokeOpacity="0.8" />
          <path d="M260 80 L390 200" stroke="#06B6D4" strokeOpacity="0.8" />
          <path d="M130 200 L90 330" stroke="#3F3F46" />
          <path d="M130 200 L210 330" stroke="#3F3F46" />
          <path d="M390 200 L330 330" stroke="#A855F7" strokeOpacity="0.8" />
          <path d="M390 200 L450 330" stroke="#3F3F46" />
          <path d="M210 330 L260 420" stroke="#3F3F46" />
          <path d="M330 330 L260 420" stroke="#A855F7" strokeOpacity="0.8" />
          <path d="M130 200 L390 200" stroke="#3F3F46" strokeDasharray="4 6" />
        </g>
        <g className="font-mono" fontSize="11" fill="#A1A1AA" textAnchor="middle">
          <circle cx="260" cy="80" r="22" fill="#09090B" stroke="#06B6D4" strokeWidth="2" />
          <circle cx="260" cy="80" r="6" fill="#06B6D4" />
          <text x="260" y="52">
            edge-fw
          </text>
          <rect
            x="104"
            y="180"
            width="52"
            height="40"
            rx="6"
            fill="#18181B"
            stroke="#06B6D4"
            strokeWidth="1.5"
          />
          <text x="130" y="240">
            core-sw
          </text>
          <rect
            x="364"
            y="180"
            width="52"
            height="40"
            rx="6"
            fill="#18181B"
            stroke="#A855F7"
            strokeWidth="1.5"
          />
          <text x="390" y="240">
            hv-cluster
          </text>
          <rect x="70" y="312" width="40" height="36" rx="4" fill="#18181B" stroke="#3F3F46" />
          <text x="90" y="368">
            srv-ad
          </text>
          <rect x="190" y="312" width="40" height="36" rx="4" fill="#18181B" stroke="#3F3F46" />
          <text x="210" y="368">
            ubuntu
          </text>
          <rect x="310" y="312" width="40" height="36" rx="4" fill="#18181B" stroke="#A855F7" />
          <text x="330" y="368">
            docker
          </text>
          <rect x="430" y="312" width="40" height="36" rx="4" fill="#18181B" stroke="#3F3F46" />
          <text x="450" y="368">
            vm-04
          </text>
          <ellipse
            cx="260"
            cy="412"
            rx="26"
            ry="9"
            fill="#18181B"
            stroke="#A855F7"
            strokeWidth="1.5"
          />
          <rect x="234" y="412" width="52" height="22" fill="#18181B" />
          <ellipse
            cx="260"
            cy="434"
            rx="26"
            ry="9"
            fill="#18181B"
            stroke="#A855F7"
            strokeWidth="1.5"
          />
          <line x1="234" y1="412" x2="234" y2="434" stroke="#A855F7" strokeWidth="1.5" />
          <line x1="286" y1="412" x2="286" y2="434" stroke="#A855F7" strokeWidth="1.5" />
        </g>
      </svg>
    </figure>
  );
}
