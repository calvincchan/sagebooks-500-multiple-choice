import { Level1Cards } from "./level1";

export interface LearningCard {
  cardId: number;
  /** Chinese character */
  character: string;
  jyutping: string;
};

export const LearningCards = {
  level1: Level1Cards,
};
