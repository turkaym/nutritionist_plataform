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

import {
    createIdColumn,
    createdAtColumn,
    currencyCodeEnum,
    deletedAtColumn,
    publishedAtColumn,
    serviceStatusEnum,
    updatedAtColumn,
} from "./common";

export const services = pgTable(
    "services",
    {
        id: createIdColumn(),
        title: text("title").notNull(),
        slug: text("slug").notNull(),
        short_description: text("short_description"),
        description: text("description"),
        cover_image_url: text("cover_image_url"),
        status: serviceStatusEnum("status").default("draft").notNull(),
        is_active: boolean("is_active").default(true).notNull(),
        price_amount: integer("price_amount").notNull(),
        currency_code: currencyCodeEnum("currency_code").default("ARS").notNull(),
        sort_order: integer("sort_order").default(0).notNull(),
        published_at: publishedAtColumn(),
        deleted_at: deletedAtColumn(),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        servicesSlugUniqueIdx: uniqueIndex("services_slug_unique_idx").on(
            table.slug,
        ),
        servicesStatusIdx: index("services_status_idx").on(table.status),
        servicesIsActiveIdx: index("services_is_active_idx").on(table.is_active),
        servicesSortOrderIdx: index("services_sort_order_idx").on(table.sort_order),
    }),
);

export const serviceCategories = pgTable(
    "service_categories",
    {
        id: createIdColumn(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),
        is_active: boolean("is_active").default(true).notNull(),
        sort_order: integer("sort_order").default(0).notNull(),
        deleted_at: deletedAtColumn(),
        created_at: createdAtColumn(),
        updated_at: updatedAtColumn(),
    },
    (table) => ({
        serviceCategoriesNameUniqueIdx: uniqueIndex(
            "service_categories_name_unique_idx",
        ).on(table.name),
        serviceCategoriesSlugUniqueIdx: uniqueIndex(
            "service_categories_slug_unique_idx",
        ).on(table.slug),
        serviceCategoriesIsActiveIdx: index("service_categories_is_active_idx").on(
            table.is_active,
        ),
        serviceCategoriesSortOrderIdx: index(
            "service_categories_sort_order_idx",
        ).on(table.sort_order),
    }),
);

export const serviceCategoryRel = pgTable(
    "service_category_rel",
    {
        id: createIdColumn(),
        service_id: uuid("service_id")
            .notNull()
            .references(() => services.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        category_id: uuid("category_id")
            .notNull()
            .references(() => serviceCategories.id, {
                onDelete: "restrict",
                onUpdate: "cascade",
            }),
        created_at: createdAtColumn(),
    },
    (table) => ({
        serviceCategoryRelUniqueIdx: uniqueIndex("service_category_rel_unique_idx").on(
            table.service_id,
            table.category_id,
        ),
        serviceCategoryRelServiceIdx: index("service_category_rel_service_idx").on(
            table.service_id,
        ),
        serviceCategoryRelCategoryIdx: index(
            "service_category_rel_category_idx",
        ).on(table.category_id),
    }),
);

export const servicesRelations = relations(services, ({ many }) => ({
    categoryRelations: many(serviceCategoryRel),
}));

export const serviceCategoriesRelations = relations(
    serviceCategories,
    ({ many }) => ({
        serviceRelations: many(serviceCategoryRel),
    }),
);

export const serviceCategoryRelRelations = relations(
    serviceCategoryRel,
    ({ one }) => ({
        service: one(services, {
            fields: [serviceCategoryRel.service_id],
            references: [services.id],
        }),
        category: one(serviceCategories, {
            fields: [serviceCategoryRel.category_id],
            references: [serviceCategories.id],
        }),
    }),
);