import { db } from "@/server/db";

import type { TransactionExecutor } from "./transaction.types";

export async function withTransaction<T>(
    callback: (transaction: TransactionExecutor) => Promise<T>,
): Promise<T> {
    return db.transaction(async (transaction) => {
        return callback(transaction);
    });
}