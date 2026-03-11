import { desc, eq } from "drizzle-orm";

import { deliveryRecords } from "@/../drizzle/schema";
import type { CreateDeliveryRecordInput } from "@/server/purchases/types/payment.types";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const deliveryRecordSelect = {
    id: deliveryRecords.id,
    purchase_id: deliveryRecords.purchase_id,
    payment_id: deliveryRecords.payment_id,
    user_id: deliveryRecords.user_id,
    channel: deliveryRecords.channel,
    status: deliveryRecords.status,
    recipient_email: deliveryRecords.recipient_email,
    delivery_subject: deliveryRecords.delivery_subject,
    delivery_payload_snapshot: deliveryRecords.delivery_payload_snapshot,
    provider_message_id: deliveryRecords.provider_message_id,
    error_message: deliveryRecords.error_message,
    delivered_at: deliveryRecords.delivered_at,
    failed_at: deliveryRecords.failed_at,
    created_at: deliveryRecords.created_at,
    updated_at: deliveryRecords.updated_at,
};

export function createDeliveryRecordsRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async createDeliveryRecord(input: CreateDeliveryRecordInput) {
            const [record] = await executor
                .insert(deliveryRecords)
                .values({
                    purchase_id: input.purchaseId,
                    payment_id: input.paymentId ?? null,
                    user_id: input.userId,
                    channel: input.channel ?? "email",
                    status: input.status ?? "pending",
                    recipient_email: input.recipientEmail,
                    delivery_subject: input.deliverySubject ?? null,
                    delivery_payload_snapshot: input.deliveryPayloadSnapshot ?? null,
                    provider_message_id: input.providerMessageId ?? null,
                    error_message: input.errorMessage ?? null,
                    delivered_at: input.deliveredAt ?? null,
                    failed_at: input.failedAt ?? null,
                })
                .returning(deliveryRecordSelect);

            return record;
        },

        async findById(deliveryRecordId: string) {
            const [record] = await executor
                .select(deliveryRecordSelect)
                .from(deliveryRecords)
                .where(eq(deliveryRecords.id, deliveryRecordId))
                .limit(1);

            return record ?? null;
        },

        async listByPurchaseId(purchaseId: string) {
            const rows = await executor
                .select(deliveryRecordSelect)
                .from(deliveryRecords)
                .where(eq(deliveryRecords.purchase_id, purchaseId))
                .orderBy(desc(deliveryRecords.created_at));

            return rows;
        },
    };
}