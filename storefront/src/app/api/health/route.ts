import { NextResponse } from "next/server";

// Forzamos runtime Node.js para evitar edge o estático
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      timestamp: new Date().toISOString(),
      message: "API funcionando correctamente 🚀",
    },
    { status: 200 }
  );
}
