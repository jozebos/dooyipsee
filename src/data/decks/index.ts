export interface DeckOverlay {
  id: string;
  name: string;
  description: string;
  cardBackImage: string;
  imagePrefix: string;
}

export const decks: DeckOverlay[] = [
  {
    id: "classic",
    name: "คลาสสิก",
    description: "สำรับดั้งเดิม สไตล์จักรวาล",
    cardBackImage: "/cards/classic/card-back.webp",
    imagePrefix: "/cards/classic",
  },
];

export function getDeckById(id: string): DeckOverlay | undefined {
  return decks.find((d) => d.id === id);
}

export function getCardImage(deckId: string, cardId: string): string {
  return `/cards/${deckId}/${cardId}.webp`;
}
