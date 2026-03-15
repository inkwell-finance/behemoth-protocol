/**
 * Zod schemas for P2P message validation.
 */

import { z } from 'zod';
import { ResearchProposalSchema } from './proposal-schema';
import { BacktestJobSchema, JobResultSchema } from './job-schema';

export const HeartbeatPayloadSchema = z.object({
  peerId: z.string().min(1),
  timestamp: z.number().int().positive(),
});

/**
 * Announcement message payloads - typed per announcement type.
 */
export const SchemaUpdatePayloadSchema = z.object({
  schemaVersion: z.string(),
  changes: z.array(z.object({
    path: z.string(),
    action: z.enum(['add', 'update', 'remove']),
  })),
});

export const EpochStartPayloadSchema = z.object({
  epochNumber: z.number().int().positive(),
  startTime: z.number().int().positive(),
  targetDuration: z.number().int().positive(),
});

export const EpochEndPayloadSchema = z.object({
  epochNumber: z.number().int().positive(),
  endTime: z.number().int().positive(),
  results: z.record(z.unknown()).optional(),
});

export const MaintenancePayloadSchema = z.object({
  maintenanceType: z.string(),
  startTime: z.number().int().positive(),
  estimatedDuration: z.number().int().positive(),
  reason: z.string().optional(),
});

export const AnnouncementMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('schema_update'), payload: SchemaUpdatePayloadSchema }),
  z.object({ type: z.literal('epoch_start'), payload: EpochStartPayloadSchema }),
  z.object({ type: z.literal('epoch_end'), payload: EpochEndPayloadSchema }),
  z.object({ type: z.literal('maintenance'), payload: MaintenancePayloadSchema }),
]);

/**
 * Discriminated union schema for all typed Behemoth P2P messages.
 * Mirrors the BehemothMessage TypeScript type in types/p2p.ts.
 */
export const BehemothMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('proposal'), payload: ResearchProposalSchema }),
  z.object({ type: z.literal('job_assignment'), payload: BacktestJobSchema }),
  z.object({ type: z.literal('job_result'), payload: JobResultSchema }),
  z.object({ type: z.literal('heartbeat'), payload: HeartbeatPayloadSchema }),
]);

export type BehemothMessageInput = z.infer<typeof BehemothMessageSchema>;
export type AnnouncementMessageInput = z.infer<typeof AnnouncementMessageSchema>;
export type SchemaUpdatePayloadInput = z.infer<typeof SchemaUpdatePayloadSchema>;
export type EpochStartPayloadInput = z.infer<typeof EpochStartPayloadSchema>;
export type EpochEndPayloadInput = z.infer<typeof EpochEndPayloadSchema>;
export type MaintenancePayloadInput = z.infer<typeof MaintenancePayloadSchema>;

/**
 * Parse and validate an unknown value as a BehemothMessage.
 * Returns a typed result rather than throwing.
 */
export function parseBehemothMessage(data: unknown): {
  success: boolean;
  data?: BehemothMessageInput;
  errors?: string[];
} {
  const result = BehemothMessageSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}
