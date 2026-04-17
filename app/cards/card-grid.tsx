"use client";

import Link from "next/link";
import { useState } from "react";

interface CardItem {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string;
  arcana: string;
  suit?: string;
  suitColor: string;
}

interface SectionData {
  key: string;
  label: string;
  cards: CardItem[];
}

interface CardGridProps {
  allCards: CardItem[];
  sections: SectionData[];
}

const FILTERS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "major", label: "Major Arcana" },
  { key: "wands", label: "ไม้เท้า" },
  { key: "cups", label: "ถ้วย" },
  { key: "swords", label: "ดาบ" },
  { key: "pentacles", label: "เหรียญ" },
] as const;

function CardTile({ card }: { card: CardItem }) {
  return (
    <Link
      href={`/cards/${card.slug}`}
      className="surface-card group flex flex-col items-center gap-2 p-3 text-center transition-all duration-300 hover:-translate-y-1 sm:gap-3 sm:p-4"
    >
      <img
         src={`/cards/classic/${card.id}.webp`}
         alt={card.nameTh}
         loading="lazy"
         className="w-full aspect-[2/3] object-cover rounded-lg"
       />
      <p className="line-clamp-2 text-xs font-medium leading-tight text-cosmic-100 group-hover:text-gold-400 transition-colors sm:text-sm">
        {card.nameTh}
      </p>
    </Link>
  );
}

export function CardGrid({ sections }: CardGridProps) {
  const [active, setActive] = useState<string>("all");

  const filteredSections =
    active === "all"
      ? sections
      : sections.filter((s) => s.key === active);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
              active === f.key
                ? "bg-cosmic-500 text-white shadow-glow-purple"
                : "bg-cosmic-800 text-cosmic-200/70 hover:bg-cosmic-700 hover:text-cosmic-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {filteredSections.map((section) => (
          <div key={section.key}>
            <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-cosmic-200 sm:mb-6 sm:text-xl">
              <span className="h-px flex-1 bg-cosmic-700/60" />
              <span className="shrink-0">{section.label}</span>
              <span className="text-sm font-normal text-cosmic-200/50">
                ({section.cards.length})
              </span>
              <span className="h-px flex-1 bg-cosmic-700/60" />
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-4">
              {section.cards.map((card) => (
                <CardTile key={card.slug} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
