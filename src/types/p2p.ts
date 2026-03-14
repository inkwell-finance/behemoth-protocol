/**
 * P2P network types.
 */

export interface PeerInfo {
  peerId: string;
  publicKey: string;
  addresses: string[];
  protocols: string[];
  role: 'researcher' | 'compute' | 'coordinator';
  connectedAt: number;
}

export interface MessageEnvelope<T = unknown> {
  type: string;
  payload: T;
  from: string;
  timestamp: number;
  signature?: string;
}

export interface ProposalMessage {
  type: 'proposal';
  proposal: import('./proposals').ResearchProposal;
}

export interface JobMessage {
  type: 'job_assignment' | 'job_result';
  assignment?: import('./jobs').JobAssignment;
  result?: import('./jobs').JobResult;
}

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

