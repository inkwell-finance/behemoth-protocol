/**
 * Strategy types - public subset for research interface.
 * Internal strategy config stays in behemoth-trader.
 * Migrated from trading-system/src/shared/types/strategy.ts
 */

export type StrategyId = string;
export type StrategyCategory = 'momentum' | 'mean_reversion' | 'microstructure' | 'cross_asset';

/**
 * Strategy signal output - can be shared with researchers
 * (after noise injection by coordinator).
 */
export interface StrategySignal {
  strategyId: StrategyId;
  symbol: string;
  timestamp: number;
  signal: number;       // -1.0 to 1.0
  confidence: number;   // 0.0 to 1.0
  metadata?: Record<string, unknown>;
}

/**
 * Feature snapshot - market features used by strategies.
 * Public because researchers need to understand what features exist.
 */
export interface FeatureSnapshot {
  symbol: string;
  timestamp: number;
  price: {
    returns: Record<string, number>;
    ema: Record<string, number>;
    atr: Record<string, number>;
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
      width: number;
    };
    donchianChannel: {
      upper: number;
      lower: number;
    };
  };
  volume: {
    volume: Record<string, number>;
    cvd: number;
    deltaPercentage: number;
    largeTradeRatio: number;
    liquidationVolume: number;
  };
  orderflow: {
    ofi: number;
    vwap: number;
    liquidationCount: number;
  };
  regime?: {
    volatilityRegime: 'low' | 'medium' | 'high';
    trendStrength: number;
    meanReversionScore: number;
  };
}

/**
 * Public strategy metadata - what researchers can see.
 * Does NOT include actual parameters.
 */
export interface StrategyMetadata {
  id: StrategyId;
  category: StrategyCategory;
  description: string;
  slotIds: string[];  // Which abstract slots this strategy uses
}

