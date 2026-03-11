import type { db } from "@/server/db";
import type { TransactionExecutor } from "./transaction.types";

export type DatabaseExecutor = typeof db | TransactionExecutor;