import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { checkoutInputSchema, intentSchema, receiptSchema, paymentStatusSchema, SHIPPING_AMOUNT, type PaymentResult, type PixPayment, type PaymentStatus } from "./velani";
import { buildShippingCharge, requestVelani, signCapability, verifyCapability, VelaniError } from "./velani.server";

const tokenSchema = z.object({ token: z.string().min(10).max(4000) });

/** Public guest checkout: signed intent binds inputs and a server-generated retry key. */
export const prepareVelaniCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutInputSchema.parse(input))
  .handler(async ({ data }): Promise<PaymentResult<string>> => {
    const secret = process.env["VELANI_PAYMENT_SIGNING_SECRET"];
    if (!secret) return { ok: false, status: 503, error: "O pagamento ainda não está disponível." };
    return { ok: true, data: await signCapability({ ...data, kind: "checkout", key: crypto.randomUUID(), exp: Date.now() + 30 * 60 * 1000 }, secret) };
  });

export const createVelaniPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }): Promise<PaymentResult<PixPayment>> => {
    const secret = process.env["VELANI_PAYMENT_SIGNING_SECRET"];
    const gatewayKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["UDC_VELANI_PAGAMENTOS_API_KEY"];
    if (!secret || !gatewayKey || !connectionKey) return { ok: false, status: 503, error: "O pagamento ainda não está disponível." };
    try {
      const intent = intentSchema.parse(await verifyCapability(data.token, secret));
      const raw = await requestVelani("/v1/transactions", { gatewayKey, connectionKey }, buildShippingCharge(intent, intent.key), intent.key);
      const transaction = z.object({ id: z.string().uuid(), amount: z.literal(SHIPPING_AMOUNT), pixQrCode: z.string().min(1), expiresAt: z.string().datetime(), status: paymentStatusSchema }).parse(raw);
      const token = await signCapability({ kind: "receipt", id: transaction.id, exp: Date.now() + 24 * 60 * 60 * 1000 }, secret);
      return { ok: true, data: { token, pixCode: transaction.pixQrCode, expiresAt: transaction.expiresAt, status: transaction.status } };
    } catch (error) {
      return { ok: false, status: error instanceof VelaniError ? error.status : 400, error: error instanceof VelaniError ? error.message : "Não foi possível gerar o PIX. Tente novamente; a mesma cobrança será reutilizada." };
    }
  });

export const getVelaniPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }): Promise<PaymentResult<PaymentStatus>> => {
    const secret = process.env["VELANI_PAYMENT_SIGNING_SECRET"];
    const gatewayKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["UDC_VELANI_PAGAMENTOS_API_KEY"];
    if (!secret || !gatewayKey || !connectionKey) return { ok: false, status: 503, error: "A consulta de pagamento não está disponível." };
    try {
      const receipt = receiptSchema.parse(await verifyCapability(data.token, secret));
      const raw = await requestVelani(`/v1/transactions/${receipt.id}`, { gatewayKey, connectionKey });
      const transaction = z.object({ id: z.literal(receipt.id), amount: z.literal(SHIPPING_AMOUNT), status: paymentStatusSchema }).parse(raw);
      return { ok: true, data: transaction.status };
    } catch (error) {
      return { ok: false, status: error instanceof VelaniError ? error.status : 400, error: error instanceof VelaniError ? error.message : "Não foi possível confirmar o pagamento. Consulte novamente." };
    }
  });