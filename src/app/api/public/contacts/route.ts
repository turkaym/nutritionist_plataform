export async function POST() {
    return Response.json({
        ok: true,
        domain: "public",
        route: "contact",
        message: "Foundation placeholder endpoint.",
    });
}