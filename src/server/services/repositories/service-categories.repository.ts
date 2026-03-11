import { and, asc, eq, isNull } from "drizzle-orm";

import {
    serviceCategories,
    serviceCategoryRel,
} from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const serviceCategorySelect = {
    id: serviceCategories.id,
    name: serviceCategories.name,
    slug: serviceCategories.slug,
    description: serviceCategories.description,
    is_active: serviceCategories.is_active,
    sort_order: serviceCategories.sort_order,
    created_at: serviceCategories.created_at,
    updated_at: serviceCategories.updated_at,
};

export function createServiceCategoriesRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async listActive() {
            const categories = await executor
                .select(serviceCategorySelect)
                .from(serviceCategories)
                .where(
                    and(
                        eq(serviceCategories.is_active, true),
                        isNull(serviceCategories.deleted_at),
                    ),
                )
                .orderBy(asc(serviceCategories.sort_order), asc(serviceCategories.name));

            return categories;
        },

        async listByServiceId(serviceId: string) {
            const rows = await executor
                .select(serviceCategorySelect)
                .from(serviceCategories)
                .innerJoin(
                    serviceCategoryRel,
                    eq(serviceCategoryRel.category_id, serviceCategories.id),
                )
                .where(
                    and(
                        eq(serviceCategoryRel.service_id, serviceId),
                        eq(serviceCategories.is_active, true),
                        isNull(serviceCategories.deleted_at),
                    ),
                )
                .orderBy(asc(serviceCategories.sort_order), asc(serviceCategories.name));

            return rows.map((row) => row);
        },
    };
}