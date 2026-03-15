/**
 * Zod schemas for reward-related validation.
 */

import { z } from 'zod';

export const ResearchImpactSchema = z.object({
  proposalId: z.string().min(1),
  researcher: z.string().min(1),
  accepted: z.boolean(),
  pnlDelta: z.number().refine(Number.isFinite, 'Must be finite'),
  paperTradeDays: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  evaluatedAt: z.number().int().positive().refine(Number.isFinite, 'Must be finite'),
});

export const ContributionScoreSchema = z.object({
  researcher: z.string().min(1),
  epoch: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  capitalScore: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  researchScore: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  computeScore: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  totalScore: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  reward: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
});

export const EpochSummarySchema = z.object({
  epochId: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  startTimestamp: z.number().int().positive().refine(Number.isFinite, 'Must be finite'),
  endTimestamp: z.number().int().positive().refine(Number.isFinite, 'Must be finite'),
  totalProposals: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  acceptedProposals: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  totalPositiveImpact: z.number().refine(Number.isFinite, 'Must be finite'),
  topResearchers: z.array(z.object({
    researcher: z.string().min(1),
    score: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  })),
}).refine(
  (s) => s.endTimestamp > s.startTimestamp,
  {
    message: 'End timestamp must be greater than start timestamp',
    path: ['endTimestamp'],
  }
).refine(
  (s) => s.acceptedProposals <= s.totalProposals,
  {
    message: 'Accepted proposals cannot exceed total proposals',
    path: ['acceptedProposals'],
  }
);

export const RewardDistributionEntrySchema = z.object({
  recipient: z.string().min(1),
  amount: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  type: z.enum(['capital', 'research', 'compute']),
});

export const RewardDistributionSchema = z.object({
  epochId: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  totalRewards: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  capitalPool: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  researchPool: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  computePool: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  distributions: z.array(RewardDistributionEntrySchema),
}).refine(
  (d) => d.capitalPool + d.researchPool + d.computePool <= d.totalRewards,
  {
    message: 'Pool sum exceeds total rewards',
    path: ['capitalPool'],
  }
).refine(
  (d) => d.distributions.reduce((s, x) => s + x.amount, 0) <= d.totalRewards,
  {
    message: 'Individual distributions exceed total rewards',
    path: ['distributions'],
  }
);

export const ClaimableRewardsSchema = z.object({
  researcher: z.string().min(1),
  totalClaimable: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
  byEpoch: z.array(z.object({
    epoch: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
    amount: z.number().nonnegative().refine(Number.isFinite, 'Must be finite'),
    claimed: z.boolean(),
  })),
});

// Type inference helpers
export type ResearchImpactInput = z.infer<typeof ResearchImpactSchema>;
export type ContributionScoreInput = z.infer<typeof ContributionScoreSchema>;
export type EpochSummaryInput = z.infer<typeof EpochSummarySchema>;
export type RewardDistributionEntryInput = z.infer<typeof RewardDistributionEntrySchema>;
export type RewardDistributionInput = z.infer<typeof RewardDistributionSchema>;
export type ClaimableRewardsInput = z.infer<typeof ClaimableRewardsSchema>;

// Validation functions
export function validateRewardDistribution(data: unknown): {
  success: boolean;
  data?: RewardDistributionInput;
  errors?: string[];
} {
  const result = RewardDistributionSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

export function validateEpochSummary(data: unknown): {
  success: boolean;
  data?: EpochSummaryInput;
  errors?: string[];
} {
  const result = EpochSummarySchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}
