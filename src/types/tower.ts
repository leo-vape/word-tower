export interface FallingWordView {
  id: string;
  word: string;
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  col: number;
  speed: number;
  opacity: number;
  isCorrect: boolean;
}
