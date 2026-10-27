export async function GET() {
  return Response.json({
    ok: true,
    service: "iturrieta-booking",
    timestamp: new Date().toISOString(),
  });
}
