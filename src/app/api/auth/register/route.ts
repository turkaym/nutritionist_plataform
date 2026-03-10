export async function POST() {
    return Response.json({
        ok: true,
        domain: "auth",
        route: "register",
        message: "Foundation placeholder endpoint.",
    });
}