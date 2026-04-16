import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCards, getCardBySlug } from "@/src/data/tarot-cards";

const SUIT_COLOR_MAP: Record<string, string> = {
  major: "from-mystic-purple/40 to-mystic-indigo/30",
  wands: "from-orange-500/40 to-amber-600/30",
  cups: "from-blue-500/40 to-cyan-600/30",
  swords: "from-slate-400/40 to-gray-500/30",
  pentacles: "from-emerald-500/40 to-green-600/30",
};

const SUIT_LABEL_TH: Record<string, string> = {
  wands: "ไม้เท้า",
  cups: "ถ้วย",
  swords: "ดาบ",
  pentacles: "เหรียญ",
};

const ELEMENT_LABEL_TH: Record<string, string> = {
  fire: "ไฟ",
  water: "น้ำ",
  air: "ลม",
  earth: "ดิน",
};

const ARCANA_LABEL_TH: Record<string, string> = {
  major: "Major Arcana",
  minor: "Minor Arcana",
};

function getSuitColor(arcana: string, suit?: string): string {
  if (arcana === "major") return SUIT_COLOR_MAP.major;
  return SUIT_COLOR_MAP[suit ?? "major"];
}

export function generateStaticParams() {
  return getAllCards().map((card) => ({ slug: card.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return {};

  const title = `${card.nameTh} — ความหมายไพ่ทาโร่`;
  const description = `ความหมายไพ่ ${card.nameTh} (${card.nameEn}) ทั้งหัวตั้งและหัวกลับ — ${card.upright.meaning.slice(0, 100)}`;

  return {
    title,
    description,
    keywords: [
      card.nameTh,
      card.nameEn,
      "ความหมายไพ่ทาโร่",
      "ไพ่ยิปซี",
      ...card.upright.keywords,
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  const suitColor = getSuitColor(card.arcana, card.suit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.nameTh} (${card.nameEn}) — ความหมายไพ่ทาโร่`,
    description: card.upright.meaning,
    author: {
      "@type": "Organization",
      name: "ดูอิปซี",
      url: "https://dooyipsee.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ดูอิปซี",
      url: "https://dooyipsee.com",
    },
    mainEntityOfPage: `https://dooyipsee.com/cards/${card.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <nav
          aria-label="breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm text-cosmic-200/60"
        >
          <Link
            href="/"
            className="transition-colors hover:text-cosmic-200"
          >
            หน้าแรก
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/cards"
            className="transition-colors hover:text-cosmic-200"
          >
            ไพ่ทั้งหมด
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-cosmic-200/80">{card.nameTh}</span>
        </nav>

        <header className="mb-8 sm:mb-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div
              className={`flex aspect-[2/3] w-40 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${suitColor} ring-1 ring-white/10 sm:w-48`}
            >
              <span className="text-5xl font-bold text-white/20 sm:text-6xl">
                {card.arcana === "major"
                  ? "✦"
                  : card.suit === "wands"
                    ? "🜂"
                    : card.suit === "cups"
                      ? "🜄"
                      : card.suit === "swords"
                        ? "🜁"
                        : "🜃"}
              </span>
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-glow text-3xl font-bold tracking-tight text-cosmic-100 sm:text-4xl">
                {card.nameTh}
              </h1>
              <p className="mt-1 text-base text-cosmic-200/60 sm:text-lg">
                {card.nameEn}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-cosmic-700 px-3 py-1 text-xs font-medium text-cosmic-200">
                  {ARCANA_LABEL_TH[card.arcana]}
                </span>
                {card.suit && (
                  <span className="rounded-full bg-cosmic-700 px-3 py-1 text-xs font-medium text-cosmic-200">
                    {SUIT_LABEL_TH[card.suit]}
                  </span>
                )}
                <span className="rounded-full bg-cosmic-700 px-3 py-1 text-xs font-medium text-cosmic-200">
                  ธาตุ{ELEMENT_LABEL_TH[card.element]}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="surface-card mb-6 p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gold-400 sm:text-xl">
            ความหมายหัวตั้ง
          </h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {card.upright.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-cosmic-700 px-3 py-1 text-xs font-medium text-cosmic-200"
              >
                {kw}
              </span>
            ))}
          </div>
          <p className="leading-relaxed text-cosmic-200/80">
            {card.upright.meaning}
          </p>
        </section>

        <section className="surface-card mb-6 p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-cosmic-300 sm:text-xl">
            ความหมายหัวกลับ
          </h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {card.reversed.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-cosmic-700 px-3 py-1 text-xs font-medium text-cosmic-200"
              >
                {kw}
              </span>
            ))}
          </div>
          <p className="leading-relaxed text-cosmic-200/80">
            {card.reversed.meaning}
          </p>
        </section>

        <section className="surface-card mb-8 p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-cosmic-300 sm:text-xl">
            สัญลักษณ์
          </h2>
          <p className="leading-relaxed text-cosmic-200/80">
            {card.symbolism}
          </p>
        </section>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link
            href="/cards"
            className="text-sm text-cosmic-200/60 transition-colors hover:text-cosmic-200"
          >
            &larr; กลับไปดูไพ่ทั้งหมด
          </Link>
          <Link
            href="/reading?spread=daily-card"
            className="btn-cosmic px-6 py-2.5 text-sm"
          >
            <span>ดูไพ่ใบนี้</span>
          </Link>
        </div>
      </article>
    </>
  );
}
