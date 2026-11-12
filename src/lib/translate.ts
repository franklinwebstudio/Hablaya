const SAMPLE_DICTIONARY: Array<[RegExp, string]> = [
  [/^hello[.!]?$/i, "Hola."],
  [/^hi[.!]?$/i, "Hola."],
  [/^how are you\??$/i, "¿Cómo estás?"],
  [/^thank you[.!]?$/i, "Gracias."],
  [/^thanks[.!]?$/i, "Gracias."],
  [/^please[.!]?$/i, "Por favor."],
  [/^yes[.!]?$/i, "Sí."],
  [/^no[.!]?$/i, "No."],
  [/^goodbye[.!]?$/i, "Adiós."],
  [/^good morning[.!]?$/i, "Buenos días."],
  [/^good afternoon[.!]?$/i, "Buenas tardes."],
  [/^good evening[.!]?$/i, "Buenas noches."],
  [/^nice to meet you[.!]?$/i, "Mucho gusto."],
  [/^how much is this\??$/i, "¿Cuánto cuesta esto?"],
  [/^where is the bathroom\??$/i, "¿Dónde está el baño?"],
  [/^i need help[.!]?$/i, "Necesito ayuda."],
  [/^hola[.!]?$/i, "Hello."],
  [/^gracias[.!]?$/i, "Thank you."],
  [/^por favor[.!]?$/i, "Please."],
  [/^buenos días[.!]?$/i, "Good morning."],
  [/^mucho gusto[.!]?$/i, "Nice to meet you."],
  [/^necesito ayuda con este formulario[.!]?$/i, "I need help with this form."],
  [/^necesito ayuda[.!]?$/i, "I need help."],
  [/^¿?dónde está el baño\??$/i, "Where is the bathroom?"],
  [/^¿?cuánto cuesta esto\??$/i, "How much does this cost?"],
  [/^¿?me puede ayudar\??$/i, "Can you help me?"],
  [/^un momento,? por favor[.!]?$/i, "One moment, please."],
];

function sampleTranslate(text: string, from: "en" | "es", to: "en" | "es"): string {
  const trimmed = text.trim();
  for (const [pattern, value] of SAMPLE_DICTIONARY) {
    if (pattern.test(trimmed)) {
      const looksSpanish = /[áéíóúñ¿¡]/i.test(value) || /^(hola|gracias|por favor|buenos|mucho|necesito|dónde|cuánto)/i.test(value);
      if (to === "es" && looksSpanish) return value;
      if (to === "en" && !looksSpanish) return value;
    }
  }

  if (from === "en" && to === "es") {
    return `[Traducción de ejemplo] ${trimmed}`;
  }
  return `[Sample translation] ${trimmed}`;
}

export async function translateText(
  text: string,
  from: "en" | "es",
  to: "en" | "es",
): Promise<{ translatedText: string; source: "live" | "sample" }> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { translatedText: "", source: "sample" };
  }

  if (from === to) {
    return { translatedText: trimmed, source: "live" };
  }

  const myMemory = await translateWithMyMemory(trimmed, from, to);
  if (myMemory) return myMemory;

  const libre = await translateWithLibre(trimmed, from, to);
  if (libre) return libre;

  return { translatedText: sampleTranslate(trimmed, from, to), source: "sample" };
}

function looksIncomplete(source: string, translated: string) {
  if (!translated) return true;
  if (translated.toLowerCase() === source.toLowerCase()) return true;
  if (/\.\.\.$/.test(translated)) return true;
  if (translated.length < Math.min(12, Math.floor(source.length * 0.35))) return true;
  return false;
}

async function translateWithMyMemory(
  text: string,
  from: "en" | "es",
  to: "en" | "es",
): Promise<{ translatedText: string; source: "live" } | null> {
  try {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text.slice(0, 450));
    url.searchParams.set("langpair", `${from}|${to}`);

    const response = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      responseData?: { translatedText?: string };
      responseStatus?: number;
    };
    const translated = data.responseData?.translatedText?.trim() ?? "";
    if (data.responseStatus !== 200 || looksIncomplete(text, translated)) return null;
    return { translatedText: translated, source: "live" };
  } catch {
    return null;
  }
}

async function translateWithLibre(
  text: string,
  from: "en" | "es",
  to: "en" | "es",
): Promise<{ translatedText: string; source: "live" } | null> {
  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        q: text.slice(0, 450),
        source: from,
        target: to,
        format: "text",
      }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { translatedText?: string };
    const translated = data.translatedText?.trim() ?? "";
    if (looksIncomplete(text, translated)) return null;
    return { translatedText: translated, source: "live" };
  } catch {
    return null;
  }
}
