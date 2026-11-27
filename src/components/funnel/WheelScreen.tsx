import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { prizes, rotationFor, targetForSpin, type Prize } from "@/data/funnel";
import { playLose, playTick } from "@/lib/sounds";
import { cn } from "@/lib/utils";

const SPIN_MS = 5200;
const SEG = 360 / prizes.length;
const R = 150;

function point(angleDeg: number, r: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [R + r * Math.cos(a), R + r * Math.sin(a)] as const;
}

export function WheelScreen({ onWin }: { onWin: (prize: Prize) => void }) {
  const [rotation, setRotation] = useState(0);
  const [spins, setSpins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = () => {
    if (spinning) return;
    const n = spins + 1;
    const target = targetForSpin(n);
    setSpins(n);
    setMessage(null);
    setSpinning(true);
    setRotation((r) => rotationFor(target, r));
    let delay = 60;
    const tick = () => {
      playTick();
      delay *= 1.08;
      if (delay < 500) tickTimer.current = setTimeout(tick, delay) as unknown as ReturnType<typeof setInterval>;
    };
    tick();
    setTimeout(() => {
      setSpinning(false);
      const prize = prizes[target];
      if (!prize) return;
      if (prize.isLoss) {
        playLose();
        setMessage("Quase! Você ganhou mais uma chance. Gire de novo!");
      } else {
        setTimeout(() => onWin(prize), 600);
        setMessage(`Você ganhou: ${prize.name}! 🎉`);
      }
    }, SPIN_MS);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-8 text-center">
      <h2 className="text-3xl font-bold uppercase text-primary">Parabéns, palmeirense!</h2>
      <p className="mt-2 font-semibold text-foreground">
        Você acertou o desafio e liberou {spins === 0 ? "2 giros" : spins === 1 ? "mais 1 giro" : "seu prêmio"} na Roleta do Verdão.
      </p>

      <div className="relative mx-auto mt-8 aspect-square w-full max-w-[320px]">
        <div className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2 drop-shadow-md">
          <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden>
            <path d="M18 44 L2 6 Q18 -4 34 6 Z" className="fill-gold stroke-pitch" strokeWidth="2" />
          </svg>
        </div>
        <div className="rounded-full border-8 border-pitch bg-pitch shadow-2xl">
          <svg
            viewBox={`0 0 ${R * 2} ${R * 2}`}
            className="block w-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.85, 0.2, 1)` : "none",
            }}
            role="img"
            aria-label="Roleta de prêmios"
          >
            {prizes.map((p, i) => {
              const [x1, y1] = point(i * SEG, R);
              const [x2, y2] = point((i + 1) * SEG, R);
              const [tx, ty] = point(i * SEG + SEG / 2, R * 0.62);
              const mid = i * SEG + SEG / 2;
              return (
                <g key={p.id}>
                  <path
                    d={`M${R},${R} L${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} Z`}
                    className={cn(p.isLoss ? "fill-gold" : i % 2 === 0 ? "fill-primary" : "fill-card")}
                    stroke="currentColor"
                    strokeOpacity={0.15}
                  />
                  <g transform={`rotate(${mid} ${tx} ${ty})`}>
                    <text x={tx} y={ty - 14} textAnchor="middle" fontSize="22">{p.emoji}</text>
                    <text
                      x={tx}
                      y={ty + 10}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      className={cn("font-display uppercase", p.isLoss ? "fill-gold-foreground" : i % 2 === 0 ? "fill-primary-foreground" : "fill-primary")}
                    >
                      {p.label}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle cx={R} cy={R} r={22} className="fill-pitch" />
            <circle cx={R} cy={R} r={14} className="fill-gold" />
          </svg>
        </div>
      </div>

      <div className="mt-6 min-h-7" aria-live="polite">
        {message && <p className="animate-pop-in text-lg font-bold text-foreground">{message}</p>}
      </div>

      <Button
        onClick={spin}
        disabled={spinning || spins >= 2}
        size="lg"
        className={cn("mt-4 h-14 w-full bg-gold text-xl font-bold uppercase tracking-wider text-gold-foreground font-display hover:bg-gold/90", !spinning && spins < 2 && "animate-pulse-glow")}
      >
        {spinning ? "Girando..." : spins === 0 ? "Girar roleta" : "Girar novamente"}
      </Button>
    </div>
  );
}
