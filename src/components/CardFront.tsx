import type { TarotCard } from "@/src/data/tarot-cards";

interface CardFrontProps {
  card: TarotCard;
  position: "upright" | "reversed";
}

export function CardFront({ card, position }: CardFrontProps) {
  return (
    <div className="relative flex w-[120px] h-[180px] md:w-[140px] md:h-[210px] flex-col overflow-hidden rounded-[var(--radius-card)]">
      <img
         src={`/cards/classic/${card.id}.webp`}
         alt={card.nameTh}
         className="absolute inset-0 w-full h-full object-cover"
       />

      <div className="absolute inset-0 border border-white/10 rounded-[var(--radius-card)] pointer-events-none" />

      <div className="relative z-10 mt-auto bg-gradient-to-t from-black/70 via-black/40 to-transparent px-2 pb-2 pt-6">
        <p className="text-[11px] md:text-xs font-semibold leading-tight text-white text-center drop-shadow-md">
          {card.nameTh}
        </p>
      </div>

      {position === "reversed" && (
        <span className="absolute top-2 left-1/2 -translate-x-1/2 z-10 text-[10px] font-medium text-red-300/90 bg-red-900/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
          กลับด้าน
        </span>
      )}
    </div>
  );
}
