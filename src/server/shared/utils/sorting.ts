import type {
    SortDirection,
    SortOption,
} from "@/server/shared/contracts/sorting";

export function normalizeSortDirection(
    direction?: string,
): SortDirection {
    return direction === "desc" ? "desc" : "asc";
}

export function buildSortOption<TField extends string>(
    field: TField,
    direction?: string,
): SortOption<TField> {
    return {
        field,
        direction: normalizeSortDirection(direction),
    };
}