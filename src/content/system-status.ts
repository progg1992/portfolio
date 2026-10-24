/**
 * The system_status terminal on the home page (PTR-21). Copy follows the
 * approved Main artboard, adjusted where the resume (PTR-8) words a claim
 * differently. Every figure carries its source (CNT-01).
 */

export type System = {
  key: string;
  name: string;
  detail: string;
  /** Spans two bento columns on wide screens. */
  wide?: boolean;
  accent?: boolean;
};

export type Stat = {
  key: string;
  value: string;
  body: string;
  source: string;
  accent?: boolean;
};

export const tabs = [
  { id: "infrastructure", path: "~/infrastructure", command: "ls --systems" },
  { id: "operations", path: "~/operations", command: "cat metrics.log" },
  { id: "leadership", path: "~/leadership", command: "whoami --team" },
] as const;

export type TabId = (typeof tabs)[number]["id"];

export const systems: System[] = [
  {
    key: "windows_server",
    name: "Windows Server",
    detail: "server os · directory · identity",
    wide: true,
  },
  { key: "linux", name: "Ubuntu Linux", detail: "server os" },
  { key: "containers", name: "Docker", detail: "containers · staging and production" },
  { key: "hypervisor", name: "VMware", detail: "virtualization" },
  { key: "hypervisor", name: "Hyper-V", detail: "virtualization" },
  {
    key: "perimeter",
    name: "pfSense",
    detail: "firewall · routing · segmentation",
    wide: true,
    accent: true,
  },
];

export const operations: Stat[] = [
  {
    key: "budget_ownership",
    value: "$150K",
    body: "Technology budget managed across vendors, procurement, licensing, and renewals.",
    source: "Certified Bice Ltd., 2023 to 2025",
  },
  {
    key: "delay_reduction",
    value: "-25%",
    body: "Fewer project delays through infrastructure optimization, automation, and stakeholder coordination.",
    source: "Twin Designs and Tech, 2023 to 2024",
  },
  {
    key: "framework_alignment",
    value: "NIST",
    body: "Continuity, recovery, and risk procedures informed by NIST practices.",
    source: "Blue Devil Development, 2025 to present",
    accent: true,
  },
];

export const leadership: Stat[] = [
  {
    key: "team_size",
    value: "10",
    body: "Up to ten developers, designers, and lead generation specialists, across time zones including the Philippines and Pakistan.",
    source: "Twin Designs and Tech, 2023 to 2024",
  },
  {
    key: "delivery_model",
    value: "Agile",
    body: "Sprint planning, stakeholder coordination, and release management across time zones.",
    source: "Twin Designs and Tech, 2023 to 2024; OurBytes, 2021 to 2023",
  },
  {
    key: "mentorship",
    value: "95%",
    body: "Job placement rate for the junior developers and project managers I trained.",
    source: "OurBytes apprenticeship program, 2021 to 2023",
    accent: true,
  },
];
