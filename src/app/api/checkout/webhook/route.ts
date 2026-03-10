export async function POST() {
    return Response.json({
        ok: true,
        domain: "checkout",
        route: "webhook",
        message: "Foundation placeholder endpoint.",
    });
}