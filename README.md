# Field Lens

Live ES ↔ EN conversation coach for Spanish speakers: translate in real time and get exactly what to say.

## What it does

- **They speak English**: listens, translates to Spanish, and proposes 3 ready replies.
- **I speak Spanish**: converts your phrase to English and can speak it aloud.
- **What to say** coach with the English line, Spanish meaning, and why it fits.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Speech recognition works best in Chrome or Edge and needs microphone permission.

## Optional secrets

- `OPENAI_API_KEY` — improves “What to say” suggestions. Without it, Field Lens uses the built-in coach and MyMemory for translation.
