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
import { CardSelector } from "@/src/components/CardSelector";
import { SpreadLayout } from "@/src/components/SpreadLayout";

type Step = "spread" | "question" | "character" | "cards" | "reveal" | "reading";

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

  const [step, setStep] = useState<Step>(resolvedSpread ? "question" : "spread");
  const [spread, setSpread] = useState<SpreadType | undefined>(resolvedSpread);
  const [question, setQuestion] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const { reading, isLoading, error, startReading } = useReading();

  const allCards = getAllCards();
  const resolvedCards: TarotCard[] = selectedCards.map(
    (sc) => allCards.find((c) => c.id === sc.id)!
  );

  const handleSpreadSelect = useCallback((s: SpreadType) => {
    setSpread(s);
    setStep("question");
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
          }, 800);
        }

        return next;
      });
    },
    [spread, selectedCards, question, characterId, startReading]
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
    setStep(resolvedSpread ? "question" : "spread");
    setQuestion("");
    setCharacterId("");
    setSelectedCards([]);
    setRevealedIndices(new Set());
  }, [resolvedSpread]);

  return (
    <section className="starfield cosmic-mesh relative min-h-[calc(100dvh-3rem)] px-4 py-10 md:py-16">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8">
        <StepIndicator current={step} hasSpread={!!resolvedSpread} />

        {step === "spread" && <SpreadSelector onSelect={handleSpreadSelect} />}

        {step === "question" && spread && (
          <QuestionStep
            spreadName={spread.nameTh}
            question={question}
            onChange={setQuestion}
            onNext={handleQuestionNext}
          />
        )}

        {step === "character" && <CharacterSelector onSelect={handleCharacterSelect} />}

        {step === "cards" && spread && (
          <CardSelector cardCount={spread.cardCount} onCardsSelected={handleCardsSelected} />
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
      </div>
    </section>
  );
}

function StepIndicator({
  current,
  hasSpread,
}: {
  current: Step;
  hasSpread: boolean;
}) {
  const steps: { key: Step; label: string }[] = hasSpread
    ? [
        { key: "question", label: "คำถาม" },
        { key: "character", label: "นักพยากรณ์" },
        { key: "cards", label: "เลือกไพ่" },
        { key: "reveal", label: "เปิดไพ่" },
        { key: "reading", label: "ทำนาย" },
      ]
    : [
        { key: "spread", label: "รูปแบบ" },
        { key: "question", label: "คำถาม" },
        { key: "character", label: "นักพยากรณ์" },
        { key: "cards", label: "เลือกไพ่" },
        { key: "reveal", label: "เปิดไพ่" },
        { key: "reading", label: "ทำนาย" },
      ];

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
        <span className="text-sm text-gold-400/70 font-medium">{spreadName}</span>
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

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60dvh] items-center justify-center">
          <span className="text-cosmic-300 animate-pulse text-lg">กำลังโหลด...</span>
        </div>
      }
    >
      <ReadingFlow />
    </Suspense>
  );
}
