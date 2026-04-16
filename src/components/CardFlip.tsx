"use client";

import { motion } from "framer-motion";
import type { TarotCard } from "@/src/data/tarot-cards";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

interface CardFlipProps {
  isFlipped: boolean;
  card: TarotCard;
  position: "upright" | "reversed";
  onClick?: () => void;
}

export function CardFlip({ isFlipped, card, position, onClick }: CardFlipProps) {
  return (
    <div
      className="relative w-[120px] h-[180px] md:w-[140px] md:h-[210px]"
      style={{ perspective: "800px" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.7,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardBack onClick={onClick} />
        </div>

        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardFront card={card} position={position} />
        </div>
      </motion.div>
    </div>
  );
}
