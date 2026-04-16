import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dooyipsee.com"),
  title: {
    template: "%s | ดูอิปซี — ดูไพ่ยิปซีออนไลน์ ฟรี",
    default: "ดูอิปซี — ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายด้วย AI",
  },
  description:
    "ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายด้วย AI ไพ่ทาโร่ 78 ใบ เลือกไพ่เอง สุ่มไพ่ ดูดวงรายวัน อดีต ปัจจุบัน อนาคต เซลติกครอส",
  keywords: [
    "ดูไพ่ยิปซี",
    "ไพ่ทาโร่",
    "ดูดวง",
    "ทำนาย",
    "AI",
    "ออนไลน์",
    "ฟรี",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "ดูอิปซี",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="bg-cosmic-900 text-cosmic-100 font-sans">
        <header className="fixed top-0 inset-x-0 z-50 border-b border-cosmic-800/80 backdrop-blur-md bg-cosmic-900/70">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-cosmic-300 transition-colors hover:text-cosmic-200"
            >
              ดูอิปซี
            </Link>

            <div className="flex items-center gap-5 text-sm font-medium">
              <Link
                href="/cards"
                className="text-cosmic-200/80 transition-colors hover:text-gold-400"
              >
                ไพ่ 78 ใบ
              </Link>
              <Link
                href="/blog"
                className="text-cosmic-200/80 transition-colors hover:text-gold-400"
              >
                บทความ
              </Link>
            </div>
          </nav>
        </header>

        <main className="pt-12">{children}</main>

        <footer className="border-t border-cosmic-800/60 mt-20">
          <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-cosmic-200/50">
            <p>© 2025 ดูอิปซี — dooyipsee.com</p>
            <p className="mt-1.5 text-xs text-cosmic-200/30">
              เพื่อความบันเทิงเท่านั้น ไม่ใช่คำแนะนำทางจิตวิทยาหรือการแพทย์
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
