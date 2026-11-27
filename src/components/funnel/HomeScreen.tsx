import { Button } from "@/components/ui/button";
import hero from "@/assets/palmeiras-campeao-2026.jpg";

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-md space-y-6 px-6 py-8 text-center">
      <h1 className="text-3xl font-bold uppercase leading-tight text-foreground">
        Desafio do Verdão 🏆
      </h1>
      <img src={hero} alt="Torcida do Palmeiras comemorando" className="w-full rounded-xl object-cover shadow-lg" fetchPriority="high" />
      <p className="font-semibold leading-relaxed text-foreground">
        Mostre que você é palmeirense raiz! Responda 5 perguntas sobre o Verdão e ganhe o direito de girar a
        <span className="text-primary"> Roleta Premiada</span>.
      </p>
      <p className="text-sm text-muted-foreground">Camisas oficiais e bola oficial esperando por você.</p>
      <Button onClick={onStart} size="lg" className="h-14 w-full text-xl font-bold uppercase tracking-wider font-display animate-pulse-glow">
        Começar
      </Button>
    </div>
  );
}
