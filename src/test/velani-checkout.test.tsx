import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeliveryScreen } from "@/components/funnel/DeliveryScreen";
import { ClaimScreen } from "@/components/funnel/ClaimScreen";
import { checkoutInputSchema, SHIPPING_AMOUNT } from "@/lib/velani";
import { buildShippingCharge } from "@/lib/velani.server";

const api = vi.hoisted(() => ({ prepare: vi.fn(), create: vi.fn(), status: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (fn: unknown) => fn }));
vi.mock("@/lib/velani.functions", () => ({
  prepareVelaniCheckout: api.prepare, createVelaniPayment: api.create, getVelaniPaymentStatus: api.status,
}));
const prize = { id: 0, label: "Camisa I", name: "Camisa Palmeiras Puma I 26/27", emoji: "👕", isLoss: false };
const pix = { token: "test-receipt", pixCode: "test-pix-code", expiresAt: "2099-01-01T12:00:00.000Z", status: "pending" as const };
function showDelivery() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  render(<QueryClientProvider client={client}><DeliveryScreen prize={prize} customerName="Arthur Vitorino" /></QueryClientProvider>);
}
beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
  api.prepare.mockResolvedValue({ ok: true, data: "test-intent" });
  api.create.mockResolvedValue({ ok: true, data: pix });
  api.status.mockResolvedValue({ ok: true, data: "pending" });
});
afterEach(cleanup);

describe("checkout Velani", () => {
  it("cobra 3782 centavos no servidor, sem aceitar valor enviado pelo navegador", () => {
    const input = checkoutInputSchema.parse({ customerName: "Arthur Vitorino", prizeId: 0, size: "M", amount: 1 });
    const charge = buildShippingCharge(input, "test-order");
    expect(SHIPPING_AMOUNT).toBe(3782);
    expect(charge.amount).toBe(3782);
    expect(charge.items[0]?.unitPrice).toBe(3782);
  });
  it("não cria pagamento sem um tamanho selecionado", () => {
    showDelivery();
    fireEvent.click(screen.getByRole("button", { name: "PAGAR FRETE" }));
    expect(api.prepare).not.toHaveBeenCalled();
    expect(api.create).not.toHaveBeenCalled();
  });
  it("envia nome, prêmio e tamanho; somente consulta validada confirma pagamento", async () => {
    // Even a paid field in the creation response is not enough for client confirmation.
    api.create.mockResolvedValue({ ok: true, data: { ...pix, status: "paid" } });
    showDelivery();
    fireEvent.click(screen.getByRole("button", { name: /^M$/ }));
    fireEvent.click(screen.getByRole("button", { name: "PAGAR FRETE" }));
    await waitFor(() => expect(api.prepare).toHaveBeenCalledWith({ data: { customerName: "Arthur Vitorino", prizeId: 0, size: "M" } }));
    expect(api.create).toHaveBeenCalledWith({ data: { token: "test-intent" } });
    await screen.findByLabelText("Código PIX copia e cola");
    expect(screen.queryByText("Pagamento confirmado")).toBeNull();
    api.status.mockResolvedValue({ ok: true, data: "paid" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Verificar pagamento" }).hasAttribute("disabled")).toBe(false));
    fireEvent.click(screen.getByRole("button", { name: "Verificar pagamento" }));
    await screen.findByText("Pagamento confirmado");
  });
  it("reutiliza o mesmo pedido após falha ao gerar o PIX", async () => {
    api.create.mockResolvedValueOnce({ ok: false, error: "Falha temporária", status: 503 });
    showDelivery();
    fireEvent.click(screen.getByRole("button", { name: /^G$/ }));
    fireEvent.click(screen.getByRole("button", { name: "PAGAR FRETE" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "PAGAR FRETE" }));
    await screen.findByLabelText("Código PIX copia e cola");
    expect(api.prepare).toHaveBeenCalledTimes(1);
    expect(api.create).toHaveBeenCalledTimes(2);
    expect(api.create.mock.calls[0]).toEqual(api.create.mock.calls[1]);
  });
  it("preserva o nome informado no resgate para a etapa de pagamento", () => {
    const onDone = vi.fn();
    render(<ClaimScreen prize={prize} onDone={onDone} />);
    fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "  Arthur Vitorino  " } });
    const button = screen.getByRole("button", { name: "Continuar com o resgate" });
    const form = button.closest("form");
    if (!form) throw new Error("Claim form missing");
    fireEvent.submit(form);
    expect(onDone).toHaveBeenCalledWith("Arthur Vitorino");
  });
});