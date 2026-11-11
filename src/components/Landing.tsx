"use client";

type Props = {
  onStart: () => void;
};

export function Landing({ onStart }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-atmosphere text-paper">
      <div className="bg-grain absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-5 pb-10 pt-6 sm:px-8">
        <header className="animate-rise flex items-center justify-between">
          <div className="font-display text-2xl tracking-tight text-lime sm:text-3xl">
            HablaYa
          </div>
          <p className="text-sm text-fog">Traducción en vivo · ES ↔ EN</p>
        </header>

        <section className="relative mt-10 flex flex-1 flex-col justify-center gap-10 lg:mt-0 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="animate-rise max-w-xl" style={{ animationDelay: "80ms" }}>
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-fog">
              Para hispanohablantes
            </p>
            <h1 className="font-display text-[clamp(3rem,9vw,5.6rem)] leading-[0.92] tracking-[-0.03em] text-paper">
              HablaYa
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-mist/90 sm:text-xl">
              Traduce en tiempo real con personas de habla inglesa y recibe
              exactamente qué decir, en español y en inglés.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="rounded-full bg-lime px-7 py-3.5 text-base font-semibold text-ink transition hover:bg-lime-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                Empezar conversación
              </button>
              <span className="text-sm text-fog">Micrófono + voz en vivo</span>
            </div>
          </div>

          <div
            className="animate-float relative min-h-[340px] overflow-hidden rounded-[2rem] hero-wave sm:min-h-[420px]"
            style={{ animationDelay: "160ms" }}
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(7,22,18,0.15),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(7,22,18,0.35),rgba(7,22,18,0.75))]" />
            <div className="absolute inset-x-6 bottom-6 top-6 flex flex-col justify-between sm:inset-x-8 sm:bottom-8 sm:top-8">
              <div className="glass max-w-sm rounded-3xl p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-fog">Ellos dicen</p>
                <p className="mt-2 font-display text-2xl leading-snug text-paper">
                  “How can I help you today?”
                </p>
                <p className="mt-3 text-mist">¿En qué puedo ayudarle hoy?</p>
              </div>
              <div className="glass ml-auto max-w-sm rounded-3xl border-lime/30 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-lime">Tú dices</p>
                <p className="mt-2 font-display text-2xl leading-snug text-lime">
                  “I need help with this form.”
                </p>
                <p className="mt-3 text-mist">Necesito ayuda con este formulario.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
