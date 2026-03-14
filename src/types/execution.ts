/**
 * Execution types - orders, fills, positions.
 * Migrated from trading-system/src/shared/types/execution.ts
 */

import type { Exchange } from './market';

export type OrderStatus = 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
export type TimeInForce = 'gtc' | 'ioc' | 'fok';
export type OrderType = 'market' | 'limit' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type PositionSide = 'long' | 'short';
export type PositionStatus = 'open' | 'closed' | 'liquidated';

export interface Order {
  id: string;
  strategyId: string;
  asset: string;
  side: OrderSide;
  size: number;
  type: OrderType;
  limitPrice?: number;
  stopPrice?: number;
  timeInForce: TimeInForce;
  reduceOnly: boolean;
  maxSlippageBps: number;
  preferredVenue?: Exchange;
  allowSplit: boolean;
  createdAt: number;
  status: OrderStatus;
}

export interface Fill {
  id: string;
  orderId: string;
  strategyId: string;
  exchange: Exchange;
  symbol: string;
  timestamp: number;
  side: OrderSide;
  size: number;
  price: number;
  fee?: number;
  feeCurrency?: string;
  isMaker?: boolean;
}

export interface Position {
  id: string;
  strategyId: string;
  exchange: Exchange;
  symbol: string;
  side: PositionSide;
  size: number;
  entryPrice: number;
  currentPrice?: number;
  unrealizedPnl?: number;
  margin?: number;
  leverage?: number;
  openedAt: number;
  closedAt?: number;
  status: PositionStatus;
}

export interface TrailingStop {
  positionId: string;
  symbol: string;
  side: PositionSide;
  initialPrice: number;
  currentStopPrice: number;
  trailDistancePct: number;
  highWaterMark: number;
  lastUpdated: number;
}

export interface ChildOrder {
  orderId: string;
  exchange: Exchange;
  size: number;
  limitPrice: number;
  status: OrderStatus;
}

export interface RoutedOrder {
  parentOrderId: string;
  childOrders: ChildOrder[];
  expectedSlippage: number;
  expectedFees: number;
}

