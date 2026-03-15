/**
 * Zod schemas for proposal validation.
 */

import { z } from 'zod';

export const SlotModificationSchema = z.object({
  slotId: z.string().min(1).max(100),
  proposedValue: z.union([z.number().refine(Number.isFinite, 'Must be finite'), z.string()]),
});

export const ResearchProposalSchema = z.object({
  proposalId: z.string().regex(/^prop-\d+-[a-z0-9]+$/),
  researcher: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{44}$/, 'Invalid base58 pubkey'),
  timestamp: z.number().int().positive().refine(Number.isFinite, 'Must be finite'),
  modifications: z.array(SlotModificationSchema).min(1).max(10),
  hypothesis: z.string().min(20).max(500),
  methodology: z.string().max(1000).optional(),
  nonce: z.string().uuid('nonce must be a valid UUID'),
  signature: z.string().min(1).max(512, 'signature is required'),
  traceId: z.string().max(128).regex(/^[a-zA-Z0-9\-_]+$/).optional(),
});

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
  proposalId: z.string(),
});

export const ProposalResultSchema = z.object({
  proposalId: z.string(),
  researcher: z.string(),
  status: z.enum(['accepted', 'rejected', 'pending_paper', 'promoted', 'failed', 'timeout', 'error']),
  relativeScore: z.number().min(-100).max(100).nullable().refine(
    (val) => val === null || Number.isFinite(val),
    'Must be finite or null'
  ),
  rank: z.number().int().min(1).nullable(),
  feedback: z.string(),
  backtestJobId: z.string().optional(),
  paperTradeId: z.string().optional(),
  submittedAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
  evaluatedAt: z.number().int().refine(Number.isFinite, 'Must be finite'),
});

// Type inference helpers
export type SlotModificationInput = z.infer<typeof SlotModificationSchema>;
export type ResearchProposalInput = z.infer<typeof ResearchProposalSchema>;
export type ValidationResultInput = z.infer<typeof ValidationResultSchema>;
export type ProposalResultInput = z.infer<typeof ProposalResultSchema>;

// Validation functions
export function validateProposal(data: unknown): { 
  success: boolean; 
  data?: ResearchProposalInput; 
  errors?: string[];
} {
  const result = ResearchProposalSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

