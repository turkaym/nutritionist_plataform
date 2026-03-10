export async function GET() {
    return Response.json({
        ok: true,
        domain: "me",
        route: "services",
        message: "Foundation placeholder endpoint.",
    });
}