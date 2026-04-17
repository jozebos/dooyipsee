import { NextRequest, NextResponse } from "next/server";
import { saveFeedback } from "@/src/server/db";
import { getOrCreateAnonymousId } from "@/src/server/anonymous";

export async function POST(req: NextRequest) {
  const { readingId, rating } = await req.json();
  if (!readingId || !["like", "dislike"].includes(rating)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const anonymousId = await getOrCreateAnonymousId();
  const id = crypto.randomUUID();
  await saveFeedback({ id, readingId, anonymousId, rating });
  return NextResponse.json({ ok: true });
}
