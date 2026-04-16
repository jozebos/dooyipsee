# Learnings — Dooyipsee

## [2026-04-17] Initial Research
- @opennextjs/cloudflare v1.19.1 supports App Router, Route Handlers, SSR, SSG, ISR, Streaming
- wrangler.jsonc needs `nodejs_compat` flag
- Worker size limit ~10MB — don't inline card images
- OpenRouter: OpenAI SDK compatible, baseURL: https://openrouter.ai/api/v1
- Streaming: standard SSE with stream: true
- Image gen: modalities: ["image", "text"] on gemini-3.1-flash-image-preview
- All 3 user-specified models verified on OpenRouter (grok-4.20, glm-5v-turbo, gemini-3.1-flash-lite-preview)
- Thai font needed for OG images (Satori) — bundle Noto Sans Thai
- next/image needs custom loader on Cloudflare
- ISR + PPR = known bug, avoid combining
- Node.js v23.11.1, Wrangler v4.83.0 available
- No bun installed — use npm/npx

## [2026-04-17] Project Init
- Next.js resolved to v16.2.4 (latest stable as of now — despite docs saying "15.x")
- `create-next-app` not needed — manual setup is cleaner and faster
- Tailwind CSS v4: no tailwind.config.js needed. Just `@import "tailwindcss"` in globals.css + postcss.config.mjs with `@tailwindcss/postcss`
- @opennextjs/cloudflare v1.19.1 works with Next.js 16.x
- tsconfig.json: Next.js auto-updates `jsx` to `react-jsx` and adds `.next/dev/types/**/*.ts` to include
- Both `npm run build` and `npx opennextjs-cloudflare build` pass on first try
- framer-motion installed as production dependency for future animation work
- Minimal wrangler.jsonc works without services/r2/d1 bindings for basic setup

## [2026-04-17] Data Configuration Files (T2)
- Created `src/data/ai-characters.ts` with 3 AI characters:
  - ท่านดาวเทพ (dao-thep): x-ai/grok-4.20, cosmic sage personality
  - แม่หมอจันทรา (mae-mo-jantra): z-ai/glm-5v-turbo, warm motherly personality
  - น้องมิสติก (nong-mystic): google/gemini-3.1-flash-lite-preview, young energetic personality
- Created `src/data/spreads.ts` with 3 spread types:
  - Daily Card (1 card)
  - Past, Present, Future (3 cards)
  - Celtic Cross (10 cards)
- All system prompts include Thai language, card interpretation instructions, position awareness, and entertainment disclaimer
- TypeScript interfaces exported: AICharacter, SpreadType, SpreadPosition
- Helper functions: getCharacterById(), getSpreadById()
- Build passes with no errors

## [2026-04-17] Deployment (T2/T3)
- `compatibility_date: "2026-04-17"` causes deploy failure when CF servers are still on UTC April 16 — use `--compatibility-date 2026-04-14` CLI override
- Workers.dev subdomain must be registered before first deploy: `PUT /accounts/{id}/workers/subdomain` with `{"subdomain":"dooyipsee"}`
- Workers Custom Domains API: `PUT /accounts/{id}/workers/domains` — sets up hostname → worker mapping with auto SSL cert
- Custom domains configured: dooyipsee.com + www.dooyipsee.com → dooyipsee worker
- For 301 redirects: Bulk Redirects work when API token lacks `http_request_dynamic_redirect` ruleset permissions
  - Create list: `POST /accounts/{id}/rules/lists` with `kind: "redirect"`
  - Add items: `POST /accounts/{id}/rules/lists/{list_id}/items` with redirect entries
  - Create ruleset: `POST /accounts/{id}/rulesets` with `phase: "http_request_redirect"` and `from_list` action
- DNS for redirect domains: need proxied A record to `192.0.2.1` (RFC 5737 TEST-NET) so CF can intercept and apply redirect rules
- duyipsee.com + www.duyipsee.com → 301 → https://dooyipsee.com (preserves path + query)
- OPENROUTER_API_KEY set via: `echo "$OPENROUTER_API_KEY" | wrangler secret put OPENROUTER_API_KEY`
- Worker deployed at: https://dooyipsee.dooyipsee.workers.dev
- All SSL certs auto-provisioned by Cloudflare (Advanced Certificate Manager not needed on free plan for workers custom domains)
- NOTE: wrangler.jsonc still has `compatibility_date: "2026-04-17"` — future deploys after April 17 UTC won't need the CLI override

## [2026-04-17] Root Layout & Homepage (T4)
- Tailwind v4 @theme directive: define custom colors as `--color-{name}`, then use as `bg-{name}`, `text-{name}` etc.
- Tailwind v4 custom animations: define as `--animate-{name}: {name} {duration} {easing} {iteration}`, then `@keyframes {name}` in CSS
- Tailwind v4 custom shadows: `--shadow-{name}` used via `shadow-{name}` utility
- next/font/google `Noto_Sans_Thai`: supports subsets `["thai", "latin"]`, set `variable: "--font-sans"` to match Tailwind's `--font-sans`
- CSS starfield effect: Multiple `radial-gradient` dots at fixed positions + slow `drift` animation = convincing subtle stars without JS
- `cosmic-mesh` class: layered radial gradients for nebula-like background atmosphere
- Surface pattern: `surface-card` class with cosmic-800 bg, cosmic-600 border, cosmic shadow, hover elevation
- Button pattern: `btn-cosmic` with gradient bg, `::before` overlay for hover transition, glow shadow on hover
- All user-facing text in Thai — only internal class names and HTML attributes in English
- Metadata: `metadataBase` needed for OG URLs, title template uses `%s | base`
- Build: Next.js 16.2.4 Turbopack compiles in ~7s, static generation ~200ms

## [2026-04-17] API Route & Reading Hook (T7)
- `app/api/reading/route.ts`: POST endpoint with SSE streaming, rate limiting (in-memory Map, 10/hr per IP), input validation
- Dynamic import for optional `tarot-cards.ts` module: wrap in try/catch + `@ts-expect-error` to suppress TS build error for missing module
- Turbopack shows "Module not found" warning for dynamic imports of non-existent files — this is expected and the catch block handles it at runtime
- SSE protocol: OpenRouter may end stream without `[DONE]` sentinel — defensively emit `data: [DONE]\n\n` after reader closes
- spreadType → maxTokens key mapping: daily-card→daily, three-card→threeCard, celtic-cross→celticCross
- `src/hooks/useReading.ts`: Client hook using ReadableStream reader to consume SSE, AbortController for cancellation
- `src/components/ReadingDisplay.tsx`: Streaming text display with typing cursor, loading dots, error+retry states
- Build passes with all 3 new files

## [2026-04-17] Reading Flow & Card Components (T8)
- Created 6 new components: CardBack, CardFront, CardFlip, CharacterSelector, CardSelector, SpreadLayout
- Created `app/reading/page.tsx` as client component with 6-step flow: spread→question→character→cards→reveal→reading
- `useSearchParams()` needs Suspense boundary — wrapped ReadingFlow in Suspense inside the default export
- Homepage links to `past-present-future` but spreads.ts uses `three-card` — handled with fallback: `spreadParam === "past-present-future" ? getSpreadById("three-card") : undefined`
- Framer Motion `rotateY` + `backfaceVisibility: "hidden"` + `perspective` on parent = clean 3D card flip
- CardBack uses CSS-only mystical design: conic-gradient rotating ring, diamond lattice pattern (45deg linear-gradients), corner accent borders, shimmer overlay
- CardFront: suit-based color mapping (wands=amber, cups=blue, swords=gray, pentacles=green, major=cosmic purple)
- CardSelector shows 21 shuffled cards in a 5-col mobile / 7-col desktop grid, scaled down with transform
- SpreadLayout: 3 sub-layouts — DailyLayout (single centered), ThreeCardLayout (horizontal row), CelticCrossLayout (2-col mobile / 4-col desktop grid)
- All design tokens from globals.css used consistently: --radius-card, --shadow-cosmic, --shadow-glow-purple, --shadow-glow-gold, --color-cosmic-*, --color-gold-*, --color-mystic-*
- Build: 5.8s compile, 84 static pages, 0 TypeScript errors, 0 LSP diagnostics
