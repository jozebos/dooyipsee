import type { Metadata } from "next";
import Link from "next/link";

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

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};

  const title = `${post.title} — บทความไพ่ทาโร่`;
  const description = post.excerpt;

  return {
    title,
    description,
    keywords: ["ไพ่ทาโร่", "บทความไพ่ยิปซี", post.title],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
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
    mainEntityOfPage: `https://dooyipsee.com/blog/${post.slug}`,
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
          <Link href="/" className="transition-colors hover:text-cosmic-200">
            หน้าแรก
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/blog"
            className="transition-colors hover:text-cosmic-200"
          >
            บทความ
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-cosmic-200/80">{post.title}</span>
        </nav>

        <header className="mb-8 sm:mb-10">
          <h1 className="text-glow text-3xl font-bold tracking-tight text-cosmic-100 sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-cosmic-200/60">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>อ่าน {post.readingTime} นาที</span>
          </div>
        </header>

        <div className="surface-card p-5 sm:p-8">
          <div className="prose-cosmic space-y-4">
            <p className="leading-relaxed text-cosmic-200/80">
              บทความนี้กำลังจะเผยแพร่ในเร็วๆ นี้
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link
            href="/blog"
            className="text-sm text-cosmic-200/60 transition-colors hover:text-cosmic-200"
          >
            &larr; กลับไปดูบทความทั้งหมด
          </Link>
          <Link
            href="/reading?spread=daily-card"
            className="btn-cosmic px-6 py-2.5 text-sm"
          >
            <span>ลองดูไพ่รายวัน</span>
          </Link>
        </div>
      </article>
    </>
  );
}
