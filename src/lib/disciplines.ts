/**
 * The four disciplines a project can belong to (C05). Kept apart from the
 * project records so the client-side filter does not bundle every record.
 * Ids are what ?filter= carries; labels are the schema's discipline names.
 */
export type ProjectCategory = "product" | "design-engineering" | "ai" | "data";

export const disciplines: readonly { id: ProjectCategory; label: string }[] = [
  { id: "product", label: "Product Design" },
  { id: "design-engineering", label: "Design Engineering" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "data", label: "Data" },
];

export function disciplineLabel(id: ProjectCategory): string {
  return disciplines.find((d) => d.id === id)?.label ?? id;
}
