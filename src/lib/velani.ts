import { z } from "zod";

export const SHIPPING_AMOUNT = 3782;
export const SHIPPING_LABEL = "R$ 37,82";
export const shirtSizes = ["P", "M", "G", "GG", "G1"] as const;
export const checkoutInputSchema = z.object({
  customerName: z.string().trim().min(3).max(120),
  prizeId: z.union([z.literal(0), z.literal(2), z.literal(3), z.literal(4)]),
  size: z.enum(shirtSizes),
});
export const paymentStatusSchema = z.enum(["pending", "processing", "paid", "failed", "expired", "refunded"]);
export const paymentSchema = z.object({
  token: z.string(),
  pixCode: z.string().min(1),
  expiresAt: z.string().datetime(),
  status: paymentStatusSchema,
});
export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
export type PixPayment = z.infer<typeof paymentSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentResult<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

export const intentSchema = checkoutInputSchema.extend({ kind: z.literal("checkout"), key: z.string().uuid(), exp: z.number() });
export const receiptSchema = z.object({ kind: z.literal("receipt"), id: z.string().uuid(), exp: z.number() });