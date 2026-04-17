import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/src/data/blog-posts";

export const metadata: Metadata = {
  title: "บทความ",
  description: "บทความเกี่ยวกับไพ่ทาโร่ วิธีดูไพ่ ความหมายไพ่ และเทคนิคการตีความ",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <h1 className="text-glow mb-12 text-center text-3xl font-bold text-cosmic-100 sm:text-4xl">
        บทความ
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-cosmic-800/60 ring-1 ring-cosmic-700/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-cosmic)]"
          >
            {post.imagePath && (
              <div className="aspect-[2/1] overflow-hidden">
                <img
                  src={post.imagePath}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <h2 className="text-base font-bold leading-snug text-cosmic-100 transition-colors group-hover:text-gold-400 sm:text-lg">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-cosmic-200/60 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-cosmic-200/40">
                <time>
                  {new Date(post.publishedAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span className="font-medium text-gold-400/70 transition-colors group-hover:text-gold-400">
                  อ่านต่อ →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
