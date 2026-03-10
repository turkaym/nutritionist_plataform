export async function GET() {
    return Response.json({
        ok: true,
        domain: "me",
        route: "profile",
        message: "Foundation placeholder endpoint.",
    });
}