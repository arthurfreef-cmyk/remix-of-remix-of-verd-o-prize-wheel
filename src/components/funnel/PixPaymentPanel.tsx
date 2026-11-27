import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Copy, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHIPPING_LABEL, type PixPayment, type PaymentStatus } from "@/lib/velani";

export interface PixPaymentPanelProps {
  payment: PixPayment;
  status: PaymentStatus;
  isChecking: boolean;
  statusError: string | undefined;
  onCheck: () => void;
}
const statusLabels: Record<PaymentStatus, string> = {
  pending: "Aguardando pagamento", processing: "Pagamento em processamento",
  paid: "Pagamento confirmado", expired: "PIX expirado", failed: "Pagamento não concluído", refunded: "Pagamento devolvido",
};

export function PixPaymentPanel({ payment, status, isChecking, statusError, onCheck }: PixPaymentPanelProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const payable = status === "pending" || status === "processing";
  const expiredByClock = Date.now() >= Date.parse(payment.expiresAt);
  const copy = async () => {
    try { await navigator.clipboard.writeText(payment.pixCode); setCopied(true); setCopyError(""); }
    catch { setCopyError("Não foi possível copiar automaticamente. Selecione e copie o código abaixo."); }
  };
  return (
    <section aria-label="Pagamento PIX" className="mt-5 space-y-4 border-t border-border pt-5 text-center">
      <div aria-live="polite" className="flex items-center justify-center gap-2 font-bold text-primary">
        {status === "paid" ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        {statusLabels[status]}
      </div>
      {status === "paid" ? (
        <p className="text-sm text-foreground">A Velani confirmou o pagamento do frete de {SHIPPING_LABEL}.</p>
      ) : payable ? (
        <>
          <h3 className="text-xl font-bold text-foreground">PIX · {SHIPPING_LABEL}</h3>
          {!expiredByClock && <div className="mx-auto aspect-square w-[220px] max-w-full rounded-lg bg-primary-foreground p-3">
            <QRCodeSVG value={payment.pixCode} size={196} marginSize={2} className="h-full w-full" title="QR Code para pagamento do frete" />
          </div>}
          <p className="text-xs text-muted-foreground">Válido até {new Date(payment.expiresAt).toLocaleString("pt-BR")}</p>
          {expiredByClock ? <p className="text-sm text-muted-foreground">O prazo do PIX terminou. Consulte o status antes de tentar outro pagamento.</p> : <>
            <textarea aria-label="Código PIX copia e cola" readOnly value={payment.pixCode} rows={3} onFocus={(event) => event.currentTarget.select()} className="w-full resize-none rounded-lg border border-input bg-background p-3 font-mono text-xs text-foreground" />
            <Button type="button" onClick={() => { void copy(); }} className="h-12 w-full gap-2">
              <Copy className="h-4 w-4" />{copied ? "Código copiado" : "Copiar código PIX"}
            </Button>
          </>}
          {copyError && <p role="alert" className="text-sm text-destructive">{copyError}</p>}
        </>
      ) : <p className="text-sm text-muted-foreground">{status === "expired" ? "Este código não aceita mais pagamentos." : "Consulte a Velani para verificar os detalhes desta transação."}</p>}
      {statusError && <p role="alert" className="text-sm text-destructive">{statusError}</p>}
      <Button type="button" variant="outline" disabled={isChecking} onClick={onCheck} className="h-11 w-full gap-2">
        {isChecking ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <RefreshCw className="h-4 w-4" />}
        {isChecking ? "Consultando pagamento..." : "Verificar pagamento"}
      </Button>
    </section>
  );
}