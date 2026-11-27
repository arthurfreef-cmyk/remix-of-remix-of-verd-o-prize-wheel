import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Prize } from "@/data/funnel";
import logo from "@/assets/palmeiras-logo.png";

const sizes = ["P", "M", "G", "GG", "G1"];

export function DeliveryScreen({ prize }: { prize: Prize }) {
  const [size, setSize] = useState<string>("");

  const handlePayment = () => {
    const checkoutUrl = import.meta.env.VITE_SHIPPING_CHECKOUT_URL as string | undefined;
    if (!size) {
      window.alert("Selecione o tamanho da camiseta para continuar.");
      return;
    }
    if (!checkoutUrl) {
      window.alert("O checkout de frete ainda não está conectado.");
      return;
    }
    const url = new URL(checkoutUrl, window.location.origin);
    url.searchParams.set("size", size);
    url.searchParams.set("prize", prize.name);
    window.location.assign(url.toString());
  };

  return (
    <main className="min-h-[100svh] bg-white px-4 py-4">
      <header className="mx-auto flex min-h-[86px] w-full max-w-md items-center justify-center bg-[#087a45] px-4">
        <img src={logo} alt="Escudo do Palmeiras" className="h-[68px] w-[68px] object-contain" />
      </header>

      <section className="mx-auto w-full max-w-md pb-8 pt-7">
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 text-center shadow-[0_12px_36px_rgba(4,55,31,0.10)]">
          <h1 className="mt-4 text-2xl font-black leading-tight text-[#075b32]">
            Seu endereço foi cadastrado e seu prêmio foi reservado!
          </h1>
          <p className="mt-2 text-base font-semibold leading-relaxed text-slate-800">
            Escolha o tamanho da sua camiseta e pague a taxa de frete para receber o seu prêmio.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_10px_30px_rgba(4,55,31,0.08)]">
          <div className="bg-[#087a45] px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-white">
            Camiseta sorteada
          </div>
          <div className="p-4">
            <div className="mx-auto flex min-h-[250px] max-w-[300px] items-center justify-center rounded-xl bg-[#f5f8f5] p-3">
              {prize.image ? (
                <img src={prize.image} alt={prize.name} className="max-h-[290px] w-full object-contain" />
              ) : (
                <span className="text-8xl">{prize.emoji}</span>
              )}
            </div>
            <h2 className="mt-4 text-center text-lg font-extrabold text-slate-900">{prize.name}</h2>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="text-base font-semibold text-slate-400 line-through">R$ 359,00</span>
              <span className="text-2xl font-black text-[#087a45]">R$ 0,00</span>
            </div>
            <div className="mx-auto mt-3 max-w-[260px] rounded-xl border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#075b32]">Taxa de frete SEDEX</p>
              <p className="mt-1 text-2xl font-black text-[#087a45]">R$ 37,82</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-[0_10px_30px_rgba(4,55,31,0.08)]">
          <h2 className="text-center text-lg font-black text-slate-900">Escolha o tamanho da sua camiseta</h2>
          <div className="mt-4 grid grid-cols-5 gap-2" role="group" aria-label="Tamanho da camiseta">
            {sizes.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={size === item}
                onClick={() => setSize(item)}
                className={`flex h-12 items-center justify-center rounded-lg border-2 text-sm font-extrabold transition-colors ${size === item ? "border-[#087a45] bg-[#087a45] text-white shadow-md" : "border-slate-200 bg-white text-slate-800 hover:border-emerald-700"}`}
              >
                {item}
              </button>
            ))}
          </div>

          <Button onClick={handlePayment} size="lg" className="mt-5 h-14 w-full rounded-xl bg-[#087a45] text-base font-black uppercase tracking-wide text-white shadow-lg hover:bg-[#06683a]">
            PAGAR FRETE
          </Button>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Infelizmente, o Palmeiras FC não consegue bancar toda a operação sozinho e precisa da ajuda dos torcedores para pagar apenas a taxa única de frete via SEDEX, no valor fixo de R$ 37,82.
          </p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-[#075b32]">
            Você irá levar uma camiseta oficial no valor de R$ 359,00 apenas pelo valor do frete de R$ 37,82.
          </p>
        </div>

        <footer className="mt-6 flex min-h-[74px] flex-col items-center justify-center gap-1 bg-[#087a45] px-4 py-3 text-center text-white">
          <img src={logo} alt="Escudo do Palmeiras" className="h-10 w-10 object-contain" />
          <span className="text-xs font-medium text-white/90">Todos os direitos reservados.</span>
        </footer>
      </section>
    </main>
  );
}
