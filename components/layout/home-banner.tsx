"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, ShieldCheck } from "lucide-react";

const slides = [
  {
    image: "/citycare-street.svg",
    imageAlt: "Illustration of a neighborhood street with a report pin",
    eyebrow: "A better neighborhood starts here",
    title: "See a problem? Make it heard.",
    description:
      "Report potholes, broken streetlights, and other local issues directly to the city team that can help.",
    action: "Report an issue",
  },
  {
    image: "/citycare-repairs.svg",
    imageAlt: "Illustration of a city crew repairing a neighborhood road",
    eyebrow: "Connected to the right team",
    title: "Your city is ready to listen.",
    description:
      "Every report gets to the people responsible, helping your community respond to what matters.",
    action: "Get started",
  },
  {
    image: "/citycare-progress.svg",
    imageAlt: "Illustration of a resident checking a city service update",
    eyebrow: "Updates you can follow",
    title: "Know what happens next.",
    description:
      "Follow your request from the first update through to resolution, all from your CityCare account.",
    action: "Track a report",
  },
];

export default function HomeBanner() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  return (
    <section
      aria-label="CityCare highlights"
      aria-roledescription="carousel"
      className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-8"
    >
      <div className="relative isolate min-h-[570px] overflow-hidden rounded-[2rem] border bg-muted/40 shadow-sm sm:min-h-[500px] lg:min-h-[530px]">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10" />

        {slides.map((slide, index) => (
          <div
            key={slide.image}
            className={`absolute inset-0 -z-10 transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center"
            />
          </div>
        ))}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/15 sm:via-background/85" />

        <div
          className="flex min-h-[570px] flex-col justify-between p-6 sm:min-h-[500px] sm:p-10 lg:min-h-[530px] lg:p-14"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500" />
              {slides[activeSlide].eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {slides[activeSlide].title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {slides[activeSlide].description}
            </p>
            <Link
              href={activeSlide === 2 ? "/login" : "/register"}
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/85"
            >
              {slides[activeSlide].action}
              <ArrowRight className="size-4" />
            </Link>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Your report stays connected to you and its progress.
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2" aria-label="Choose a slide">
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-foreground/25 hover:bg-foreground/50"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={isPaused ? "Play slides" : "Pause slides"}
                onClick={() => setIsPaused((paused) => !paused)}
                className="flex size-10 items-center justify-center rounded-full border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
              >
                {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goToSlide(activeSlide - 1)}
                className="flex size-10 items-center justify-center rounded-full border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goToSlide(activeSlide + 1)}
                className="flex size-10 items-center justify-center rounded-full border bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
