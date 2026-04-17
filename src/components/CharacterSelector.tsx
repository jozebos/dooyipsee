"use client";

import { useState } from "react";
import { personas } from "@/src/data/personas";

const avatarEmojis: Record<string, string> = {
  "mae-mo-jantra": "🌙",
  "ajarn-dao-thep": "🌌",
  "nong-mystic": "⚡",
  "khun-yai-tip": "🔮",
  "mor-thep-digital": "💫",
};

interface CharacterSelectorProps {
  onSelect: (personaId: string) => void;
}

export function CharacterSelector({ onSelect }: CharacterSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelect(id: string) {
    setSelectedId(id);
    onSelect(id);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center">
        เลือกหมอดู
      </h2>
      <p className="text-sm text-cosmic-200/60 text-center -mt-2">
        แต่ละท่านมีสไตล์การทำนายที่แตกต่างกัน
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {personas.map((persona) => {
          const isSelected = selectedId === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => handleSelect(persona.id)}
              className={`
                relative flex flex-col items-center gap-3 p-5 md:p-6
                rounded-[var(--radius-card)] transition-all duration-300
                bg-cosmic-800 border cursor-pointer
                ${
                  isSelected
                    ? "border-mystic-purple shadow-[var(--shadow-glow-purple)] scale-[1.02]"
                    : "border-cosmic-600 shadow-[var(--shadow-cosmic)] hover:border-cosmic-500 hover:shadow-[var(--shadow-cosmic-lg)] hover:-translate-y-0.5"
                }
              `}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-mystic-purple text-xs text-white">
                  ✓
                </div>
              )}

              <span className="text-4xl md:text-5xl">
                {avatarEmojis[persona.id] ?? "🔮"}
              </span>

              <h3 className="text-base md:text-lg font-semibold text-cosmic-100">
                {persona.name}
              </h3>

              <p className="text-xs md:text-sm text-cosmic-200/70 text-center leading-relaxed">
                {persona.bio}
              </p>

              <span className="text-[11px] text-cosmic-300/50 italic text-center">
                {persona.personality.split(" ").slice(0, 4).join(" ")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
