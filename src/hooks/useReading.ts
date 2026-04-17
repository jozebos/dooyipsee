"use client";

import { useState, useCallback, useRef } from "react";

interface ReadingParams {
  spreadType: string;
  cards: { id: string; position: "upright" | "reversed" }[];
  question?: string;
  personaId: string;
  deckId?: string;
}

export function useReading() {
  const [reading, setReading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const startReading = useCallback(async (params: ReadingParams) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setReading("");
    setIsLoading(true);
    setError(null);
    setReadingId(null);

    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? `เกิดข้อผิดพลาด (${response.status})`,
        );
      }

      const headerReadingId = response.headers.get("X-Reading-Id");
      if (headerReadingId) {
        setReadingId(headerReadingId);
      }

      if (!response.body) {
        throw new Error("ไม่สามารถรับข้อมูลแบบสตรีมได้");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            setIsLoading(false);
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.readingId) {
              setReadingId(parsed.readingId);
            }
            if (parsed.content) {
              setReading((prev) => prev + parsed.content);
            }
          } catch {
            /* malformed SSE chunk — skip */
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      );
      setIsLoading(false);
    }
  }, []);

  return { reading, isLoading, error, readingId, startReading };
}
