"use client";

import { useState, useMemo } from "react";
import { getAllCards, drawRandomCards } from "@/src/data/tarot-cards";
import { CardBack } from "./CardBack";

interface SelectedCard {
  id: string;
  position: "upright" | "reversed";
}

interface CardSelectorProps {
  cardCount: number;
  onCardsSelected: (cards: SelectedCard[]) => void;
}

function randomPosition(): "upright" | "reversed" {
  return Math.random() > 0.3 ? "upright" : "reversed";
}

const DISPLAY_COUNT = 21;

export function CardSelector({ cardCount, onCardsSelected }: CardSelectorProps) {
  const displayCards = useMemo(() => {
    const all = getAllCards();
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, DISPLAY_COUNT);
  }, []);

  const [selected, setSelected] = useState<SelectedCard[]>([]);
  const isFull = selected.length >= cardCount;

  function handleCardTap(cardId: string) {
    setSelected((prev) => {
      const already = prev.find((s) => s.id === cardId);
      if (already) return prev.filter((s) => s.id !== cardId);
      if (prev.length >= cardCount) return prev;
      return [...prev, { id: cardId, position: randomPosition() }];
    });
  }

  function handleRandom() {
    const random = drawRandomCards(cardCount);
    const cards: SelectedCard[] = random.map((c) => ({
      id: c.id,
      position: randomPosition(),
    }));
    setSelected(cards);
    onCardsSelected(cards);
  }

  function handleConfirm() {
    onCardsSelected(selected);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center">
        เลือกไพ่ {cardCount} ใบ
      </h2>
      <p className="text-sm text-cosmic-200/60 text-center -mt-2">
        แตะที่ไพ่เพื่อเลือก ({selected.length}/{cardCount})
      </p>

      <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 md:gap-3 justify-items-center">
        {displayCards.map((card) => {
          const isSelected = selected.some((s) => s.id === card.id);
          return (
            <div
              key={card.id}
              className="transform scale-[0.72] sm:scale-[0.82] md:scale-90 origin-center"
            >
              <CardBack
                onClick={() => handleCardTap(card.id)}
                selected={isSelected}
                disabled={!isSelected && isFull}
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <button
          type="button"
          onClick={handleRandom}
          className="flex items-center gap-2 rounded-[var(--radius-button)] border border-cosmic-500 bg-cosmic-800 px-6 py-2.5 text-sm font-medium text-cosmic-200 transition-all duration-300 hover:border-gold-400 hover:text-gold-400 hover:shadow-[var(--shadow-glow-gold)] cursor-pointer"
        >
          <span>🎲</span>
          <span>สุ่มให้</span>
        </button>

        {isFull && (
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-cosmic px-8 py-2.5 text-sm cursor-pointer"
          >
            <span>เริ่มเปิดไพ่</span>
          </button>
        )}
      </div>
    </div>
  );
}
