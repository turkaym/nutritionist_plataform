export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}