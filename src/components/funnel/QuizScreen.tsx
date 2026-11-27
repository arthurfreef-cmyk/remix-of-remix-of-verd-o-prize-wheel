import { useState } from "react";
import { questions } from "@/data/funnel";
import { cn } from "@/lib/utils";
import { playCorrect } from "@/lib/sounds";

export function QuizScreen({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const q = questions[current];
  if (!q) return null;

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setScore((value) => value + 1);
      playCorrect();
    }
    setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        if (current < questions.length - 1) {
          setCurrent((c) => c + 1);
          setSelected(null);
          setLeaving(false);
        } else {
          onComplete(score + (isCorrect ? 1 : 0));
        }
      }, 300);
    }, 700);
  };

  return (
    <div className={cn("mx-auto max-w-md px-6 py-8 transition-all duration-300", leaving ? "-translate-x-12 opacity-0" : "opacity-100")}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pergunta {current + 1} de {questions.length}
        </p>
        <p className="rounded-full bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary">
          ⭐ {score} {score === 1 ? "acerto" : "acertos"}
        </p>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <h2 className="mb-8 mt-2 text-center text-2xl font-bold text-foreground">{q.question}</h2>
      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          const isCorrectOption = idx === q.correctIndex;
          const wasSelected = selected === idx;
          return (
            <button
              key={opt}
              onClick={() => choose(idx)}
              disabled={selected !== null}
              className={cn(
                "w-full rounded-lg border-2 px-6 py-4 text-base font-semibold transition-all",
                selected === null && "border-primary bg-primary text-primary-foreground hover:scale-[1.02]",
                selected !== null && isCorrectOption && "border-emerald-500 bg-emerald-500 text-white",
                selected !== null && wasSelected && !isCorrectOption && "border-red-500 bg-red-500 text-white",
                selected !== null && !wasSelected && !isCorrectOption && "border-primary/30 bg-primary/20 text-foreground/70",
              )}
            >
              {opt} {selected !== null && isCorrectOption && "✓"} {wasSelected && !isCorrectOption && "✕"}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {questions.map((_, i) => (
          <div key={i} className={cn("h-2 w-8 rounded-full transition-colors", i <= current ? "bg-primary" : "bg-border")} />
        ))}
      </div>
    </div>
  );
}
