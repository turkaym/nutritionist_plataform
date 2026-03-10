export async function GET() {
    return Response.json({
        ok: true,
        domain: "admin",
        route: "settings",
        message: "Foundation placeholder endpoint.",
    });
}