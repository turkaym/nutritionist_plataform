import { and, asc, eq } from "drizzle-orm";

import {
    blogPostTags,
    blogTags,
} from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const blogTagSelect = {
    id: blogTags.id,
    name: blogTags.name,
    slug: blogTags.slug,
    description: blogTags.description,
    is_active: blogTags.is_active,
    created_at: blogTags.created_at,
    updated_at: blogTags.updated_at,
};

export function createBlogTagsRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async listActive() {
            const tags = await executor
                .select(blogTagSelect)
                .from(blogTags)
                .where(eq(blogTags.is_active, true))
                .orderBy(asc(blogTags.name));

            return tags;
        },

        async listByPostId(postId: string) {
            const tags = await executor
                .select(blogTagSelect)
                .from(blogTags)
                .innerJoin(
                    blogPostTags,
                    eq(blogPostTags.tag_id, blogTags.id),
                )
                .where(
                    and(
                        eq(blogPostTags.post_id, postId),
                        eq(blogTags.is_active, true),
                    ),
                )
                .orderBy(asc(blogTags.name));

            return tags;
        },
    };
}