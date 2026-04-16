"use client";

interface ReadingDisplayProps {
  reading: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ReadingDisplay({
  reading,
  isLoading,
  error,
  onRetry,
}: ReadingDisplayProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-center">
        <p className="text-red-300">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600/30 px-5 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-600/50"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  if (isLoading && !reading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-cosmic-300 text-lg animate-pulse">
          กำลังทำนาย
          <span className="inline-flex w-8 text-left">
            <LoadingDots />
          </span>
        </span>
      </div>
    );
  }

  if (!reading) return null;

  return (
    <div className="prose prose-invert max-w-none">
      <div className="whitespace-pre-wrap leading-relaxed text-cosmic-100">
        {reading}
        {isLoading && <TypingCursor />}
      </div>
    </div>
  );
}

function TypingCursor() {
  return (
    <span
      className="ml-0.5 inline-block h-5 w-[2px] bg-gold-400 animate-blink align-text-bottom"
      aria-hidden="true"
    />
  );
}

function LoadingDots() {
  return (
    <>
      <span className="animate-dot-1">.</span>
      <span className="animate-dot-2">.</span>
      <span className="animate-dot-3">.</span>
    </>
  );
}
