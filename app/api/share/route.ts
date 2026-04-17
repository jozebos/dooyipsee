import { NextRequest, NextResponse } from "next/server";
import { createShareToken } from "@/src/server/db";

export async function POST(req: NextRequest) {
  const { readingId } = await req.json();
  if (!readingId) {
    return NextResponse.json({ error: "Missing readingId" }, { status: 400 });
  }

  const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const id = crypto.randomUUID();
  await createShareToken({ id, readingId, shareToken });

  const shareUrl = `https://dooyipsee.com/share/${shareToken}`;
  return NextResponse.json({ shareUrl, shareToken });
}
