import { and, desc, eq, isNull } from "drizzle-orm";

import {
    blogPostTags,
    blogPosts,
    blogTags,
} from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";
import { normalizePagination } from "@/server/shared/utils/pagination";
import type {
    GetPostByIdParams,
    GetPostBySlugParams,
    ListPublishedPostsParams,
} from "@/server/blog/types/blog.types";

const publishedPostSelect = {
    id: blogPosts.id,
    author_user_id: blogPosts.author_user_id,
    title: blogPosts.title,
    slug: blogPosts.slug,
    excerpt: blogPosts.excerpt,
    content: blogPosts.content,
    cover_image_url: blogPosts.cover_image_url,
    status: blogPosts.status,
    is_featured: blogPosts.is_featured,
    seo_title: blogPosts.seo_title,
    seo_description: blogPosts.seo_description,
    reading_time_minutes: blogPosts.reading_time_minutes,
    published_at: blogPosts.published_at,
    created_at: blogPosts.created_at,
    updated_at: blogPosts.updated_at,
};

export function createBlogPostsRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async listPublished(params: ListPublishedPostsParams = {}) {
            const pagination = normalizePagination(params);

            const baseConditions = [
                eq(blogPosts.status, "published"),
                isNull(blogPosts.deleted_at)
            ] as const;

            if (params.tagSlug?.trim()) {
                const conditions = [
                    ...baseConditions,
                    eq(blogTags.slug, params.tagSlug.trim()),
                    eq(blogTags.is_active, true),
                ] as const;

                if (params.featuredOnly) {
                    const rows = await executor
                        .select(publishedPostSelect)
                        .from(blogPosts)
                        .innerJoin(
                            blogPostTags,
                            eq(blogPostTags.post_id, blogPosts.id),
                        )
                        .innerJoin(
                            blogTags,
                            eq(blogTags.id, blogPostTags.tag_id),
                        )
                        .where(
                            and(
                                ...conditions,
                                eq(blogPosts.is_featured, true),
                            ),
                        )
                        .orderBy(desc(blogPosts.published_at), desc(blogPosts.created_at))
                        .limit(pagination.limit)
                        .offset(pagination.offset);

                    return rows;
                }

                const rows = await executor
                    .select(publishedPostSelect)
                    .from(blogPosts)
                    .innerJoin(
                        blogPostTags,
                        eq(blogPostTags.post_id, blogPosts.id),
                    )
                    .innerJoin(
                        blogTags,
                        eq(blogTags.id, blogPostTags.tag_id),
                    )
                    .where(and(...conditions))
                    .orderBy(desc(blogPosts.published_at), desc(blogPosts.created_at))
                    .limit(pagination.limit)
                    .offset(pagination.offset);

                return rows;
            }

            if (params.featuredOnly) {
                const rows = await executor
                    .select(publishedPostSelect)
                    .from(blogPosts)
                    .where(
                        and(
                            ...baseConditions,
                            eq(blogPosts.is_featured, true),
                        ),
                    )
                    .orderBy(desc(blogPosts.published_at), desc(blogPosts.created_at))
                    .limit(pagination.limit)
                    .offset(pagination.offset);

                return rows;
            }

            const rows = await executor
                .select(publishedPostSelect)
                .from(blogPosts)
                .where(and(...baseConditions))
                .orderBy(desc(blogPosts.published_at), desc(blogPosts.created_at))
                .limit(pagination.limit)
                .offset(pagination.offset);

            return rows;
        },

        async findBySlug(params: GetPostBySlugParams) {
            const [post] = await executor
                .select(publishedPostSelect)
                .from(blogPosts)
                .where(
                    and(
                        eq(blogPosts.slug, params.slug),
                        eq(blogPosts.status, "published"),
                        isNull(blogPosts.deleted_at)
                    ),
                )
                .limit(1);

            return post ?? null;
        },

        async findById(params: GetPostByIdParams) {
            const [post] = await executor
                .select(publishedPostSelect)
                .from(blogPosts)
                .where(
                    and(
                        eq(blogPosts.id, params.postId),
                        isNull(blogPosts.deleted_at)
                    ),
                )
                .limit(1);

            return post ?? null;
        },
    };
}