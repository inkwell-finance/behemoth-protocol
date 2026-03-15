/**
 * Zod schemas for market types validation.
 */

import { z } from 'zod';

export const ExchangeSchema = z.enum(['hyperliquid', 'binance', 'drift']);
export const SectorSchema = z.enum(['defi', 'l1', 'l2', 'gaming', 'ai', 'meme', 'other']);
export const TimeframeSchema = z.enum(['1s', '1m', '5m', '15m', '1h', '4h', '1d']);
export const TradeBucketSchema = z.enum(['micro', 'small', 'medium', 'large', 'whale']);
export const TradeSideSchema = z.enum(['buy', 'sell']);

export const PriceLevelSchema = z.tuple([z.number(), z.number()]);

export const NormalizedTradeSchema = z.object({
  id: z.string(),
  exchange: ExchangeSchema,
  symbol: z.string(),
  timestamp: z.number().int().positive(),
  price: z.number().positive(),
  size: z.number().positive(),
  side: TradeSideSchema,
  isLiquidation: z.boolean(),
  bucket: TradeBucketSchema,
});

export const OrderbookDepthSchema = z.object({
  bid1pct: z.number().nonnegative(),
  ask1pct: z.number().nonnegative(),
  bid5pct: z.number().nonnegative(),
  ask5pct: z.number().nonnegative(),
});

export const NormalizedOrderbookSchema = z.object({
  exchange: ExchangeSchema,
  symbol: z.string(),
  timestamp: z.number().int().positive(),
  bids: z.array(PriceLevelSchema).min(1),
  asks: z.array(PriceLevelSchema).min(1),
  midPrice: z.number().positive(),
  spread: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  spreadBps: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  imbalance: z.number().min(-1).max(1).refine(Number.isFinite, 'Must be finite'),
  depth: OrderbookDepthSchema,
});

export const NormalizedFundingSchema = z.object({
  exchange: ExchangeSchema,
  symbol: z.string(),
  timestamp: z.number().int().positive(),
  rate: z.number().min(-1.0).max(1.0),
  nextFundingTime: z.number().int(),
  aggregatedRate: z.number().optional(),
  zScore: z.number().min(-10).max(10).optional(),
});

export const CandleSchema = z.object({
  exchange: ExchangeSchema,
  symbol: z.string(),
  timeframe: TimeframeSchema,
  timestamp: z.number().int().positive(),
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().min(0),
  tradeCount: z.number().int().optional(),
});

export const OHLCVSchema = z.object({
  timestamp: z.number().int(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
}).refine(d => d.high >= d.low && d.high >= d.open && d.high >= d.close
             && d.low <= d.open && d.low <= d.close,
  { message: 'OHLCV relationship violated' }
);

export const PriceTickSchema = z.object({
  symbol: z.string(),
  exchange: ExchangeSchema,
  price: z.number().positive(),
  timestamp: z.number().int().positive(),
});

// Type inference
export type NormalizedTradeInput = z.infer<typeof NormalizedTradeSchema>;
export type NormalizedOrderbookInput = z.infer<typeof NormalizedOrderbookSchema>;
export type CandleInput = z.infer<typeof CandleSchema>;

