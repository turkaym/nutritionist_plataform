import type { PaginationParams } from "@/server/shared/contracts/pagination";

export interface ListPublicServicesParams extends PaginationParams {
    categorySlug?: string;
}

export interface GetServiceBySlugParams {
    slug: string;
}

export interface GetServiceByIdParams {
    serviceId: string;
}