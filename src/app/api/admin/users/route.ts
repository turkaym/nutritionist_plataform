export async function GET() {
    return Response.json({
        ok: true,
        domain: "admin",
        route: "users",
        message: "Foundation placeholder endpoint.",
    });
}