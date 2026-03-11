import type {
    NormalizedPagination,
    PaginationParams,
} from "@/server/shared/contracts/pagination";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export function normalizePagination(
    params: PaginationParams = {},
): NormalizedPagination {
    const page =
        typeof params.page === "number" && params.page > 0
            ? Math.floor(params.page)
            : DEFAULT_PAGE;

    const rawPageSize =
        typeof params.pageSize === "number" && params.pageSize > 0
            ? Math.floor(params.pageSize)
            : DEFAULT_PAGE_SIZE;

    const pageSize = Math.min(rawPageSize, MAX_PAGE_SIZE);
    const offset = (page - 1) * pageSize;

    return {
        page,
        pageSize,
        offset,
        limit: pageSize,
    };
}