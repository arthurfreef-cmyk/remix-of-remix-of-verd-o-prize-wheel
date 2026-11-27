import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { prizes, rotationFor, targetForSpin, type Prize } from "@/data/funnel";
import { playLose, playTick } from "@/lib/sounds";
import { cn } from "@/lib/utils";

const SPIN_MS = 5600;
const SEG = 360 / prizes.length;
const R = 150;

function point(angleDeg: number, r: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [R + r * Math.cos(a), R + r * Math.sin(a)] as const;
}

export function WheelScreen({ onWin, score }: { onWin: (prize: Prize) => void; score: number }) {
  const [rotation, setRotation] = useState(0);
  const [spins, setSpins] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const tickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    prizes.forEach((prize) => {
      if (!prize.image) return;
      const image = new Image();
      image.decoding = "async";
      image.src = prize.image;
    });
  }, []);

  const spin = () => {
    if (spinning || won) return;
    const n = spins + 1;
    const target = targetForSpin(n);
    setSpins(n);
    setMessage(null);
    setSpinning(true);
    setRotation((r) => rotationFor(target, r, 7));
    let delay = 55;
    const tick = () => {
      playTick();
      delay *= 1.075;
      if (delay < 520) tickTimer.current = setTimeout(tick, delay);
    };
    tick();

    window.setTimeout(() => {
      if (tickTimer.current) clearTimeout(tickTimer.current);
      setSpinning(false);
      const prize = prizes[target];
      if (!prize) return;
      if (prize.isLoss) {
        playLose();
        setMessage("Não foi dessa vez! Você ainda pode tentar mais uma vez.");
        if (n >= 2) {
          window.setTimeout(() => {
            setSpins(0);
            setMessage("Você ganhou mais duas tentativas. Boa sorte!");
          }, 1500);
        }
      } else {
        setWon(true);
        setMessage(`Parabéns! Resultado: ${prize.name}`);
        window.setTimeout(() => onWin(prize), 1100);
      }
    }, SPIN_MS);
  };

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-[#f5f7f5] px-3 pb-7 pt-3 sm:px-4 sm:pb-10 sm:pt-6 text-center text-slate-900">
      <div className="mx-auto max-w-md">
        <h1 className="mt-2 text-2xl sm:mt-4 sm:text-2xl font-extrabold leading-tight text-emerald-950 sm:text-3xl">
          Você chegou à roleta!
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600 sm:text-base">
          Mandou bem no desafio, palmeirense! Você conquistou acesso à Roleta do Verdão. Agora é hora de girar e descobrir qual prêmio a sua participação vai revelar.
        </p>

        <div className="mx-auto mt-4 grid max-w-sm sm:mt-5 grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sua pontuação</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-800">{score}<span className="text-sm text-slate-500">/5</span></p>
          </div>
          <div className="rounded-2xl border border-emerald-900 bg-emerald-950 px-3 py-3 shadow-lg">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Tentativas</p>
            <p className="mt-1 text-2xl font-black text-[#f6e4a9]">{Math.max(0, 2 - spins)}<span className="text-sm text-white"> disponíveis</span></p>
          </div>
        </div>

        <div className="mx-auto mt-3 rounded-xl border sm:mt-4 border-slate-200 bg-white px-4 py-3 text-left">
          <p className="text-sm font-bold text-emerald-900">Sua missão agora é simples:</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Toque em <strong className="text-emerald-900">GIRAR A ROLETA</strong>, acompanhe o giro até parar e confira o resultado. Se aparecer “Tente novamente”, você poderá fazer outra tentativa.
          </p>
        </div>

        <div className="relative mx-auto mt-5 w-[min(84vw,340px)] max-w-[340px] sm:mt-7">
          <div className="absolute -inset-2 rounded-full bg-emerald-900/5 blur-lg" />
          <div className="absolute left-1/2 top-[-17px] z-20 -translate-x-1/2 drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]">
            <svg width="42" height="52" viewBox="0 0 42 52" aria-hidden>
              <path d="M21 50 L3 7 Q21 -3 39 7 Z" fill="#f1d17b" stroke="#fff4d1" strokeWidth="2" />
              <path d="M21 39 L12 11 Q21 7 30 11 Z" fill="#fff0b8" opacity=".8" />
            </svg>
          </div>

          <div className="relative rounded-full border-[10px] border-[#d6b65f] bg-[#f5e7bd] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
            <div className="rounded-full border-4 border-[#fff7df]">
              <svg
                viewBox={`0 0 ${R * 2} ${R * 2}`}
                className="block w-full overflow-visible"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.82, 0.18, 1)` : "none",
                }}
                role="img"
                aria-label="Roleta com setores de prêmios"
              >
                {prizes.map((p, i) => {
                  const [x1, y1] = point(i * SEG, R);
                  const [x2, y2] = point((i + 1) * SEG, R);
                  const [tx, ty] = point(i * SEG + SEG / 2, R * 0.64);
                  const mid = i * SEG + SEG / 2;
                  const dark = i % 2 === 0;
                  return (
                    <g key={p.id}>
                      <path
                        d={`M${R},${R} L${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} Z`}
                        fill={p.isLoss ? "#d6b65f" : dark ? "#087a45" : "#f7f4e9"}
                        stroke="#fff7df"
                        strokeWidth="2"
                      />
                      {p.image ? (
                        <>
                          <image
                            href={p.image}
                            x={tx - 29}
                            y={ty - 31}
                            width="58"
                            height="49"
                            preserveAspectRatio="xMidYMid meet"
                          />
                          <text
                            x={tx}
                            y={ty + 30}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="900"
                            fill={dark ? "#ffffff" : "#075b32"}
                          >
                            {p.label}
                          </text>
                        </>
                      ) : (
                        <g transform={`rotate(${mid} ${tx} ${ty})`}>
                          <text x={tx} y={ty - 8} textAnchor="middle" fontSize="25">{p.emoji}</text>
                          <text
                            x={tx}
                            y={ty + 17}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="900"
                            fill="#ffffff"
                          >
                            {p.label}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
                <circle cx={R} cy={R} r="29" fill="#06452b" stroke="#e2c36f" strokeWidth="5" />
                <text x={R} y={R + 7} textAnchor="middle" fontSize="19" fontWeight="900" fill="#f8e7b1">SEP</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 min-h-[58px] sm:mt-6 max-w-sm" aria-live="polite">
          {message ? (
            <p className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-900">{message}</p>
          ) : (
            <p className="text-sm font-medium text-slate-600">A roleta está pronta. Boa sorte e avanti, Verdão! 💚</p>
          )}
        </div>

        <Button
          onClick={spin}
          disabled={spinning || won}
          size="lg"
          className={cn(
            "mt-2 h-14 w-full rounded-xl bg-[#087a45] text-base font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#06683a] disabled:opacity-60",
            !spinning && !won && "animate-pulse"
          )}
        >
          {spinning ? "Boa sorte! Girando..." : won ? "Resultado confirmado" : "GIRAR A ROLETA"}
        </Button>

        <p className="mt-4 text-xs sm:mt-5 leading-relaxed text-slate-500">
          Confira o resultado na tela seguinte e siga as instruções apresentadas para consultar as condições de participação e resgate.
        </p>
      </div>
    </main>
  );
}
