import * as React from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        {eyebrow && (
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-500">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary md:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
