import type { Suggestion } from "./types";

type Rule = {
  intent: string;
  patterns: RegExp[];
  replies: Array<{
    sayInSpanish: string;
    sayInEnglish: string;
    why: string;
  }>;
};

const RULES: Rule[] = [
  {
    intent: "Saludo",
    patterns: [/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/i],
    replies: [
      {
        sayInSpanish: "Hola, mucho gusto.",
        sayInEnglish: "Hi, nice to meet you.",
        why: "Saludo amable y natural.",
      },
      {
        sayInSpanish: "Hola, ¿cómo está?",
        sayInEnglish: "Hello, how are you?",
        why: "Responde y sigue la conversación.",
      },
      {
        sayInSpanish: "Buenos días, gracias por recibirme.",
        sayInEnglish: "Good morning, thank you for seeing me.",
        why: "Formal y cortés.",
      },
    ],
  },
  {
    intent: "Cómo estás",
    patterns: [/\b(how are you|how's it going|how are things)\b/i],
    replies: [
      {
        sayInSpanish: "Bien, gracias. ¿Y usted?",
        sayInEnglish: "I'm good, thank you. And you?",
        why: "Respuesta corta y educada.",
      },
      {
        sayInSpanish: "Todo bien, un poco nervioso pero contento de estar aquí.",
        sayInEnglish: "I'm doing well — a little nervous, but glad to be here.",
        why: "Honesto y cercano.",
      },
    ],
  },
  {
    intent: "Nombre",
    patterns: [/\b(what('s| is) your name|who are you|can I get your name)\b/i],
    replies: [
      {
        sayInSpanish: "Me llamo [tu nombre].",
        sayInEnglish: "My name is [your name].",
        why: "Di tu nombre con claridad.",
      },
      {
        sayInSpanish: "Soy [tu nombre]. Mucho gusto.",
        sayInEnglish: "I'm [your name]. Nice to meet you.",
        why: "Presentación completa.",
      },
    ],
  },
  {
    intent: "Repetir / más despacio",
    patterns: [
      /\b(do you understand|did you get that|are you following|any questions)\b/i,
      /\b(what do you think|does that make sense)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "¿Puede repetirlo más despacio, por favor?",
        sayInEnglish: "Could you please repeat that more slowly?",
        why: "Pide claridad sin vergüenza.",
      },
      {
        sayInSpanish: "Entiendo un poco. ¿Puede decirlo de otra forma?",
        sayInEnglish: "I understand a little. Could you say it another way?",
        why: "Muestra esfuerzo y pide ayuda.",
      },
      {
        sayInSpanish: "Un momento, por favor. Quiero asegurarme de entender.",
        sayInEnglish: "One moment, please. I want to make sure I understand.",
        why: "Gana tiempo para pensar.",
      },
    ],
  },
  {
    intent: "Precio / compra",
    patterns: [
      /\b(how much|price|cost|total|pay|cash|card|receipt)\b/i,
      /\b(would you like to buy|on sale|discount)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "¿Cuánto cuesta esto?",
        sayInEnglish: "How much does this cost?",
        why: "Pregunta directa por el precio.",
      },
      {
        sayInSpanish: "¿Aceptan tarjeta?",
        sayInEnglish: "Do you take cards?",
        why: "Confirma el método de pago.",
      },
      {
        sayInSpanish: "Lo llevo. ¿Me puede dar el recibo, por favor?",
        sayInEnglish: "I'll take it. Could I get a receipt, please?",
        why: "Cierra la compra con claridad.",
      },
    ],
  },
  {
    intent: "Restaurante",
    patterns: [
      /\b(menu|order|table|reservation|water|check|bill|allerg)\b/i,
      /\b(what would you like|are you ready to order|for here or to go)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "¿Me puede traer el menú, por favor?",
        sayInEnglish: "Could I please have the menu?",
        why: "Pide el menú con cortesía.",
      },
      {
        sayInSpanish: "Quiero esto, por favor. Sin cebolla.",
        sayInEnglish: "I'd like this, please. No onions.",
        why: "Pide y añade una preferencia.",
      },
      {
        sayInSpanish: "La cuenta, por favor.",
        sayInEnglish: "The check, please.",
        why: "Frase corta para pedir la cuenta.",
      },
    ],
  },
  {
    intent: "Médico / salud",
    patterns: [
      /\b(pain|hurt|symptom|medicine|prescription|appointment|doctor|nurse)\b/i,
      /\b(where does it hurt|how long|are you allergic)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "Me duele aquí desde ayer.",
        sayInEnglish: "It has hurt here since yesterday.",
        why: "Describe el problema y el tiempo.",
      },
      {
        sayInSpanish: "Soy alérgico a la penicilina.",
        sayInEnglish: "I'm allergic to penicillin.",
        why: "Información importante de seguridad.",
      },
      {
        sayInSpanish: "¿Puede escribirlo, por favor?",
        sayInEnglish: "Could you please write that down?",
        why: "Evita malentendidos con instrucciones médicas.",
      },
    ],
  },
  {
    intent: "Trabajo / entrevista",
    patterns: [
      /\b(job|work|interview|experience|resume|schedule|shift|manager|hire)\b/i,
      /\b(tell me about yourself|why should we|available|start date)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "Tengo experiencia en atención al cliente y soy responsable.",
        sayInEnglish: "I have customer service experience and I'm reliable.",
        why: "Resalta fortalezas simples.",
      },
      {
        sayInSpanish: "Puedo trabajar fines de semana y turnos de tarde.",
        sayInEnglish: "I can work weekends and evening shifts.",
        why: "Muestra flexibilidad.",
      },
      {
        sayInSpanish: "Estoy aprendiendo inglés y me comunico con claridad.",
        sayInEnglish: "I'm learning English and I communicate clearly.",
        why: "Honesto y positivo sobre el idioma.",
      },
    ],
  },
  {
    intent: "Direcciones",
    patterns: [
      /\b(where is|how do I get|turn left|turn right|straight|bus|train|uber|address)\b/i,
      /\b(are you lost|need help finding)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "¿Dónde queda esto? ¿Me puede mostrar en el mapa?",
        sayInEnglish: "Where is this? Can you show me on the map?",
        why: "Combina pregunta + ayuda visual.",
      },
      {
        sayInSpanish: "¿Está lejos caminando?",
        sayInEnglish: "Is it far to walk?",
        why: "Confirma distancia.",
      },
      {
        sayInSpanish: "Gracias. Voy para allá.",
        sayInEnglish: "Thank you. I'm headed that way.",
        why: "Cierra con cortesía.",
      },
    ],
  },
  {
    intent: "Escuela / oficina",
    patterns: [
      /\b(form|sign|signature|document|appointment|meeting|email|phone number)\b/i,
      /\b(fill this out|can you sign|contact information)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "¿Puede ayudarme a llenar este formulario?",
        sayInEnglish: "Can you help me fill out this form?",
        why: "Pide apoyo sin rodeos.",
      },
      {
        sayInSpanish: "¿Dónde firmo?",
        sayInEnglish: "Where do I sign?",
        why: "Pregunta concreta.",
      },
      {
        sayInSpanish: "¿Me puede enviar un correo con la información?",
        sayInEnglish: "Could you email me the information?",
        why: "Pide un registro escrito.",
      },
    ],
  },
  {
    intent: "Agradecimiento / despedida",
    patterns: [
      /\b(thank you|thanks|appreciate|have a (good|nice) day|goodbye|bye|see you)\b/i,
    ],
    replies: [
      {
        sayInSpanish: "Muchas gracias. Que tenga un buen día.",
        sayInEnglish: "Thank you very much. Have a good day.",
        why: "Cierre cálido y correcto.",
      },
      {
        sayInSpanish: "Gracias por su ayuda.",
        sayInEnglish: "Thank you for your help.",
        why: "Agradece de forma directa.",
      },
      {
        sayInSpanish: "Hasta luego. Fue un gusto.",
        sayInEnglish: "See you later. It was nice talking with you.",
        why: "Despedida amable.",
      },
    ],
  },
  {
    intent: "No entiendo",
    patterns: [/\b(sorry|excuse me|pardon|what did you say|come again)\b/i],
    replies: [
      {
        sayInSpanish: "Disculpe, no entendí. ¿Puede repetirlo?",
        sayInEnglish: "Sorry, I didn't catch that. Could you repeat it?",
        why: "Pide repetición con cortesía.",
      },
      {
        sayInSpanish: "Hablo un poco de inglés. ¿Puede hablar más despacio?",
        sayInEnglish: "I speak a little English. Could you speak more slowly?",
        why: "Establece expectativa clara.",
      },
    ],
  },
  {
    intent: "Ayuda general",
    patterns: [/\b(help|need|can you|could you|please|assist)\b/i],
    replies: [
      {
        sayInSpanish: "Sí, por favor. Necesito ayuda con esto.",
        sayInEnglish: "Yes, please. I need help with this.",
        why: "Acepta ayuda de forma clara.",
      },
      {
        sayInSpanish: "¿Me puede ayudar un momento?",
        sayInEnglish: "Could you help me for a moment?",
        why: "Pide asistencia breve.",
      },
    ],
  },
];

const FALLBACK: Suggestion[] = [
  {
    id: "fallback-1",
    intent: "General",
    sayInSpanish: "¿Puede repetirlo más despacio, por favor?",
    sayInEnglish: "Could you please repeat that more slowly?",
    why: "Frase segura cuando algo no quedó claro.",
  },
  {
    id: "fallback-2",
    intent: "General",
    sayInSpanish: "Sí, entiendo. Gracias.",
    sayInEnglish: "Yes, I understand. Thank you.",
    why: "Confirma y agradece.",
  },
  {
    id: "fallback-3",
    intent: "General",
    sayInSpanish: "Un momento, por favor.",
    sayInEnglish: "One moment, please.",
    why: "Gana tiempo para pensar o traducir.",
  },
];

export function buildSuggestions(englishText: string): Suggestion[] {
  const text = englishText.trim();
  if (!text) return FALLBACK;

  const matched = RULES.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(text)),
  );

  const picked = (matched.length > 0 ? matched : [RULES[RULES.length - 1]!])
    .flatMap((rule) =>
      rule.replies.map((reply, index) => ({
        id: `${rule.intent}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        intent: rule.intent,
        ...reply,
      })),
    );

  const unique: Suggestion[] = [];
  for (const item of [...picked, ...FALLBACK]) {
    if (unique.some((existing) => existing.sayInEnglish === item.sayInEnglish)) {
      continue;
    }
    unique.push(item);
    if (unique.length === 3) break;
  }

  return unique.length > 0 ? unique : FALLBACK;
}

export async function buildSmartSuggestions(
  englishText: string,
  history: Array<{ role: string; text: string }> = [],
  options: { allowPaid?: boolean } = {},
): Promise<{ suggestions: Suggestion[]; source: "live" | "sample" }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  // Paid OpenAI calls require a verified signed-in caller (allowPaid).
  if (!options.allowPaid || !apiKey || !englishText.trim()) {
    return { suggestions: buildSuggestions(englishText), source: "sample" };
  }

  try {
    const prompt = [
      "You help Spanish-speaking adults talk with English speakers in real life.",
      "Given the latest English line, return 3 short reply options.",
      "Each option must include: intent, sayInSpanish, sayInEnglish, why (in Spanish).",
      "Keep English phrases natural, short, and easy to pronounce.",
      "Return ONLY JSON: {\"suggestions\":[...]}",
      `Latest English: ${englishText}`,
      history.length
        ? `Recent conversation: ${JSON.stringify(history.slice(-6))}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are HablaYa, a calm bilingual conversation coach for Spanish speakers.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return { suggestions: buildSuggestions(englishText), source: "sample" };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content) as {
      suggestions?: Array<{
        intent?: string;
        sayInSpanish?: string;
        sayInEnglish?: string;
        why?: string;
      }>;
    };

    const suggestions = (parsed.suggestions ?? [])
      .filter(
        (item) => item.sayInEnglish && item.sayInSpanish && item.intent && item.why,
      )
      .slice(0, 3)
      .map((item, index) => ({
        id: `ai-${index}-${Date.now()}`,
        intent: item.intent!,
        sayInSpanish: item.sayInSpanish!,
        sayInEnglish: item.sayInEnglish!,
        why: item.why!,
      }));

    if (suggestions.length === 0) {
      return { suggestions: buildSuggestions(englishText), source: "sample" };
    }

    return { suggestions, source: "live" };
  } catch {
    return { suggestions: buildSuggestions(englishText), source: "sample" };
  }
}
