"use client";

interface CardBackProps {
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function CardBack({ onClick, selected, disabled }: CardBackProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex items-center justify-center
        w-[120px] h-[180px] md:w-[140px] md:h-[210px]
        rounded-[var(--radius-card)] overflow-hidden
        transition-all duration-300
        ${
          selected
            ? "ring-2 ring-gold-400 shadow-[var(--shadow-glow-gold)] scale-[1.04]"
            : "ring-1 ring-cosmic-600 shadow-[var(--shadow-cosmic)]"
        }
        ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer hover:ring-mystic-purple hover:shadow-[var(--shadow-glow-purple)] hover:-translate-y-1 active:scale-95"
        }
      `}
      aria-label="เลือกไพ่"
    >
      <img
         src="/cards/card-back.webp"
         alt="ไพ่ทาโร่"
         className="w-full h-full object-cover rounded-[var(--radius-card)]"
       />

      {/* Shimmer overlay on hover */}
      {!disabled && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(167,139,250,0.12) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />
      )}
    </button>
  );
}
