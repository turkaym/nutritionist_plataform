export async function POST() {
    return Response.json({
        ok: true,
        domain: "checkout",
        route: "create-session",
        message: "Foundation placeholder endpoint.",
    });
}