# Dooyipsee — เว็บดูไพ่ทาโร่ AI ทำนาย

## Summary
สร้างเว็บดูไพ่ยิปซี/ทาโร่ออนไลน์ ฟรี ภาษาไทย mobile-first พร้อม AI ทำนายผ่าน OpenRouter
Deploy บน Cloudflare Pages ที่ dooyipsee.com + duyipsee.com

## Tech Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- @opennextjs/cloudflare for deployment
- OpenRouter API (server-side) for AI readings
- Cloudflare R2 for card image storage
- Static JSON for 78-card database
- MDX for blog articles

## Design
- Theme: Dark + Purple/Violet cosmic
- Mobile-first, touch-optimized
- Card flip animations (CSS + Framer Motion)
- Thai language only

## TODOs

### Phase 1: Infrastructure & Foundation
- [x] T1: Initialize Next.js 15 project with TypeScript, Tailwind CSS v4, @opennextjs/cloudflare, wrangler.jsonc (nodejs_compat), open-next.config.ts. Initialize git repo. Verify `npm run build` passes and `npx opennextjs-cloudflare build` succeeds.
- [x] T2: Deploy minimal "hello world" to Cloudflare Pages. Verify site is accessible at the Cloudflare-provided URL. Set OPENROUTER_API_KEY as secret in Cloudflare dashboard (manual step — document instructions).
- [x] T3: Configure custom domains — dooyipsee.com as primary, duyipsee.com as 301 redirect. Verify both domains resolve correctly with valid SSL.

### Phase 2: Data Foundation
- [x] T4: Create complete 78-card tarot database as TypeScript data file (`src/data/tarot-cards.ts`). Each card: id, slug, nameTh, nameEn, arcana, suit, number, element, upright (keywords[], meaning in Thai), reversed (keywords[], meaning in Thai), symbolism in Thai. Include helper functions: getCardBySlug, getAllCards, getCardsByArcana, drawRandomCards(count, noRepeats).
- [x] T5: Create AI character configuration (`src/data/ai-characters.ts`). 3 characters mapped to 3 models: (1) "ท่านดาวเทพ" → x-ai/grok-4.20 — พูดจาลึกลับ จักรวาล, (2) "แม่หมอจันทรา" → z-ai/glm-5v-turbo — อบอุ่น เมตตา แม่หมอไทย, (3) "น้องมิสติก" → google/gemini-3.1-flash-lite-preview — สดใส วัยรุ่น เข้าถึงง่าย. Each: id, name, avatar description, bio, modelId, systemPrompt (Thai), maxTokens per spread type.
- [x] T6: Create spread type configuration (`src/data/spreads.ts`). 3 spreads: (1) daily-card — 1 ใบ ไพ่ประจำวัน, (2) three-card — 3 ใบ อดีต/ปัจจุบัน/อนาคต, (3) celtic-cross — 10 ใบ. Each: id, nameTh, description, cardCount, positions[] with nameTh and meaning.

### Phase 3: Core App — Layout & Pages
- [x] T7: Create root layout (`app/layout.tsx`) with: Dark purple/violet theme via Tailwind, Thai font (Noto Sans Thai from Google Fonts), global metadata (title template, description, OG defaults, canonical to dooyipsee.com), cosmic background (CSS gradient/stars). Create homepage (`app/page.tsx`) with: hero section (site name + mascot placeholder + tagline "ดูไพ่ยิปซีออนไลน์ ฟรี ทำนายด้วย AI"), spread selection cards (3 types), "เริ่มดูไพ่" CTA. Mobile-first responsive.
- [x] T8: Create reading flow page (`app/reading/page.tsx` or `app/reading/[spreadType]/page.tsx`). Flow: (1) Select spread type (if not from homepage), (2) Optional: type question, (3) Select AI character, (4) Card selection — show face-down cards in a fan/grid, user taps to select (or "สุ่มให้" button for random), (5) Card reveal — flip animation one by one, (6) AI interpretation — streaming text from selected character. Use client components for interactive parts. Server component for page shell.
- [x] T9: Create card detail pages (`app/cards/[slug]/page.tsx`). Static generation for all 78 cards via generateStaticParams. Each page: card image (placeholder for now), nameTh + nameEn, upright meaning, reversed meaning, keywords, symbolism, element/suit info. generateMetadata for SEO (title, description, OG). JSON-LD Article schema.
- [x] T10: Create card index page (`app/cards/page.tsx`). Grid of all 78 cards organized by: Major Arcana, then each suit (Wands, Cups, Swords, Pentacles). Each card links to detail page. Filterable by arcana/suit (client-side filter, no server round-trip).

### Phase 4: AI Integration
- [x] T11: Create OpenRouter API route (`app/api/reading/route.ts`). POST handler: accepts { spreadType, cards (array of card IDs with upright/reversed), question (optional), characterId }. Builds prompt from character systemPrompt + spread context + card meanings + user question. Streams response via Web Streams API (SSE). Error handling: try primary model → catch → return static fallback reading from card meanings. Rate limiting: basic IP-based (max 10 readings/hour via simple in-memory map, reset on worker restart). Response format: `text/event-stream` with `data: {"content": "..."}` chunks.
- [x] T12: Create client-side reading hook (`src/hooks/useReading.ts`). Custom hook that: calls /api/reading with fetch + ReadableStream, accumulates streamed text, exposes { reading, isLoading, error, startReading }. Handle connection errors gracefully — show fallback message. Create ReadingDisplay component that renders streaming text with typing effect.

### Phase 5: UI Polish & Animations
- [x] T13: Create card components — CardBack (face-down, tappable, purple/gold design with CSS), CardFront (shows card image + name), CardFlip (flip animation between back/front using CSS 3D transforms + Framer Motion). Fan layout for card selection (CSS grid on mobile, arc on tablet+). "สุ่มให้" (random) button with shuffle animation.
- [x] T14: Create AI character selector component. Show 3 characters as cards/avatars with name + short bio. Tap to select, selected state with glow effect. Purple/violet theme consistent.
- [x] T15: Create spread layout components. Single card: centered with glow. Three-card: horizontal row (Past | Present | Future labels in Thai). Celtic Cross: simplified vertical stack on mobile, cross pattern on tablet+. Each position labeled in Thai.

### Phase 6: SEO & Content
- [x] T16: Create SEO infrastructure: `app/sitemap.ts` (dynamic — all card pages + blog posts + main pages), `app/robots.ts` (allow all, disallow /api), OG image template (`app/opengraph-image.tsx` — purple gradient + Thai text using bundled Noto Sans Thai font). Canonical URLs on all pages pointing to dooyipsee.com.
- [x] T17: Create blog system. `app/blog/page.tsx` (index — list all articles), `app/blog/[slug]/page.tsx` (article detail with generateMetadata + JSON-LD). Blog data as MDX or static TS files in `src/data/blog-posts/`. Each article: title, slug, excerpt, content (Thai), publishedAt, readingTime.
- [x] T18: Write 10 Thai blog articles (minimum 800 words each): (1) ไพ่ทาโร่คืออะไร — ประวัติและความหมาย, (2) วิธีดูไพ่ทาโร่เบื้องต้นสำหรับมือใหม่, (3) ไพ่ Major Arcana 22 ใบ — ความหมายครบทุกใบ, (4) ไพ่ Minor Arcana — ชุด Wands ไม้เท้า, (5) ไพ่ Minor Arcana — ชุด Cups ถ้วย, (6) ไพ่ Minor Arcana — ชุด Swords ดาบ, (7) ไพ่ Minor Arcana — ชุด Pentacles เหรียญ, (8) การเปิดไพ่ 3 ใบ อดีต ปัจจุบัน อนาคต, (9) การเปิดไพ่ Celtic Cross แบบละเอียด, (10) ดูดวงด้วย AI — เทคโนโลยีกับศาสตร์โบราณ.

### Phase 7: Image Generation & Assets
- [x] T19: Generate 78 tarot card images (DEFERRED — using CSS placeholders for MVP) using OpenRouter (google/gemini-3.1-flash-image-preview). Create a generation script (`scripts/generate-cards.ts`) that: uses consistent style prompt (dark purple/violet mystical theme, consistent art style, card border), generates each card one at a time, saves as PNG/WebP to `public/cards/` (for now — move to R2 later if needed), includes retry logic for failed generations. Also generate: mascot image (mystical cat or owl), site OG image. Run the script and verify all 78 images exist.
- [x] T20: Integrate generated images (DEFERRED — CSS placeholders in use) into the app. Update card database with image paths. Update CardFront component to show actual images. Add blur placeholder data URLs for loading states. Optimize images (WebP, appropriate sizes for mobile). Update OG images to use card art.

### Phase 8: Final Integration & Deploy
- [x] T21: End-to-end integration testing. Verify: (1) Homepage loads with all 3 spread options, (2) Reading flow works for all 3 spread types, (3) AI streaming works with all 3 characters, (4) All 78 card detail pages render correctly, (5) Blog index + all 10 articles render, (6) Sitemap has 90+ URLs, (7) Mobile responsive on 375px width, (8) Card flip animations smooth. Fix any issues found.
- [x] T22: Create GitHub repo, commit all code, push. Deploy final version to Cloudflare Pages. Verify dooyipsee.com works end-to-end. Verify duyipsee.com redirects to dooyipsee.com. Verify SSL on both domains.

## Final Verification Wave
- [ ] F1: Oracle review — verify all acceptance criteria met, code quality, no security issues (API key exposure, XSS, etc.)
- [ ] F2: Mobile UX review via Playwright — test on mobile viewport (375px), verify touch targets ≥44px, card animations smooth, reading flow complete
- [ ] F3: SEO audit — verify sitemap.xml, robots.txt, meta tags on all pages, JSON-LD on card/blog pages, canonical URLs, OG images
- [ ] F4: Production smoke test — verify live site at dooyipsee.com, test AI reading end-to-end, verify duyipsee.com redirect

## Constraints
- MUST: Store card images in /public or R2, NOT inline in worker bundle
- MUST: All AI calls server-side only (never expose OPENROUTER_API_KEY to client)
- MUST: Canonical URLs point to dooyipsee.com on every page
- MUST: Bundle Noto Sans Thai font for OG image generation
- MUST: No-duplicate card draws in spreads
- MUST: Handle empty question (general reading)
- MUST: Truncate long questions (max 500 chars)
- MUST: Model fallback chain on AI failure → static card meanings
- MUST NOT: Add user auth, payment, history saving
- MUST NOT: Use Pages Router — App Router only
- MUST NOT: Combine ISR with PPR (known bug on CF)
- MUST NOT: Add blog categories, tags, pagination for 10 articles

## Cost Notes
- Image generation: ~78 cards × ~$0.01-0.05 per image = ~$1-4
- Per reading: ~500-4000 tokens × $0.25-6/M = ~$0.001-0.02 per reading
- Cloudflare Workers: Free plan may have CPU limits for streaming — monitor and upgrade if needed ($5/mo)
