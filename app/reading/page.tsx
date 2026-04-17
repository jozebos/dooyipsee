"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSpreadById, spreads } from "@/src/data/spreads";
import type { SpreadType } from "@/src/data/spreads";
import { getAllCards } from "@/src/data/tarot-cards";
import type { TarotCard } from "@/src/data/tarot-cards";
import { useReading } from "@/src/hooks/useReading";
import { ReadingDisplay } from "@/src/components/ReadingDisplay";
import { CharacterSelector } from "@/src/components/CharacterSelector";
import { getCharacterById } from "@/src/data/ai-characters";
import { CardSelector } from "@/src/components/CardSelector";
import { SpreadLayout } from "@/src/components/SpreadLayout";

type Step =
  | "spread"
  | "mode"
  | "question"
  | "character"
  | "cards"
  | "reveal"
  | "reading"
  | "meanings";

type ReadingMode = "quick" | "ai";

interface SelectedCard {
  id: string;
  position: "upright" | "reversed";
}

function ReadingFlow() {
  const searchParams = useSearchParams();
  const spreadParam = searchParams.get("spread");

  const resolvedSpread =
    getSpreadById(spreadParam ?? "") ??
    (spreadParam === "past-present-future"
      ? getSpreadById("three-card")
      : undefined);

  const [step, setStep] = useState<Step>(resolvedSpread ? "mode" : "spread");
  const [spread, setSpread] = useState<SpreadType | undefined>(resolvedSpread);
  const [mode, setMode] = useState<ReadingMode | null>(null);
  const [question, setQuestion] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
    new Set()
  );
  const [wantsAI, setWantsAI] = useState(false);

  const { reading, isLoading, error, startReading } = useReading();

  const allCards = getAllCards();
  const resolvedCards: TarotCard[] = selectedCards.map(
    (sc) => allCards.find((c) => c.id === sc.id)!
  );

  const handleSpreadSelect = useCallback((s: SpreadType) => {
    setSpread(s);
    setStep("mode");
  }, []);

  const handleModeSelect = useCallback((selected: ReadingMode) => {
    setMode(selected);
    if (selected === "quick") {
      setStep("cards");
    } else {
      setStep("question");
    }
  }, []);

  const handleQuestionNext = useCallback(() => {
    setStep("character");
  }, []);

  const handleCharacterSelect = useCallback((id: string) => {
    setCharacterId(id);
    setTimeout(() => setStep("cards"), 300);
  }, []);

  const handleCardsSelected = useCallback((cards: SelectedCard[]) => {
    setSelectedCards(cards);
    setRevealedIndices(new Set());
    setStep("reveal");
  }, []);

  const handleCardReveal = useCallback(
    (index: number) => {
      setRevealedIndices((prev) => {
        const next = new Set(prev);
        next.add(index);

        if (spread && next.size === spread.cardCount) {
          setTimeout(() => {
            if (mode === "quick") {
              setStep("meanings");
            } else {
              setStep("reading");
              startReading({
                spreadType: spread.id,
                cards: selectedCards.map((sc) => ({
                  id: sc.id,
                  position: sc.position,
                })),
                question: question || undefined,
                characterId,
              });
            }
          }, 800);
        }

        return next;
      });
    },
    [spread, selectedCards, question, characterId, startReading, mode]
  );

  const handleMeaningsAISelect = useCallback(
    (id: string) => {
      setCharacterId(id);
      if (!spread) return;
      startReading({
        spreadType: spread.id,
        cards: selectedCards.map((sc) => ({
          id: sc.id,
          position: sc.position,
        })),
        question: question || undefined,
        characterId: id,
      });
    },
    [spread, selectedCards, question, startReading]
  );

  const handleRetry = useCallback(() => {
    if (!spread) return;
    startReading({
      spreadType: spread.id,
      cards: selectedCards.map((sc) => ({ id: sc.id, position: sc.position })),
      question: question || undefined,
      characterId,
    });
  }, [spread, selectedCards, question, characterId, startReading]);

  const handleStartOver = useCallback(() => {
    setStep(resolvedSpread ? "mode" : "spread");
    setMode(null);
    setQuestion("");
    setCharacterId("");
    setSelectedCards([]);
    setRevealedIndices(new Set());
    setWantsAI(false);
  }, [resolvedSpread]);

  return (
    <section className="starfield cosmic-mesh relative min-h-[calc(100dvh-3rem)] px-4 py-10 md:py-16">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8">
        <StepIndicator
          current={step}
          hasSpread={!!resolvedSpread}
          mode={mode}
        />

        {step === "spread" && <SpreadSelector onSelect={handleSpreadSelect} />}

        {step === "mode" && spread && (
          <ModeSelector
            spreadName={spread.nameTh}
            onSelect={handleModeSelect}
          />
        )}

        {step === "question" && spread && (
          <QuestionStep
            spreadName={spread.nameTh}
            question={question}
            onChange={setQuestion}
            onNext={handleQuestionNext}
          />
        )}

        {step === "character" && (
          <CharacterSelector onSelect={handleCharacterSelect} />
        )}

        {step === "cards" && spread && (
          <CardSelector
            cardCount={spread.cardCount}
            onCardsSelected={handleCardsSelected}
          />
        )}

        {step === "reveal" && spread && resolvedCards.length > 0 && (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center">
              แตะไพ่เพื่อเปิด
            </h2>
            <SpreadLayout
              cards={resolvedCards.map((card, i) => ({
                card,
                position: selectedCards[i].position,
                isFlipped: revealedIndices.has(i),
              }))}
              spreadType={spread.id}
              onCardClick={handleCardReveal}
              positionLabels={spread.positions.map((p) => p.nameTh)}
            />
          </div>
        )}

        {step === "reading" && spread && resolvedCards.length > 0 && (
          <div className="flex flex-col items-center gap-8 w-full">
            <SpreadLayout
              cards={resolvedCards.map((card, i) => ({
                card,
                position: selectedCards[i].position,
                isFlipped: true,
              }))}
              spreadType={spread.id}
              onCardClick={() => {}}
              positionLabels={spread.positions.map((p) => p.nameTh)}
            />

            <div className="w-full surface-card p-5 md:p-8">
              <ReadingDisplay
                reading={reading}
                isLoading={isLoading}
                error={error}
                onRetry={handleRetry}
                characterName={getCharacterById(characterId)?.name}
              />
            </div>

            {!isLoading && reading && (
              <button
                type="button"
                onClick={handleStartOver}
                className="btn-cosmic px-8 py-3 text-sm cursor-pointer"
              >
                <span>ดูไพ่อีกครั้ง</span>
              </button>
            )}
          </div>
        )}

        {step === "meanings" && spread && resolvedCards.length > 0 && (
          <div className="flex flex-col items-center gap-8 w-full">
            <SpreadLayout
              cards={resolvedCards.map((card, i) => ({
                card,
                position: selectedCards[i].position,
                isFlipped: true,
              }))}
              spreadType={spread.id}
              onCardClick={() => {}}
              positionLabels={spread.positions.map((p) => p.nameTh)}
            />

            <CardMeaningsDisplay
              cards={resolvedCards}
              selectedCards={selectedCards}
              spread={spread}
            />

            {!wantsAI ? (
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-cosmic-500/60 to-transparent" />
                <p className="text-sm text-cosmic-200/50">
                  อยากให้ AI ตีความเพิ่มเติม?
                </p>
                <button
                  type="button"
                  onClick={() => setWantsAI(true)}
                  className="btn-cosmic px-6 py-2.5 text-sm cursor-pointer"
                >
                  <span>🤖 ถาม AI ทำนาย</span>
                </button>
              </div>
            ) : !characterId ? (
              <div className="w-full">
                <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-cosmic-500/60 to-transparent" />
                <CharacterSelector onSelect={handleMeaningsAISelect} />
              </div>
            ) : (
              <div className="w-full">
                <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-cosmic-500/60 to-transparent" />
                <div className="w-full surface-card p-5 md:p-8">
                  <ReadingDisplay
                    reading={reading}
                    isLoading={isLoading}
                    error={error}
                    onRetry={handleRetry}
                    characterName={getCharacterById(characterId)?.name}
                  />
                </div>
              </div>
            )}

            {!(wantsAI && isLoading && !reading) && (
              <button
                type="button"
                onClick={handleStartOver}
                className="btn-cosmic px-8 py-3 text-sm cursor-pointer"
              >
                <span>ดูไพ่อีกครั้ง</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   Step Indicator — adapts steps based on mode
   ═══════════════════════════════════════════════════ */

function StepIndicator({
  current,
  hasSpread,
  mode,
}: {
  current: Step;
  hasSpread: boolean;
  mode: ReadingMode | null;
}) {
  const prefix: { key: Step; label: string }[] = hasSpread
    ? []
    : [{ key: "spread", label: "รูปแบบ" }];

  let modeSteps: { key: Step; label: string }[];

  if (mode === "quick") {
    modeSteps = [
      { key: "mode", label: "โหมด" },
      { key: "cards", label: "เลือกไพ่" },
      { key: "reveal", label: "เปิดไพ่" },
      { key: "meanings", label: "ความหมาย" },
    ];
  } else if (mode === "ai") {
    modeSteps = [
      { key: "mode", label: "โหมด" },
      { key: "question", label: "คำถาม" },
      { key: "character", label: "นักพยากรณ์" },
      { key: "cards", label: "เลือกไพ่" },
      { key: "reveal", label: "เปิดไพ่" },
      { key: "reading", label: "ทำนาย" },
    ];
  } else {
    modeSteps = [{ key: "mode", label: "โหมด" }];
  }

  const steps = [...prefix, ...modeSteps];
  const currentIdx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
      {steps.map((s, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-1.5 md:gap-2">
            <div
              className={`
                flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full text-[10px] md:text-xs font-semibold transition-all duration-300
                ${
                  isActive
                    ? "bg-mystic-purple text-white shadow-[var(--shadow-glow-purple)]"
                    : isDone
                      ? "bg-cosmic-600 text-cosmic-200"
                      : "bg-cosmic-800 text-cosmic-200/40 border border-cosmic-700"
                }
              `}
            >
              {isDone ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] md:text-xs ${
                isActive ? "text-cosmic-100 font-medium" : "text-cosmic-200/40"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-4 md:w-6 ${
                  isDone ? "bg-cosmic-500" : "bg-cosmic-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Mode Selector — the new fork in the flow
   ═══════════════════════════════════════════════════ */

function ModeSelector({
  spreadName,
  onSelect,
}: {
  spreadName: string;
  onSelect: (mode: ReadingMode) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-gold-400/70 font-medium">
          {spreadName}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center">
          คุณอยากดูไพ่แบบไหน?
        </h2>
        <p className="text-sm text-cosmic-200/50">เลือกโหมดที่เหมาะกับคุณ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-lg">
        <button
          type="button"
          onClick={() => onSelect("quick")}
          className="group relative flex flex-col items-center gap-4 p-6 md:p-8 rounded-[var(--radius-card)] bg-cosmic-800 border border-cosmic-600 shadow-[var(--shadow-cosmic)] transition-all duration-300 hover:border-gold-400/50 hover:shadow-[var(--shadow-glow-gold)] hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 via-transparent to-gold-400/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <span className="relative text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110">
            🃏
          </span>

          <div className="relative flex flex-col items-center gap-2">
            <h3 className="text-lg md:text-xl font-semibold text-cosmic-100">
              เปิดไพ่เฉยๆ
            </h3>
            <div className="flex flex-col items-center gap-0.5 text-xs text-cosmic-200/60 leading-relaxed">
              <span>เลือกไพ่แล้วดูความหมาย</span>
              <span>ทันที</span>
            </div>
          </div>

          <span className="relative text-[10px] text-gold-400/50 font-medium tracking-widest">
            รวดเร็ว · ง่ายดาย
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect("ai")}
          className="group relative flex flex-col items-center gap-4 p-6 md:p-8 rounded-[var(--radius-card)] bg-cosmic-800 border border-cosmic-600 shadow-[var(--shadow-cosmic)] transition-all duration-300 hover:border-mystic-purple/50 hover:shadow-[var(--shadow-glow-purple)] hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple/5 via-transparent to-mystic-violet/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <span className="relative text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110">
            🤖
          </span>

          <div className="relative flex flex-col items-center gap-2">
            <h3 className="text-lg md:text-xl font-semibold text-cosmic-100">
              ถาม AI ทำนาย
            </h3>
            <div className="flex flex-col items-center gap-0.5 text-xs text-cosmic-200/60 leading-relaxed">
              <span>พิมพ์คำถาม · เลือกนักพยากรณ์</span>
              <span>ให้ AI ตีความให้</span>
            </div>
          </div>

          <span className="relative text-[10px] text-mystic-purple/50 font-medium tracking-widest">
            ลึกซึ้ง · ครบถ้วน
          </span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Card Meanings Display — static card-by-card meanings
   ═══════════════════════════════════════════════════ */

function CardMeaningsDisplay({
  cards,
  selectedCards,
  spread,
}: {
  cards: TarotCard[];
  selectedCards: SelectedCard[];
  spread: SpreadType;
}) {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center mb-2">
        ✨ ความหมายของไพ่
      </h2>
      <p className="text-xs text-cosmic-200/40 text-center mb-6">
        {spread.nameTh} · {cards.length} ใบ
      </p>

      {cards.map((card, i) => {
        const sc = selectedCards[i];
        const pos = spread.positions[i];
        const isUpright = sc.position === "upright";
        const cardData = isUpright ? card.upright : card.reversed;

        return (
          <div
            key={card.id + "-" + i}
            className="surface-card p-5 transition-all duration-500"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="relative w-[72px] h-[108px] md:w-20 md:h-[120px] rounded-lg overflow-hidden shadow-[var(--shadow-cosmic)] border border-cosmic-600/50">
                   <img
                     src={`/cards/${card.id}.webp`}
                     alt={card.nameTh}
                     className="w-full h-full object-cover"
                   />
                  {!isUpright && (
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-medium text-red-300/90 bg-red-900/70 px-1.5 py-px rounded-full backdrop-blur-sm">
                      กลับด้าน
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-gold-400/80 font-medium">
                  {pos.nameTh}
                </span>
                <h3 className="text-base md:text-lg font-semibold text-cosmic-100 mt-0.5 leading-tight">
                  {card.nameTh}
                </h3>
                <span className="text-[11px] text-cosmic-300/70">
                  {card.nameEn} ·{" "}
                  {isUpright ? "🔼 หัวตั้ง" : "🔽 หัวกลับ"}
                </span>

                <div className="mt-2.5 flex gap-1.5 flex-wrap">
                  {cardData.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-cosmic-700/80 border border-cosmic-600/50 px-2.5 py-0.5 text-[11px] text-cosmic-200/90"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-cosmic-200/70">
                  {cardData.meaning}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Spread Selector
   ═══════════════════════════════════════════════════ */

function SpreadSelector({
  onSelect,
}: {
  onSelect: (spread: SpreadType) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center">
        เลือกรูปแบบการดูไพ่
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {spreads.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className="surface-card flex flex-col items-center gap-3 p-6 text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <span className="text-3xl md:text-4xl">{s.icon}</span>
            <h3 className="text-base md:text-lg font-semibold text-cosmic-100">
              {s.nameTh}
            </h3>
            <p className="text-xs text-cosmic-200/60">{s.description}</p>
            <span className="text-xs text-gold-400/70">{s.cardCount} ใบ</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Question Step
   ═══════════════════════════════════════════════════ */

function QuestionStep({
  spreadName,
  question,
  onChange,
  onNext,
}: {
  spreadName: string;
  question: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-gold-400/70 font-medium">
          {spreadName}
        </span>
        <h2 className="text-xl md:text-2xl font-semibold text-cosmic-100 text-center">
          ตั้งคำถาม
        </h2>
      </div>

      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder="พิมพ์คำถามของคุณ (ไม่บังคับ)"
        rows={3}
        className="w-full rounded-[var(--radius-card)] border border-cosmic-600 bg-cosmic-800 px-4 py-3 text-sm text-cosmic-100 placeholder:text-cosmic-200/30 focus:border-mystic-purple focus:outline-none focus:ring-1 focus:ring-mystic-purple/50 transition-colors resize-none"
      />

      <button
        type="button"
        onClick={onNext}
        className="btn-cosmic px-8 py-3 text-sm cursor-pointer"
      >
        <span>{question.trim() ? "ถัดไป" : "ข้ามขั้นตอนนี้"}</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Page Export
   ═══════════════════════════════════════════════════ */

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60dvh] items-center justify-center">
          <span className="text-cosmic-300 animate-pulse text-lg">
            กำลังโหลด...
          </span>
        </div>
      }
    >
      <ReadingFlow />
    </Suspense>
  );
}
