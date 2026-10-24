/**
 * Home page hero content (PTR-20). Every figure carries its source, the same
 * rule the case study schema enforces (CNT-01). Figures match the resume (PTR-8).
 */
export const hero = {
  availability: "Available for leadership roles and consulting",
  name: "Pierce Rogg",
  titles: ["Technical Project Manager", "Principal Technologist", "Systems Operations Leader"],
  figures: {
    budget: {
      value: "$150K",
      source: "Technology budget managed, Certified Bice Ltd., 2023 to 2025",
    },
    savings: {
      value: "$250K",
      source:
        "Annual savings from workflow and operational systems, Certified Bice Ltd., 2023 to 2025",
    },
  },
} as const;
