export async function GET() {
    return Response.json({
        ok: true,
        domain: "public",
        route: "services",
        message: "Foundation placeholder endpoint.",
    });
}