"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSpeechRecognitionCtor,
  type SpeechRecognitionLike,
} from "../lib/speech";

type Options = {
  lang: "en-US" | "es-ES";
  onFinal: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
};

export function useLiveRecognition({ lang, onFinal, onInterim }: Options) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const onFinalRef = useRef(onFinal);
  const onInterimRef = useRef(onInterim);

  useEffect(() => {
    onFinalRef.current = onFinal;
    onInterimRef.current = onInterim;
  }, [onFinal, onInterim]);

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognitionCtor()));
  }, []);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError(
        "Este navegador no admite reconocimiento de voz. Prueba Chrome o Edge en el teléfono o la computadora.",
      );
      return;
    }

    setError(null);
    shouldListenRef.current = true;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();
        if (!transcript) continue;
        if (result.isFinal) {
          onFinalRef.current(transcript);
        } else {
          interim = transcript;
        }
      }
      if (interim) onInterimRef.current?.(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setError("Necesitamos permiso del micrófono para traducir en vivo.");
        shouldListenRef.current = false;
        setListening(false);
        return;
      }
      if (event.error === "no-speech" || event.error === "aborted") return;
      setError("Hubo un problema con el micrófono. Intenta de nuevo.");
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
          setListening(true);
        } catch {
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current?.abort();
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      setError("No se pudo iniciar el micrófono.");
      setListening(false);
    }
  }, [lang]);

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  return { supported, listening, error, start, stop, setError };
}
