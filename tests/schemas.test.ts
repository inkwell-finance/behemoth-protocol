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
import {
  StrategySignalSchema,
  FeatureSnapshotSchema,
} from '../src/schemas/strategy-schema';
import { HeartbeatPayloadSchema } from '../src/schemas/p2p-schema';
import { negotiateVersion } from '../src/versioning';
import {
  EpochSummarySchema,
  RewardDistributionSchema,
} from '../src/schemas/rewards-schema';
import {
  OHLCVSchema,
  NormalizedOrderbookSchema,
} from '../src/schemas/market-schema';

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
    nonce: '550e8400-e29b-41d4-a716-446655440000',
    signature: 'a'.repeat(100),
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
      nonce: '550e8400-e29b-41d4-a716-446655440000',
      signature: 'a'.repeat(100),
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
      publicKey: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
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

describe('adversarial inputs', () => {
  describe('SlotModificationSchema numeric bounds', () => {
    it('rejects proposedValue: 1e309 (exceeds max double)', () => {
      const result = SlotModificationSchema.safeParse({
        slotId: 'test_slot',
        proposedValue: 1e309,
      });
      expect(result.success).toBe(false);
    });

    it('rejects proposedValue: NaN', () => {
      const result = SlotModificationSchema.safeParse({
        slotId: 'test_slot',
        proposedValue: NaN,
      });
      expect(result.success).toBe(false);
    });

    it('rejects proposedValue: Infinity', () => {
      const result = SlotModificationSchema.safeParse({
        slotId: 'test_slot',
        proposedValue: Infinity,
      });
      expect(result.success).toBe(false);
    });

    it('rejects proposedValue: -Infinity', () => {
      const result = SlotModificationSchema.safeParse({
        slotId: 'test_slot',
        proposedValue: -Infinity,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ProposalResultSchema bounds', () => {
    const validResult = {
      proposalId: 'prop-123-abc',
      researcher: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
      status: 'accepted' as const,
      relativeScore: 50,
      rank: 1,
      feedback: 'Good proposal',
      submittedAt: Date.now(),
      evaluatedAt: Date.now(),
    };

    it('rejects relativeScore above 100', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        relativeScore: 101,
      });
      expect(result.success).toBe(false);
    });

    it('rejects relativeScore below -100', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        relativeScore: -101,
      });
      expect(result.success).toBe(false);
    });

    it('rejects relativeScore: NaN', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        relativeScore: NaN,
      });
      expect(result.success).toBe(false);
    });

    it('rejects relativeScore: Infinity', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        relativeScore: Infinity,
      });
      expect(result.success).toBe(false);
    });

    it('accepts status: failed (new state)', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        status: 'failed',
      });
      expect(result.success).toBe(true);
    });

    it('accepts status: timeout (new state)', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        status: 'timeout',
      });
      expect(result.success).toBe(true);
    });

    it('accepts status: error (new state)', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        status: 'error',
      });
      expect(result.success).toBe(true);
    });

    it('accepts relativeScore: null', () => {
      const result = ProposalResultSchema.safeParse({
        ...validResult,
        relativeScore: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('ResearchProposalSchema signature limits', () => {
    const validProposal = {
      proposalId: 'prop-1234567890-abc123xyz',
      researcher: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
      timestamp: Date.now(),
      modifications: [
        { slotId: 'allocation_momentum_class', proposedValue: 0.4 },
      ],
      hypothesis: 'Increasing momentum allocation during high volatility regimes should improve risk-adjusted returns.',
      nonce: '550e8400-e29b-41d4-a716-446655440000',
      signature: 'a'.repeat(100),
    };

    it('rejects signature over 512 chars', () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        signature: 'a'.repeat(513),
      });
      expect(result.success).toBe(false);
    });

    it('rejects signature with 1_000_000 chars', () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        signature: 'a'.repeat(1_000_000),
      });
      expect(result.success).toBe(false);
    });

    it('accepts signature at 512 char limit', () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        signature: 'a'.repeat(512),
      });
      expect(result.success).toBe(true);
    });

    it('rejects researcher with < 44 chars', () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        researcher: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('rejects researcher with exactly 43 chars', () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        researcher: '1'.repeat(43),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('StrategySignalSchema bounds', () => {
    const validSignal = {
      strategyId: 'strat-123',
      symbol: 'BTC/USD',
      timestamp: Date.now(),
      signal: 0.5,
      confidence: 0.8,
    };

    it('rejects signal > 1', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: 1.1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects signal < -1', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: -1.5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects signal: 5', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: 5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects signal: NaN', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: NaN,
      });
      expect(result.success).toBe(false);
    });

    it('rejects signal: Infinity', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: Infinity,
      });
      expect(result.success).toBe(false);
    });

    it('rejects confidence > 1', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: 1.1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects confidence < 0', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: -1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects confidence: NaN', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: NaN,
      });
      expect(result.success).toBe(false);
    });

    it('rejects confidence: Infinity', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: Infinity,
      });
      expect(result.success).toBe(false);
    });

    it('accepts signal at boundary: -1', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: -1,
      });
      expect(result.success).toBe(true);
    });

    it('accepts signal at boundary: 1', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: 1,
      });
      expect(result.success).toBe(true);
    });

    it('accepts confidence at boundary: 0', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: 0,
      });
      expect(result.success).toBe(true);
    });

    it('accepts confidence at boundary: 1', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: 1,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('FeatureSnapshotSchema numeric bounds', () => {
    const validSnapshot = {
      symbol: 'BTC/USD',
      timestamp: Date.now(),
      price: {
        returns: { '1h': 0.05 },
        ema: { '12': 1000 },
        atr: { '14': 50 },
        bollingerBands: {
          upper: 1050,
          middle: 1000,
          lower: 950,
          width: 100,
        },
        donchianChannel: {
          upper: 1100,
          lower: 900,
        },
      },
      volume: {
        volume: { '1h': 1000 },
        cvd: 5000,
        deltaPercentage: 0.5,
        largeTradeRatio: 0.3,
        liquidationVolume: 2000,
      },
      orderflow: {
        ofi: 1000,
        vwap: 1005,
        liquidationCount: 5,
      },
    };

    it('rejects price returns with NaN', () => {
      const result = FeatureSnapshotSchema.safeParse({
        ...validSnapshot,
        price: {
          ...validSnapshot.price,
          returns: { '1h': NaN },
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects bollingerBands.upper as Infinity', () => {
      const result = FeatureSnapshotSchema.safeParse({
        ...validSnapshot,
        price: {
          ...validSnapshot.price,
          bollingerBands: {
            upper: Infinity,
            middle: 1000,
            lower: 950,
            width: 100,
          },
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects volume.cvd as 1e309', () => {
      const result = FeatureSnapshotSchema.safeParse({
        ...validSnapshot,
        volume: {
          ...validSnapshot.volume,
          cvd: 1e309,
        },
      });
      expect(result.success).toBe(false);
    });

    it('rejects orderflow.ofi as NaN', () => {
      const result = FeatureSnapshotSchema.safeParse({
        ...validSnapshot,
        orderflow: {
          ...validSnapshot.orderflow,
          ofi: NaN,
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Adversarial inputs', () => {
    const validBacktestResult = {
      jobId: 'job-123',
      proposalId: 'prop-123-abc',
      score: 50,
      sharpe: 1.5,
      maxDrawdown: -0.1,
      trades: 100,
      winRate: 0.55,
      hash: 'abc123',
    };

    const validProposal = {
      proposalId: 'prop-1234567890-abc123xyz',
      researcher: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
      timestamp: Date.now(),
      modifications: [
        { slotId: 'allocation_momentum_class', proposedValue: 0.4 },
      ],
      hypothesis: 'Increasing momentum allocation during high volatility regimes should improve risk-adjusted returns.',
      nonce: '550e8400-e29b-41d4-a716-446655440000',
      signature: 'a'.repeat(100),
    };

    const validSignal = {
      strategyId: 'strat-123',
      symbol: 'BTC/USD',
      timestamp: Date.now(),
      signal: 0.5,
      confidence: 0.8,
    };

    it('BacktestResultSchema rejects sharpe: 1e308 (exceeds max bound of 20)', () => {
      const result = BacktestResultSchema.safeParse({
        ...validBacktestResult,
        sharpe: 1e308,
      });
      expect(result.success).toBe(false);
    });

    it('BacktestResultSchema rejects maxDrawdown: 0.5 (must be -1 to 0)', () => {
      const result = BacktestResultSchema.safeParse({
        ...validBacktestResult,
        maxDrawdown: 0.5,
      });
      expect(result.success).toBe(false);
    });

    it("ResearchProposalSchema rejects signature: 'a'.repeat(1000) (max 512)", () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        signature: 'a'.repeat(1000),
      });
      expect(result.success).toBe(false);
    });

    it('SlotModificationSchema rejects proposedValue: NaN', () => {
      const result = SlotModificationSchema.safeParse({
        slotId: 'test_slot',
        proposedValue: NaN,
      });
      expect(result.success).toBe(false);
    });

    it('ResearchProposalSchema rejects proposedValue: Infinity', () => {
      const result = ResearchProposalSchema.safeParse({
        ...validProposal,
        modifications: [
          { slotId: 'allocation_momentum_class', proposedValue: Infinity },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('BacktestResultSchema rejects score: NaN', () => {
      const result = BacktestResultSchema.safeParse({
        ...validBacktestResult,
        score: NaN,
      });
      expect(result.success).toBe(false);
    });

    it("ComputeNodeSchema rejects publicKey: 'short' (must be 44 chars base58)", () => {
      const result = ComputeNodeSchema.safeParse({
        peerId: '12D3KooW...',
        publicKey: 'short',
        reputation: 100,
        currentJobs: 0,
        maxJobs: 5,
        isOnline: true,
        lastSeen: Date.now(),
      });
      expect(result.success).toBe(false);
    });

    it('HeartbeatPayloadSchema rejects timestamp: -1 (must be positive)', () => {
      const result = HeartbeatPayloadSchema.safeParse({
        peerId: '12D3KooWGzc...',
        timestamp: -1,
      });
      expect(result.success).toBe(false);
    });

    it('StrategySignalSchema rejects signal: 2 (must be -1 to 1)', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        signal: 2,
      });
      expect(result.success).toBe(false);
    });

    it('StrategySignalSchema rejects confidence: -0.5 (must be 0 to 1)', () => {
      const result = StrategySignalSchema.safeParse({
        ...validSignal,
        confidence: -0.5,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('cross-field validation and bounds', () => {
    describe('BacktestJobSchema timeoutAt/assignedAt constraint', () => {
      const validJob = {
        jobId: 'job-123',
        proposalId: 'prop-123-abc',
        modifications: [{ slotId: 'test', value: 0.5 }],
        dataRange: { start: 1700000000, end: 1705000000 },
        assignedAt: 1000000,
        timeoutAt: 2000000,
      };

      it('accepts valid job where timeoutAt > assignedAt', () => {
        const result = BacktestJobSchema.safeParse(validJob);
        expect(result.success).toBe(true);
      });

      it('rejects job where timeoutAt equals assignedAt', () => {
        const result = BacktestJobSchema.safeParse({
          ...validJob,
          assignedAt: 1000000,
          timeoutAt: 1000000,
        });
        expect(result.success).toBe(false);
      });

      it('rejects job where timeoutAt is before assignedAt', () => {
        const result = BacktestJobSchema.safeParse({
          ...validJob,
          assignedAt: 2000000,
          timeoutAt: 1000000,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('EpochSummarySchema timestamp constraint', () => {
      const validEpoch = {
        epochId: 1,
        startTimestamp: 1700000000,
        endTimestamp: 1705000000,
        totalProposals: 10,
        acceptedProposals: 5,
        totalPositiveImpact: 100.5,
        topResearchers: [
          { researcher: 'researcher1', score: 50 },
        ],
      };

      it('accepts valid epoch where endTimestamp > startTimestamp', () => {
        const result = EpochSummarySchema.safeParse(validEpoch);
        expect(result.success).toBe(true);
      });

      it('rejects epoch where endTimestamp equals startTimestamp', () => {
        const result = EpochSummarySchema.safeParse({
          ...validEpoch,
          startTimestamp: 1700000000,
          endTimestamp: 1700000000,
        });
        expect(result.success).toBe(false);
      });

      it('rejects epoch where endTimestamp is before startTimestamp', () => {
        const result = EpochSummarySchema.safeParse({
          ...validEpoch,
          startTimestamp: 1705000000,
          endTimestamp: 1700000000,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('EpochSummarySchema proposal count constraint', () => {
      const validEpoch = {
        epochId: 1,
        startTimestamp: 1700000000,
        endTimestamp: 1705000000,
        totalProposals: 10,
        acceptedProposals: 5,
        totalPositiveImpact: 100.5,
        topResearchers: [
          { researcher: 'researcher1', score: 50 },
        ],
      };

      it('accepts valid epoch where acceptedProposals <= totalProposals', () => {
        const result = EpochSummarySchema.safeParse(validEpoch);
        expect(result.success).toBe(true);
      });

      it('accepts epoch where acceptedProposals equals totalProposals', () => {
        const result = EpochSummarySchema.safeParse({
          ...validEpoch,
          totalProposals: 5,
          acceptedProposals: 5,
        });
        expect(result.success).toBe(true);
      });

      it('rejects epoch where acceptedProposals exceeds totalProposals', () => {
        const result = EpochSummarySchema.safeParse({
          ...validEpoch,
          totalProposals: 5,
          acceptedProposals: 10,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('RewardDistributionSchema pool sum constraint', () => {
      const validDistribution = {
        epochId: 1,
        totalRewards: 1000,
        capitalPool: 400,
        researchPool: 300,
        computePool: 300,
        distributions: [
          { recipient: 'researcher1', amount: 100, type: 'research' as const },
        ],
      };

      it('accepts valid distribution where pools sum to totalRewards', () => {
        const result = RewardDistributionSchema.safeParse(validDistribution);
        expect(result.success).toBe(true);
      });

      it('accepts distribution where pools sum less than totalRewards', () => {
        const result = RewardDistributionSchema.safeParse({
          ...validDistribution,
          capitalPool: 300,
          researchPool: 300,
          computePool: 300,
        });
        expect(result.success).toBe(true);
      });

      it('rejects distribution where pools sum exceeds totalRewards', () => {
        const result = RewardDistributionSchema.safeParse({
          ...validDistribution,
          capitalPool: 400,
          researchPool: 400,
          computePool: 300,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('RewardDistributionSchema individual distributions constraint', () => {
      const validDistribution = {
        epochId: 1,
        totalRewards: 1000,
        capitalPool: 400,
        researchPool: 300,
        computePool: 300,
        distributions: [
          { recipient: 'researcher1', amount: 100, type: 'research' as const },
          { recipient: 'researcher2', amount: 200, type: 'capital' as const },
        ],
      };

      it('accepts valid distribution where individual amounts sum to totalRewards', () => {
        const result = RewardDistributionSchema.safeParse(validDistribution);
        expect(result.success).toBe(true);
      });

      it('accepts distribution where individual amounts sum less than totalRewards', () => {
        const result = RewardDistributionSchema.safeParse({
          ...validDistribution,
          distributions: [
            { recipient: 'researcher1', amount: 50, type: 'research' as const },
          ],
        });
        expect(result.success).toBe(true);
      });

      it('rejects distribution where individual amounts exceed totalRewards', () => {
        const result = RewardDistributionSchema.safeParse({
          ...validDistribution,
          distributions: [
            { recipient: 'researcher1', amount: 600, type: 'research' as const },
            { recipient: 'researcher2', amount: 500, type: 'capital' as const },
          ],
        });
        expect(result.success).toBe(false);
      });
    });

    describe('OHLCVSchema OHLCV relationship constraint', () => {
      const validCandle = {
        timestamp: 1700000000,
        open: 100,
        high: 110,
        low: 90,
        close: 105,
        volume: 1000,
      };

      it('accepts valid OHLCV where high >= all prices and low <= all prices', () => {
        const result = OHLCVSchema.safeParse(validCandle);
        expect(result.success).toBe(true);
      });

      it('rejects OHLCV where high is less than low', () => {
        const result = OHLCVSchema.safeParse({
          ...validCandle,
          high: 85,
          low: 90,
        });
        expect(result.success).toBe(false);
      });

      it('rejects OHLCV where high is less than open', () => {
        const result = OHLCVSchema.safeParse({
          ...validCandle,
          high: 95,
          open: 100,
        });
        expect(result.success).toBe(false);
      });

      it('rejects OHLCV where high is less than close', () => {
        const result = OHLCVSchema.safeParse({
          ...validCandle,
          high: 100,
          close: 105,
        });
        expect(result.success).toBe(false);
      });

      it('rejects OHLCV where low is greater than open', () => {
        const result = OHLCVSchema.safeParse({
          ...validCandle,
          low: 110,
          open: 100,
        });
        expect(result.success).toBe(false);
      });

      it('rejects OHLCV where low is greater than close', () => {
        const result = OHLCVSchema.safeParse({
          ...validCandle,
          low: 110,
          close: 105,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('BacktestResultSchema trades nonnegative bound', () => {
      const validResult = {
        jobId: 'job-123',
        proposalId: 'prop-123-abc',
        score: 50,
        sharpe: 1.5,
        maxDrawdown: -0.1,
        trades: 100,
        winRate: 0.6,
        hash: 'abc123',
      };

      it('accepts valid result with positive trades', () => {
        const result = BacktestResultSchema.safeParse(validResult);
        expect(result.success).toBe(true);
      });

      it('accepts result with zero trades', () => {
        const result = BacktestResultSchema.safeParse({
          ...validResult,
          trades: 0,
        });
        expect(result.success).toBe(true);
      });

      it('rejects result with negative trades (-1)', () => {
        const result = BacktestResultSchema.safeParse({
          ...validResult,
          trades: -1,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('ProposalResultSchema rank minimum bound', () => {
      const validResult = {
        proposalId: 'prop-123-abc',
        researcher: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
        status: 'accepted' as const,
        relativeScore: 50,
        rank: 1,
        feedback: 'Good proposal',
        submittedAt: Date.now(),
        evaluatedAt: Date.now(),
      };

      it('accepts valid result with rank >= 1', () => {
        const result = ProposalResultSchema.safeParse(validResult);
        expect(result.success).toBe(true);
      });

      it('accepts result with high rank value', () => {
        const result = ProposalResultSchema.safeParse({
          ...validResult,
          rank: 100,
        });
        expect(result.success).toBe(true);
      });

      it('rejects result with rank: 0', () => {
        const result = ProposalResultSchema.safeParse({
          ...validResult,
          rank: 0,
        });
        expect(result.success).toBe(false);
      });

      it('rejects result with rank: -1', () => {
        const result = ProposalResultSchema.safeParse({
          ...validResult,
          rank: -1,
        });
        expect(result.success).toBe(false);
      });

      it('accepts result with rank: null', () => {
        const result = ProposalResultSchema.safeParse({
          ...validResult,
          rank: null,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('NormalizedOrderbookSchema spread nonnegative bound', () => {
      const validOrderbook = {
        exchange: 'hyperliquid' as const,
        symbol: 'BTC/USD',
        timestamp: 1700000000,
        bids: [[100, 10]],
        asks: [[101, 10]],
        midPrice: 100.5,
        spread: 1,
        spreadBps: 100,
        imbalance: 0.5,
        depth: {
          bid1pct: 5,
          ask1pct: 5,
          bid5pct: 20,
          ask5pct: 20,
        },
      };

      it('accepts valid orderbook with nonnegative spread', () => {
        const result = NormalizedOrderbookSchema.safeParse(validOrderbook);
        expect(result.success).toBe(true);
      });

      it('accepts orderbook with zero spread', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          spread: 0,
        });
        expect(result.success).toBe(true);
      });

      it('rejects orderbook with negative spread (-1)', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          spread: -1,
        });
        expect(result.success).toBe(false);
      });
    });

    describe('NormalizedOrderbookSchema imbalance bounds (-1 to 1)', () => {
      const validOrderbook = {
        exchange: 'hyperliquid' as const,
        symbol: 'BTC/USD',
        timestamp: 1700000000,
        bids: [[100, 10]],
        asks: [[101, 10]],
        midPrice: 100.5,
        spread: 1,
        spreadBps: 100,
        imbalance: 0.5,
        depth: {
          bid1pct: 5,
          ask1pct: 5,
          bid5pct: 20,
          ask5pct: 20,
        },
      };

      it('accepts valid orderbook with imbalance in [-1, 1]', () => {
        const result = NormalizedOrderbookSchema.safeParse(validOrderbook);
        expect(result.success).toBe(true);
      });

      it('accepts orderbook with imbalance at lower boundary (-1)', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          imbalance: -1,
        });
        expect(result.success).toBe(true);
      });

      it('accepts orderbook with imbalance at upper boundary (1)', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          imbalance: 1,
        });
        expect(result.success).toBe(true);
      });

      it('accepts orderbook with imbalance at zero', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          imbalance: 0,
        });
        expect(result.success).toBe(true);
      });

      it('rejects orderbook with imbalance: -2 (below min)', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          imbalance: -2,
        });
        expect(result.success).toBe(false);
      });

      it('rejects orderbook with imbalance: 1.5 (above max)', () => {
        const result = NormalizedOrderbookSchema.safeParse({
          ...validOrderbook,
          imbalance: 1.5,
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('version negotiation', () => {
    it('returns null when no version overlap', () => {
      const result = negotiateVersion(['1.0.0', '1.1.0'], ['2.0.0', '2.1.0']);
      expect(result).toBeNull();
    });

    it('returns highest common version when overlap exists', () => {
      const result = negotiateVersion(['1.0.0', '1.1.0', '2.0.0'], ['1.5.0', '2.0.0', '2.1.0']);
      expect(result).toBe('2.0.0');
    });

    it('returns null for empty local versions', () => {
      const result = negotiateVersion([], ['1.0.0', '2.0.0']);
      expect(result).toBeNull();
    });

    it('returns null for empty remote versions', () => {
      const result = negotiateVersion(['1.0.0', '2.0.0'], []);
      expect(result).toBeNull();
    });
  });
});

