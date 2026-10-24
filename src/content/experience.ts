/**
 * Experience page data (PTR-49). Copy follows the approved Experience artboard,
 * which was written from the resume (PTR-8). Every figure sits with the role it
 * came from (PTR-6), so the role is the figure's source.
 */

/** A figure inside an outcome, rendered with emphasis. */
export type Segment = string | { figure: string };

export type Role = {
  title: string;
  organization: string;
  location: string;
  /** Years as written on the resume. `end` is null for a current role. */
  start: number;
  end: number | null;
  outcomes: Segment[][];
};

export const intro = {
  heading: "Five years of owning the environment",
  body: "Servers, networks, identity, security, cloud, vendors, and budgets for small technology businesses, plus the outages, incidents, and teams that come with them.",
};

/** The home page teaser for this page (PTR-20). */
export const teaser = {
  title: "Operations first, development second",
  body: "Role history, the infrastructure record, and the skills behind it.",
  cta: "view experience",
};

/** Newest first. Several roles were remote and ran at the same time. */
export const roles: Role[] = [
  {
    title: "Founder and CEO",
    organization: "Blue Devil Development",
    location: "Michigan, remote",
    start: 2025,
    end: null,
    outcomes: [
      [
        "Own technology strategy and operations: Linux servers, cloud infrastructure, DNS, identity and access, monitoring, backups, security, and vendors.",
      ],
      [
        "Run Ubuntu production environments, Dockerized services, UFW host firewalls, CI/CD, and separate staging and production.",
      ],
      [
        "Designed and built BDOS v3: ",
        { figure: "146" },
        " canonical models across ",
        { figure: "14" },
        " domains, with JSON Schema validation and generated documentation.",
      ],
    ],
  },
  {
    title: "Technical Operations and Systems Lead",
    organization: "Certified Bice Ltd.",
    location: "remote",
    start: 2023,
    end: 2025,
    outcomes: [
      [
        "Owned the full technology environment: 6 employees, 10 websites, Windows Server 2019, Active Directory, Group Policy, and Google Workspace.",
      ],
      [
        "Managed a ",
        { figure: "$150,000" },
        " technology budget and delivered about ",
        { figure: "$250,000" },
        " in annual savings through new workflow and operational systems.",
      ],
      [
        "Recovered a corrupted website database during a hosting migration, then wrote the migration SOP and trained developers on backup and recovery.",
      ],
    ],
  },
  {
    title: "Fractional Chief Technology Officer",
    organization: "FelonyDiscrimination.org",
    location: "remote",
    start: 2023,
    end: 2025,
    outcomes: [
      [
        "Led technology strategy, secure platform development, accessibility, and team coordination for a nonprofit supporting reentry and anti-discrimination work.",
      ],
    ],
  },
  {
    title: "Senior Technical Analyst and Technical Project Manager",
    organization: "Twin Designs and Tech",
    location: "remote",
    start: 2023,
    end: 2024,
    outcomes: [
      [
        "Ran Agile delivery across teams in the Philippines and Pakistan, reducing project delays ",
        { figure: "25%" },
        " and improving operational efficiency ",
        { figure: "20%" },
        ".",
      ],
      [
        "Restored production after a deployment exhausted server resources; added monitoring and a documented recovery procedure.",
      ],
      [
        "Investigated a suspected bulk data exfiltration through Workspace access logs, revoked the account, tightened download alerts, and briefed leadership.",
      ],
    ],
  },
  {
    title: "Project Manager and Lead Developer",
    organization: "OurBytes",
    location: "remote",
    start: 2021,
    end: 2023,
    outcomes: [
      [
        "Directed full-lifecycle application projects and introduced workflow changes that raised development speed ",
        { figure: "15%" },
        ".",
      ],
      [
        "Lead trainer in the apprenticeship program for junior developers and project managers: ",
        { figure: "95%" },
        " job placement on completion.",
      ],
    ],
  },
  {
    title: "Software Application Developer",
    organization: "Auctioneer Software",
    location: "Grandville, Michigan",
    start: 2021,
    end: 2021,
    outcomes: [
      [
        "Maintained React, TypeScript, and PostgreSQL auction software and the physical servers it ran on.",
      ],
      [
        "Configured Cisco and pfSense networking: firewall rules, VLANs, routing, and intrusion detection.",
      ],
    ],
  },
];

/** Grouped as on the resume's Areas of Expertise. */
export const skills: { group: string; items: string[] }[] = [
  { group: "infrastructure", items: ["Windows Server", "Ubuntu", "VMware", "Hyper-V", "Docker"] },
  {
    group: "identity and collaboration",
    items: ["Active Directory", "Group Policy", "DNS · DHCP", "Google Workspace"],
  },
  {
    group: "networking and security",
    items: ["Cisco", "pfSense", "VLANs", "Intrusion detection", "NIST practices"],
  },
  {
    group: "operations and leadership",
    items: [
      "Incident response",
      "Backup and recovery",
      "Vendor management",
      "Budgeting",
      "SOPs and training",
    ],
  },
];
