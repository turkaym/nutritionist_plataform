export async function POST() {
    return Response.json({
        ok: true,
        domain: "auth",
        route: "login",
        message: "Foundation placeholder endpoint.",
    });
}