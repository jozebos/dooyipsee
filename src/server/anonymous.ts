import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "dy_anon";

export async function getOrCreateAnonymousId(): Promise<string> {
  const store = await cookies();
  let id = store.get(COOKIE_NAME)?.value;
  if (!id) {
    id = randomUUID();
    store.set(COOKIE_NAME, id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });
  }
  return id;
}
