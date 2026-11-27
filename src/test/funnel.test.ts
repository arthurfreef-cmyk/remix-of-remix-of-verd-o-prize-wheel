import { describe, expect, it } from "vitest";
import { prizes, rotationFor, targetForSpin } from "@/data/funnel";

describe("roleta", () => {
  it("tem 5 prêmios e 1 tente novamente", () => {
    expect(prizes.filter((p) => !p.isLoss)).toHaveLength(5);
    expect(prizes.filter((p) => p.isLoss)).toHaveLength(1);
  });
  it("primeiro giro cai em tente novamente, segundo em prêmio", () => {
    expect(prizes[targetForSpin(1)]?.isLoss).toBe(true);
    expect(prizes[targetForSpin(2)]?.isLoss).toBe(false);
  });
  it("para o segmento sob o ponteiro", () => {
    const seg = 360 / prizes.length;
    for (let i = 0; i < prizes.length; i++) {
      const r = rotationFor(i, 1234);
      const atTop = (((360 - (r % 360)) % 360) / seg) | 0;
      expect(atTop).toBe(i);
      expect(r).toBeGreaterThan(1234);
    }
  });
});
