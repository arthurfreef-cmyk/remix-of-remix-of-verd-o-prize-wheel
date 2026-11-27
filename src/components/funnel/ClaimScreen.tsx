import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, ShieldCheck } from "lucide-react";
import type { Prize } from "@/data/funnel";

type AddressForm = {
  nome: string;
  cep: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
};

export function ClaimScreen({ prize, onDone }: { prize: Prize; onDone: () => void }) {
  const [form, setForm] = useState<AddressForm>({
    nome: "",
    cep: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepMessage, setCepMessage] = useState("");
  const [cepError, setCepError] = useState("");

  useEffect(() => {
    const digits = form.cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setCepMessage("");
      setCepError("");
      return;
    }

    const controller = new AbortController();
    setLoadingCep(true);
    setCepError("");
    setCepMessage("");

    fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível consultar o CEP.");
        return response.json();
      })
      .then((data) => {
        if (data.erro) {
          setCepError("CEP não encontrado. Confira os números digitados.");
          return;
        }
        setForm((current) => ({
          ...current,
          rua: data.logradouro || current.rua,
          cidade: data.localidade || current.cidade,
          estado: data.uf || current.estado,
        }));
        setCepMessage("Endereço encontrado e preenchido automaticamente.");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setCepError("Não foi possível consultar agora. Preencha o endereço manualmente.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCep(false);
      });

    return () => controller.abort();
  }, [form.cep]);

  const update = (key: keyof AddressForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    update("cep", digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onDone();
  };

  const field = (key: keyof AddressForm, label: string, placeholder: string, onChange?: (value: string) => void) => (
    <div className="space-y-1.5 text-left">
      <Label htmlFor={key} className="font-semibold text-slate-700">{label}</Label>
      <Input
        id={key}
        name={key}
        required
        autoComplete={key === "nome" ? "name" : key === "rua" ? "street-address" : key === "numero" ? "address-line2" : key === "cidade" ? "address-level2" : key === "estado" ? "address-level1" : "postal-code"}
        placeholder={placeholder}
        value={form[key]}
        onChange={(event) => onChange ? onChange(event.target.value) : update(key, event.target.value)}
        className="h-12 rounded-xl border-slate-300 bg-white text-base"
      />
    </div>
  );

  return (
    <main className="min-h-[calc(100svh-5rem)] bg-gradient-to-b from-[#f4f8f5] to-white px-3 py-4 sm:px-4 sm:py-7">
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border sm:rounded-3xl border-emerald-900/10 bg-white shadow-[0_18px_55px_rgba(4,55,31,0.12)]">
        <header className="flex flex-col items-center bg-gradient-to-r from-[#06452b] to-[#087a45] px-4 py-4 text-center sm:px-6 sm:py-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-100">Desafio do Verdão</p>
          <h1 className="mt-1 text-xl sm:text-2xl font-black uppercase">Resgate seu prêmio</h1>
          <p className="mt-1 text-sm text-white/85">Só falta informar os dados para continuar.</p>
        </header>

        <form onSubmit={submit} className="space-y-4 p-4 sm:space-y-5 sm:p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-800/10 bg-emerald-50 p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
              {prize.image ? <img src={prize.image} alt={prize.name} loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-contain" /> : <span className="text-3xl">{prize.emoji}</span>}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-800/70">Prêmio selecionado</p>
              <p className="mt-0.5 font-extrabold leading-snug text-emerald-950">{prize.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            {field("nome", "Nome completo", "Digite seu nome completo")}
            <div className="space-y-1.5 text-left">
              <Label htmlFor="cep" className="font-semibold text-slate-700">CEP</Label>
              <div className="relative">
                <Input
                  id="cep"
                  name="cep"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  required
                  placeholder="00000-000"
                  value={form.cep}
                  onChange={(event) => handleCepChange(event.target.value)}
                  className="h-12 rounded-xl border-slate-300 bg-white pr-11 text-base"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700">
                  {loadingCep ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                </span>
              </div>
              {cepMessage && <p className="text-xs font-medium text-emerald-700">{cepMessage}</p>}
              {cepError && <p className="text-xs font-medium text-red-600">{cepError}</p>}
              <p className="text-xs text-slate-500">Digite os 8 números para preencher rua, cidade e estado automaticamente.</p>
            </div>

            {field("rua", "Rua", "Nome da rua")}
            <div className="grid grid-cols-[0.8fr_1.2fr] gap-2 sm:gap-3">
              {field("numero", "Número", "Nº")}
              {field("cidade", "Cidade", "Sua cidade")}
            </div>
            {field("estado", "Estado (UF)", "Ex.: SP")}
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs leading-relaxed text-slate-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            Confira se os dados de entrega estão corretos antes de continuar.
          </div>

          <Button type="submit" size="lg" className="h-14 w-full rounded-xl bg-[#087a45] text-base font-black uppercase tracking-wide text-white shadow-lg hover:bg-[#06683a]">
            Continuar com o resgate
          </Button>
        </form>
      </div>
    </main>
  );
}
