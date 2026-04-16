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
