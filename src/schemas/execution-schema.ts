/**
 * Zod schemas for execution types validation.
 */

import { z } from 'zod';
import { ExchangeSchema } from './market-schema';

export const OrderStatusSchema = z.enum(['pending', 'open', 'filled', 'cancelled', 'rejected']);
export const TimeInForceSchema = z.enum(['gtc', 'ioc', 'fok']);
export const OrderTypeSchema = z.enum(['market', 'limit', 'stop_limit']);
export const OrderSideSchema = z.enum(['buy', 'sell']);
export const PositionSideSchema = z.enum(['long', 'short']);
export const PositionStatusSchema = z.enum(['open', 'closed', 'liquidated']);

export const OrderSchema = z.object({
  id: z.string(),
  strategyId: z.string(),
  asset: z.string(),
  side: OrderSideSchema,
  size: z.number().positive(),
  type: OrderTypeSchema,
  limitPrice: z.number().positive().optional(),
  stopPrice: z.number().positive().optional(),
  timeInForce: TimeInForceSchema,
  reduceOnly: z.boolean(),
  maxSlippageBps: z.number().min(0),
  preferredVenue: ExchangeSchema.optional(),
  allowSplit: z.boolean(),
  createdAt: z.number().int(),
  status: OrderStatusSchema,
});

export const FillSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  strategyId: z.string(),
  exchange: ExchangeSchema,
  symbol: z.string(),
  timestamp: z.number().int().positive(),
  side: OrderSideSchema,
  size: z.number().positive(),
  price: z.number().positive(),
  fee: z.number().optional(),
  feeCurrency: z.string().optional(),
  isMaker: z.boolean().optional(),
});

export const PositionSchema = z.object({
  id: z.string(),
  strategyId: z.string(),
  exchange: ExchangeSchema,
  symbol: z.string(),
  side: PositionSideSchema,
  size: z.number().positive(),
  entryPrice: z.number().positive(),
  currentPrice: z.number().positive().optional(),
  unrealizedPnl: z.number().optional(),
  margin: z.number().optional(),
  leverage: z.number().positive().optional(),
  openedAt: z.number().int(),
  closedAt: z.number().int().optional(),
  status: PositionStatusSchema,
});

export const TrailingStopSchema = z.object({
  positionId: z.string(),
  symbol: z.string(),
  side: PositionSideSchema,
  initialPrice: z.number().positive(),
  currentStopPrice: z.number().positive(),
  trailDistancePct: z.number().min(0).max(100),
  highWaterMark: z.number().positive(),
  lastUpdated: z.number().int(),
});

export const ChildOrderSchema = z.object({
  orderId: z.string(),
  exchange: ExchangeSchema,
  size: z.number().positive(),
  limitPrice: z.number().positive(),
  status: OrderStatusSchema,
});

export const RoutedOrderSchema = z.object({
  parentOrderId: z.string(),
  childOrders: z.array(ChildOrderSchema),
  expectedSlippage: z.number(),
  expectedFees: z.number(),
});

// Type inference
export type OrderInput = z.infer<typeof OrderSchema>;
export type FillInput = z.infer<typeof FillSchema>;
export type PositionInput = z.infer<typeof PositionSchema>;

