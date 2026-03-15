/**
 * Zod schemas for strategy types validation.
 */

import { z } from 'zod';

/**
 * Strategy signal schema - validated signal output from strategies.
 * Signal ranges from -1.0 to 1.0 (short to long).
 * Confidence ranges from 0.0 to 1.0.
 */
export const StrategySignalSchema = z.object({
  strategyId: z.string().min(1),
  symbol: z.string().min(1),
  timestamp: z.number().int().positive(),
  signal: z.number().min(-1).max(1).refine(Number.isFinite, 'Must be finite'),
  confidence: z.number().min(0).max(1).refine(Number.isFinite, 'Must be finite'),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Feature snapshot schema - market features used by strategies.
 * Nested validation matching FeatureSnapshot type structure.
 */
export const FeatureSnapshotSchema = z.object({
  symbol: z.string().min(1),
  timestamp: z.number().int().positive(),
  price: z.object({
    returns: z.record(z.number().refine(Number.isFinite, 'Must be finite')),
    ema: z.record(z.number().refine(Number.isFinite, 'Must be finite')),
    atr: z.record(z.number().refine(Number.isFinite, 'Must be finite')),
    bollingerBands: z.object({
      upper: z.number().refine(Number.isFinite, 'Must be finite'),
      middle: z.number().refine(Number.isFinite, 'Must be finite'),
      lower: z.number().refine(Number.isFinite, 'Must be finite'),
      width: z.number().refine(Number.isFinite, 'Must be finite'),
    }),
    donchianChannel: z.object({
      upper: z.number().refine(Number.isFinite, 'Must be finite'),
      lower: z.number().refine(Number.isFinite, 'Must be finite'),
    }),
  }),
  volume: z.object({
    volume: z.record(z.number().refine(Number.isFinite, 'Must be finite')),
    cvd: z.number().refine(Number.isFinite, 'Must be finite'),
    deltaPercentage: z.number().refine(Number.isFinite, 'Must be finite'),
    largeTradeRatio: z.number().refine(Number.isFinite, 'Must be finite'),
    liquidationVolume: z.number().refine(Number.isFinite, 'Must be finite'),
  }),
  orderflow: z.object({
    ofi: z.number().refine(Number.isFinite, 'Must be finite'),
    vwap: z.number().refine(Number.isFinite, 'Must be finite'),
    liquidationCount: z.number().int(),
  }),
  regime: z.object({
    volatilityRegime: z.enum(['low', 'medium', 'high']),
    trendStrength: z.number().refine(Number.isFinite, 'Must be finite'),
    meanReversionScore: z.number().refine(Number.isFinite, 'Must be finite'),
  }).optional(),
});

// Type inference
export type StrategySignalInput = z.infer<typeof StrategySignalSchema>;
export type FeatureSnapshotInput = z.infer<typeof FeatureSnapshotSchema>;

// Validation functions
export function validateStrategySignal(data: unknown): {
  success: boolean;
  data?: StrategySignalInput;
  errors?: string[];
} {
  const result = StrategySignalSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

export function validateFeatureSnapshot(data: unknown): {
  success: boolean;
  data?: FeatureSnapshotInput;
  errors?: string[];
} {
  const result = FeatureSnapshotSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}
