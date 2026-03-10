export async function POST() {
    return Response.json({
        ok: true,
        domain: "auth",
        route: "logout",
        message: "Foundation placeholder endpoint.",
    });
}