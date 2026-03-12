import { NextRequest, NextResponse } from "next/server";

import { loginUser } from "@/server/auth/services/login.service";
import { mapAuthErrorToResponse } from "@/server/auth/http/map-auth-error";

type LoginRequestBody = {
    email?: string;
    password?: string;
};

function getClientIpAddress(request: NextRequest): string | null {
    const forwardedFor = request.headers.get("x-forwarded-for");

    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() ?? null;
    }

    return request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as LoginRequestBody;

        const result = await loginUser({
            credentials: {
                email: body.email ?? "",
                password: body.password ?? "",
            },
            context: {
                ipAddress: getClientIpAddress(request),
                userAgent: request.headers.get("user-agent"),
            },
        });

        const response = NextResponse.json(
            {
                success: true,
                data: {
                    user: result.user,
                    session: result.session,
                },
            },
            { status: 200 },
        );

        response.cookies.set({
            name: result.cookie.name,
            value: result.cookie.value,
            httpOnly: result.cookie.httpOnly,
            secure: result.cookie.secure,
            sameSite: result.cookie.sameSite,
            path: result.cookie.path,
            expires: result.cookie.expires,
        });

        return response;
    } catch (error) {
        return mapAuthErrorToResponse(error);
    }
}