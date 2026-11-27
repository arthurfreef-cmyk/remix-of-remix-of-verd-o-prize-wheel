import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import logo from "@/assets/palmeiras-logo.png";

type Offer = {
  title: string;
  eyebrow: string;
  description: string;
  price?: string;
  note?: string;
  acceptLabel: string;
  next: string;
  decline: string;
};

const offers: Record<string, Offer> = {
  "upsell-frete": {
    eyebrow: "OPÇÃO ADICIONAL",
    title: "Complemento opcional de envio",
    description: "Confira esta opção adicional relacionada ao envio do seu pedido. A escolha é opcional e não altera o prêmio que você já selecionou.",
    price: "R$ 17,56",
    note: "Esta etapa é um espaço de oferta. Nenhum valor adicional é cobrado enquanto o pagamento desta opção não estiver configurado.",
    acceptLabel: "QUERO ESTA OPÇÃO",
    next: "/upsell-nota-fiscal",
    decline: "/upsell-nota-fiscal",
  },
  "upsell-nota-fiscal": {
    eyebrow: "INFORMAÇÕES DA COMPRA",
    title: "Documento fiscal e garantia legal",
    description: "As informações fiscais e os direitos de garantia aplicáveis à sua compra devem acompanhar o pedido conforme a legislação. A emissão da nota fiscal não é um produto adicional pago.",
    note: "Esta etapa é informativa e não gera cobrança.",
    acceptLabel: "CONTINUAR",
    next: "/upsell-camisa",
    decline: "/upsell-camisa",
  },
  "upsell-camisa": {
    eyebrow: "OFERTA OPCIONAL",
    title: "Adicione mais uma camisa",
    description: "Aproveite para incluir uma segunda camisa do Palmeiras no seu pedido.",
    price: "R$ 127,00",
    note: "Oferta em configuração. A inclusão e a cobrança só serão efetivadas após a integração do pagamento.",
    acceptLabel: "QUERO ADICIONAR UMA CAMISA",
    next: "/upsell-nota-fiscal-camisa",
    decline: "/upsell-nota-fiscal-camisa",
  },
  "upsell-nota-fiscal-camisa": {
    eyebrow: "INFORMAÇÕES DA COMPRA",
    title: "Documento fiscal da camisa adicional",
    description: "A documentação fiscal e as condições de garantia legal da camisa adicional serão disponibilizadas conforme as regras aplicáveis à compra.",
    note: "Esta etapa é informativa e não gera cobrança.",
    acceptLabel: "CONTINUAR",
    next: "/vale-ingressos",
    decline: "/vale-ingressos",
  },
  "vale-ingressos": {
    eyebrow: "BENEFÍCIO ESPECIAL",
    title: "Vale-ingressos para 4 jogos",
    description: "Consulte as condições de elegibilidade, jogos participantes, disponibilidade e procedimento de resgate antes de confirmar qualquer benefício.",
    note: "A disponibilidade dos ingressos e as regras de resgate precisam ser confirmadas. Esta página ainda não emite ingressos nem realiza cobrança.",
    acceptLabel: "CONTINUAR",
    next: "/obrigado",
    decline: "/obrigado",
  },
};

function UpsellPage() {
  const { slug } = Route.useParams();
  const offer = offers[slug];

  if (slug === "obrigado") {
    return (
      <main className="min-h-[100svh] bg-white px-3 py-3 sm:px-4 sm:py-4">
        <PageHeader />
        <section className="mx-auto flex min-h-[60svh] w-full max-w-md flex-col items-center justify-center px-3 py-10 text-center">
          <div className="text-6xl">💚</div>
          <h1 className="mt-5 text-3xl font-black text-[#075b32]">Obrigado, torcedor!</h1>
          <p className="mt-3 text-base leading-relaxed text-slate-700">As etapas desta experiência foram concluídas. Consulte as confirmações do seu pedido e os canais oficiais para acompanhar a entrega.</p>
          <Button onClick={() => { window.location.assign("/"); }} className="mt-7 h-14 w-full rounded-xl text-base font-black">VOLTAR AO INÍCIO</Button>
        </section>
        <PageFooter />
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-[100svh] bg-white px-3 py-3 sm:px-4 sm:py-4">
        <PageHeader />
        <section className="mx-auto flex min-h-[55svh] max-w-md flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-black text-[#075b32]">Página não encontrada</h1>
          <Button onClick={() => { window.location.assign("/"); }} className="mt-5">Voltar ao início</Button>
        </section>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-white px-3 py-3 sm:px-4 sm:py-4">
      <PageHeader />
      <section className="mx-auto w-full max-w-md pb-6 pt-5 sm:pb-8 sm:pt-7">
        <div className="rounded-2xl border border-emerald-900/10 bg-white p-5 text-center shadow-[0_12px_36px_rgba(4,55,31,0.10)]">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#075b32]">{offer.eyebrow}</span>
          <h1 className="mt-4 text-2xl font-black leading-tight text-[#075b32] sm:text-3xl">{offer.title}</h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">{offer.description}</p>
          {offer.price && <div className="mx-auto mt-5 max-w-[260px] rounded-xl border-2 border-emerald-600 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#075b32]">Valor da opção</p>
            <p className="mt-1 text-3xl font-black text-[#087a45]">{offer.price}</p>
          </div>}
          {offer.note && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">{offer.note}</p>}
        </div>
        <div className="mt-5 space-y-3">
          <Button onClick={() => { window.location.assign(offer.next); }} className="h-14 w-full rounded-xl text-sm font-black uppercase tracking-wide shadow-lg">{offer.acceptLabel}</Button>
          <Button variant="ghost" onClick={() => { window.location.assign(offer.decline); }} className="h-11 w-full text-sm font-semibold text-slate-500">
            Não, obrigado. Continuar
          </Button>
        </div>
      </section>
      <PageFooter />
    </main>
  );
}

function PageHeader() {
  return <header className="mx-auto flex min-h-[72px] w-full max-w-md items-center justify-center bg-[#087a45] px-4 sm:min-h-[86px]">
    <img src={logo} alt="Escudo do Palmeiras" className="h-14 w-14 object-contain sm:h-[68px] sm:w-[68px]" />
  </header>;
}

function PageFooter() {
  return <footer className="mx-auto mt-6 flex min-h-[74px] w-full max-w-md flex-col items-center justify-center gap-1 bg-[#087a45] px-4 py-3 text-center text-white">
    <img src={logo} alt="Escudo do Palmeiras" className="h-10 w-10 object-contain" />
    <span className="text-xs font-medium text-white/90">Todos os direitos reservados.</span>
  </footer>;
}

export const Route = createFileRoute("/$slug")({
  component: UpsellPage,
});
