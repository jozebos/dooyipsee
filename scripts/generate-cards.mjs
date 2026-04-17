#!/usr/bin/env node
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'cards');
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'google/gemini-3.1-flash-image-preview';
const DELAY_MS = 3000;
const MAX_RETRIES = 3;

if (!API_KEY) { console.error('Missing OPENROUTER_API_KEY'); process.exit(1); }
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const STYLE = 'Dark cosmic purple and violet mystical theme, ornate golden border frame, stars and nebula background, rich jewel tones with deep purples violets and gold accents, detailed digital art illustration, portrait orientation tarot card';

const majorNames = [
  ['The Fool','เดอะฟูล','Young traveler at cliff edge with small white dog, carrying bag on stick, looking up at sky'],
  ['The Magician','เดอะแมจิเชียน','Figure at table with cup sword wand pentacle, one hand pointing up one down, infinity symbol above head'],
  ['The High Priestess','ไฮพรีสเตส','Woman seated between two pillars B and J, scroll in lap, crescent moon at feet'],
  ['The Empress','ดิเอมเพรส','Crowned woman in lush garden, surrounded by wheat and nature, symbol of Venus'],
  ['The Emperor','ดิเอมเพอเรอร์','Armored figure on stone throne, holding ankh scepter, rams head decorations'],
  ['The Hierophant','เดอะไฮโรแฟนท์','Religious figure between two pillars, two acolytes kneeling, raised hand blessing'],
  ['The Lovers','เดอะเลิฟเวอร์ส','Two figures under angel with spread wings, tree of knowledge and tree of life'],
  ['The Chariot','เดอะชาริออท','Warrior in chariot pulled by two sphinxes one black one white, starry canopy'],
  ['Strength','สเตร็งธ','Woman gently closing lion mouth, infinity symbol above head, flowers in hair'],
  ['The Hermit','เดอะเฮอร์มิท','Robed figure on mountain peak holding lantern with six-pointed star, staff in other hand'],
  ['Wheel of Fortune','วีลออฟฟอร์จูน','Great wheel with symbols, sphinx on top, serpent descending, Anubis ascending'],
  ['Justice','จัสทิส','Seated figure holding sword upright and scales, between two pillars, crown on head'],
  ['The Hanged Man','เดอะแฮงด์แมน','Figure suspended upside down from T-shaped cross by one foot, halo around head, serene expression'],
  ['Death','เดธ','Skeleton knight on white horse, carrying black flag with white rose, sun rising between towers'],
  ['Temperance','เทมเพอแรนซ์','Angel with one foot on land one in water, pouring liquid between two cups, sun on horizon'],
  ['The Devil','เดะเดวิล','Horned figure on pedestal, two chained figures below, inverted pentagram above'],
  ['The Tower','เดอะทาวเวอร์','Lightning striking tower crown, two figures falling, flames and debris'],
  ['The Star','เดอะสตาร์','Nude figure kneeling by water pouring from two jugs, large star above with seven smaller stars'],
  ['The Moon','เดอะมูน','Full moon with face between two towers, dog and wolf howling, crayfish emerging from water'],
  ['The Sun','เดอะซัน','Large sun with face, child on white horse, sunflowers in background, red banner'],
  ['Judgement','จัดจ์เมนท์','Angel blowing trumpet from clouds, figures rising from coffins below, mountains in background'],
  ['The World','เดอะเวิลด์','Dancing figure in wreath, four creatures in corners (angel eagle lion bull), two wands'],
];

const suits = {
  wands: { th: 'ไม้เท้า', element: 'fire and wooden flowering staffs' },
  cups: { th: 'ถ้วย', element: 'water and ornate golden chalices' },
  swords: { th: 'ดาบ', element: 'air and gleaming silver swords' },
  pentacles: { th: 'เหรียญ', element: 'earth and golden pentacle coins' },
};

const minorNumbers = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];

// Build card list
const cards = [];

// Major Arcana
majorNames.forEach(([nameEn, nameTh, desc], i) => {
  cards.push({
    filename: `major-${String(i).padStart(2, '0')}.png`,
    nameEn, nameTh,
    prompt: `Generate a tarot card illustration: "${nameEn}" (${nameTh}). ${STYLE}. Card imagery: ${desc}. The card name "${nameEn}" elegantly written at the bottom of the card.`,
  });
});

// Minor Arcana
for (const [suit, info] of Object.entries(suits)) {
  minorNumbers.forEach((num, i) => {
    const nameEn = `${num} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`;
    const nameTh = `${num === 'Ace' ? 'เอซ' : num === 'Page' ? 'เพจ' : num === 'Knight' ? 'อัศวิน' : num === 'Queen' ? 'ราชินี' : num === 'King' ? 'ราชา' : num}แห่ง${info.th}`;
    const numVal = i + 1;
    let desc = `${num} ${suit} card showing ${info.element} imagery`;
    if (numVal <= 10) desc += `, ${numVal} ${suit} symbols arranged artistically`;
    else if (num === 'Page') desc += ', young person holding the suit symbol';
    else if (num === 'Knight') desc += ', mounted warrior charging with suit symbol';
    else if (num === 'Queen') desc += ', seated queen holding suit symbol, throne decorated';
    else if (num === 'King') desc += ', seated king with suit symbol, commanding presence';
    
    cards.push({
      filename: `${suit}-${String(numVal).padStart(2, '0')}.png`,
      nameEn, nameTh,
      prompt: `Generate a tarot card illustration: "${nameEn}" (${nameTh}). ${STYLE}. Card imagery: ${desc}. The card name "${nameEn}" elegantly written at the bottom.`,
    });
  });
}

// Card back
cards.push({
  filename: 'card-back.png',
  nameEn: 'Card Back', nameTh: 'หลังไพ่',
  prompt: `Design an ornate tarot card back. ${STYLE}. Symmetrical mandala design with moons stars and mystical symbols. The text "ดูยิปซี" subtly integrated. Rich mysterious and elegant.`,
});

// Mascot
cards.push({
  filename: 'mascot.png',
  nameEn: 'Mascot', nameTh: 'มาสคอต',
  prompt: `A cute mystical owl fortune teller mascot character. Dark purple violet cosmic theme. The owl wears a small wizard hat with stars, has large wise glowing purple eyes, holds a tiny tarot card. Chibi kawaii style but mystical. Starry cosmic purple background.`,
});

async function generateImage(prompt) {
  // Use curl via child_process because Node.js fetch has IPv6 timeout issues on this machine
  const { execSync } = await import('child_process');
  const payload = JSON.stringify({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    modalities: ['image', 'text'],
  });
  const tmpFile = path.join(OUTPUT_DIR, '_payload.json');
  fs.writeFileSync(tmpFile, payload);
  try {
    const result = execSync(`curl -s --max-time 120 https://openrouter.ai/api/v1/chat/completions \
      -H "Authorization: Bearer ${API_KEY}" \
      -H "Content-Type: application/json" \
      -H "HTTP-Referer: https://dooyipsee.com" \
      -H "X-Title: Dooyipsee Card Generator" \
      -d @${tmpFile}`, { maxBuffer: 50 * 1024 * 1024, timeout: 130000 });
    const data = JSON.parse(result.toString());
    if (data.error) throw new Error(JSON.stringify(data.error));
    const images = data.choices?.[0]?.message?.images;
    if (!images?.length) throw new Error('No images in response');
    const dataUrl = images[0].image_url.url;
    const base64 = dataUrl.split(',')[1];
    return { buffer: Buffer.from(base64, 'base64'), cost: data.usage?.cost || 0 };
  } finally {
    try { fs.unlinkSync(tmpFile); } catch {}
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Parse CLI args
const startIdx = parseInt(process.argv.find(a => a.startsWith('--start='))?.split('=')[1] || '0');
const onlyCard = process.argv.find(a => a.startsWith('--only='))?.split('=')[1];

let totalCost = 0;
let generated = 0;
let skipped = 0;
let failed = 0;

const toGenerate = onlyCard ? cards.filter(c => c.filename.replace('.png','') === onlyCard) : cards.slice(startIdx);

console.log(`\n🔮 Dooyipsee Card Generator`);
console.log(`📦 Total: ${toGenerate.length} cards to process\n`);

for (let i = 0; i < toGenerate.length; i++) {
  const card = toGenerate[i];
  const outPath = path.join(OUTPUT_DIR, card.filename);
  
  if (fs.existsSync(outPath)) {
    console.log(`⏭️  [${i+1}/${toGenerate.length}] ${card.nameEn} — already exists, skipping`);
    skipped++;
    continue;
  }

  let success = false;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      process.stdout.write(`🎨 [${i+1}/${toGenerate.length}] Generating ${card.nameEn}...`);
      const { buffer, cost } = await generateImage(card.prompt);
      fs.writeFileSync(outPath, buffer);
      totalCost += cost;
      generated++;
      console.log(` ✅ (${(buffer.length/1024).toFixed(0)}KB, $${cost.toFixed(4)})`);
      success = true;
      break;
    } catch (err) {
      console.log(` ❌ attempt ${attempt}/${MAX_RETRIES}: ${err.message.slice(0,100)}`);
      if (attempt < MAX_RETRIES) await sleep(DELAY_MS * attempt);
    }
  }
  
  if (!success) { failed++; console.log(`   ⚠️  FAILED: ${card.nameEn}`); }
  if (i < toGenerate.length - 1) await sleep(DELAY_MS);
}

console.log(`\n✨ Done! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
console.log(`💰 Total cost: $${totalCost.toFixed(4)}\n`);
