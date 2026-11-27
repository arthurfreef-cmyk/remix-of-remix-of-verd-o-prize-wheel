import { useEffect } from "react";
import logo from "@/assets/palmeiras-logo.png";

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onFinish, 2400);
    return () => window.clearTimeout(timeout);
  }, [onFinish]);

  return (
    <main className="flex min-h-[100svh] flex-col bg-white px-3 py-3 sm:px-4 sm:py-4">
      <header className="mx-auto flex min-h-[82px] sm:min-h-[106px] w-full max-w-md items-center justify-center bg-[#087a45]">
        <img src={logo} alt="Palmeiras" className="h-[64px] w-[64px] sm:h-[78px] sm:w-[78px] object-contain" />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <div
          className="h-20 w-20 sm:h-24 sm:w-24 animate-spin rounded-full border-[8px] border-emerald-100 border-t-[#087a45]"
          role="status"
          aria-label="Carregando"
        />
        <p className="mt-7 max-w-sm px-3 text-lg sm:mt-9 sm:text-xl font-extrabold leading-snug text-[#087a45]">
          Estamos cadastrando seu endereço de envio
        </p>
      </section>

      <p className="mb-4 px-2 text-center text-sm sm:mb-6 sm:text-base font-bold text-slate-900">
        Aguarde um instante, não feche esta página.
      </p>

      <footer className="mx-auto flex min-h-12 sm:min-h-14 w-full max-w-md items-center justify-center bg-[#087a45] px-4 text-center text-sm font-bold text-white">
        Desafio do Verdão • 2026
      </footer>
    </main>
  );
}
