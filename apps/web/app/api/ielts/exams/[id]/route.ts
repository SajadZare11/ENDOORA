export function GET() {
  return Response.json({ detail: "This mock catalogue is retired.", practice_url: "/ielts" }, { status: 410 });
}
