import type {
    DateRangeFilter,
    SearchFilter,
} from "@/server/shared/contracts/filters";

export function normalizeSearchFilter(
    filter: SearchFilter,
): string | undefined {
    const search = filter.search?.trim();

    return search ? search : undefined;
}

export function hasDateRange(filter: DateRangeFilter): boolean {
    return Boolean(filter.from || filter.to);
}