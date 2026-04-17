import type { Metadata } from "next";
import Image from "next/image";
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

function BlogHeroImage({
  imagePath,
  title,
}: {
  imagePath?: string;
  title: string;
}) {
  if (imagePath) {
    return (
      <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-xl">
        <Image
          src={imagePath}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="mb-8 flex aspect-[2.5/1] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cosmic-800 via-cosmic-700 to-cosmic-900">
      <span className="text-5xl opacity-30">🔮</span>
    </div>
  );
}

function BlogContent({ content }: { content: string }) {
  return (
    <div className="prose-cosmic space-y-4">
      {content.split("\n\n").map((paragraph, i) => {
        if (paragraph.trim().startsWith("<img")) {
          return (
            <figure key={i} className="my-6">
              <div
                className="overflow-hidden rounded-lg"
                dangerouslySetInnerHTML={{ __html: paragraph.trim() }}
              />
            </figure>
          );
        }

        return (
          <p key={i} className="leading-relaxed text-cosmic-200/80">
            {paragraph}
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

        <BlogHeroImage imagePath={post.imagePath} title={post.title} />

        <div className="surface-card p-5 sm:p-8">
          <BlogContent content={post.content} />
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
