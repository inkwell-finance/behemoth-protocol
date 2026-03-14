/**
 * Tests for protocol schemas - validates all shared types.
 */

import { describe, it, expect } from 'vitest';
import {
  ResearchProposalSchema,
  SlotModificationSchema,
  ValidationResultSchema,
  ProposalResultSchema,
  validateProposal,
} from '../src/schemas/proposal-schema';
import {
  BacktestJobSchema,
  BacktestResultSchema,
  JobAssignmentSchema,
  ComputeNodeSchema,
  validateJobResult,
} from '../src/schemas/job-schema';

describe('SlotModificationSchema', () => {
  it('validates numeric slot modification', () => {
    const result = SlotModificationSchema.safeParse({
      slotId: 'allocation_momentum_class',
      proposedValue: 0.35,
    });
    expect(result.success).toBe(true);
    expect(result.data?.proposedValue).toBe(0.35);
  });

  it('validates string slot modification', () => {
    const result = SlotModificationSchema.safeParse({
      slotId: 'regime_type',
      proposedValue: 'high_volatility',
    });
    expect(result.success).toBe(true);
    expect(result.data?.proposedValue).toBe('high_volatility');
  });

  it('rejects empty slotId', () => {
    const result = SlotModificationSchema.safeParse({
      slotId: '',
      proposedValue: 0.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects slotId over 100 chars', () => {
    const result = SlotModificationSchema.safeParse({
      slotId: 'a'.repeat(101),
      proposedValue: 0.5,
    });
    expect(result.success).toBe(false);
  });
});

describe('ResearchProposalSchema', () => {
  const validProposal = {
    proposalId: 'prop-1234567890-abc123xyz',
    researcher: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
    timestamp: Date.now(),
    modifications: [
      { slotId: 'allocation_momentum_class', proposedValue: 0.4 },
    ],
    hypothesis: 'Increasing momentum allocation during high volatility regimes should improve risk-adjusted returns.',
  };

  it('validates complete proposal', () => {
    const result = ResearchProposalSchema.safeParse(validProposal);
    expect(result.success).toBe(true);
  });

  it('rejects invalid proposalId format', () => {
    const result = ResearchProposalSchema.safeParse({
      ...validProposal,
      proposalId: 'invalid-id',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short researcher pubkey', () => {
    const result = ResearchProposalSchema.safeParse({
      ...validProposal,
      researcher: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty modifications', () => {
    const result = ResearchProposalSchema.safeParse({
      ...validProposal,
      modifications: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects too many modifications', () => {
    const result = ResearchProposalSchema.safeParse({
      ...validProposal,
      modifications: Array(11).fill({ slotId: 'test', proposedValue: 0.1 }),
    });
    expect(result.success).toBe(false);
  });

  it('rejects short hypothesis', () => {
    const result = ResearchProposalSchema.safeParse({
      ...validProposal,
      hypothesis: 'Too short',
    });
    expect(result.success).toBe(false);
  });

  it('allows optional methodology', () => {
    const result = ResearchProposalSchema.safeParse({
      ...validProposal,
      methodology: 'Backtested over 6 months of historical data.',
    });
    expect(result.success).toBe(true);
  });
});

describe('validateProposal helper', () => {
  it('returns success with data for valid proposal', () => {
    const result = validateProposal({
      proposalId: 'prop-1234567890-abc123xyz',
      researcher: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
      timestamp: Date.now(),
      modifications: [{ slotId: 'test', proposedValue: 0.5 }],
      hypothesis: 'This is a test hypothesis that is long enough.',
    });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it('returns errors for invalid proposal', () => {
    const result = validateProposal({
      proposalId: 'invalid',
      researcher: '',
    });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });
});

describe('BacktestJobSchema', () => {
  it('validates job with data range', () => {
    const result = BacktestJobSchema.safeParse({
      jobId: 'job-123',
      proposalId: 'prop-123-abc',
      modifications: [{ slotId: 'test', value: 0.5 }],
      dataRange: { start: 1700000000, end: 1705000000 },
      assignedAt: Date.now(),
      timeoutAt: Date.now() + 60000,
    });
    expect(result.success).toBe(true);
  });
});

describe('ComputeNodeSchema', () => {
  it('validates compute node', () => {
    const result = ComputeNodeSchema.safeParse({
      peerId: '12D3KooWGzc...',
      publicKey: 'ed25519-pub-key...',
      reputation: 100,
      currentJobs: 2,
      maxJobs: 5,
      isOnline: true,
      lastSeen: Date.now(),
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative reputation', () => {
    const result = ComputeNodeSchema.safeParse({
      peerId: '12D3KooW...',
      publicKey: 'key',
      reputation: -1,
      currentJobs: 0,
      maxJobs: 5,
      isOnline: true,
      lastSeen: Date.now(),
    });
    expect(result.success).toBe(false);
  });
});

