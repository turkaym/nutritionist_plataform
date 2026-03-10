export async function GET() {
    return Response.json({
        ok: true,
        domain: "admin",
        route: "services",
        message: "Foundation placeholder endpoint.",
    });
}