export async function GET() {
    return Response.json({
        ok: true,
        domain: "me",
        route: "purchases",
        message: "Foundation placeholder endpoint.",
    });
}