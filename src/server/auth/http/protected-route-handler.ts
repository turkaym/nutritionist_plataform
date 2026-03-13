import type { NextRequest } from "next/server";

import type { AuthenticatedActor } from "@/server/auth/contracts/authenticated-actor";

export type ProtectedRouteHandler = (
    request: NextRequest,
    actor: AuthenticatedActor,
) => Response | Promise<Response>;