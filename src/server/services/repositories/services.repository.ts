import { and, desc, eq, isNull, asc } from "drizzle-orm";

import {
    serviceCategoryRel,
    serviceCategories,
    services,
} from "@/../drizzle/schema";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";
import { normalizePagination } from "@/server/shared/utils/pagination";
import type {
    GetServiceByIdParams,
    GetServiceBySlugParams,
    ListPublicServicesParams,
} from "@/server/services/types/service.types";

const publicServiceSelect = {
    id: services.id,
    title: services.title,
    slug: services.slug,
    short_description: services.short_description,
    description: services.description,
    cover_image_url: services.cover_image_url,
    status: services.status,
    is_active: services.is_active,
    price_amount: services.price_amount,
    currency_code: services.currency_code,
    sort_order: services.sort_order,
    published_at: services.published_at,
    created_at: services.created_at,
    updated_at: services.updated_at,
};

export function createServicesRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async listPublicServices(params: ListPublicServicesParams = {}) {
            const pagination = normalizePagination(params);

            const baseConditions = [
                eq(services.status, "published"),
                eq(services.is_active, true),
                isNull(services.deleted_at),
            ];

            if (params.categorySlug?.trim()) {
                const rows = await executor
                    .select(publicServiceSelect)
                    .from(services)
                    .innerJoin(
                        serviceCategoryRel,
                        eq(serviceCategoryRel.service_id, services.id),
                    )
                    .innerJoin(
                        serviceCategories,
                        eq(serviceCategories.id, serviceCategoryRel.category_id),
                    )
                    .where(
                        and(
                            ...baseConditions,
                            eq(serviceCategories.slug, params.categorySlug.trim()),
                            eq(serviceCategories.is_active, true),
                            isNull(serviceCategories.deleted_at),
                        ),
                    )
                    .orderBy(asc(services.sort_order), desc(services.created_at))
                    .limit(pagination.limit)
                    .offset(pagination.offset);

                return rows.map((row) => row);
            }

            const rows = await executor
                .select(publicServiceSelect)
                .from(services)
                .where(and(...baseConditions))
                .orderBy(asc(services.sort_order), desc(services.created_at))
                .limit(pagination.limit)
                .offset(pagination.offset);

            return rows;
        },

        async findBySlug(params: GetServiceBySlugParams) {
            const [service] = await executor
                .select(publicServiceSelect)
                .from(services)
                .where(
                    and(
                        eq(services.slug, params.slug),
                        eq(services.status, "published"),
                        eq(services.is_active, true),
                        isNull(services.deleted_at),
                    ),
                )
                .limit(1);

            return service ?? null;
        },

        async findById(params: GetServiceByIdParams) {
            const [service] = await executor
                .select(publicServiceSelect)
                .from(services)
                .where(
                    and(
                        eq(services.id, params.serviceId),
                        isNull(services.deleted_at),
                    ),
                )
                .limit(1);

            return service ?? null;
        },
    };
}