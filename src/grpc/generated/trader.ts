// AUTO-GENERATED placeholder — will be replaced by protoc output
// Source of truth: src/grpc/trader.proto
// Regenerate with: npm run proto:gen

// === Oneof helpers ===

/** Discriminated union for SlotModification.value */
export type SlotModification_Value =
  | { $case: "float_value"; float_value: number }
  | { $case: "int_value"; int_value: number }
  | { $case: "string_value"; string_value: string }
  | undefined;

// === Message interfaces ===

export interface SlotModification {
  slot_id: string;
  value?: SlotModification_Value;
}

export interface BacktestRequest {
  proposal_id: string;
  modifications: SlotModification[];
  /** Unix timestamp */
  data_start: number;
  /** Unix timestamp */
  data_end: number;
  /** For tracking */
  request_id: string;
}

export interface BacktestResponse {
  success: boolean;
  proposal_id: string;
  /** Performance vs baseline */
  relative_score: number;
  sharpe_ratio: number;
  max_drawdown: number;
  total_trades: number;
  win_rate: number;
  /** Populated when success=false */
  error: string;
  /** Hash for verification */
  result_hash: string;
}

export interface PaperShadowRequest {
  proposal_id: string;
  modifications: SlotModification[];
  duration_days: number;
}

export interface PaperShadowResponse {
  success: boolean;
  paper_trade_id: string;
  error: string;
}

export interface PaperResultsRequest {
  paper_trade_id: string;
}

export interface PaperResultsResponse {
  paper_trade_id: string;
  /** "running" | "completed" | "stopped" */
  status: string;
  days_elapsed: number;
  relative_pnl: number;
  sharpe_ratio: number;
  recommend_promotion: boolean;
}

export interface StopPaperRequest {
  paper_trade_id: string;
}

export interface StopPaperResponse {
  success: boolean;
}

export interface BaselineRequest {
  /** Unix timestamp */
  data_start: number;
  /** Unix timestamp */
  data_end: number;
}

export interface BaselineResponse {
  total_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
  total_trades: number;
}

export interface HealthRequest {}

export interface HealthResponse {
  healthy: boolean;
  version: string;
  uptime_seconds: number;
  active_paper_trades: number;
}

// === Service definition ===
// Mirrors the TraderService RPC surface from trader.proto.
// When ts-proto codegen runs, this will be replaced with a proper
// ServiceDefinition object compatible with @grpc/grpc-js.

export interface TraderServiceDefinition {
  RunBacktest(request: BacktestRequest): Promise<BacktestResponse>;
  StartPaperShadow(request: PaperShadowRequest): Promise<PaperShadowResponse>;
  GetPaperResults(request: PaperResultsRequest): Promise<PaperResultsResponse>;
  StopPaperShadow(request: StopPaperRequest): Promise<StopPaperResponse>;
  HealthCheck(request: HealthRequest): Promise<HealthResponse>;
  GetBaseline(request: BaselineRequest): Promise<BaselineResponse>;
}
