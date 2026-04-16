"use client";

import type { TarotCard } from "@/src/data/tarot-cards";
import { CardFlip } from "./CardFlip";

interface SpreadCard {
  card: TarotCard;
  position: "upright" | "reversed";
  isFlipped: boolean;
}

interface SpreadLayoutProps {
  cards: SpreadCard[];
  spreadType: string;
  onCardClick: (index: number) => void;
  positionLabels?: string[];
}

export function SpreadLayout({
  cards,
  spreadType,
  onCardClick,
  positionLabels,
}: SpreadLayoutProps) {
  if (spreadType === "daily-card") {
    return <DailyLayout cards={cards} onCardClick={onCardClick} label={positionLabels?.[0]} />;
  }

  if (spreadType === "three-card" || spreadType === "past-present-future") {
    return <ThreeCardLayout cards={cards} onCardClick={onCardClick} labels={positionLabels} />;
  }

  return <CelticCrossLayout cards={cards} onCardClick={onCardClick} labels={positionLabels} />;
}

function DailyLayout({
  cards,
  onCardClick,
  label,
}: {
  cards: SpreadCard[];
  onCardClick: (i: number) => void;
  label?: string;
}) {
  const c = cards[0];
  if (!c) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <CardFlip
        isFlipped={c.isFlipped}
        card={c.card}
        position={c.position}
        onClick={() => onCardClick(0)}
      />
      {label && (
        <span className="text-xs md:text-sm font-medium text-gold-400/80">
          {label}
        </span>
      )}
    </div>
  );
}

function ThreeCardLayout({
  cards,
  onCardClick,
  labels,
}: {
  cards: SpreadCard[];
  onCardClick: (i: number) => void;
  labels?: string[];
}) {
  const defaultLabels = ["อดีต", "ปัจจุบัน", "อนาคต"];

  return (
    <div className="flex items-end justify-center gap-3 md:gap-6">
      {cards.slice(0, 3).map((c, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <CardFlip
            isFlipped={c.isFlipped}
            card={c.card}
            position={c.position}
            onClick={() => onCardClick(i)}
          />
          <span className="text-xs md:text-sm font-medium text-gold-400/80">
            {labels?.[i] ?? defaultLabels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function CelticCrossLayout({
  cards,
  onCardClick,
  labels,
}: {
  cards: SpreadCard[];
  onCardClick: (i: number) => void;
  labels?: string[];
}) {
  const defaultLabels = [
    "สถานการณ์", "ความท้าทาย", "อดีต", "อนาคตใกล้",
    "เป้าหมาย", "รากฐาน", "คำแนะนำ", "อิทธิพล",
    "ความหวัง/กลัว", "ผลลัพธ์",
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5 justify-items-center">
      {cards.slice(0, 10).map((c, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <span className="text-[10px] md:text-xs text-cosmic-300/60 font-medium">
            {i + 1}
          </span>
          <CardFlip
            isFlipped={c.isFlipped}
            card={c.card}
            position={c.position}
            onClick={() => onCardClick(i)}
          />
          <span className="text-[10px] md:text-xs font-medium text-gold-400/70 text-center max-w-[100px]">
            {labels?.[i] ?? defaultLabels[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
