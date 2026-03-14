/**
 * Backtest job types.
 */

export interface BacktestJob {
  jobId: string;
  proposalId: string;
  modifications: Array<{ slotId: string; value: number | string }>;
  dataRange: {
    start: number;
    end: number;
  };
  assignedAt: number;
  timeoutAt: number;
}

export interface BacktestResult {
  jobId: string;
  proposalId: string;
  score: number;
  sharpe: number;
  maxDrawdown: number;
  trades: number;
  hash: string;
}

export interface JobAssignment {
  jobId: string;
  nodeId: string;
  proposalId: string;
  assignedAt: number;
  timeoutAt: number;
}

export interface JobResult {
  jobId: string;
  nodeId: string;
  result: BacktestResult;
  signature: string;
  submittedAt: number;
}

export interface ComputeNode {
  peerId: string;
  publicKey: string;
  reputation: number;
  currentJobs: number;
  maxJobs: number;
  isOnline: boolean;
  lastSeen: number;
}

// Request/Response types for gRPC
export interface BacktestRequest {
  proposalId: string;
  modifications: Array<{ slotId: string; value: number | string }>;
  dataRange?: { start: number; end: number };
}

export interface BacktestResponse {
  success: boolean;
  result?: BacktestResult;
  error?: string;
}

export interface PaperShadowRequest {
  proposalId: string;
  modifications: Array<{ slotId: string; value: number | string }>;
  durationDays: number;
}

export interface PaperShadowResponse {
  success: boolean;
  paperTradeId?: string;
  error?: string;
}

