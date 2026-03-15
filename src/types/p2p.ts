/**
 * P2P network types.
 */

import type { ResearchProposal } from './proposals';
import type { BacktestJob, JobResult } from './jobs';

export interface PeerInfo {
  peerId: string;
  publicKey: string;
  addresses: string[];
  protocols: string[];
  role: 'researcher' | 'compute' | 'coordinator';
  connectedAt: number;
}

/** @deprecated Use BehemothMessage instead for fully-typed message handling. */
export interface MessageEnvelope<T = unknown> {
  type: string;
  payload: T;
  from: string;
  timestamp: number;
  traceId: string;
  /** Protocol version of the sender. Used during version negotiation and migration. */
  version: string;
  signature?: string;
}

/**
 * Discriminated union covering all typed messages on the Behemoth P2P network.
 * Use this in place of the untyped MessageEnvelope when reading or writing
 * messages so that exhaustive type-narrowing is possible.
 */
export type BehemothMessage =
  | { type: 'proposal'; payload: ResearchProposal }
  | { type: 'job_assignment'; payload: BacktestJob }
  | { type: 'job_result'; payload: JobResult }
  | { type: 'heartbeat'; payload: { peerId: string; timestamp: number } };

/** Convenience type for the 'type' discriminant of BehemothMessage. */
export type BehemothMessageType = BehemothMessage['type'];

/** @deprecated Use BehemothMessage instead */
export interface ProposalMessage {
  type: 'proposal';
  proposal: ResearchProposal;
}

/** @deprecated Use BehemothMessage instead */
export interface JobMessage {
  type: 'job_assignment' | 'job_result';
  assignment?: import('./jobs').JobAssignment;
  result?: JobResult;
}

/** @deprecated Use BehemothMessage instead */
export interface AnnouncementMessage {
  type: 'schema_update' | 'epoch_start' | 'epoch_end' | 'maintenance';
  payload: unknown;
}

// Network statistics
export interface NetworkStats {
  totalPeers: number;
  researcherPeers: number;
  computePeers: number;
  activeJobs: number;
  messagesPerMinute: number;
}

