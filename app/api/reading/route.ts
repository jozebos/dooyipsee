import { type NextRequest, NextResponse } from "next/server";
import { getCharacterById } from "@/src/data/ai-characters";
import { getSpreadById } from "@/src/data/spreads";
import { getAllCards } from "@/src/data/tarot-cards";
import type { TarotCard } from "@/src/data/tarot-cards";

interface CardInput {
  id: string;
  position: "upright" | "reversed";
}

interface ReadingRequest {
  spreadType: string;
  cards: CardInput[];
  question?: string;
  characterId: string;
}

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

const spreadTokenKeyMap: Record<string, "daily" | "threeCard" | "celticCross"> =
  {
    "daily-card": "daily",
    "three-card": "threeCard",
    "celtic-cross": "celticCross",
  };

// tarot-cards.ts may not exist yet (created in parallel) — dynamic import with fallback
let tarotCards: TarotCard[] | null = null;

async function loadTarotCards() {
  if (tarotCards !== null) return;
  try {
    const mod = await import("@/src/data/tarot-cards");
    tarotCards = mod.getAllCards() ?? [];
  } catch {
    tarotCards = [];
  }
}

function getCardInfo(cardId: string): {
  name: string;
  meaning: string;
} | null {
  if (!tarotCards || tarotCards.length === 0) return null;
  const card = tarotCards.find((c) => c.id === cardId);
  if (!card) return null;
  return { name: card.nameTh, meaning: card.upright.meaning };
}

function getReversedMeaning(cardId: string, fallback: string): string {
  return (
    tarotCards?.find((c) => c.id === cardId)?.reversed.meaning ?? fallback
  );
}

function buildUserPrompt(
  spread: NonNullable<ReturnType<typeof getSpreadById>>,
  cards: CardInput[],
  question: string,
): string {
  const lines: string[] = [];

  lines.push(`รูปแบบการอ่าน: ${spread.nameTh} (${spread.nameEn})`);
  lines.push(`คำถาม: ${question}`);
  lines.push("");
  lines.push("ไพ่ที่ได้:");

  cards.forEach((card, i) => {
    const pos = spread.positions[i];
    const posLabel = pos ? pos.nameTh : `ตำแหน่งที่ ${i + 1}`;
    const orientation = card.position === "upright" ? "ตั้งตรง" : "กลับด้าน";

    const info = getCardInfo(card.id);
    if (info) {
      const meaning =
        card.position === "upright"
          ? info.meaning
          : getReversedMeaning(card.id, info.meaning);
      lines.push(
        `${i + 1}. ${posLabel}: ${info.name} (${orientation}) — ${meaning}`,
      );
    } else {
      lines.push(`${i + 1}. ${posLabel}: ไพ่ ${card.id} (${orientation})`);
    }
  });

  lines.push("");
  lines.push(
    "กรุณาตีความไพ่ทั้งหมดตามตำแหน่งและทิศทาง และตอบเป็นภาษาไทย",
  );

  return lines.join("\n");
}

function buildFallbackReading(
  spread: NonNullable<ReturnType<typeof getSpreadById>>,
  cards: CardInput[],
): string {
  const lines: string[] = [];
  lines.push(`การอ่านไพ่ ${spread.nameTh}\n`);

  cards.forEach((card, i) => {
    const pos = spread.positions[i];
    const posLabel = pos ? pos.nameTh : `ตำแหน่งที่ ${i + 1}`;
    const orientation = card.position === "upright" ? "ตั้งตรง" : "กลับด้าน";
    const info = getCardInfo(card.id);
    const name = info ? info.name : card.id;

    lines.push(`**${posLabel}**: ${name} (${orientation})`);
    if (info) {
      const meaning =
        card.position === "upright"
          ? info.meaning
          : getReversedMeaning(card.id, info.meaning);
      lines.push(meaning);
    }
    lines.push("");
  });

  lines.push(
    "ขอให้ท่านพิจารณาความหมายของไพ่และนำไปปรับใช้กับชีวิตอย่างมีสติ",
  );
  lines.push("\n*เพื่อความบันเทิงเท่านั้น*");

  return lines.join("\n");
}

function validateRequest(
  body: unknown,
): { ok: true; data: ReadingRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body" };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.spreadType !== "string" || !getSpreadById(b.spreadType)) {
    return { ok: false, error: "Invalid spreadType" };
  }

  if (typeof b.characterId !== "string" || !getCharacterById(b.characterId)) {
    return { ok: false, error: "Invalid characterId" };
  }

  const spread = getSpreadById(b.spreadType as string);
  if (!Array.isArray(b.cards) || b.cards.length !== spread!.cardCount) {
    return {
      ok: false,
      error: `Expected ${spread!.cardCount} cards for ${b.spreadType}`,
    };
  }

  for (const card of b.cards) {
    if (
      !card ||
      typeof card !== "object" ||
      typeof (card as CardInput).id !== "string" ||
      !["upright", "reversed"].includes((card as CardInput).position)
    ) {
      return {
        ok: false,
        error:
          "Each card must have id (string) and position (upright | reversed)",
      };
    }
  }

  // Validate card IDs exist in tarot deck
  const allCards = getAllCards();
  for (const card of b.cards as CardInput[]) {
    if (!allCards.find((c) => c.id === card.id)) {
      return { ok: false, error: `Card ID "${card.id}" not found in deck` };
    }
  }

  // Validate no duplicate cards
  const cardIds = (b.cards as CardInput[]).map((c) => c.id);
  if (new Set(cardIds).size !== cardIds.length) {
    return { ok: false, error: "Duplicate card IDs not allowed" };
  }

  if (b.question !== undefined) {
    if (typeof b.question !== "string" || b.question.length > 500) {
      return {
        ok: false,
        error: "question must be a string with max 500 characters",
      };
    }
  }

  return { ok: true, data: b as unknown as ReadingRequest };
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "ท่านส่งคำขอมากเกินไป กรุณารอสักครู่" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateRequest(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { spreadType, cards, question, characterId } = validation.data;

  const character = getCharacterById(characterId)!;
  const spread = getSpreadById(spreadType)!;
  const spreadTokenKey = spreadTokenKeyMap[spreadType] ?? "daily";

  await loadTarotCards();

  const userPrompt = buildUserPrompt(
    spread,
    cards,
    question || "การอ่านไพ่ทั่วไป",
  );

  try {
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://dooyipsee.com",
          "X-Title": "Dooyipsee Tarot",
        },
        body: JSON.stringify({
          model: character.modelId,
          messages: [
            { role: "system", content: character.systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: true,
          max_tokens: character.maxTokens[spreadTokenKey],
        }),
      },
    );

    if (!openRouterResponse.ok || !openRouterResponse.body) {
      const fallback = buildFallbackReading(spread, cards);
      return new Response(createFallbackSSE(fallback), {
        headers: sseHeaders(),
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openRouterResponse.body!.getReader();
        let buffer = "";

        try {
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
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                  );
                }
              } catch {
                /* malformed SSE chunk — skip */
              }
            }
          }

          // Stream ended without explicit [DONE] signal
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: sseHeaders() });
  } catch {
    const fallback = buildFallbackReading(spread, cards);
    return new Response(createFallbackSSE(fallback), {
      headers: sseHeaders(),
    });
  }
}

function sseHeaders(): HeadersInit {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };
}

function createFallbackSSE(text: string): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      const words = text.split(" ");
      let chunk = "";
      for (const word of words) {
        chunk += (chunk ? " " : "") + word;
        if (chunk.length >= 20) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`),
          );
          chunk = "";
        }
      }
      if (chunk) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`),
        );
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}
