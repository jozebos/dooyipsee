import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/src/data/blog-posts";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
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
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-cosmic-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function BlogContent({ content }: { content: string }) {
  return (
    <div className="mx-auto max-w-prose space-y-6">
      {content.split("\n\n").map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("## ")) {
          return (
            <div key={i} className="mt-10 first:mt-0">
              <hr className="mb-6 border-cosmic-700/50" />
              <h2 className="text-xl font-bold text-cosmic-100 sm:text-2xl">
                {renderInline(trimmed.slice(3))}
              </h2>
            </div>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="mt-8 text-lg font-semibold text-gold-400"
            >
              {renderInline(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed === "---") {
          return <hr key={i} className="my-8 border-cosmic-700/50" />;
        }

        if (trimmed.startsWith("<img")) {
          return (
            <figure key={i} className="my-8 overflow-hidden rounded-xl">
              <div dangerouslySetInnerHTML={{ __html: trimmed }} />
            </figure>
          );
        }

        const lines = trimmed.split("\n");

        if (lines.every((l) => l.match(/^[-•*]\s/) || !l.trim())) {
          return (
            <ul key={i} className="my-4 space-y-2.5 pl-1">
              {lines
                .filter((l) => l.trim())
                .map((line, j) => (
                  <li key={j} className="flex gap-3 text-cosmic-200/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/60" />
                    <span className="leading-[1.8]">
                      {renderInline(line.replace(/^[-•*]\s*/, ""))}
                    </span>
                  </li>
                ))}
            </ul>
          );
        }

        if (lines.every((l) => l.match(/^\d+\.\s/) || !l.trim())) {
          return (
            <ol key={i} className="my-4 space-y-2.5 pl-1">
              {lines
                .filter((l) => l.trim())
                .map((line, j) => (
                  <li key={j} className="flex gap-3 text-cosmic-200/80">
                    <span className="mt-0.5 shrink-0 text-sm font-semibold text-gold-400/60">
                      {j + 1}.
                    </span>
                    <span className="leading-[1.8]">
                      {renderInline(line.replace(/^\d+\.\s*/, ""))}
                    </span>
                  </li>
                ))}
            </ol>
          );
        }

        return (
          <p key={i} className="leading-[1.85] text-cosmic-200/80">
            {renderInline(trimmed.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
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
      name: "ดูยิปซี",
      url: "https://dooyipsee.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ดูยิปซี",
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

      <article className="pb-20">
        {post.imagePath && (
          <div className="mx-auto max-w-4xl px-4 pt-8">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={post.imagePath}
                alt={post.title}
                className="aspect-[2/1] w-full object-cover"
              />
            </div>
          </div>
        )}

        {!post.imagePath && (
          <div className="mx-auto max-w-4xl px-4 pt-8">
            <div className="flex aspect-[2.5/1] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cosmic-800 via-cosmic-700 to-cosmic-900">
              <span className="text-5xl opacity-30">🔮</span>
            </div>
          </div>
        )}

        <header className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
          <nav
            aria-label="breadcrumb"
            className="mb-6 flex items-center gap-2 text-sm text-cosmic-200/60"
          >
            <Link
              href="/"
              className="transition-colors hover:text-cosmic-200"
            >
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
            <span className="truncate text-cosmic-200/80">{post.title}</span>
          </nav>

          <h1 className="text-glow text-2xl font-bold leading-tight text-cosmic-100 sm:text-3xl md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-cosmic-200/50">
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              อ่าน {post.readingTime} นาที
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4">
          <BlogContent content={post.content} />
        </div>

        <div className="mx-auto mt-12 max-w-3xl px-4">
          <div className="rounded-2xl border border-cosmic-700/50 bg-cosmic-800/40 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-cosmic-100">
              🔮 อยากลองดูไพ่?
            </p>
            <p className="mt-2 text-sm text-cosmic-200/60">
              เปิดไพ่ทาโร่ออนไลน์ ฟรี ให้หมอดูตีความให้
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/reading?spread=daily-card"
                className="btn-cosmic px-5 py-2.5 text-sm"
              >
                <span>ไพ่ประจำวัน</span>
              </Link>
              <Link
                href="/reading"
                className="rounded-full border border-cosmic-600 px-5 py-2.5 text-sm text-cosmic-200 transition-colors hover:bg-cosmic-700/50"
              >
                ดูไพ่แบบอื่น
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl px-4">
          <Link
            href="/blog"
            className="text-sm text-cosmic-200/60 transition-colors hover:text-cosmic-200"
          >
            ← กลับไปดูบทความทั้งหมด
          </Link>
        </div>
      </article>
    </>
  );
}
