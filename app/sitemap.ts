import type { MetadataRoute } from 'next';
import { getAllCards } from '@/src/data/tarot-cards';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dooyipsee.com';
  const cards = getAllCards();

  const cardEntries = cards.map(card => ({
    url: `${baseUrl}/cards/${card.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add blog entries (hardcoded slugs for now)
  const blogSlugs = [
    'what-is-tarot', 'tarot-for-beginners', 'major-arcana-meanings',
    'minor-arcana-wands', 'minor-arcana-cups', 'minor-arcana-swords',
    'minor-arcana-pentacles', 'three-card-spread', 'celtic-cross-guide',
    'ai-and-tarot'
  ];
  const blogEntries = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/cards`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/reading`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...cardEntries,
    ...blogEntries,
  ];
}
