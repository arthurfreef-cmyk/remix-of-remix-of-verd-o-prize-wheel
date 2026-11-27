import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import type { Prize } from "@/data/funnel";
import { playWin } from "@/lib/sounds";

export function ResultScreen({ prize, score, total, onClaim }: { prize: Prize; score: number; total: number; onClaim: () => void }) {
  useEffect(() => {
    playWin();
    const colors = ["#006437", "#ffffff", "#d4af37"];
    const timers = [0, 350, 700, 1050, 1400].map((delay) =>
      window.setTimeout(() => {
        void confetti({ particleCount: 24, angle: 60, spread: 55, origin: { x: 0 }, colors });
        void confetti({ particleCount: 24, angle: 120, spread: 55, origin: { x: 1 }, colors });
      }, delay)
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div className="mx-auto max-w-md animate-pop-in space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-8 text-center">
      <h1 className="text-3xl font-bold sm:text-4xl uppercase text-primary">Você ganhou!</h1>
      <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Sua pontuação no quiz</p>
        <p className="mt-1 text-4xl font-extrabold text-primary">{score} <span className="text-xl text-muted-foreground">/ {total}</span></p>
        <p className="mt-1 text-sm font-medium text-foreground">{score === total ? "Perfeito! Você é um verdadeiro palestrino!" : score >= 3 ? "Mandou bem! Você conhece o Verdão!" : "Obrigado por participar do desafio!"}</p>
      </div>
      <div className="mx-auto max-w-xs rounded-2xl bg-secondary p-4">
        {prize.image ? (
          <img src={prize.image} alt={prize.name} loading="eager" fetchPriority="high" decoding="async" className="h-56 w-full sm:h-64 rounded-xl object-contain" />
        ) : (
          <div className="py-10 text-8xl">{prize.emoji}</div>
        )}
      </div>
      <p className="text-lg font-bold sm:text-xl text-foreground">{prize.name}</p>
      <p className="text-muted-foreground">Cadastre seus dados para resgatar seu prêmio. A oferta é válida por tempo limitado.</p>
      <Button onClick={onClaim} size="lg" className="h-14 w-full text-lg sm:text-xl font-bold uppercase tracking-wider font-display animate-pulse-glow">
        Resgatar prêmio
      </Button>
    </div>
  );
}
