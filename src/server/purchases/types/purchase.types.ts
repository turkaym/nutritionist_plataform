export interface CreatePendingPurchaseInput {
    userId: string;
    currencyCode: "ARS";
    totalAmount: number;
    notes?: string | null;
}

export interface CreatePurchaseItemSnapshotInput {
    purchaseId: string;
    serviceId?: string | null;
    quantity: number;
    unitPriceAmount: number;
    lineTotalAmount: number;
    currencyCode: "ARS";
    serviceTitleSnapshot: string;
    serviceSlugSnapshot: string;
    serviceShortDescriptionSnapshot?: string | null;
}

export interface GetPurchaseByIdParams {
    purchaseId: string;
}

export interface ListPurchasesByUserIdParams {
    userId: string;
}