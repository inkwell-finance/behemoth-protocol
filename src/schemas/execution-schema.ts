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
  asset: z.string().min(1).max(50),
  side: OrderSideSchema,
  size: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  type: OrderTypeSchema,
  limitPrice: z.number().positive().refine(Number.isFinite, 'Must be finite').optional(),
  stopPrice: z.number().positive().refine(Number.isFinite, 'Must be finite').optional(),
  timeInForce: TimeInForceSchema,
  reduceOnly: z.boolean(),
  maxSlippageBps: z.number().min(0).refine(Number.isFinite, 'Must be finite'),
  preferredVenue: ExchangeSchema.optional(),
  allowSplit: z.boolean(),
  createdAt: z.number().int().positive().refine(Number.isFinite, 'Must be finite'),
  status: OrderStatusSchema,
});

export const FillSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  strategyId: z.string(),
  exchange: ExchangeSchema,
  symbol: z.string().min(1).max(50),
  timestamp: z.number().int().positive().refine(Number.isFinite, 'Must be finite'),
  side: OrderSideSchema,
  size: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  price: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  fee: z.number().nonnegative().refine(Number.isFinite, 'Must be finite').optional(),
  feeCurrency: z.string().optional(),
  isMaker: z.boolean().optional(),
});

export const PositionSchema = z.object({
  id: z.string(),
  strategyId: z.string(),
  exchange: ExchangeSchema,
  symbol: z.string().min(1).max(50),
  side: PositionSideSchema,
  size: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  entryPrice: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  currentPrice: z.number().positive().refine(Number.isFinite, 'Must be finite').optional(),
  unrealizedPnl: z.number().refine(Number.isFinite, 'Must be finite').optional(),
  margin: z.number().refine(Number.isFinite, 'Must be finite').optional(),
  leverage: z.number().positive().refine(Number.isFinite, 'Must be finite').optional(),
  openedAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
  closedAt: z.number().int().refine(Number.isFinite, 'Must be finite').optional(),
  status: PositionStatusSchema,
}).refine(p => p.closedAt === undefined || p.closedAt >= p.openedAt,
  { message: 'closedAt must be >= openedAt' }
);

export const TrailingStopSchema = z.object({
  positionId: z.string(),
  symbol: z.string().min(1).max(50),
  side: PositionSideSchema,
  initialPrice: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  currentStopPrice: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  trailDistancePct: z.number().min(0).max(100).refine(Number.isFinite, 'Must be finite'),
  highWaterMark: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  lastUpdated: z.number().int().refine(Number.isFinite, 'Must be finite'),
});

export const ChildOrderSchema = z.object({
  orderId: z.string(),
  exchange: ExchangeSchema,
  size: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  limitPrice: z.number().positive().refine(Number.isFinite, 'Must be finite'),
  status: OrderStatusSchema,
});

export const RoutedOrderSchema = z.object({
  parentOrderId: z.string(),
  childOrders: z.array(ChildOrderSchema),
  expectedSlippage: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  expectedFees: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
});

// Type inference
export type OrderInput = z.infer<typeof OrderSchema>;
export type FillInput = z.infer<typeof FillSchema>;
export type PositionInput = z.infer<typeof PositionSchema>;

