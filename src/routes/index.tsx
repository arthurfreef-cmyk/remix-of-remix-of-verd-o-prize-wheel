import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/funnel/Header";
import { HomeScreen } from "@/components/funnel/HomeScreen";
import { QuizScreen } from "@/components/funnel/QuizScreen";
import { AnalysisScreen } from "@/components/funnel/AnalysisScreen";
import { WheelScreen } from "@/components/funnel/WheelScreen";
import { ResultScreen } from "@/components/funnel/ResultScreen";
import { ClaimScreen } from "@/components/funnel/ClaimScreen";
import { Button } from "@/components/ui/button";
import type { Prize } from "@/data/funnel";
import { questions } from "@/data/funnel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desafio do Verdão — Roleta Premiada" },
      { name: "description", content: "Responda o quiz do Palmeiras e gire a roleta para ganhar camisas oficiais." },
      { property: "og:title", content: "Desafio do Verdão — Roleta Premiada" },
      { property: "og:description", content: "Responda o quiz do Palmeiras e gire a roleta para ganhar camisas oficiais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Step = "home" | "quiz" | "analysis" | "not-qualified" | "wheel" | "result" | "claim" | "done";

function Index() {
  const [step, setStep] = useState<Step>("home");
  const [prize, setPrize] = useState<Prize | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {step === "home" && <HomeScreen onStart={() => { setQuizScore(0); setStep("quiz"); }} />}
      {step === "quiz" && <QuizScreen onComplete={(score) => { setQuizScore(score); setStep("analysis"); }} />}
      {step === "analysis" && (
        <AnalysisScreen
          score={quizScore}
          total={questions.length}
          onFinish={(qualified) => setStep(qualified ? "wheel" : "not-qualified")}
        />
      )}
      {step === "not-qualified" && (
        <main className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-md flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-4 text-6xl">💚</div>
          <h1 className="text-3xl font-extrabold text-primary">Quase lá!</h1>
          <p className="mt-4 text-lg text-foreground">
            Você acertou <strong>{quizScore} de {questions.length}</strong> perguntas. É necessário acertar pelo menos 3 para liberar a roleta.
          </p>
          <Button onClick={() => { setQuizScore(0); setStep("quiz"); }} size="lg" className="mt-7 h-14 w-full text-lg font-bold uppercase">
            Tentar novamente
          </Button>
        </main>
      )}
      {step === "wheel" && <WheelScreen onWin={(p) => { setPrize(p); setStep("result"); }} />}
      {step === "result" && prize && <ResultScreen prize={prize} score={quizScore} total={questions.length} onClaim={() => setStep("claim")} />}
      {step === "claim" && prize && <ClaimScreen prize={prize} onDone={() => setStep("done")} />}
      {step === "done" && (
        <div className="mx-auto max-w-md animate-pop-in space-y-4 px-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl">✅</div>
          <h2 className="text-2xl font-bold uppercase text-foreground">Resgate confirmado!</h2>
          <p className="text-muted-foreground">Entraremos em contato para combinar o envio do seu prêmio. Avanti, Palestra! 💚</p>
        </div>
      )}
    </div>
  );
}
