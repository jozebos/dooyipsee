# Draft: Dooyipsee — Tarot Reading Web App

## Requirements (confirmed)
- เว็บดูไพ่ยิปซี/ทาโร่ ออนไลน์ ฟรี
- Mobile-first UX เน้นบนมือถือ
- ภาษาไทยอย่างเดียว
- ไพ่ครบ 78 ใบ (Major 22 + Minor 56)
- รูปไพ่ AI Generate ด้วย google/gemini-3.1-flash-image-preview ผ่าน OpenRouter — เข้าตีมเว็บ + มี mascot
- โหมดเลือกไพ่เอง + โหมดสุ่มไพ่
- โหมดพิมพ์คำถาม → AI ทำนายจากไพ่ที่เปิดได้
- AI Models ผ่าน OpenRouter: x-ai/grok-4.20, z-ai/glm-5v-turbo, google/gemini-3.1-flash-lite-preview (ชื่อตาม user ให้มา — ต้อง verify ใน OpenRouter)
- SEO เน้น — บทความ 10 ชิ้นพร้อม deploy
- Domain: dooyipsee.com + duyipsee.com (Cloudflare)
- สร้าง repo, commit, deploy ให้เสร็จ
- Monetization: คิดทีหลัง — เตรียมโครงไว้ไม่ implement

## Technical Decisions (confirmed)
- **Stack**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Deployment**: Cloudflare Pages via @opennextjs/cloudflare
- **Language**: ไทยอย่างเดียว
- **Card Deck**: ครบ 78 ใบ
- **Card Images**: AI Generate (gemini-3.1-flash-image-preview via OpenRouter) — เจนตอน build หรือเป็น task แยก
- **AI API**: Server-side (API route ใน Next.js → OpenRouter) ซ่อน key
- **Content**: Blog system + 10 บทความเริ่มต้น (ความหมายไพ่, วิธีดู, etc.)

## Research Findings

### Next.js + Cloudflare
- ใช้ @opennextjs/cloudflare adapter (v1.19.1)
- wrangler.jsonc ต้องมี nodejs_compat flag
- API routes ทำงานได้เต็มที่ (server functions)
- Worker size limit ~10MB — ไม่ควรเก็บรูปใน worker bundle
- Streaming responses supported — ดีสำหรับ AI reading

### Tarot UX Patterns
- **Best practices**: Setup-first UX (เลือก spread → ถามคำถาม → จับไพ่)
- **Card interactions**: Tap <100ms, Drag with spring physics (response 0.4, damping 0.7)
- **Theme**: Dark + Gold เป็นมาตรฐาน mystical theme
- **Spreads**: Single card (เร็ว), 3-card (Past/Present/Future), Celtic Cross (deep)
- **Inspiration**: Tarovent (spread UX), TarotVeil (AI narrative), Tarotara (mobile gestures)

### Thai Market
- ไพ่ยิปซี (Gypsy Cards) = ชื่อที่คนไทยเรียกไพ่ทาโร่
- คนไทยจริงจังกับการดูดวง ใช้ตัดสินใจเรื่องสำคัญ
- ผสม Buddhism + ความเชื่อพื้นบ้าน
- ต้องการคำแนะนำที่ actionable ไม่ใช่ abstract

### Free Assets
- Rider-Waite-Smith = Public Domain (ใช้เป็น reference ได้)
- แต่ user เลือก AI Generate เอง — จะ unique กว่า

## Open Questions (resolved)
1. ~~AI model names~~ → ใช้ผ่าน OpenRouter ตามชื่อที่ให้มา (verify ตอน implement)
2. ~~ภาษา~~ → ไทยอย่างเดียว
3. ~~สำรับไพ่~~ → 78 ใบเต็ม
4. ~~รูปไพ่~~ → AI Generate ด้วย gemini image model
5. ~~บทความ~~ → เขียน 10 ชิ้นพร้อม deploy
6. ~~รายได้~~ → คิดทีหลัง
7. ~~API key~~ → server-side API routes ซ่อน key

## Additional Decisions (confirmed)
- **Spread Types**: 3 แบบ — 1 ใบ (ไพ่ประจำวัน), 3 ใบ (อดีต/ปัจจุบัน/อนาคต), Celtic Cross (10 ใบ)
- **AI Model Selection**: ให้ user เลือกเป็น "ตัวละคร" — แต่ละ model มีชื่อ+บุคลิกต่างกัน (สนุกกว่า)
- **Theme**: Dark + Purple/Violet — cosmic/จักรวาล/ดวงดาว vibes
- **Mascot**: TBD — จะให้ AI generate ตอน implement (อาจเป็นแมว/นกฮูก mystical)

## Scope Boundaries
- INCLUDE: เว็บ tarot reading, AI ทำนาย, blog 10 บทความ, SEO, deploy CF, repo+commit
- EXCLUDE: Payment/monetization, user accounts/login, save history (ดูแล้วจบ), native app
