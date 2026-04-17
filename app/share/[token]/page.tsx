import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingByShareToken } from "@/src/server/db";
import { getPersonaById } from "@/src/data/personas";
import { getSpreadById } from "@/src/data/spreads";
import { getAllCards } from "@/src/data/tarot-cards";

interface ReadingRow {
  id: string;
  persona_id: string;
  spread_type: string;
  cards_json: string;
  reading_text: string;
  question: string | null;
  deck_id: string;
  created_at: string;
}

interface CardEntry {
  id: string;
  position: "upright" | "reversed";
}

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { token } = await params;
  const row = await getReadingByShareToken(token);
  if (!row) return { title: "ไม่พบคำทำนาย" };

  const reading = row as unknown as ReadingRow;
  const persona = getPersonaById(reading.persona_id);
  const spread = getSpreadById(reading.spread_type);

  return {
    title: "คำทำนายจากดูยิปซี",
    description: reading.reading_text.slice(0, 160),
    openGraph: {
      title: `คำทำนาย${spread?.nameTh ? ` — ${spread.nameTh}` : ""} | ดูยิปซี`,
      description: `${persona?.name ?? "หมอดู"}ทำนายให้ — ${reading.reading_text.slice(0, 120)}...`,
      type: "article",
      siteName: "ดูยิปซี",
    },
  };
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-cosmic-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderMarkdown(text: string) {
  return text.split("\n\n").map((block, blockIdx) => {
    if (block.startsWith("## ")) {
      return (
        <h3
          key={blockIdx}
          className="mt-6 mb-3 text-lg font-semibold text-gold-400"
        >
          {block.slice(3)}
        </h3>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h4
          key={blockIdx}
          className="mt-4 mb-2 text-base font-semibold text-cosmic-300"
        >
          {block.slice(4)}
        </h4>
      );
    }
    if (block.trim() === "---") {
      return <hr key={blockIdx} className="my-6 border-cosmic-600" />;
    }
    if (
      block
        .split("\n")
        .every((line) => line.match(/^[-•*]\s/) || line.trim() === "")
    ) {
      return (
        <ul key={blockIdx} className="my-3 space-y-1.5 pl-4">
          {block
            .split("\n")
            .filter((l) => l.trim())
            .map((line, i) => (
              <li key={i} className="text-cosmic-200/90 flex gap-2">
                <span className="text-cosmic-400 shrink-0">•</span>
                <span>{renderInline(line.replace(/^[-•*]\s*/, ""))}</span>
              </li>
            ))}
        </ul>
      );
    }
    return (
      <p key={blockIdx} className="my-2 leading-relaxed text-cosmic-100/90">
        {renderInline(block.replace(/\n/g, " "))}
      </p>
    );
  });
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const row = await getReadingByShareToken(token);
  if (!row) notFound();

  const reading = row as unknown as ReadingRow;
  const persona = getPersonaById(reading.persona_id);
  const spread = getSpreadById(reading.spread_type);
  const cards: CardEntry[] = JSON.parse(reading.cards_json);
  const allCards = getAllCards();

  return (
    <section className="starfield cosmic-mesh relative min-h-[calc(100dvh-3rem)] px-4 py-10 md:py-16">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-3xl">🔮</span>
          <h1 className="text-xl md:text-2xl font-semibold text-cosmic-100">
            คำทำนายจากดูยิปซี
          </h1>
          {spread && (
            <p className="text-sm text-gold-400/70">{spread.nameTh}</p>
          )}
          {persona && (
            <p className="text-sm text-cosmic-200/50">
              ทำนายโดย {persona.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {cards.map((card, i) => {
            const tarotCard = allCards.find((c) => c.id === card.id);
            if (!tarotCard) return null;
            const isUpright = card.position === "upright";
            const posLabel = spread?.positions[i]?.nameTh;

            return (
              <div key={`${card.id}-${i}`} className="flex flex-col items-center gap-1.5">
                <div className="relative w-[72px] h-[108px] md:w-20 md:h-[120px] rounded-lg overflow-hidden shadow-[var(--shadow-cosmic)] border border-cosmic-600/50">
                  <img
                    src={`/cards/classic/${card.id}.webp`}
                    alt={tarotCard.nameTh}
                    className="w-full h-full object-cover"
                  />
                  {!isUpright && (
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-medium text-red-300/90 bg-red-900/70 px-1.5 py-px rounded-full backdrop-blur-sm">
                      กลับด้าน
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-cosmic-200/60 text-center max-w-[80px] truncate">
                  {tarotCard.nameTh}
                </span>
                {posLabel && (
                  <span className="text-[9px] text-gold-400/50">
                    {posLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full surface-card p-5 md:p-8">
          {persona && (
            <div className="mb-4 flex items-center gap-2 text-sm text-cosmic-300/80">
              <span>🔮</span>
              <span className="font-medium text-gold-400">{persona.name}</span>
              <span>ทำนายให้คุณ</span>
            </div>
          )}
          <div className="prose prose-invert max-w-none leading-relaxed text-cosmic-100">
            {renderMarkdown(reading.reading_text)}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-cosmic-500/60 to-transparent" />
          <p className="text-sm text-cosmic-200/50">
            อยากลองดูไพ่เอง?
          </p>
          <Link
            href="/reading"
            className="btn-cosmic px-8 py-3 text-sm cursor-pointer inline-block"
          >
            <span>🔮 ดูไพ่ยิปซี</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
