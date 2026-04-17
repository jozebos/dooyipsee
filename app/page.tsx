import Link from "next/link";

const spreads = [
  {
    icon: "🌟",
    name: "ไพ่ประจำวัน",
    description: "จับไพ่ 1 ใบ ดูพลังงานวันนี้",
    href: "/reading?spread=daily-card",
    delay: "0s",
  },
  {
    icon: "🔮",
    name: "อดีต ปัจจุบัน อนาคต",
    description: "จับไพ่ 3 ใบ ดูเรื่องราวของคุณ",
    href: "/reading?spread=three-card",
    delay: "0.1s",
  },
  {
    icon: "✨",
    name: "เซลติกครอส",
    description: "จับไพ่ 10 ใบ วิเคราะห์เชิงลึก",
    href: "/reading?spread=celtic-cross",
    delay: "0.2s",
  },
] as const;

const features = [
  { icon: "💎", title: "ฟรี 100%", description: "ไม่มีค่าใช้จ่าย ไม่ต้องสมัครสมาชิก" },
  { icon: "🤖", title: "AI ทำนาย", description: "ตีความไพ่ด้วยปัญญาประดิษฐ์" },
  { icon: "🃏", title: "ไพ่ครบ 78 ใบ", description: "ไพ่ทาโร่ Major และ Minor Arcana" },
  { icon: "🧙", title: "เลือกนักพยากรณ์", description: "เปลี่ยนสไตล์การทำนายได้" },
] as const;

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="starfield cosmic-mesh relative flex min-h-[85dvh] flex-col items-center justify-center px-4 text-center">
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="animate-float relative">
            <img
              src="/cards/mascot.png"
              alt="ดูยิปซี มาสคอต"
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            />
          </div>

          <h1 className="text-glow text-5xl font-bold tracking-tight text-cosmic-100 sm:text-6xl md:text-7xl">
            ดูยิปซี
          </h1>

          <p className="max-w-md text-lg font-light text-cosmic-200 sm:text-xl">
            ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายด้วย AI
          </p>

          <Link
            href="#spreads"
            className="btn-cosmic mt-4 px-8 py-3.5 text-base sm:text-lg"
          >
            <span>เริ่มดูไพ่เลย</span>
          </Link>
        </div>

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

      {/* ── Spread Selection ── */}
      <section
        id="spreads"
        className="mx-auto max-w-5xl scroll-mt-16 px-4 py-20 sm:py-28"
      >
        <h2 className="mb-10 text-center text-2xl font-semibold text-cosmic-100 sm:mb-14 sm:text-3xl">
          เลือกรูปแบบการดูไพ่
        </h2>

        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {spreads.map((spread) => (
            <Link
              key={spread.href}
              href={spread.href}
              className="surface-card group flex flex-col items-center gap-4 p-6 text-center transition-all duration-300 hover:-translate-y-1 sm:p-8"
            >
              <span className="text-4xl sm:text-5xl">{spread.icon}</span>
              <h3 className="text-lg font-semibold text-cosmic-100 sm:text-xl">
                {spread.name}
              </h3>
              <p className="text-sm text-cosmic-200/70">{spread.description}</p>
              <span className="btn-cosmic mt-auto px-6 py-2.5 text-sm">
                <span>เริ่มดูไพ่</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-cosmic-800/50 bg-cosmic-850/50 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-cosmic-100 sm:mb-14 sm:text-3xl">
            ทำไมต้องดูยิปซี?
          </h2>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-3 rounded-xl bg-cosmic-800/40 p-5 text-center ring-1 ring-cosmic-700/40 sm:p-6"
              >
                <span className="text-3xl sm:text-4xl">{feature.icon}</span>
                <h3 className="text-sm font-semibold text-gold-400 sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-cosmic-200/60 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
        <h2 className="mb-10 text-center text-2xl font-semibold text-cosmic-100 sm:text-3xl">
          เรียนรู้เพิ่มเติม
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <Link
            href="/cards"
            className="surface-card group flex items-center gap-5 p-6 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cosmic-700/60 text-2xl ring-1 ring-cosmic-500/30">
              🃏
            </span>
            <div>
              <h3 className="font-semibold text-cosmic-100 group-hover:text-gold-400 transition-colors">
                ความหมายไพ่ทั้ง 78 ใบ
              </h3>
              <p className="mt-1 text-sm text-cosmic-200/60">
                เรียนรู้ความหมาย ทั้งหัวตั้งและหัวกลับ
              </p>
            </div>
          </Link>

          <Link
            href="/blog"
            className="surface-card group flex items-center gap-5 p-6 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cosmic-700/60 text-2xl ring-1 ring-cosmic-500/30">
              📖
            </span>
            <div>
              <h3 className="font-semibold text-cosmic-100 group-hover:text-gold-400 transition-colors">
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
