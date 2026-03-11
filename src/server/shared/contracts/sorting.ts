export type SortDirection = "asc" | "desc";

export interface SortOption<TField extends string = string> {
    field: TField;
    direction: SortDirection;
}
