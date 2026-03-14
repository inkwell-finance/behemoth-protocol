/**
 * Market data types - shared across all nodes.
 * Migrated from trading-system/src/shared/types/market.ts
 */

export type Exchange = 'hyperliquid' | 'binance' | 'drift';
export type Sector = 'defi' | 'l1' | 'l2' | 'gaming' | 'ai' | 'meme' | 'other';
export type Timeframe = '1s' | '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
export type PriceLevel = [number, number]; // [price, size]

export const BUCKET_THRESHOLDS = {
  micro: 1000,
  small: 10000,
  medium: 100000,
  large: 1000000,
  whale: Infinity,
} as const;

export type TradeBucket = 'micro' | 'small' | 'medium' | 'large' | 'whale';

export interface NormalizedTrade {
  id: string;
  exchange: Exchange;
  symbol: string;
  timestamp: number;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  isLiquidation: boolean;
  bucket: TradeBucket;
}

export interface NormalizedOrderbook {
  exchange: Exchange;
  symbol: string;
  timestamp: number;
  bids: PriceLevel[];
  asks: PriceLevel[];
  midPrice: number;
  spread: number;
  spreadBps: number;
  imbalance: number;
  depth: {
    bid1pct: number;
    ask1pct: number;
    bid5pct: number;
    ask5pct: number;
  };
}

export interface NormalizedFunding {
  exchange: Exchange;
  symbol: string;
  timestamp: number;
  rate: number;
  nextFundingTime: number;
  aggregatedRate?: number;
  zScore?: number;
}

export interface Candle {
  exchange: Exchange;
  symbol: string;
  timeframe: Timeframe;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradeCount?: number;
}

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceTick {
  symbol: string;
  exchange: Exchange;
  price: number;
  timestamp: number;
}

