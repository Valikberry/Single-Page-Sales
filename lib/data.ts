import type { CategoryWithDescription } from "./types";

export function extractCategoriesWithDescription(
  data: Record<string, any[][]>
): CategoryWithDescription[] {
  const result: [string, string, string][] = [];

  for (const [key, items] of Object.entries(data)) {
    
    for (const item of items) {
      const description = item[item.length - 3];
      const id = item[item.length - 2];
      const name = item[item.length - 1];
      if (id && name && description) {
        result.push([id, name, description]);
        break;
      }
    }
  }

  const transformed = result.map(([id, name, description]) => ({
    id,
    name,
    description,
  }));

  return transformed;
}
