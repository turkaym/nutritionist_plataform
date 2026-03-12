import { NextResponse } from "next/server";

import { AppError } from "@/server/shared/errors/app-error";
import { APP_ERROR_CODES } from "@/server/shared/errors/error-codes";
import { AUTH_ERROR_CODES } from "@/server/auth/contracts/auth-errors";

type ErrorResponseBody = {
    success: false;
    error: {
        code: string;
        message: string;
    };
};

export function mapAuthErrorToResponse(error: unknown): NextResponse<ErrorResponseBody> {
    if (error instanceof AppError) {
        switch (error.code) {
            case APP_ERROR_CODES.VALIDATION_ERROR:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: error.code,
                            message: error.message,
                        },
                    },
                    { status: 400 },
                );

            case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
            case AUTH_ERROR_CODES.UNAUTHENTICATED:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: error.code,
                            message: error.message,
                        },
                    },
                    { status: 401 },
                );

            case AUTH_ERROR_CODES.UNAUTHORIZED:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: error.code,
                            message: error.message,
                        },
                    },
                    { status: 403 },
                );

            case AUTH_ERROR_CODES.USER_NOT_FOUND:
            case AUTH_ERROR_CODES.SESSION_NOT_FOUND:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: error.code,
                            message: error.message,
                        },
                    },
                    { status: 404 },
                );

            case AUTH_ERROR_CODES.USER_INACTIVE:
            case AUTH_ERROR_CODES.USER_SUSPENDED:
            case AUTH_ERROR_CODES.SESSION_EXPIRED:
            case AUTH_ERROR_CODES.SESSION_REVOKED:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: error.code,
                            message: error.message,
                        },
                    },
                    { status: 401 },
                );

            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            code: APP_ERROR_CODES.INTERNAL_ERROR,
                            message: "An unexpected error occurred.",
                        },
                    },
                    { status: 500 },
                );
        }
    }

    return NextResponse.json(
        {
            success: false,
            error: {
                code: APP_ERROR_CODES.INTERNAL_ERROR,
                message: "An unexpected error occurred.",
            },
        },
        { status: 500 },
    );
}