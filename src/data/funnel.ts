import camisaPumaII from "@/assets/camisa-puma-ii-26-27.png";
import camisaThird from "@/assets/camisa-third-25-26.png";
import camisaPumaI2526 from "@/assets/camisa-puma-i-25-26.png";
import camisaPumaI2627 from "@/assets/camisa-puma-i-26-27.png";

export interface Question {
  question: string;
  options: string[];
}

export interface Prize {
  id: number;
  label: string;
  name: string;
  image?: string;
  emoji: string;
  isLoss: boolean;
}

export const questions: Question[] = [
  { question: "Em que ano o Palmeiras foi fundado?", options: ["1910", "1912", "1914", "1917"] },
  { question: "Qual é o apelido mais famoso do Palmeiras?", options: ["Alviverde", "Verdão", "Porco", "Palestra"] },
  { question: "Quantas vezes o Palmeiras venceu a Libertadores?", options: ["1 vez", "2 vezes", "3 vezes", "4 vezes"] },
  { question: "Qual é o estádio do Palmeiras?", options: ["Morumbi", "Pacaembu", "Allianz Parque", "Neo Química Arena"] },
  { question: "Qual o nome original do Palmeiras?", options: ["Palestra Itália", "Sport Club Italiano", "Verde Paulista", "Clube Alviverde"] },
];

/** Wheel segments in clockwise order, starting at the top. */
export const prizes: Prize[] = [
  { id: 0, label: "Camisa I 26/27", name: "Camisa Palmeiras Puma I 26/27", image: camisaPumaI2627, emoji: "👕", isLoss: false },
  { id: 1, label: "Tente novamente", name: "Tente novamente", emoji: "🔄", isLoss: true },
  { id: 2, label: "Camisa II 26/27", name: "Camisa Palmeiras Puma II 26/27", image: camisaPumaII, emoji: "👕", isLoss: false },
  { id: 3, label: "Camisa Third", name: "Camisa Palmeiras Third 25/26", image: camisaThird, emoji: "👕", isLoss: false },
  { id: 4, label: "Camisa I 25/26", name: "Camisa Palmeiras Puma I 25/26", image: camisaPumaI2526, emoji: "👕", isLoss: false },
  { id: 5, label: "Bola Oficial", name: "Bola Oficial Palmeiras", emoji: "⚽", isLoss: false },
];

export const LOSS_INDEX = 1;
export const WIN_INDEX = 0;

/** First spin always lands on "Tente novamente"; the second lands on the main prize. */
export function targetForSpin(spinNumber: number): number {
  return spinNumber <= 1 ? LOSS_INDEX : WIN_INDEX;
}

/** Final wheel rotation (deg) so segment `index` stops under the top pointer. */
export function rotationFor(index: number, current: number, turns = 6): number {
  const seg = 360 / prizes.length;
  const center = index * seg + seg / 2;
  const base = current - (current % 360) + 360 * turns;
  return base + (360 - center);
}
