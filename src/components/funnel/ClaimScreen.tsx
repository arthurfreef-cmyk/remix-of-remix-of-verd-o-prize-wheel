import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Prize } from "@/data/funnel";

export function ClaimScreen({ prize, onDone }: { prize: Prize; onDone: () => void }) {
  const [form, setForm] = useState({ nome: "", email: "", cep: "" });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onDone();
  };
  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} type={type} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  );
  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 px-6 py-8">
      <h2 className="text-center text-2xl font-bold uppercase text-foreground">Resgate seu prêmio</h2>
      <p className="text-center text-sm text-muted-foreground">Prêmio: <strong className="text-primary">{prize.name}</strong></p>
      {field("nome", "Nome completo")}
      {field("email", "E-mail", "email")}
      {field("cep", "CEP")}
      <Button type="submit" size="lg" className="h-14 w-full text-lg font-bold uppercase font-display">Confirmar resgate</Button>
    </form>
  );
}
