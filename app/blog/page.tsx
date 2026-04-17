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
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-10 text-center text-3xl font-bold text-cosmic-100">บทความ</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="surface-card group block overflow-hidden transition-all hover:-translate-y-0.5">
            {post.imagePath && (
              <div className="aspect-[2/1] overflow-hidden">
                <img 
                  src={post.imagePath} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-cosmic-100 group-hover:text-gold-400 transition-colors">{post.title}</h2>
              <p className="mt-2 text-sm text-cosmic-200/70 line-clamp-2">{post.excerpt}</p>
              <div className="mt-3 flex gap-4 text-xs text-cosmic-200/50">
                <span>📖 อ่าน {post.readingTime} นาที</span>
                <time>{new Date(post.publishedAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}</time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
