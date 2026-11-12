"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLiveRecognition } from "../hooks/useLiveRecognition";
import { speakText, stopSpeaking } from "../lib/speech";
import type { ConversationMessage, Suggestion } from "../lib/types";

type Mode = "listen" | "speak";

type Props = {
  onBack: () => void;
};

async function translate(text: string, from: "en" | "es", to: "en" | "es") {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text, from, to }),
  });
  if (!response.ok) {
    throw new Error("translate_failed");
  }
  return (await response.json()) as {
    translatedText: string;
    source: "live" | "sample";
  };
}

async function fetchSuggestions(
  englishText: string,
  history: ConversationMessage[],
) {
  const response = await fetch("/api/suggest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      englishText,
      history: history.slice(-6).map((item) => ({
        role: item.speaker,
        text: item.original,
      })),
    }),
  });
  if (!response.ok) {
    throw new Error("suggest_failed");
  }
  return (await response.json()) as {
    suggestions: Suggestion[];
    source: "live" | "sample";
  };
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ConversationApp({ onBack }: Props) {
  const [mode, setMode] = useState<Mode>("listen");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [interim, setInterim] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [busy, setBusy] = useState(false);
  const [dataNote, setDataNote] = useState<string | null>(null);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const lang = mode === "listen" ? "en-US" : "es-ES";

  const handleFinal = useCallback(
    async (transcript: string) => {
      setInterim("");
      setBusy(true);
      try {
        if (mode === "listen") {
          const { translatedText, source } = await translate(transcript, "en", "es");
          const message: ConversationMessage = {
            id: uid(),
            speaker: "them",
            sourceLang: "en",
            original: transcript,
            translated: translatedText,
            createdAt: Date.now(),
          };
          setMessages((prev) => [...prev, message]);
          if (source === "sample") {
            setDataNote("Usando traducción de ejemplo mientras el servicio responde.");
          } else {
            setDataNote(null);
          }
          if (autoSpeak) speakText(translatedText, "es-ES");

          const suggest = await fetchSuggestions(transcript, [...messages, message]);
          setSuggestions(suggest.suggestions);
          setSelected(suggest.suggestions[0] ?? null);
          if (suggest.source === "sample") {
            setDataNote((prev) =>
              prev ??
                "Sugerencias del coach integrado. Las sugerencias con IA requieren iniciar sesión en una app privada o de equipo.",
            );
          }
        } else {
          const { translatedText, source } = await translate(transcript, "es", "en");
          const message: ConversationMessage = {
            id: uid(),
            speaker: "you",
            sourceLang: "es",
            original: transcript,
            translated: translatedText,
            createdAt: Date.now(),
          };
          setMessages((prev) => [...prev, message]);
          setSelected({
            id: message.id,
            intent: "Tu frase",
            sayInSpanish: transcript,
            sayInEnglish: translatedText,
            why: "Esto es lo que puedes decir en inglés ahora mismo.",
          });
          if (source === "sample") {
            setDataNote("Usando traducción de ejemplo mientras el servicio responde.");
          } else {
            setDataNote(null);
          }
          if (autoSpeak) speakText(translatedText, "en-US");
        }
      } catch {
        setDataNote("No se pudo traducir ahora. Revisa la conexión e inténtalo otra vez.");
      } finally {
        setBusy(false);
      }
    },
    [autoSpeak, messages, mode],
  );

  const { supported, listening, error, start, stop, setError } = useLiveRecognition({
    lang,
    onFinal: handleFinal,
    onInterim: setInterim,
  });

  useEffect(() => {
    stopSpeaking();
    setInterim("");
  }, [mode]);

  const statusLabel = useMemo(() => {
    if (!supported) return "Micrófono no disponible en este navegador";
    if (listening) {
      return mode === "listen"
        ? "Escuchando inglés…"
        : "Escuchando tu español…";
    }
    return "Micrófono en pausa";
  }, [listening, mode, supported]);

  function toggleListening() {
    if (listening) stop();
    else start();
  }

  function clearChat() {
    stop();
    stopSpeaking();
    setMessages([]);
    setSuggestions([]);
    setSelected(null);
    setInterim("");
    setDataNote(null);
    setError(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-atmosphere text-paper">
      <div className="bg-grain absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stop();
              stopSpeaking();
              onBack();
            }}
            className="rounded-full px-3 py-2 text-sm text-fog transition hover:text-paper"
          >
            ← HablaYa
          </button>
          <div className="font-display text-xl text-lime sm:text-2xl">HablaYa</div>
          <button
            type="button"
            onClick={clearChat}
            className="rounded-full px-3 py-2 text-sm text-fog transition hover:text-paper"
          >
            Limpiar
          </button>
        </header>

        <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass flex min-h-[520px] flex-col rounded-[1.75rem] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <ModeChip
                active={mode === "listen"}
                label="Ellos hablan inglés"
                onClick={() => {
                  stop();
                  setMode("listen");
                }}
              />
              <ModeChip
                active={mode === "speak"}
                label="Yo hablo español"
                onClick={() => {
                  stop();
                  setMode("speak");
                }}
              />
            </div>

            <p className="mt-4 text-sm text-fog">
              {mode === "listen"
                ? "Acerca el micrófono a la persona que habla inglés. HablaYa traduce al instante y te sugiere qué responder."
                : "Habla en español. HablaYa te dice exactamente qué decir en inglés y lo puede pronunciar por ti."}
            </p>

            <div className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {messages.length === 0 && !interim ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-white/10 px-6 py-16 text-center">
                  <p className="font-display text-3xl text-mist">Listo cuando tú lo estés</p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-fog">
                    Pulsa el micrófono para empezar. En una clínica, tienda, entrevista o
                    escuela: la app te guía frase por frase.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
              {interim ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-fog italic">
                  {interim}…
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={toggleListening}
                disabled={!supported}
                className={`relative flex h-24 w-24 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
                  listening
                    ? "pulse-ring bg-lime text-ink"
                    : "bg-white/10 text-paper hover:bg-white/15"
                } disabled:cursor-not-allowed disabled:opacity-50`}
                aria-pressed={listening}
                aria-label={listening ? "Detener micrófono" : "Activar micrófono"}
              >
                <MicIcon listening={listening} />
              </button>
              <div className="text-center">
                <p className="text-sm font-medium text-mist">{statusLabel}</p>
                {busy ? <p className="text-xs text-fog">Traduciendo…</p> : null}
                {error ? <p className="mt-1 max-w-sm text-xs text-coral">{error}</p> : null}
              </div>
              <label className="flex items-center gap-2 text-xs text-fog">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(event) => setAutoSpeak(event.target.checked)}
                  className="accent-[var(--lime)]"
                />
                Leer la traducción en voz alta
              </label>
            </div>
          </section>

          <aside className="glass flex min-h-[420px] flex-col rounded-[1.75rem] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-lime">Qué decir</p>
                <h2 className="mt-1 font-display text-3xl text-paper">Tu siguiente frase</h2>
              </div>
            </div>

            {selected ? (
              <div className="mt-5 rounded-[1.4rem] bg-ink/50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-fog">
                  {selected.intent}
                </p>
                <p className="mt-3 font-display text-2xl leading-snug text-lime sm:text-3xl">
                  {selected.sayInEnglish}
                </p>
                <p className="mt-3 text-mist">{selected.sayInSpanish}</p>
                <p className="mt-3 text-sm text-fog">{selected.why}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => speakText(selected.sayInEnglish, "en-US")}
                    className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink hover:bg-lime-deep"
                  >
                    Escuchar inglés
                  </button>
                  <button
                    type="button"
                    onClick={() => speakText(selected.sayInSpanish, "es-ES")}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm text-paper hover:bg-white/15"
                  >
                    Escuchar español
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/10 px-5 py-10 text-sm leading-relaxed text-fog">
                Cuando alguien hable en inglés, aquí aparecerán 3 opciones claras de qué
                responder — con la frase lista para decir.
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`rounded-2xl px-4 py-3 text-left transition ${
                    selected?.id === item.id
                      ? "bg-lime/15 ring-1 ring-lime/40"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-fog">
                    {item.intent}
                  </p>
                  <p className="mt-1 text-sm font-medium text-paper">
                    {item.sayInEnglish}
                  </p>
                  <p className="mt-1 text-xs text-mist">{item.sayInSpanish}</p>
                </button>
              ))}
            </div>

            {dataNote ? (
              <p className="mt-auto pt-4 text-xs leading-relaxed text-fog">{dataNote}</p>
            ) : (
              <p className="mt-auto pt-4 text-xs leading-relaxed text-fog">
                Tip: en modo “Ellos hablan inglés”, deja que HablaYa escuche y luego elige
                una respuesta. En modo “Yo hablo español”, di lo que quieres y recibe la
                frase en inglés.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function ModeChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active
          ? "bg-lime text-ink font-semibold"
          : "bg-white/5 text-mist hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function MessageBubble({ message }: { message: ConversationMessage }) {
  const theirs = message.speaker === "them";
  return (
    <article
      className={`max-w-[92%] rounded-[1.35rem] px-4 py-3 animate-rise ${
        theirs ? "self-start bg-white/8" : "self-end bg-lime/15"
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-fog">
        {theirs ? "Ellos · inglés" : "Tú · español"}
      </p>
      <p className={`mt-1 text-base leading-snug ${theirs ? "text-paper" : "text-lime"}`}>
        {message.original}
      </p>
      <p className="mt-2 text-sm text-mist">{message.translated}</p>
    </article>
  );
}

function MicIcon({ listening }: { listening: boolean }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={listening ? "text-ink" : "text-paper"}
    >
      <path
        d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"
        fill="currentColor"
      />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
