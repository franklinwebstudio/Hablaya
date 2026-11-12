export type Speaker = "them" | "you";

export type ConversationMessage = {
  id: string;
  speaker: Speaker;
  sourceLang: "en" | "es";
  original: string;
  translated: string;
  createdAt: number;
  interim?: boolean;
};

export type Suggestion = {
  id: string;
  intent: string;
  sayInSpanish: string;
  sayInEnglish: string;
  why: string;
};

export type TranslateResponse = {
  translatedText: string;
  source: "live" | "sample";
};

export type SuggestResponse = {
  suggestions: Suggestion[];
  source: "live" | "sample";
};
