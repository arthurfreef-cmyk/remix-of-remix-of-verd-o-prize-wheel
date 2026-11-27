import { useEffect } from "react";
import logo from "@/assets/palmeiras-logo.png";

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onFinish, 2400);
    return () => window.clearTimeout(timeout);
  }, [onFinish]);

  return (
    <main className="flex min-h-[100svh] flex-col bg-white px-4 py-4">
      <header className="mx-auto flex min-h-[106px] w-full max-w-md items-center justify-center bg-[#087a45]">
        <img src={logo} alt="Palmeiras" className="h-[78px] w-[78px] object-contain" />
      </header>

      <section className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <div
          className="h-24 w-24 animate-spin rounded-full border-[8px] border-emerald-100 border-t-[#087a45]"
          role="status"
          aria-label="Carregando"
        />
        <p className="mt-9 max-w-sm text-xl font-extrabold leading-snug text-[#087a45]">
          Estamos cadastrando seu endereço de envio
        </p>
      </section>

      <p className="mb-6 text-center text-base font-bold text-slate-900">
        Aguarde um instante, não feche esta página.
      </p>

      <footer className="mx-auto flex min-h-14 w-full max-w-md items-center justify-center bg-[#087a45] px-4 text-center text-sm font-bold text-white">
        Desafio do Verdão • 2026
      </footer>
    </main>
  );
}
