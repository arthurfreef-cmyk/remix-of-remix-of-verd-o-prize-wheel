import { Button } from "@/components/ui/button";

export function HomeScreen({ onStart, onPrefetch }: { onStart: () => void; onPrefetch: () => void }) {
  return (
    <main className="flex min-h-[calc(100svh-5rem)] flex-col bg-white text-center text-neutral-950">
      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-6 pb-8 pt-10 sm:pt-12">
        <h1 className="mb-5 text-[27px] font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
          VOCÊ QUER GANHAR UMA CAMISETA OFICIAL?
        </h1>

        <p className="mb-7 text-[19px] leading-[1.42]">
          O Verdão decidiu <strong>doar 300 camisetas oficiais</strong> para os torcedores que conseguirem provar que sabem sobre a história do Palmeiras!
        </p>

        <p className="mb-7 text-[19px] leading-[1.42]">
          Se você é torcedor raiz e quer provar os seus conhecimentos sobre o clube e ganhar um manto sagrado oficial, vai precisar acertar pelo menos 3 perguntas no nosso jogo de perguntas e respostas para provar que é torcedor alviverde!
        </p>

        <p className="mb-4 text-[19px] font-bold">clique no botão abaixo:</p>

        <Button
          onClick={onStart}
          onPointerEnter={onPrefetch}
          onFocus={onPrefetch}
          onTouchStart={onPrefetch}
          size="lg"
          className="h-[54px] w-full max-w-[320px] rounded-md bg-[#087A3D] text-lg font-semibold uppercase text-white shadow-sm hover:bg-[#066532]"
        >
          COMEÇAR JOGO
        </Button>

        <p className="mt-auto pt-12 text-[19px] font-extrabold">
          Serão apenas 300 camisetas!
        </p>
      </section>

      <footer className="w-full bg-[#075B32] px-4 py-3 text-center text-[16px] font-semibold text-white shadow-[0_-2px_0_#c9a24b]">
        Direitos reservados, Palmeiras
      </footer>
    </main>
  );
}
