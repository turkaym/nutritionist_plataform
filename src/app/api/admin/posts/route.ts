export async function GET() {
    return Response.json({
        ok: true,
        domain: "admin",
        route: "posts",
        message: "Foundation placeholder endpoint.",
    });
}