/**
 * Universal Popularity & Ranking Engine for THE SABBiR OS
 * Calculates and sorts items across Tools, Agents, Games, Projects, and News.
 * Default Sort is ALWAYS 'popular'.
 */

export type SortOption = "popular" | "newest" | "impact" | "alphabetical";

export interface SortAccessors<T> {
  getPopularity?: (item: T) => number;
  getDate?: (item: T) => string | Date | number | undefined;
  getImpact?: (item: T) => number;
  getTitle?: (item: T) => string;
}

export function sortItems<T>(
  items: T[],
  sortBy: SortOption = "popular",
  accessors: SortAccessors<T>
): T[] {
  const cloned = [...items];

  switch (sortBy) {
    case "popular": {
      return cloned.sort((a, b) => {
        const scoreA = accessors.getPopularity ? accessors.getPopularity(a) : 0;
        const scoreB = accessors.getPopularity ? accessors.getPopularity(b) : 0;
        return scoreB - scoreA;
      });
    }

    case "newest": {
      return cloned.sort((a, b) => {
        const dateA = accessors.getDate ? new Date(accessors.getDate(a) || 0).getTime() : 0;
        const dateB = accessors.getDate ? new Date(accessors.getDate(b) || 0).getTime() : 0;
        return dateB - dateA;
      });
    }

    case "impact": {
      return cloned.sort((a, b) => {
        const impactA = accessors.getImpact ? accessors.getImpact(a) : 0;
        const impactB = accessors.getImpact ? accessors.getImpact(b) : 0;
        return impactB - impactA;
      });
    }

    case "alphabetical": {
      return cloned.sort((a, b) => {
        const titleA = accessors.getTitle ? accessors.getTitle(a).toLowerCase() : "";
        const titleB = accessors.getTitle ? accessors.getTitle(b).toLowerCase() : "";
        return titleA.localeCompare(titleB);
      });
    }

    default:
      return cloned;
  }
}
