export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export interface NormalizedPagination {
    page: number;
    pageSize: number;
    offset: number;
    limit: number;
}