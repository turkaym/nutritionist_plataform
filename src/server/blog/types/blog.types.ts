import type { PaginationParams } from "@/server/shared/contracts/pagination";

export interface ListPublishedPostsParams extends PaginationParams {
    tagSlug?: string;
    featuredOnly?: boolean;
}

export interface GetPostBySlugParams {
    slug: string;
}

export interface GetPostByIdParams {
    postId: string;
}