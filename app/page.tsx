import Link from "next/link";

/* ─── Data ───────────────────────────────────────── */

const heroCards = [
  "major-00",
  "major-01",
  "major-02",
  "major-06",
  "major-10",
  "major-17",
  "major-21",
];

const spreads = [
  {
    name: "ไพ่ประจำวัน",
    description: "จับไพ่ 1 ใบ รับพลังงานและข้อความจากจักรวาลสำหรับวันนี้",
    href: "/reading?spread=daily-card",
    cardCount: 1,
    headerCards: ["major-19"],
    accentGlow: "rgba(251, 191, 36, 0.12)",
  },
  {
    name: "อดีต ปัจจุบัน อนาคต",
    description: "จับไพ่ 3 ใบ ดูเรื่องราวที่ผ่านมา สิ่งที่เป็นอยู่ และสิ่งที่รออยู่",
    href: "/reading?spread=three-card",
    cardCount: 3,
    headerCards: ["major-02", "major-10", "major-17"],
    accentGlow: "rgba(168, 85, 247, 0.12)",
  },
  {
    name: "เซลติกครอส",
    description: "จับไพ่ 10 ใบ วิเคราะห์เชิงลึกทุกมิติของชีวิต",
    href: "/reading?spread=celtic-cross",
    cardCount: 10,
    headerCards: ["major-21"],
    accentGlow: "rgba(99, 102, 241, 0.12)",
  },
] as const;

const fortuneTellers = [
  {
    name: "แม่หมอจันทรา",
    title: "แม่หมอผู้เมตตา",
    bio: "อ่านไพ่ด้วยสัญชาตญาณและความเมตตา เหมือนคุยกับคนรู้ใจ อบอุ่น ให้กำลังใจ",
    emoji: "🌙",
    topBorder: "border-t-purple-400",
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    name: "อาจารย์ดาวเทพ",
    title: "นักพยากรณ์แห่งดวงดาว",
    bio: "ผู้หยั่งรู้ที่ใช้พลังจักรวาลในการทำนาย ให้คำตอบลึกซึ้ง ตรงประเด็น ด้วยภาษาที่สง่างาม",
    emoji: "🌌",
    topBorder: "border-t-indigo-400",
    accent: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    name: "น้องมิสติก",
    title: "นักดูดวงรุ่นใหม่",
    bio: "สดใส ตรงไปตรงมา พูดภาษาวัยรุ่น ทำนายแบบเพื่อนคุย สนุก ไม่เครียด",
    emoji: "⚡",
    topBorder: "border-t-gold-400",
    accent: "text-gold-400",
    bg: "bg-gold-400/10",
  },
  {
    name: "คุณยายทิพย์",
    title: "คุณยายผู้มีญาณทิพย์",
    bio: "พูดอบอุ่น เหมือนคุณยายเล่าให้ฟัง ให้คำแนะนำแบบผู้ใหญ่ที่ห่วงใย",
    emoji: "🔮",
    topBorder: "border-t-rose-400",
    accent: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    name: "หมอเทพ ดิจิตอล",
    title: "หมอดูยุคใหม่",
    bio: "ผสมศาสตร์โบราณกับมุมมองสมัยใหม่ พูดจา smart เข้าใจง่าย",
    emoji: "💫",
    topBorder: "border-t-cyan-400",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
] as const;

const features = [
  { icon: "💎", title: "ฟรี 100%", description: "ไม่มีค่าใช้จ่าย ไม่ต้องสมัคร" },
  { icon: "🔮", title: "ทำนายแม่นยำ", description: "ตีความไพ่โดยหมอดูผู้เชี่ยวชาญ" },
  { icon: "🃏", title: "ไพ่ครบ 78 ใบ", description: "Major & Minor Arcana" },
  {
    icon: "🧙",
    title: "เลือกหมอดู",
    description: "สลับสไตล์การทำนาย",
  },
] as const;

/* ─── Inline Components ──────────────────────────── */

function FloatingCardFan({
  cards,
  className,
}: {
  cards: string[];
  className?: string;
}) {
  const total = cards.length;
  return (
    <div className={`flex items-end justify-center ${className || ""}`}>
      {cards.map((cardId, i) => {
        const rotation = (i - (total - 1) / 2) * 8;
        const translateY = Math.abs(i - (total - 1) / 2) * 8;
        return (
           <div
             key={cardId}
             className="card-fan-item -ml-3 w-12 first:ml-0 sm:w-16 md:w-20 lg:w-24"
             style={
               {
                 "--fan-rotate": `${rotation}deg`,
                 "--fan-ty": `${translateY}px`,
                 zIndex: i,
               } as React.CSSProperties
             }
           >
             <img
              src={`/cards/classic/${cardId}.webp`}
                alt=""
                className="w-full rounded-lg shadow-lg shadow-cosmic-900/50"
                loading="lazy"
              />
           </div>
        );
      })}
    </div>
  );
}

function SpreadHeaderVisual({ cards }: { cards: readonly string[] }) {
  if (cards.length === 1) {
    return (
       <div className="flex h-full items-center justify-center">
         <img
           src={`/cards/classic/${cards[0]}.webp`}
           alt=""
           className="h-32 w-auto rounded-md shadow-lg shadow-cosmic-900/60 drop-shadow-[0_0_15px_rgba(251,191,36,0.15)]"
           loading="lazy"
         />
      </div>
    );
  }

  const total = cards.length;
  return (
    <div className="flex h-full items-end justify-center pb-3">
      {cards.map((cardId, i) => {
        const rotation = (i - (total - 1) / 2) * 12;
        const translateY = Math.abs(i - (total - 1) / 2) * 6;
        return (
           <div
             key={cardId}
             className="-ml-4 first:ml-0"
             style={{
               transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
               zIndex: i,
             }}
           >
             <img
              src={`/cards/classic/${cardId}.webp`}
                alt=""
                className="h-28 w-auto rounded-md shadow-md shadow-cosmic-900/60"
               loading="lazy"
             />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section className="starfield cosmic-mesh relative flex min-h-[90dvh] flex-col items-center justify-center px-4 text-center">
        {/* Extra depth overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(139,92,246,0.1),transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center gap-5">


          {/* Title */}
          <h1 className="text-glow text-5xl font-bold tracking-tight text-cosmic-100 sm:text-6xl md:text-7xl lg:text-8xl">
            ดูยิปซี
          </h1>

          {/* Subtitle */}
          <p className="max-w-md text-lg font-light text-cosmic-200 sm:text-xl">
            ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายโดยหมอดู
          </p>

          {/* Floating tarot card fan */}
          <FloatingCardFan cards={heroCards} className="mt-2 sm:mt-4" />

          {/* CTA */}
          <Link
            href="#spreads"
            className="btn-cosmic mt-4 px-10 py-3.5 text-base sm:mt-6 sm:text-lg"
          >
            <span>เริ่มดูไพ่เลย</span>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-glow text-cosmic-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ── Section 2: Spread Selection ── */}
      <section
        id="spreads"
        className="relative scroll-mt-16 px-4 py-20 sm:py-28"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.06),transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-cosmic-100 sm:mb-14 sm:text-3xl">
            เลือกรูปแบบการดูไพ่
          </h2>

          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {spreads.map((spread) => (
              <Link
                key={spread.href}
                href={spread.href}
                className="surface-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Visual header with card imagery */}
                <div className="relative h-44 overflow-hidden bg-gradient-to-b from-cosmic-700/50 to-cosmic-800">
                  {/* Accent glow */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(ellipse at center 60%, ${spread.accentGlow}, transparent 70%)`,
                    }}
                  />

                  <SpreadHeaderVisual cards={spread.headerCards} />

                  {/* Card count badge */}
                  <div className="absolute right-3 top-3 rounded-full bg-cosmic-900/70 px-2.5 py-1 text-xs font-semibold text-gold-400 ring-1 ring-gold-400/30 backdrop-blur-sm">
                    {spread.cardCount} ใบ
                  </div>

                  {/* Bottom fade */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cosmic-800 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-cosmic-100 transition-colors group-hover:text-gold-400">
                    {spread.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cosmic-200/70">
                    {spread.description}
                  </p>
                  <span className="btn-cosmic mt-4 self-start px-6 py-2.5 text-sm">
                    <span>เริ่มดูไพ่</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Quick Access ── */}
      <section className="relative overflow-hidden border-y border-cosmic-700/30 bg-cosmic-850/60 px-4 py-16 sm:py-20">
        {/* Radial center glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_60%)]" />

        {/* Decorative card-backs */}
          <img
            src="/cards/classic/card-back.webp"
            alt=""
            className="pointer-events-none absolute -left-10 top-1/2 w-32 -translate-y-1/2 -rotate-12 opacity-[0.07] blur-[1px] sm:-left-4 sm:w-40 sm:opacity-10"
            loading="lazy"
          />
          <img
            src="/cards/classic/card-back.webp"
            alt=""
            className="pointer-events-none absolute -right-10 top-1/2 w-32 -translate-y-1/2 rotate-12 opacity-[0.07] blur-[1px] sm:-right-4 sm:w-40 sm:opacity-10"
           loading="lazy"
         />

        <div className="relative z-10 mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-semibold text-cosmic-100 sm:text-3xl">
            อยากเปิดไพ่เลย?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-cosmic-200/70 sm:text-base">
            ไม่ต้องตั้งคำถาม ไม่ต้องเลือกหมอดู
            แค่เลือกไพ่แล้วเปิดเลย
          </p>
          <Link
            href="/reading?spread=daily-card&mode=quick"
            className="btn-cosmic mt-6 inline-flex items-center gap-2 px-8 py-3.5 text-base sm:text-lg"
          >
            <span>🃏 เปิดไพ่ประจำวัน</span>
          </Link>
        </div>
      </section>

      {/* ── Section 4: Fortune Tellers ── */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.05),transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-cosmic-100 sm:mb-14 sm:text-3xl">
            พบกับหมอดูของเรา
          </h2>

          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6">
            {fortuneTellers.map((ft) => (
              <div
                key={ft.name}
                className={`rounded-[var(--radius-card)] border border-cosmic-700/30 border-t-2 ${ft.topBorder} ${ft.bg} p-6 text-center transition-all duration-300 hover:shadow-cosmic sm:p-7`}
              >
                <span className="text-4xl">{ft.emoji}</span>
                <h3 className={`mt-3 text-lg font-bold ${ft.accent}`}>
                  {ft.name}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-cosmic-200/50">
                  {ft.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cosmic-200/70">
                  {ft.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Features ── */}
      <section className="border-t border-cosmic-800/50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-semibold text-cosmic-100 sm:mb-12 sm:text-2xl">
            ทำไมต้องดูยิปซี?
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="surface-glass flex flex-col items-center gap-2 p-4 text-center sm:p-5"
              >
                <span className="text-2xl sm:text-3xl">{f.icon}</span>
                <h3 className="text-sm font-semibold text-gold-400">
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed text-cosmic-200/60">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Quick Links ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <h2 className="mb-8 text-center text-xl font-semibold text-cosmic-100 sm:mb-12 sm:text-2xl">
          เรียนรู้เพิ่มเติม
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <Link
            href="/cards"
            className="surface-card group overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Card imagery header */}
             <div className="relative h-32 overflow-hidden">
               <img
                  src="/cards/classic/major-01.webp"
                 alt=""
                 className="h-full w-full object-cover object-top opacity-30 transition-opacity duration-300 group-hover:opacity-40"
                 loading="lazy"
               />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-800 via-cosmic-800/60 to-transparent" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-cosmic-100 transition-colors group-hover:text-gold-400">
                ความหมายไพ่ทั้ง 78 ใบ
              </h3>
              <p className="mt-1 text-sm text-cosmic-200/60">
                เรียนรู้ความหมาย ทั้งหัวตั้งและหัวกลับ
              </p>
            </div>
          </Link>

          <Link
            href="/blog"
            className="surface-card group overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="relative h-32 overflow-hidden">
               <img
                  src="/cards/classic/major-09.webp"
                 alt=""
                 className="h-full w-full object-cover object-top opacity-30 transition-opacity duration-300 group-hover:opacity-40"
                 loading="lazy"
               />
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-800 via-cosmic-800/60 to-transparent" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-cosmic-100 transition-colors group-hover:text-gold-400">
                บทความ
              </h3>
              <p className="mt-1 text-sm text-cosmic-200/60">
                เทคนิคการดูไพ่ และวิธีตีความ
              </p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
