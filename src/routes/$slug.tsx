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
    eyebrow: "OFERTA ADICIONAL DE ENVIO",
    title: "Adicione o complemento de envio",
    description: "Inclua este complemento opcional ao envio da sua camisa. O valor é apresentado separadamente e não substitui nem altera a taxa de frete já informada no pedido.",
    price: "R$ 17,56",
    note: "A contratação desta opção dependerá da confirmação do pagamento na etapa de checkout.",
    acceptLabel: "ADICIONAR AO MEU PEDIDO",
    next: "/upsell-nota-fiscal",
    decline: "/upsell-nota-fiscal",
  },
  "upsell-nota-fiscal": {
    eyebrow: "PROTEÇÃO OPCIONAL DO PRODUTO",
    title: "Nota Fiscal de Garantia do Produto",
    description: "Adquira a proteção adicional de garantia para o produto principal. As condições, o prazo de cobertura, os itens cobertos e o procedimento para solicitar atendimento deverão constar no certificado de garantia entregue após a contratação.",
    price: "R$ 25,34",
    note: "Oferta adicional independente da nota fiscal obrigatória da compra. A cobertura só será válida após a configuração dos termos e a confirmação do pagamento.",
    acceptLabel: "ADQUIRIR GARANTIA",
    next: "/upsell-camisa",
    decline: "/upsell-camisa",
  },
  "upsell-camisa": {
    eyebrow: "OFERTA EXCLUSIVA",
    title: "Adicione mais uma camisa do Palmeiras",
    description: "Aproveite esta etapa para incluir uma segunda camisa no seu pedido, além da camisa que você já resgatou.",
    price: "R$ 127,00",
    note: "Seleção de modelo e tamanho, disponibilidade de estoque e pagamento serão configurados no checkout desta oferta.",
    acceptLabel: "QUERO ADICIONAR OUTRA CAMISA",
    next: "/upsell-nota-fiscal-camisa",
    decline: "/upsell-nota-fiscal-camisa",
  },
  "upsell-nota-fiscal-camisa": {
    eyebrow: "PROTEÇÃO OPCIONAL",
    title: "Nota Fiscal de Garantia da Camisa Adicional",
    description: "Adicione a proteção adicional de garantia para a camisa extra. O certificado deverá apresentar claramente o prazo, a cobertura, as exclusões e como solicitar atendimento.",
    price: "R$ 25,34",
    note: "Esta é uma oferta de garantia adicional, separada da nota fiscal obrigatória da compra. A cobertura depende dos termos que serão publicados junto ao checkout.",
    acceptLabel: "ADQUIRIR GARANTIA DA CAMISA",
    next: "/vale-ingressos",
    decline: "/vale-ingressos",
  },
  "vale-ingressos": {
    eyebrow: "BENEFÍCIO DIGITAL",
    title: "Receba 4 ingressos virtuais",
    description: "Adquira o pacote com quatro ingressos virtuais para utilizar nos próximos quatro jogos elegíveis do Palmeiras. Os ingressos serão disponibilizados digitalmente após a confirmação da contratação, conforme calendário, disponibilidade e regras de resgate.",
    note: "Antes de ativar a venda, configure os jogos elegíveis, a forma de emissão e entrega dos ingressos virtuais, os prazos e as regras de utilização.",
    acceptLabel: "QUERO OS 4 INGRESSOS VIRTUAIS",
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
