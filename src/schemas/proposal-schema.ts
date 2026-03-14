/**
 * Zod schemas for proposal validation.
 */

import { z } from 'zod';

export const SlotModificationSchema = z.object({
  slotId: z.string().min(1).max(100),
  proposedValue: z.union([z.number(), z.string()]),
});

export const ResearchProposalSchema = z.object({
  proposalId: z.string().regex(/^prop-\d+-[a-z0-9]+$/),
  researcher: z.string().min(32).max(64), // Solana pubkey
  timestamp: z.number().int().positive(),
  modifications: z.array(SlotModificationSchema).min(1).max(10),
  hypothesis: z.string().min(20).max(500),
  methodology: z.string().max(1000).optional(),
  signature: z.string().optional(),
});

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(z.string()),
  proposalId: z.string(),
});

export const ProposalResultSchema = z.object({
  proposalId: z.string(),
  researcher: z.string(),
  status: z.enum(['accepted', 'rejected', 'pending_paper', 'promoted']),
  relativeScore: z.number().nullable(),
  rank: z.number().int().nullable(),
  feedback: z.string(),
  backtestJobId: z.string().optional(),
  paperTradeId: z.string().optional(),
  submittedAt: z.number().int(),
  evaluatedAt: z.number().int(),
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

