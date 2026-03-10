export async function GET() {
    return Response.json({
        ok: true,
        domain: "admin",
        route: "purchases",
        message: "Foundation placeholder endpoint.",
    });
}