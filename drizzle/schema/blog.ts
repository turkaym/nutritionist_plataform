import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgTable,
    text,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";
import {
    blogPostStatusEnum,
    createIdColumn,
    createdAtColumn,
    deletedAtColumn,
    publishedAtColumn,
    updatedAtColumn,
} from "./common";

export const blogPosts = pgTable(
    "blog_posts",
    {
        id: createIdColumn(),
        author_user_id: uuid("author_user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        title: text("title").notNull(),
        slug: text("slug").notNull(),
        excerpt: text("excerpt"),
        content: text("content").notNull(),
        cover_image_url: text("cover_image_url"),
        status: blogPostStatusEnum("status").default("draft").notNull(),
        is_featured: boolean("is_featured").default(false).notNull(),
        seo_title: text("seo_title"),
        seo_description: text("seo_description"),
        reading_time_minutes: integer("reading_time_minutes"),
        published_at: publishedAtColumn(),
        deleted_at: deletedAtColumn(),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        blogPostsSlugUniqueIdx: uniqueIndex("blog_posts_slug_unique_idx").on(
            table.slug,
        ),
        blogPostsAuthorIdx: index("blog_posts_author_idx").on(table.author_user_id),
        blogPostsStatusIdx: index("blog_posts_status_idx").on(table.status),
        blogPostsPublishedAtIdx: index("blog_posts_published_at_idx").on(
            table.published_at,
        ),
        blogPostsFeaturedIdx: index("blog_posts_featured_idx").on(table.is_featured),
    }),
);

export const blogTags = pgTable(
    "blog_tags",
    {
        id: createIdColumn(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),
        is_active: boolean("is_active").default(true).notNull(),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        blogTagsNameUniqueIdx: uniqueIndex("blog_tags_name_unique_idx").on(
            table.name,
        ),
        blogTagsSlugUniqueIdx: uniqueIndex("blog_tags_slug_unique_idx").on(
            table.slug,
        ),
        blogTagsIsActiveIdx: index("blog_tags_is_active_idx").on(table.is_active),
    }),
);

export const blogPostTags = pgTable(
    "blog_post_tags",
    {
        id: createIdColumn(),
        post_id: uuid("post_id")
            .notNull()
            .references(() => blogPosts.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        tag_id: uuid("tag_id")
            .notNull()
            .references(() => blogTags.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        created_at: createdAtColumn(),
    },
    (table) => ({
        blogPostTagsUniqueIdx: uniqueIndex("blog_post_tags_unique_idx").on(
            table.post_id,
            table.tag_id,
        ),
        blogPostTagsPostIdx: index("blog_post_tags_post_idx").on(table.post_id),
        blogPostTagsTagIdx: index("blog_post_tags_tag_idx").on(table.tag_id),
    }),
);

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
    author: one(users, {
        fields: [blogPosts.author_user_id],
        references: [users.id],
    }),
    tagRelations: many(blogPostTags),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
    postRelations: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
    post: one(blogPosts, {
        fields: [blogPostTags.post_id],
        references: [blogPosts.id],
    }),
    tag: one(blogTags, {
        fields: [blogPostTags.tag_id],
        references: [blogTags.id],
    }),
}));