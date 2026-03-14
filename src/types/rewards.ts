/**
 * Reward and contribution types.
 */

export interface ResearchImpact {
  proposalId: string;
  researcher: string;
  accepted: boolean;
  pnlDelta: number;
  paperTradeDays: number;
  evaluatedAt: number;
}

export interface ContributionScore {
  researcher: string;
  epoch: number;
  capitalScore: number;
  researchScore: number;
  computeScore: number;
  totalScore: number;
  reward: number;
}

export interface EpochSummary {
  epochId: number;
  startTimestamp: number;
  endTimestamp: number;
  totalProposals: number;
  acceptedProposals: number;
  totalPositiveImpact: number;
  topResearchers: Array<{ researcher: string; score: number }>;
}

export interface RewardDistribution {
  epochId: number;
  totalRewards: number;
  capitalPool: number;
  researchPool: number;
  computePool: number;
  distributions: Array<{
    recipient: string;
    amount: number;
    type: 'capital' | 'research' | 'compute';
  }>;
}

export interface ClaimableRewards {
  researcher: string;
  totalClaimable: number;
  byEpoch: Array<{
    epoch: number;
    amount: number;
    claimed: boolean;
  }>;
}

