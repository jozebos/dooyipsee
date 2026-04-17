import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "บทความ",
  description: "บทความเกี่ยวกับไพ่ทาโร่ วิธีดูไพ่ ความหมายไพ่ และเทคนิคการตีความ",
  alternates: { canonical: "/blog" },
};

// Inline blog data for now (will be moved to data file later)
const posts = [
  { slug: "what-is-tarot", title: "ไพ่ทาโร่คืออะไร", excerpt: "ทำความรู้จักกับไพ่ทาโร่ ประวัติความเป็นมา และความหมายเบื้องต้น", readingTime: 3, publishedAt: "2026-01-15" },
  { slug: "tarot-for-beginners", title: "วิธีดูไพ่ทาโร่สำหรับมือใหม่", excerpt: "เรียนรู้วิธีดูไพ่ทาโร่เบื้องต้น ตั้งแต่การเลือกสำรับไพ่ไปจนถึงการตีความ", readingTime: 4, publishedAt: "2026-01-20" },
  { slug: "major-arcana-meanings", title: "ไพ่ Major Arcana 22 ใบ", excerpt: "ความหมายของไพ่ Major Arcana ทั้ง 22 ใบ ตั้งแต่ The Fool ถึง The World", readingTime: 8, publishedAt: "2026-02-01" },
  { slug: "minor-arcana-wands", title: "ไพ่ชุดไม้เท้า (Wands)", excerpt: "ความหมายของไพ่ Minor Arcana ชุดไม้เท้า ธาตุไฟ แห่งความหลงใหล", readingTime: 5, publishedAt: "2026-02-10" },
  { slug: "minor-arcana-cups", title: "ไพ่ชุดถ้วย (Cups)", excerpt: "ความหมายของไพ่ Minor Arcana ชุดถ้วย ธาตุน้ำ แห่งอารมณ์", readingTime: 5, publishedAt: "2026-02-15" },
  { slug: "minor-arcana-swords", title: "ไพ่ชุดดาบ (Swords)", excerpt: "ความหมายของไพ่ Minor Arcana ชุดดาบ ธาตุลม แห่งปัญญา", readingTime: 5, publishedAt: "2026-02-20" },
  { slug: "minor-arcana-pentacles", title: "ไพ่ชุดเหรียญ (Pentacles)", excerpt: "ความหมายของไพ่ Minor Arcana ชุดเหรียญ ธาตุดิน แห่งวัตถุ", readingTime: 5, publishedAt: "2026-02-25" },
  { slug: "three-card-spread", title: "การเปิดไพ่ 3 ใบ", excerpt: "เรียนรู้วิธีเปิดไพ่ 3 ใบ อดีต ปัจจุบัน อนาคต แบบละเอียด", readingTime: 4, publishedAt: "2026-03-01" },
  { slug: "celtic-cross-guide", title: "การเปิดไพ่ Celtic Cross", excerpt: "คู่มือการเปิดไพ่ Celtic Cross 10 ใบ แบบละเอียดทุกตำแหน่ง", readingTime: 6, publishedAt: "2026-03-10" },
  { slug: "ai-and-tarot", title: "ดูดวงด้วย AI", excerpt: "เทคโนโลยี AI กับศาสตร์การดูไพ่โบราณ ผสมผสานอย่างลงตัว", readingTime: 3, publishedAt: "2026-03-15" },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-10 text-center text-3xl font-bold text-cosmic-100">บทความ</h1>
      <div className="grid gap-5">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="surface-card block p-6 transition-all hover:-translate-y-0.5">
            <h2 className="text-lg font-semibold text-cosmic-100">{post.title}</h2>
            <p className="mt-2 text-sm text-cosmic-200/70">{post.excerpt}</p>
            <div className="mt-3 flex gap-4 text-xs text-cosmic-200/50">
              <span>📖 {post.readingTime} นาที</span>
              <span>{post.publishedAt}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
