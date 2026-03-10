export async function GET() {
    return Response.json({
        ok: true,
        domain: "admin",
        route: "contact",
        message: "Foundation placeholder endpoint.",
    });
}