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
  bid1pct: z.number(),
  ask1pct: z.number(),
  bid5pct: z.number(),
  ask5pct: z.number(),
});

export const NormalizedOrderbookSchema = z.object({
  exchange: ExchangeSchema,
  symbol: z.string(),
  timestamp: z.number().int().positive(),
  bids: z.array(PriceLevelSchema),
  asks: z.array(PriceLevelSchema),
  midPrice: z.number().positive(),
  spread: z.number(),
  spreadBps: z.number(),
  imbalance: z.number(),
  depth: OrderbookDepthSchema,
});

export const NormalizedFundingSchema = z.object({
  exchange: ExchangeSchema,
  symbol: z.string(),
  timestamp: z.number().int().positive(),
  rate: z.number(),
  nextFundingTime: z.number().int(),
  aggregatedRate: z.number().optional(),
  zScore: z.number().optional(),
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
});

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

