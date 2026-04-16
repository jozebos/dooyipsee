export interface SpreadPosition {
  index: number;
  nameTh: string;
  description: string;
}

export interface SpreadType {
  id: string;
  nameTh: string;
  nameEn: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  icon: string;
}

export const spreads: SpreadType[] = [
  {
    id: "daily-card",
    nameTh: "ไพ่ประจำวัน",
    nameEn: "Daily Card",
    description: "ไพ่ประจำวันที่นำเสนอพลังงานและข้อความสำหรับวันนี้",
    cardCount: 1,
    positions: [
      {
        index: 1,
        nameTh: "ไพ่ประจำวัน",
        description: "พลังงานและข้อความสำหรับวันนี้",
      },
    ],
    icon: "🌟",
  },
  {
    id: "three-card",
    nameTh: "อดีต ปัจจุบัน อนาคต",
    nameEn: "Past, Present, Future",
    description: "การอ่านไพ่สามใบที่แสดงการไหลของเวลาและสถานการณ์",
    cardCount: 3,
    positions: [
      {
        index: 1,
        nameTh: "อดีต",
        description: "สิ่งที่ผ่านมา ประสบการณ์ที่ส่งผลต่อสถานการณ์ปัจจุบัน",
      },
      {
        index: 2,
        nameTh: "ปัจจุบัน",
        description: "สถานการณ์ตอนนี้ พลังงานและอิทธิพลที่กำลังเกิดขึ้น",
      },
      {
        index: 3,
        nameTh: "อนาคต",
        description: "สิ่งที่กำลังจะมา ผลลัพธ์ที่อาจเกิดขึ้นหากเส้นทางยังคงเดิม",
      },
    ],
    icon: "🔮",
  },
  {
    id: "celtic-cross",
    nameTh: "เซลติกครอส",
    nameEn: "Celtic Cross",
    description:
      "การอ่านไพ่สิบใบที่ลึกซึ้ง ให้ความเข้าใจที่ครอบคลุมเกี่ยวกับสถานการณ์",
    cardCount: 10,
    positions: [
      {
        index: 1,
        nameTh: "สถานการณ์ปัจจุบัน",
        description: "สถานการณ์หลักและพลังงานที่ครอบงำในขณะนี้",
      },
      {
        index: 2,
        nameTh: "ความท้าทาย",
        description: "อุปสรรค ความท้าทาย หรือสิ่งที่ต้องเอาชนะ",
      },
      {
        index: 3,
        nameTh: "อดีต",
        description: "รากฐานของสถานการณ์ ประสบการณ์ที่นำมาซึ่งสถานการณ์นี้",
      },
      {
        index: 4,
        nameTh: "อนาคตอันใกล้",
        description: "สิ่งที่จะเกิดขึ้นในไม่ช้า ผลกระทบในระยะสั้น",
      },
      {
        index: 5,
        nameTh: "เป้าหมาย",
        description: "เป้าหมายสูงสุด ผลลัพธ์ที่ดีที่สุดที่เป็นไปได้",
      },
      {
        index: 6,
        nameTh: "รากฐาน",
        description: "พื้นฐานที่ลึกซึ้ง ปัจจัยพื้นฐานของสถานการณ์",
      },
      {
        index: 7,
        nameTh: "คำแนะนำ",
        description: "คำแนะนำหรือแนวทางที่ควรปฏิบัติ",
      },
      {
        index: 8,
        nameTh: "อิทธิพลภายนอก",
        description: "อิทธิพลจากภายนอก ผู้คน หรือสถานการณ์ที่ส่งผลกระทบ",
      },
      {
        index: 9,
        nameTh: "ความหวังและความกลัว",
        description: "ความหวังของผู้ถาม และความกลัวที่ซ่อนอยู่",
      },
      {
        index: 10,
        nameTh: "ผลลัพธ์สุดท้าย",
        description: "ผลลัพธ์สุดท้ายและการแก้ไขของสถานการณ์",
      },
    ],
    icon: "✨",
  },
];

export function getSpreadById(id: string): SpreadType | undefined {
  return spreads.find((spread) => spread.id === id);
}
