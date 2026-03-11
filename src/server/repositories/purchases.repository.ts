import { desc, eq } from "drizzle-orm";

import {
    purchaseItems,
    purchases,
} from "@/../drizzle/schema";
import type {
    CreatePendingPurchaseInput,
    CreatePurchaseItemSnapshotInput,
    GetPurchaseByIdParams,
    ListPurchasesByUserIdParams,
} from "@/server/purchases/types/purchase.types";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const purchaseSelect = {
    id: purchases.id,
    user_id: purchases.user_id,
    status: purchases.status,
    currency_code: purchases.currency_code,
    total_amount: purchases.total_amount,
    paid_at: purchases.paid_at,
    cancelled_at: purchases.cancelled_at,
    refunded_at: purchases.refunded_at,
    notes: purchases.notes,
    created_at: purchases.created_at,
    updated_at: purchases.updated_at,
};

const purchaseItemSelect = {
    id: purchaseItems.id,
    purchase_id: purchaseItems.purchase_id,
    service_id: purchaseItems.service_id,
    quantity: purchaseItems.quantity,
    unit_price_amount: purchaseItems.unit_price_amount,
    line_total_amount: purchaseItems.line_total_amount,
    currency_code: purchaseItems.currency_code,
    service_title_snapshot: purchaseItems.service_title_snapshot,
    service_slug_snapshot: purchaseItems.service_slug_snapshot,
    service_short_description_snapshot:
        purchaseItems.service_short_description_snapshot,
    created_at: purchaseItems.created_at,
};

export function createPurchasesRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async createPendingPurchase(input: CreatePendingPurchaseInput) {
            const [purchase] = await executor
                .insert(purchases)
                .values({
                    user_id: input.userId,
                    status: "pending",
                    currency_code: input.currencyCode,
                    total_amount: input.totalAmount,
                    notes: input.notes ?? null,
                })
                .returning(purchaseSelect);

            return purchase;
        },

        async createPurchaseItems(
            items: CreatePurchaseItemSnapshotInput[],
        ) {
            if (items.length === 0) {
                return [];
            }

            const createdItems = await executor
                .insert(purchaseItems)
                .values(
                    items.map((item) => ({
                        purchase_id: item.purchaseId,
                        service_id: item.serviceId ?? null,
                        quantity: item.quantity,
                        unit_price_amount: item.unitPriceAmount,
                        line_total_amount: item.lineTotalAmount,
                        currency_code: item.currencyCode,
                        service_title_snapshot: item.serviceTitleSnapshot,
                        service_slug_snapshot: item.serviceSlugSnapshot,
                        service_short_description_snapshot:
                            item.serviceShortDescriptionSnapshot ?? null,
                    })),
                )
                .returning(purchaseItemSelect);

            return createdItems;
        },

        async findById(params: GetPurchaseByIdParams) {
            const [purchase] = await executor
                .select(purchaseSelect)
                .from(purchases)
                .where(eq(purchases.id, params.purchaseId))
                .limit(1);

            return purchase ?? null;
        },

        async listByUserId(params: ListPurchasesByUserIdParams) {
            const rows = await executor
                .select(purchaseSelect)
                .from(purchases)
                .where(eq(purchases.user_id, params.userId))
                .orderBy(desc(purchases.created_at));

            return rows;
        },

        async listItemsByPurchaseId(purchaseId: string) {
            const rows = await executor
                .select(purchaseItemSelect)
                .from(purchaseItems)
                .where(eq(purchaseItems.purchase_id, purchaseId))
                .orderBy(desc(purchaseItems.created_at));

            return rows;
        },
    };
}