/**
 * Zod schemas for job validation.
 */

import { z } from 'zod';

export const BacktestJobSchema = z.object({
  jobId: z.string().min(1),
  proposalId: z.string(),
  modifications: z.array(z.object({
    slotId: z.string(),
    value: z.union([z.number(), z.string()]),
  })),
  dataRange: z.object({
    start: z.number().int(),
    end: z.number().int(),
  }),
  assignedAt: z.number().int(),
  timeoutAt: z.number().int(),
});

export const BacktestResultSchema = z.object({
  jobId: z.string(),
  proposalId: z.string(),
  score: z.number(),
  sharpe: z.number(),
  maxDrawdown: z.number(),
  trades: z.number().int(),
  hash: z.string(),
});

export const JobAssignmentSchema = z.object({
  jobId: z.string(),
  nodeId: z.string(),
  proposalId: z.string(),
  assignedAt: z.number().int(),
  timeoutAt: z.number().int(),
});

export const JobResultSchema = z.object({
  jobId: z.string(),
  nodeId: z.string(),
  result: BacktestResultSchema,
  signature: z.string(),
  submittedAt: z.number().int(),
});

export const ComputeNodeSchema = z.object({
  peerId: z.string(),
  publicKey: z.string(),
  reputation: z.number().int().min(0),
  currentJobs: z.number().int().min(0),
  maxJobs: z.number().int().min(1),
  isOnline: z.boolean(),
  lastSeen: z.number().int(),
});

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

