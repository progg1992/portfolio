/** Case study disciplines. Kept apart from schema.ts so client code can import it without Zod. */
export const disciplines = ["infrastructure", "operations", "delivery", "documentation"] as const;

export type Discipline = (typeof disciplines)[number];
