export async function GET() {
    return Response.json({
        ok: true,
        domain: "public",
        route: "posts",
        message: "Foundation placeholder endpoint.",
    });
}