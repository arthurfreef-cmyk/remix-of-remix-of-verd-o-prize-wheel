import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Prize } from "@/data/funnel";
import logo from "@/assets/palmeiras-logo.png";
import { Loader2 } from "lucide-react";
import { checkoutInputSchema, shirtSizes, SHIPPING_LABEL } from "@/lib/velani";
import { useVelaniCheckout } from "@/hooks/use-velani-checkout";
import { PixPaymentPanel } from "./PixPaymentPanel";
import { cn } from "@/lib/utils";

export function DeliveryScreen({ prize, customerName }: { prize: Prize; customerName: string }) {
  const [size, setSize] = useState<string>("");
  const [validationError, setValidationError] = useState("");
  const checkout = useVelaniCheckout();

  const handlePayment = () => {
    if (!size) {
      setValidationError("Selecione o tamanho da camiseta para continuar.");
      return;
    }
    const input = checkoutInputSchema.safeParse({ customerName, prizeId: prize.id, size });
    if (!input.success) {
      setValidationError("Confira o nome informado no resgate e o tamanho selecionado.");
      return;
    }
    setValidationError("");
    checkout.begin(input.data);
  };

  return (
    <main className="min-h-[100svh] bg-white px-3 py-3 sm:px-4 sm:py-4">
      <header className="mx-auto flex min-h-[72px] sm:min-h-[86px] w-full max-w-md items-center justify-center bg-[#087a45] px-4">
        <img src={logo} alt="Escudo do Palmeiras" className="h-14 w-14 sm:h-[68px] sm:w-[68px] object-contain" />
      </header>

      <section className="mx-auto w-full max-w-md pb-6 pt-4 sm:pb-8 sm:pt-7">
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-3 sm:p-4 text-center sm:p-5 shadow-[0_12px_36px_rgba(4,55,31,0.10)]">
          <h1 className="mt-2 text-xl leading-snug sm:mt-4 sm:text-2xl font-black leading-tight text-[#075b32]">
            Seu endereço foi cadastrado e seu prêmio foi reservado!
          </h1>
          <p className="mt-2 text-sm leading-relaxed sm:text-base font-semibold leading-relaxed text-slate-800">
            Escolha o tamanho da sua camiseta e pague a taxa de frete para receber o seu prêmio.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_10px_30px_rgba(4,55,31,0.08)]">
          <div className="bg-[#087a45] px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-white">
            Camiseta sorteada
          </div>
          <div className="p-4">
            <div className="mx-auto flex min-h-[210px] sm:min-h-[250px] max-w-[300px] items-center justify-center rounded-xl bg-[#f5f8f5] p-3">
              {prize.image ? (
                <img src={prize.image} alt={prize.name} loading="eager" fetchPriority="high" decoding="async" className="max-h-[240px] sm:max-h-[290px] w-full object-contain" />
              ) : (
                <span className="text-8xl">{prize.emoji}</span>
              )}
            </div>
            <h2 className="mt-3 text-center text-base sm:mt-4 sm:text-lg font-extrabold text-slate-900">{prize.name}</h2>
            <div className="mt-2 flex items-center sm:mt-3 justify-center gap-3">
              <span className="text-base font-semibold text-slate-400 line-through">R$ 359,00</span>
              <span className="text-2xl font-black text-[#087a45]">R$ 0,00</span>
            </div>
            <div className="mx-auto mt-3 max-w-[260px] rounded-xl border-2 border-emerald-600 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#075b32]">Taxa de frete SEDEX</p>
              <p className="mt-1 text-2xl font-black text-[#087a45]">{SHIPPING_LABEL}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-[0_10px_30px_rgba(4,55,31,0.08)]">
          <h2 className="text-center text-lg font-black text-slate-900">Escolha o tamanho da sua camiseta</h2>
          <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2" role="group" aria-label="Tamanho da camiseta">
            {shirtSizes.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                disabled={checkout.isCreating || checkout.payment !== null}
                aria-pressed={size === item}
                onClick={() => { setSize(item); setValidationError(""); }}
                className={cn("h-12 min-w-0 rounded-lg border-2 px-0 text-sm font-extrabold", size === item && "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}
              >
                {item}
              </Button>
            ))}
          </div>

          {!checkout.payment && <Button onClick={handlePayment} disabled={checkout.isCreating} size="lg" className="mt-4 h-14 sm:mt-5 w-full rounded-xl text-base font-black uppercase tracking-wide shadow-lg">
            {checkout.isCreating && <Loader2 className="mr-2 h-5 w-5 animate-spin motion-reduce:animate-none" />}
            {checkout.isCreating ? "GERANDO PIX..." : "PAGAR FRETE"}
          </Button>}
          {(validationError || checkout.creationError) && <p role="alert" className="mt-3 text-sm text-destructive">{validationError || checkout.creationError}</p>}
          {checkout.payment && <PixPaymentPanel payment={checkout.payment} status={checkout.status} isChecking={checkout.isChecking} statusError={checkout.statusError} onCheck={checkout.check} />}
          <p className="mt-3 text-sm leading-relaxed sm:mt-4 text-slate-600">
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
