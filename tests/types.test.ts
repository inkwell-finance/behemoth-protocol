/**
 * Type tests for protocol types - validates TypeScript types compile correctly.
 */

import { describe, it, expect } from 'vitest';
import type {
  SlotDefinition,
  SlotSchema,
  SlotValueType,
  SlotCategory,
  InternalSlotMapping,
} from '../src/types/slots';
import type {
  ResearchProposal,
  SlotModification,
  ValidationResult,
  ProposalResult,
} from '../src/types/proposals';
import type {
  BacktestJob,
  JobAssignment,
  ComputeNode,
} from '../src/types/jobs';
import type {
  PeerInfo,
  MessageEnvelope,
  NetworkStats,
} from '../src/types/p2p';
import type {
  RewardDistribution,
  ContributionScore,
  EpochSummary,
} from '../src/types/rewards';

describe('Slots Types', () => {
  it('SlotValueType has correct union members', () => {
    const types: SlotValueType[] = ['float', 'int', 'enum', 'boolean'];
    expect(types).toHaveLength(4);
  });

  it('SlotCategory has correct union members', () => {
    const categories: SlotCategory[] = [
      'allocation', 'threshold', 'sizing', 'timing', 'risk', 'regime', 'execution',
    ];
    expect(categories).toHaveLength(7);
  });

  it('SlotDefinition shape is correct', () => {
    const slot: SlotDefinition = {
      slotId: 'test_slot',
      description: 'A test slot',
      valueType: 'float',
      range: { min: 0, max: 1, step: 0.1 },
      category: 'allocation',
      currentValue: null, // Always null
    };
    expect(slot.currentValue).toBeNull();
  });

  it('SlotSchema contains version and slots', () => {
    const schema: SlotSchema = {
      version: '1.0.0',
      lastUpdated: Date.now(),
      slots: [],
    };
    expect(schema.version).toBe('1.0.0');
  });
});

describe('Proposal Types', () => {
  it('SlotModification allows numeric values', () => {
    const mod: SlotModification = {
      slotId: 'allocation_momentum',
      proposedValue: 0.35,
    };
    expect(typeof mod.proposedValue).toBe('number');
  });

  it('SlotModification allows string values', () => {
    const mod: SlotModification = {
      slotId: 'regime_type',
      proposedValue: 'bull_market',
    };
    expect(typeof mod.proposedValue).toBe('string');
  });

  it('ResearchProposal has required fields', () => {
    const proposal: ResearchProposal = {
      proposalId: 'prop-123-abc',
      researcher: 'pubkey123',
      timestamp: Date.now(),
      modifications: [],
      hypothesis: 'Test hypothesis',
    };
    expect(proposal.proposalId).toBeDefined();
  });

  it('ValidationResult tracks validity and errors', () => {
    const result: ValidationResult = {
      valid: false,
      errors: ['Invalid slot: unknown_slot'],
      proposalId: 'prop-123',
    };
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it('ProposalResult has all status types', () => {
    const statuses: ProposalResult['status'][] = [
      'accepted', 'rejected', 'pending_paper', 'promoted',
    ];
    expect(statuses).toHaveLength(4);
  });
});

describe('Job Types', () => {
  it('ComputeNode tracks reputation', () => {
    const node: ComputeNode = {
      peerId: '12D3KooW...',
      publicKey: 'ed25519-key',
      reputation: 95,
      currentJobs: 3,
      maxJobs: 10,
      isOnline: true,
      lastSeen: Date.now(),
    };
    expect(node.reputation).toBe(95);
  });

  it('JobAssignment links job to node', () => {
    const assignment: JobAssignment = {
      jobId: 'job-123',
      nodeId: 'node-456',
      proposalId: 'prop-789',
      assignedAt: Date.now(),
      timeoutAt: Date.now() + 60000,
    };
    expect(assignment.jobId).toBeDefined();
    expect(assignment.nodeId).toBeDefined();
  });
});

describe('P2P Types', () => {
  it('PeerInfo has role types', () => {
    const roles: PeerInfo['role'][] = ['researcher', 'compute', 'coordinator'];
    expect(roles).toHaveLength(3);
  });

  it('MessageEnvelope wraps payloads', () => {
    const envelope: MessageEnvelope<{ test: boolean }> = {
      type: 'proposal',
      payload: { test: true },
      from: 'peer-123',
      timestamp: Date.now(),
    };
    expect(envelope.payload.test).toBe(true);
  });

  it('NetworkStats tracks peer counts', () => {
    const stats: NetworkStats = {
      totalPeers: 50,
      researcherPeers: 30,
      computePeers: 20,
      activeJobs: 5,
      messagesPerMinute: 120,
    };
    expect(stats.totalPeers).toBe(50);
  });
});

describe('Reward Types', () => {
  it('ContributionScore breaks down by type', () => {
    const score: ContributionScore = {
      researcher: 'pubkey123',
      epoch: 42,
      capitalScore: 0.2,
      researchScore: 0.5,
      computeScore: 0.3,
      totalScore: 1.0,
      reward: 100,
    };
    expect(score.totalScore).toBe(1.0);
  });

  it('RewardDistribution tracks pools', () => {
    const dist: RewardDistribution = {
      epochId: 42,
      totalRewards: 1000,
      capitalPool: 400,
      researchPool: 400,
      computePool: 200,
      distributions: [],
    };
    expect(dist.capitalPool + dist.researchPool + dist.computePool).toBe(1000);
  });

  it('EpochSummary tracks top researchers', () => {
    const summary: EpochSummary = {
      epochId: 42,
      startTimestamp: Date.now() - 86400000,
      endTimestamp: Date.now(),
      totalProposals: 100,
      acceptedProposals: 15,
      totalPositiveImpact: 0.05,
      topResearchers: [{ researcher: 'pub1', score: 0.9 }],
    };
    expect(summary.topResearchers).toHaveLength(1);
  });
});

