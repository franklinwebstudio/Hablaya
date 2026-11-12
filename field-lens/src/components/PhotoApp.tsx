"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { HERO_PHOTO, SAMPLE_PHOTOS, type Photo } from "../lib/photos";

export function PhotoApp() {
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [usingSamples, setUsingSamples] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const inputId = useId();

  const active = photos.find((photo) => photo.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const index = photos.findIndex((photo) => photo.id === active.id);
        if (index < 0) return;
        const next =
          event.key === "ArrowRight"
            ? photos[(index + 1) % photos.length]
            : photos[(index - 1 + photos.length) % photos.length];
        setActiveId(next.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, photos]);

  function scrollToGallery() {
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onAddPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (!files.length) return;

    const next: Photo[] = files.map((file, index) => ({
      id: `local-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^.]+$/, "") || "Untitled",
      place: "Your roll",
      src: URL.createObjectURL(file),
      width: 1600,
      height: 1200,
      sample: false,
    }));

    setPhotos((current) => {
      const kept = usingSamples ? [] : current.filter((photo) => !photo.sample);
      return [...next, ...kept];
    });
    setUsingSamples(false);
    event.target.value = "";
  }

  function restoreSamples() {
    setPhotos(SAMPLE_PHOTOS);
    setUsingSamples(true);
    setActiveId(null);
  }

  return (
    <main className="bg-field relative min-h-screen overflow-x-hidden text-sand">
      <div className="bg-grain absolute inset-0" aria-hidden />

      <section className="relative min-h-[100svh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_PHOTO.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="animate-zoom object-cover"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,14,0.35)_0%,rgba(18,16,14,0.55)_45%,rgba(18,16,14,0.92)_100%)]"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-5 pb-12 pt-7 sm:px-8">
          <header className="animate-rise flex items-center justify-between">
            <p className="font-display text-3xl text-sand sm:text-4xl">
              Field Lens
            </p>
            <p className="text-sm text-sand/70">Photo library</p>
          </header>

          <div className="mt-auto max-w-xl pb-4 pt-24">
            <h1
              className="animate-rise font-display text-[clamp(2.6rem,8vw,4.8rem)] leading-[0.94] text-sand"
              style={{ animationDelay: "80ms" }}
            >
              Keep the field in frame.
            </h1>
            <p
              className="animate-rise mt-5 max-w-md text-lg leading-relaxed text-sand/80"
              style={{ animationDelay: "140ms" }}
            >
              A quiet place for outdoor rolls—browse the sample set or drop in
              your own photos.
            </p>
            <div
              className="animate-rise mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "200ms" }}
            >
              <button
                type="button"
                onClick={scrollToGallery}
                className="rounded-md bg-amber px-6 py-3 text-base font-semibold text-night transition hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                Open library
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-md border border-sand/25 bg-sand/5 px-6 py-3 text-base font-medium text-sand transition hover:border-sand/45 hover:bg-sand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
              >
                Add photos
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={galleryRef}
        id="library"
        className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-sand sm:text-4xl">
              Library
            </h2>
            <p className="mt-2 max-w-lg text-mute">
              {usingSamples
                ? "Showing sample field frames. Add your own photos anytime—they stay on this device."
                : "Your photos on this device. Samples are hidden until you restore them."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-md bg-amber px-4 py-2.5 text-sm font-semibold text-night transition hover:bg-amber-deep"
            >
              Add photos
            </label>
            {!usingSamples ? (
              <button
                type="button"
                onClick={restoreSamples}
                className="rounded-md border border-sand/20 px-4 py-2.5 text-sm text-sand/85 transition hover:border-sand/40"
              >
                Restore samples
              </button>
            ) : null}
          </div>
        </div>

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={onAddPhotos}
        />

        <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className="animate-rise mb-4 break-inside-avoid"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <button
                type="button"
                onClick={() => setActiveId(photo.id)}
                className="group relative block w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={!photo.sample}
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-4 pt-12 opacity-0 transition group-hover:opacity-100">
                  <span className="block font-display text-lg text-sand">
                    {photo.title}
                  </span>
                  <span className="text-sm text-sand/75">{photo.place}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {active ? (
        <div
          className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-night/92 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActiveId(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md border border-sand/20 px-3 py-1.5 text-sm text-sand sm:right-8 sm:top-8"
            onClick={() => setActiveId(null)}
          >
            Close
          </button>
          <figure
            className="relative max-h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.title}
              width={active.width}
              height={active.height}
              unoptimized={!active.sample}
              className="max-h-[80vh] w-auto object-contain"
              sizes="90vw"
            />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-sand">
              <span className="font-display text-2xl">{active.title}</span>
              <span className="text-sm text-mute">
                {active.place}
                {active.sample ? " · sample" : ""}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </main>
  );
}
