import { desc, eq } from "drizzle-orm";

import { payments } from "@/../drizzle/schema";
import type {
    CreatePaymentRecordInput,
    UpdatePaymentStatusInput,
} from "@/server/purchases/types/payment.types";
import { database } from "@/server/shared/db/database";
import type { DatabaseExecutor } from "@/server/shared/db/types";

const paymentSelect = {
    id: payments.id,
    purchase_id: payments.purchase_id,
    provider: payments.provider,
    status: payments.status,
    external_payment_id: payments.external_payment_id,
    external_preference_id: payments.external_preference_id,
    external_reference: payments.external_reference,
    amount: payments.amount,
    currency_code: payments.currency_code,
    provider_response_raw: payments.provider_response_raw,
    approved_at: payments.approved_at,
    failed_at: payments.failed_at,
    refunded_at: payments.refunded_at,
    created_at: payments.created_at,
    updated_at: payments.updated_at,
};

export function createPaymentsRepository(
    executor: DatabaseExecutor = database,
) {
    return {
        async createPaymentRecord(input: CreatePaymentRecordInput) {
            const [payment] = await executor
                .insert(payments)
                .values({
                    purchase_id: input.purchaseId,
                    provider: input.provider ?? "mercado_pago",
                    status: input.status ?? "pending",
                    external_payment_id: input.externalPaymentId ?? null,
                    external_preference_id: input.externalPreferenceId ?? null,
                    external_reference: input.externalReference ?? null,
                    amount: input.amount,
                    currency_code: input.currencyCode,
                    provider_response_raw: input.providerResponseRaw ?? null,
                    approved_at: input.approvedAt ?? null,
                    failed_at: input.failedAt ?? null,
                    refunded_at: input.refundedAt ?? null,
                })
                .returning(paymentSelect);

            return payment;
        },

        async updatePaymentStatus(input: UpdatePaymentStatusInput) {
            const [payment] = await executor
                .update(payments)
                .set({
                    status: input.status,
                    provider_response_raw: input.providerResponseRaw ?? null,
                    approved_at: input.approvedAt ?? null,
                    failed_at: input.failedAt ?? null,
                    refunded_at: input.refundedAt ?? null,
                    updated_at: new Date(),
                })
                .where(eq(payments.id, input.paymentId))
                .returning(paymentSelect);

            return payment ?? null;
        },

        async findById(paymentId: string) {
            const [payment] = await executor
                .select(paymentSelect)
                .from(payments)
                .where(eq(payments.id, paymentId))
                .limit(1);

            return payment ?? null;
        },

        async listByPurchaseId(purchaseId: string) {
            const rows = await executor
                .select(paymentSelect)
                .from(payments)
                .where(eq(payments.purchase_id, purchaseId))
                .orderBy(desc(payments.created_at));

            return rows;
        },
    };
}