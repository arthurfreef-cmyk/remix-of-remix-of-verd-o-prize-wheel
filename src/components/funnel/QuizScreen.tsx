import { useState } from "react";
import { questions } from "@/data/funnel";
import { cn } from "@/lib/utils";
import { playCorrect } from "@/lib/sounds";

export function QuizScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const q = questions[current];
  if (!q) return null;

  const choose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    playCorrect();
    setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        if (current < questions.length - 1) {
          setCurrent((c) => c + 1);
          setSelected(null);
          setLeaving(false);
        } else onComplete();
      }, 300);
    }, 700);
  };

  return (
    <div className={cn("mx-auto max-w-md px-6 py-8 transition-all duration-300", leaving ? "-translate-x-12 opacity-0" : "opacity-100")}>
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Pergunta {current + 1} de {questions.length}
      </p>
      <h2 className="mb-8 mt-2 text-center text-2xl font-bold text-foreground">{q.question}</h2>
      <div className="space-y-3">
        {q.options.map((opt, idx) => (
          <button
            key={opt}
            onClick={() => choose(idx)}
            disabled={selected !== null}
            className={cn(
              "w-full rounded-lg border-2 px-6 py-4 text-base font-semibold transition-all",
              selected === null && "border-primary bg-primary text-primary-foreground hover:scale-[1.02]",
              selected === idx && "scale-[1.03] border-gold bg-gold text-gold-foreground",
              selected !== null && selected !== idx && "border-primary/40 bg-primary/40 text-primary-foreground/70",
            )}
          >
            {opt} {selected === idx && "✓"}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {questions.map((_, i) => (
          <div key={i} className={cn("h-2 w-8 rounded-full transition-colors", i <= current ? "bg-primary" : "bg-border")} />
        ))}
      </div>
    </div>
  );
}
