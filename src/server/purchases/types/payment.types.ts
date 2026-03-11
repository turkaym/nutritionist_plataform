export interface CreatePaymentRecordInput {
    purchaseId: string;
    provider?: "mercado_pago";
    status?: "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "failed";
    externalPaymentId?: string | null;
    externalPreferenceId?: string | null;
    externalReference?: string | null;
    amount: number;
    currencyCode: "ARS";
    providerResponseRaw?: string | null;
    approvedAt?: Date | null;
    failedAt?: Date | null;
    refundedAt?: Date | null;
}

export interface UpdatePaymentStatusInput {
    paymentId: string;
    status: "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "failed";
    providerResponseRaw?: string | null;
    approvedAt?: Date | null;
    failedAt?: Date | null;
    refundedAt?: Date | null;
}

export interface CreateDeliveryRecordInput {
    purchaseId: string;
    paymentId?: string | null;
    userId: string;
    channel?: "email";
    status?: "pending" | "sent" | "failed";
    recipientEmail: string;
    deliverySubject?: string | null;
    deliveryPayloadSnapshot?: string | null;
    providerMessageId?: string | null;
    errorMessage?: string | null;
    deliveredAt?: Date | null;
    failedAt?: Date | null;
}