import type { db } from "@/server/db";

export type TransactionExecutor = Parameters<typeof db.transaction>[0] extends (
    transaction: infer T,
) => Promise<unknown>
    ? T
    : never;

