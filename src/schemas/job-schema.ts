/**
 * Zod schemas for job validation.
 */

import { z } from 'zod';

export const BacktestJobSchema = z.object({
  jobId: z.string().min(1),
  proposalId: z.string(),
  modifications: z.array(z.object({
    slotId: z.string(),
    value: z.union([z.number().refine(Number.isFinite, 'Must be finite'), z.string()]),
  })),
  dataRange: z.object({
    start: z.number().int().refine(Number.isFinite, 'Must be finite'),
    end: z.number().int().refine(Number.isFinite, 'Must be finite'),
  }),
  assignedAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
  timeoutAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
}).refine(d => d.timeoutAt > d.assignedAt, { message: 'timeoutAt must be after assignedAt' })
.refine(d => !d.dataRange || d.dataRange.start < d.dataRange.end, {
  message: 'dataRange.start must be before dataRange.end',
  path: ['dataRange'],
});

export const BacktestResultSchema = z.object({
  jobId: z.string(),
  proposalId: z.string(),
  score: z.number().min(-100).max(100).refine(Number.isFinite, 'Must be finite'),
  sharpe: z.number().min(-10).max(20).refine(Number.isFinite, 'Must be finite'),
  maxDrawdown: z.number().min(-1).max(0).refine(Number.isFinite, 'Must be finite'),
  trades: z.number().int().nonnegative().refine(Number.isFinite, 'Must be finite'),
  winRate: z.number().min(0).max(1).refine(Number.isFinite, 'Must be finite'),
  hash: z.string(),
});

export const JobAssignmentSchema = z.object({
  jobId: z.string(),
  nodeId: z.string(),
  proposalId: z.string(),
  assignedAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
  timeoutAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
}).refine(d => d.timeoutAt > d.assignedAt, { message: 'timeoutAt must be after assignedAt' });

export const JobResultSchema = z.object({
  jobId: z.string(),
  nodeId: z.string(),
  result: BacktestResultSchema,
  signature: z.string().max(512),
  submittedAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
});

export const ComputeNodeSchema = z.object({
  peerId: z.string(),
  publicKey: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{44}$/, 'Invalid base58 pubkey'),
  reputation: z.number().int().min(0).refine(Number.isFinite, 'Must be finite'),
  currentJobs: z.number().int().min(0).refine(Number.isFinite, 'Must be finite'),
  maxJobs: z.number().int().min(1).refine(Number.isFinite, 'Must be finite'),
  isOnline: z.boolean(),
  lastSeen: z.number().int().refine(Number.isFinite, 'Must be finite'),
}).refine(d => d.currentJobs <= d.maxJobs, { message: 'currentJobs must not exceed maxJobs', path: ['currentJobs'] });

// Type inference
export type BacktestJobInput = z.infer<typeof BacktestJobSchema>;
export type BacktestResultInput = z.infer<typeof BacktestResultSchema>;
export type JobAssignmentInput = z.infer<typeof JobAssignmentSchema>;
export type JobResultInput = z.infer<typeof JobResultSchema>;
export type ComputeNodeInput = z.infer<typeof ComputeNodeSchema>;

// Validation functions
export function validateJobResult(data: unknown): {
  success: boolean;
  data?: JobResultInput;
  errors?: string[];
} {
  const result = JobResultSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

