import type { AppErrorCode } from "./error-codes";

export interface AppErrorOptions {
    code: AppErrorCode;
    message: string;
    cause?: unknown;
    metadata?: Record<string, unknown>;
}

export class AppError extends Error {
    public readonly code: AppErrorCode;
    public readonly cause?: unknown;
    public readonly metadata?: Record<string, unknown>;

    constructor(options: AppErrorOptions) {
        super(options.message);

        this.name = "AppError";
        this.code = options.code;
        this.cause = options.cause;
        this.metadata = options.metadata;
    }
}