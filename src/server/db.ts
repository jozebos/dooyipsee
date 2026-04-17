import { getCloudflareContext } from "@opennextjs/cloudflare";

interface D1Result {
  results?: Record<string, unknown>[];
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

interface D1DB {
  prepare(query: string): D1PreparedStatement;
}

declare global {
  interface CloudflareEnv {
    DB: D1DB;
  }
}

function getDB(): D1DB {
  const { env } = getCloudflareContext();
  return env.DB;
}

export async function createReading(input: {
  id: string;
  anonymousId: string;
  spreadType: string;
  deckId: string;
  personaId: string;
  question?: string;
  cardsJson: string;
  readingText: string;
  readingExcerpt?: string;
}) {
  const db = getDB();
  await db
    .prepare(
      `INSERT INTO readings (id, anonymous_id, spread_type, deck_id, persona_id, question, cards_json, reading_text, reading_excerpt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      input.id,
      input.anonymousId,
      input.spreadType,
      input.deckId,
      input.personaId,
      input.question ?? null,
      input.cardsJson,
      input.readingText,
      input.readingExcerpt ?? null
    )
    .run();
}

export async function saveFeedback(input: {
  id: string;
  readingId: string;
  anonymousId: string;
  rating: "like" | "dislike";
}) {
  const db = getDB();
  await db
    .prepare(
      `INSERT INTO feedback (id, reading_id, anonymous_id, rating) VALUES (?, ?, ?, ?)
       ON CONFLICT (reading_id, anonymous_id) DO UPDATE SET rating = excluded.rating`
    )
    .bind(input.id, input.readingId, input.anonymousId, input.rating)
    .run();
}

export async function createShareToken(input: {
  id: string;
  readingId: string;
  shareToken: string;
}) {
  const db = getDB();
  await db
    .prepare(
      `INSERT INTO shared_readings (id, reading_id, share_token) VALUES (?, ?, ?)`
    )
    .bind(input.id, input.readingId, input.shareToken)
    .run();
}

export async function getReadingByShareToken(token: string) {
  const db = getDB();
  const row = await db
    .prepare(
      `SELECT r.* FROM readings r
       JOIN shared_readings sr ON sr.reading_id = r.id
       WHERE sr.share_token = ?`
    )
    .bind(token)
    .first();
  return row;
}
