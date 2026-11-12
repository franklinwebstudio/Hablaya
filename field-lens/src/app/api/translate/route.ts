import { clientKey, rateLimit } from "../../../lib/rate-limit";
import { translateText } from "../../../lib/translate";

export async function POST(request: Request) {
  const limited = rateLimit(`translate:${clientKey(request)}`, 60, 60_000);
  if (!limited.ok) {
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un momento." },
      {
        status: 429,
        headers: {
          "retry-after": String(limited.retryAfterSec),
          "cache-control": "no-store",
        },
      },
    );
  }

  let body: { text?: string; from?: string; to?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Solicitud inválida." },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const text = typeof body.text === "string" ? body.text.slice(0, 500) : "";
  const from = body.from === "es" ? "es" : "en";
  const to = body.to === "es" ? "es" : "en";

  if (!text.trim()) {
    return Response.json(
      { error: "Falta el texto." },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  const result = await translateText(text, from, to);
  return Response.json(result, {
    headers: { "cache-control": "no-store" },
  });
}
