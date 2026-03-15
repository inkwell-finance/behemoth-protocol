/**
 * Research proposal types.
 */

export interface SlotModification {
  slotId: string;
  proposedValue: number | string;
}

export interface ResearchProposal {
  proposalId: string;
  researcher: string;
  timestamp: number;
  modifications: SlotModification[];
  hypothesis: string;
  methodology?: string;
  traceId?: string;
  nonce: string;
  signature: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  proposalId: string;
}

export interface ProposalResult {
  proposalId: string;
  researcher: string;
  status: 'accepted' | 'rejected' | 'pending_paper' | 'promoted' | 'failed' | 'timeout' | 'error';
  relativeScore: number | null;
  rank: number | null;
  feedback: string;
  backtestJobId?: string;
  paperTradeId?: string;
  submittedAt: number;
  evaluatedAt: number;
}

export interface ProposalSummary {
  proposalId: string;
  status: ProposalResult['status'];
  submittedAt: number;
  modificationsCount: number;
}

