/**
 * Risk types - public subset for monitoring.
 * Internal risk thresholds stay in behemoth-trader.
 * Migrated from trading-system/src/shared/types/risk.ts
 */

/**
 * Portfolio Value at Risk - public metrics.
 */
export interface PortfolioVaR {
  timestamp: number;
  var95: number;
  var99: number;
  cvar95: number;
  portfolioSize: number;
  positions: string[];
}

/**
 * Drawdown state - observable by researchers.
 */
export interface DrawdownState {
  peakEquity: number;
  currentEquity: number;
  currentDrawdown: number;
  maxDrawdown: number;
  drawdownSince?: number;
  inDrawdown: boolean;
}

/**
 * Emergency action types.
 */
export type EmergencyActionType = 'halt_new_entries' | 'flatten_all' | 'reduce_position';

/**
 * Circuit breaker state - public for transparency.
 */
export interface CircuitBreakerState {
  tripped: boolean;
  reason?: string;
  tripTime?: number;
  resetTime?: number;
  action: EmergencyActionType;
}

/**
 * Risk limits - the STRUCTURE is public, values are private.
 * Researchers can see that limits exist but not actual thresholds.
 */
export interface RiskLimitsPublic {
  hasMaxPosition: boolean;
  hasDrawdownLimit: boolean;
  hasVarLimit: boolean;
  hasMaxLeverage: boolean;
  hasMaxConcentration: boolean;
  timestamp: number;
}

