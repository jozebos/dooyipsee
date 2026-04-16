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
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-800 via-cosmic-700 to-cosmic-800" />

      {/* Diamond lattice pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(45deg, var(--color-mystic-purple) 1px, transparent 1px),
            linear-gradient(-45deg, var(--color-mystic-purple) 1px, transparent 1px)
          `,
          backgroundSize: "18px 18px",
        }}
      />

      {/* Inner border frame */}
      <div className="absolute inset-2 rounded-lg border border-cosmic-500/40" />
      <div className="absolute inset-3.5 rounded-md border border-cosmic-500/20" />

      {/* Central mystical symbol */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center">
          {/* Rotating outer ring */}
          <div
            className="absolute inset-0 rounded-full border border-cosmic-400/30"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, var(--color-mystic-purple), transparent, var(--color-mystic-indigo), transparent)",
              mask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
              WebkitMask:
                "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
              animation: disabled ? "none" : "spin 12s linear infinite",
            }}
          />
          {/* Star icon */}
          <span className="text-2xl md:text-3xl opacity-80 group-hover:opacity-100 transition-opacity">
            ✦
          </span>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-2.5 left-2.5 h-3 w-3 border-t border-l border-gold-400/30 rounded-tl-sm" />
      <div className="absolute top-2.5 right-2.5 h-3 w-3 border-t border-r border-gold-400/30 rounded-tr-sm" />
      <div className="absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-gold-400/30 rounded-bl-sm" />
      <div className="absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-gold-400/30 rounded-br-sm" />

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
