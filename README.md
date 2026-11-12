# HablaYa

App para hispanohablantes que traduce conversaciones en vivo con personas de habla inglesa y sugiere exactamente qué decir.

## Qué hace

- **Ellos hablan inglés**: escucha, traduce al español y propone 3 respuestas listas.
- **Yo hablo español**: convierte tu frase al inglés y la puede pronunciar en voz alta.
- Coach **Qué decir** con la frase en inglés, su significado en español y el motivo.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. El reconocimiento de voz funciona mejor en Chrome o Edge (escritorio o móvil) y pide permiso de micrófono.

## Secretos opcionales

- `OPENAI_API_KEY` — mejora las sugerencias de “Qué decir”. Sin ella, HablaYa usa el coach integrado y MyMemory para traducir.
