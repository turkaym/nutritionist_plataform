import type { NextRequest } from "next/server";

import type { AuthenticatedActor } from "@/server/auth/contracts/authenticated-actor";
import { resolveAuthenticatedActor } from "@/server/auth/http/resolve-authenticated-actor";

export async function requireAuth(
    request: NextRequest,
): Promise<AuthenticatedActor> {
    return resolveAuthenticatedActor(request);
}