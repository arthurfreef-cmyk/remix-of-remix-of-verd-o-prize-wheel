import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Header } from "@/components/funnel/Header";
import { HomeScreen } from "@/components/funnel/HomeScreen";
let quizScreenPromise: Promise<typeof import("@/components/funnel/QuizScreen")> | undefined;
const loadQuizScreen = () => (quizScreenPromise ??= import("@/components/funnel/QuizScreen"));
const QuizScreen = lazy(() => loadQuizScreen().then((m) => ({ default: m.QuizScreen })));
import { AnalysisScreen } from "@/components/funnel/AnalysisScreen";
import { WheelScreen } from "@/components/funnel/WheelScreen";
import { ResultScreen } from "@/components/funnel/ResultScreen";
import { ClaimScreen } from "@/components/funnel/ClaimScreen";
import { LoadingScreen } from "@/components/funnel/LoadingScreen";
import { DeliveryScreen } from "@/components/funnel/DeliveryScreen";
import { Button } from "@/components/ui/button";
import type { Prize } from "@/data/funnel";
import { questions } from "@/data/funnel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desafio do Verdão — Roleta Premiada" },
      { name: "description", content: "Responda ao desafio e descubra o resultado da roleta." },
      { property: "og:title", content: "Desafio do Verdão — Roleta Premiada" },
      { property: "og:description", content: "Responda ao desafio e descubra o resultado da roleta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Step = "home" | "quiz" | "analysis" | "not-qualified" | "wheel" | "result" | "claim" | "loading" | "delivery";

function Index() {
  const [step, setStep] = useState<Step>("home");
  const [prize, setPrize] = useState<Prize | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  return (
    <div className="min-h-screen bg-background">
      {step !== "analysis" && step !== "loading" && step !== "delivery" && <Header />}
      {step === "home" && <HomeScreen onPrefetch={() => { void loadQuizScreen(); }} onStart={() => { void loadQuizScreen(); setQuizScore(0); setStep("quiz"); }} />}
      {step === "quiz" && (
        <Suspense fallback={<main className="mx-auto flex min-h-[60svh] max-w-md items-center justify-center px-6"><p className="text-base font-semibold text-primary">Preparando o desafio...</p></main>}>
          <QuizScreen onComplete={(score) => { setQuizScore(score); setStep("analysis"); }} />
        </Suspense>
      )}
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
      {step === "wheel" && <WheelScreen score={quizScore} onWin={(p) => { setPrize(p); setStep("result"); }} />}
      {step === "result" && prize && <ResultScreen prize={prize} score={quizScore} total={questions.length} onClaim={() => setStep("claim")} />}
      {step === "claim" && prize && <ClaimScreen prize={prize} onDone={(name) => { setCustomerName(name); setStep("loading"); }} />}
      {step === "loading" && <LoadingScreen onFinish={() => setStep("delivery")} />}
      {step === "delivery" && prize && <DeliveryScreen prize={prize} customerName={customerName} />}
    </div>
  );
}
