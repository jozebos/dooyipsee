import type { Metadata } from "next";
import {
  getAllCards,
  getCardsByArcana,
  getCardsBySuit,
} from "@/src/data/tarot-cards";
import { CardGrid } from "./card-grid";

export const metadata: Metadata = {
  title: "ไพ่ทาโร่ทั้ง 78 ใบ — ความหมายครบทุกใบ",
  description:
    "เรียนรู้ความหมายไพ่ทาโร่ทั้ง 78 ใบ ครบทุกใบ Major Arcana 22 ใบ และ Minor Arcana 56 ใบ ทั้งหัวตั้งและหัวกลับ พร้อมสัญลักษณ์และคำแนะนำ",
  keywords: [
    "ไพ่ทาโร่",
    "ความหมายไพ่ทาโร่",
    "Major Arcana",
    "Minor Arcana",
    "ไพ่ยิปซี",
    "ไพ่ทาโร่ 78 ใบ",
  ],
  alternates: { canonical: "/cards" },
};

const SUIT_COLOR_MAP: Record<string, string> = {
  major: "from-mystic-purple/40 to-mystic-indigo/30",
  wands: "from-orange-500/40 to-amber-600/30",
  cups: "from-blue-500/40 to-cyan-600/30",
  swords: "from-slate-400/40 to-gray-500/30",
  pentacles: "from-emerald-500/40 to-green-600/30",
};

const SUIT_LABEL_MAP: Record<string, string> = {
  major: "Major Arcana",
  wands: "ไม้เท้า (Wands)",
  cups: "ถ้วย (Cups)",
  swords: "ดาบ (Swords)",
  pentacles: "เหรียญ (Pentacles)",
};

function getSuitColor(arcana: string, suit?: string): string {
  if (arcana === "major") return SUIT_COLOR_MAP.major;
  return SUIT_COLOR_MAP[suit ?? "major"];
}

export default function CardsPage() {
  const majorCards = getCardsByArcana("major");
  const wandsCards = getCardsBySuit("wands");
  const cupsCards = getCardsBySuit("cups");
  const swordsCards = getCardsBySuit("swords");
  const pentaclesCards = getCardsBySuit("pentacles");

  const sections = [
    { key: "major", label: SUIT_LABEL_MAP.major, cards: majorCards },
    { key: "wands", label: SUIT_LABEL_MAP.wands, cards: wandsCards },
    { key: "cups", label: SUIT_LABEL_MAP.cups, cards: cupsCards },
    { key: "swords", label: SUIT_LABEL_MAP.swords, cards: swordsCards },
    { key: "pentacles", label: SUIT_LABEL_MAP.pentacles, cards: pentaclesCards },
  ];

  const allCardsData = getAllCards().map((card) => ({
    id: card.id,
    slug: card.slug,
    nameTh: card.nameTh,
    nameEn: card.nameEn,
    arcana: card.arcana,
    suit: card.suit,
    suitColor: getSuitColor(card.arcana, card.suit),
  }));

  const sectionsData = sections.map((section) => ({
    key: section.key,
    label: section.label,
    cards: section.cards.map((card) => ({
      id: card.id,
      slug: card.slug,
      nameTh: card.nameTh,
      nameEn: card.nameEn,
      arcana: card.arcana,
      suit: card.suit,
      suitColor: getSuitColor(card.arcana, card.suit),
    })),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="mb-10 text-center sm:mb-14">
        <h1 className="text-glow text-3xl font-bold tracking-tight text-cosmic-100 sm:text-4xl">
          ไพ่ทาโร่ทั้ง 78 ใบ
        </h1>
        <p className="mt-3 text-base text-cosmic-200/70 sm:text-lg">
          เรียนรู้ความหมายไพ่ทาโร่ครบทุกใบ ทั้งหัวตั้งและหัวกลับ
        </p>
      </div>

      <CardGrid allCards={allCardsData} sections={sectionsData} />
    </section>
  );
}
