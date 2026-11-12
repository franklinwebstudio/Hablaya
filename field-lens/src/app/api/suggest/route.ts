import { getIdentity } from "../../../../cursor/identity";
import { buildSmartSuggestions } from "../../../lib/suggestions";
import { clientKey, rateLimit } from "../../../lib/rate-limit";

export async function POST(request: Request) {
  const identity = await getIdentity(request);
  // Only verified signed-in callers may spend OPENAI_API_KEY.
  const allowPaid = identity.verified;
  const bucketKey = allowPaid
    ? `suggest:user:${identity.sub}`
    : `suggest:free:${clientKey(request)}`;

  const limited = rateLimit(bucketKey, allowPaid ? 30 : 40, 60_000);
  if (!limited.ok) {
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un momento." },
      {
        status: 429,
        headers: {
          "retry-after": String(limited.retryAfterSec),
          "cache-control": "private, no-store",
        },
      },
    );
  }

  let body: {
    englishText?: string;
    history?: Array<{ role?: string; text?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Solicitud inválida." },
      { status: 400, headers: { "cache-control": "private, no-store" } },
    );
  }

  const englishText =
    typeof body.englishText === "string" ? body.englishText.slice(0, 500) : "";
  const history = Array.isArray(body.history)
    ? body.history
        .slice(-6)
        .map((item) => ({
          role: typeof item.role === "string" ? item.role.slice(0, 20) : "unknown",
          text: typeof item.text === "string" ? item.text.slice(0, 240) : "",
        }))
        .filter((item) => item.text)
    : [];

  const result = await buildSmartSuggestions(englishText, history, {
    allowPaid,
  });
  return Response.json(result, {
    headers: { "cache-control": "private, no-store" },
  });
}
