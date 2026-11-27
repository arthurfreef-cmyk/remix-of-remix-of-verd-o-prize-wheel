import { useEffect } from "react";
import logo from "@/assets/palmeiras-logo.png";

export function AnalysisScreen({ score, total, onFinish }: { score: number; total: number; onFinish: (qualified: boolean) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onFinish(score >= 3), 2600);
    return () => window.clearTimeout(timer);
  }, [score, onFinish]);

  return (
    <main className="flex min-h-[100svh] flex-col bg-white px-[18px] pb-8 text-center text-neutral-900">
      <header className="flex h-[118px] shrink-0 items-center justify-center bg-[#075B32]">
        <img src={logo} alt="Palmeiras" className="h-[88px] w-[88px] object-contain" />
      </header>

      <section className="flex flex-1 flex-col items-center pt-[clamp(105px,19vh,160px)]">
        <div
          className="h-24 w-24 animate-spin rounded-full border-[9px] border-[#dceee3] border-t-[#087A3D]"
          role="status"
          aria-label="Analisando respostas"
        />
        <h1 className="mt-9 max-w-sm text-[22px] font-extrabold leading-tight text-[#087A3D]">
          Estamos analisando suas respostas...
        </h1>
      </section>

      <p className="mx-auto mb-5 mt-8 max-w-md text-[17px] font-semibold leading-relaxed text-neutral-800">
        Caso você tenha acertado pelo menos 3 perguntas será automaticamente redirecionado!
      </p>

      <footer className="flex min-h-[62px] w-full shrink-0 items-center justify-center bg-[#075B32] px-3 py-4 text-center text-[16px] font-semibold text-white">
        Direitos reservados, Palmeiras
      </footer>
    </main>
  );
}
