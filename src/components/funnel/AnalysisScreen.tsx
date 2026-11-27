import { useEffect } from "react";

export function AnalysisScreen({ score, total, onFinish }: { score: number; total: number; onFinish: (qualified: boolean) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onFinish(score >= 3), 2600);
    return () => window.clearTimeout(timer);
  }, [score, onFinish]);

  return (
    <main className="flex min-h-[calc(100svh-6rem)] flex-col items-center bg-white px-5 pb-8 text-center text-neutral-900">
      <section className="flex flex-1 flex-col items-center justify-center">
        <div
          className="mb-9 h-24 w-24 animate-spin rounded-full border-[9px] border-[#d9eadf] border-t-[#087A3D]"
          role="status"
          aria-label="Analisando respostas"
        />
        <h1 className="max-w-sm text-[22px] font-extrabold leading-tight text-[#087A3D]">
          Estamos analisando suas respostas...
        </h1>
      </section>

      <p className="mb-5 max-w-md text-[17px] font-semibold leading-relaxed text-neutral-800">
        Você precisa acertar pelo menos 3 das {total} perguntas para liberar a roleta. Se atingir a pontuação mínima, será redirecionado automaticamente!
      </p>

      <footer className="w-full bg-[#075B32] px-4 py-4 text-center text-[16px] font-semibold text-white">
        Direitos reservados, Palmeiras
      </footer>
    </main>
  );
}
