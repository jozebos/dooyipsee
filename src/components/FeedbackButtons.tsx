"use client";

import { useState } from "react";

export function FeedbackButtons({
  readingId,
}: {
  readingId: string | null;
}) {
  const [submitted, setSubmitted] = useState<"like" | "dislike" | null>(null);

  if (!readingId) return null;

  const submit = async (rating: "like" | "dislike") => {
    setSubmitted(rating);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readingId, rating }),
    });
  };

  if (submitted) {
    return (
      <div className="text-center text-sm text-cosmic-200/60">
        {submitted === "like"
          ? "🙏 ขอบคุณที่ชอบคำทำนาย!"
          : "🙏 ขอบคุณสำหรับความคิดเห็น!"}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-sm text-cosmic-200/60">คำทำนายนี้เป็นอย่างไร?</span>
      <button
        onClick={() => submit("like")}
        className="rounded-full px-4 py-2 text-sm bg-cosmic-700/50 hover:bg-green-900/40 text-cosmic-200 transition-colors cursor-pointer"
      >
        👍 ชอบ
      </button>
      <button
        onClick={() => submit("dislike")}
        className="rounded-full px-4 py-2 text-sm bg-cosmic-700/50 hover:bg-red-900/40 text-cosmic-200 transition-colors cursor-pointer"
      >
        👎 ไม่ชอบ
      </button>
    </div>
  );
}
