import { useEffect, useState } from "react";
import logo from "@/assets/palmeiras-logo.png";

type Phase = "checking" | "transition" | "preparing";

export function AnalysisScreen({ score, total, onFinish }: { score: number; total: number; onFinish: (qualified: boolean) => void }) {
  const [phase, setPhase] = useState<Phase>("checking");

  useEffect(() => {
    const firstTimer = window.setTimeout(() => setPhase("transition"), 4200);
    return () => window.clearTimeout(firstTimer);
  }, []);

  useEffect(() => {
    if (phase !== "transition") return;
    const transitionTimer = window.setTimeout(() => {
      if (score >= 3) setPhase("preparing");
      else onFinish(false);
    }, 550);
    return () => window.clearTimeout(transitionTimer);
  }, [phase, score, onFinish]);

  useEffect(() => {
    if (phase !== "preparing") return;
    const finishTimer = window.setTimeout(() => onFinish(true), 3800);
    return () => window.clearTimeout(finishTimer);
  }, [phase, onFinish]);

  const transitioning = phase === "transition";

  return (
    <main className="flex min-h-[100svh] flex-col bg-white px-4 pb-6 sm:px-[18px] sm:pb-8 text-center text-neutral-900">
      <header className="flex h-[88px] sm:h-[118px] shrink-0 items-center justify-center bg-[#075B32]">
        <img src={logo} alt="Palmeiras" className="h-[68px] w-[68px] sm:h-[88px] sm:w-[88px] object-contain" />
      </header>

      <section
        className={`flex flex-1 flex-col items-center pt-[clamp(48px,10svh,120px)] sm:pt-[clamp(80px,14vh,150px)] transition-all duration-500 ease-in-out ${transitioning ? "translate-y-3 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"}`}
        aria-live="polite"
      >
        <div
          className="h-20 w-20 sm:h-24 sm:w-24 animate-spin rounded-full border-[9px] border-[#dceee3] border-t-[#087A3D]"
          role="status"
          aria-label={phase === "preparing" ? "Preparando roleta" : "Analisando respostas"}
        />
        {phase === "checking" ? (
          <h1 className="mt-7 max-w-sm px-2 text-xl sm:mt-9 sm:text-[22px] font-extrabold leading-tight text-[#087A3D]">
            Estamos analisando suas respostas...
          </h1>
        ) : phase === "preparing" ? (
          <>
            <h1 className="mt-9 max-w-sm text-[22px] font-extrabold leading-tight text-[#087A3D]">
              Parabéns! Você acertou {score} das {total} perguntas!
            </h1>
            <p className="mt-4 text-[17px] font-semibold text-neutral-800">
              Preparando sua roleta...
            </p>
          </>
        ) : null}
      </section>

      <p className="mx-auto mb-4 mt-6 max-w-md px-1 text-base sm:mb-5 sm:mt-8 sm:text-[17px] font-semibold leading-relaxed text-neutral-800">
        {phase === "preparing"
          ? "Sua pontuação foi confirmada. Você atingiu a pontuação mínima e a roleta está sendo preparada!"
          : "Caso você tenha acertado pelo menos 3 perguntas será automaticamente redirecionado!"}
      </p>

      <footer className="flex min-h-[54px] w-full shrink-0 items-center justify-center bg-[#075B32] px-3 py-3 text-center text-sm sm:py-4 sm:text-[16px] font-semibold text-white">
        Direitos reservados, Palmeiras
      </footer>
    </main>
  );
}
