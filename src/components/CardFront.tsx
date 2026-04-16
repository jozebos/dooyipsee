import type { TarotCard } from "@/src/data/tarot-cards";

const suitColors: Record<string, { from: string; to: string; accent: string }> =
  {
    wands: {
      from: "rgb(180, 83, 9)",
      to: "rgb(146, 64, 14)",
      accent: "rgb(251, 191, 36)",
    },
    cups: {
      from: "rgb(30, 64, 175)",
      to: "rgb(29, 78, 216)",
      accent: "rgb(147, 197, 253)",
    },
    swords: {
      from: "rgb(75, 85, 99)",
      to: "rgb(55, 65, 81)",
      accent: "rgb(209, 213, 219)",
    },
    pentacles: {
      from: "rgb(21, 128, 61)",
      to: "rgb(22, 101, 52)",
      accent: "rgb(134, 239, 172)",
    },
    major: {
      from: "var(--color-cosmic-600)",
      to: "var(--color-cosmic-700)",
      accent: "var(--color-gold-400)",
    },
  };

interface CardFrontProps {
  card: TarotCard;
  position: "upright" | "reversed";
}

export function CardFront({ card, position }: CardFrontProps) {
  const colors = suitColors[card.suit ?? "major"];

  return (
    <div
      className="relative flex w-[120px] h-[180px] md:w-[140px] md:h-[210px] flex-col items-center justify-between overflow-hidden rounded-[var(--radius-card)] p-3 md:p-4"
      style={{
        background: `linear-gradient(to bottom, ${colors.from}, ${colors.to})`,
      }}
    >
      <div className="absolute inset-0 border border-white/10 rounded-[var(--radius-card)] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 text-center">
        <span className="text-[10px] md:text-xs font-medium tracking-wider uppercase text-white/50">
          {card.arcana === "major" ? `${card.number}` : card.suit}
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-3xl md:text-4xl">
          {card.arcana === "major" ? "🌟" : card.suit === "wands" ? "🪄" : card.suit === "cups" ? "🏆" : card.suit === "swords" ? "⚔️" : "💰"}
        </span>
        {position === "reversed" && (
          <span className="text-[10px] font-medium text-red-300/90 bg-red-900/40 px-2 py-0.5 rounded-full">
            กลับด้าน
          </span>
        )}
      </div>

      <div className="relative z-10 text-center">
        <p
          className="text-[11px] md:text-xs font-semibold leading-tight"
          style={{ color: colors.accent }}
        >
          {card.nameTh}
        </p>
      </div>
    </div>
  );
}
