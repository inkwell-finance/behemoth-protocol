# @behemoth/protocol

> **🔓 OPEN SOURCE** - Shared types, schemas, and utilities for the Behemoth network.

## Installation

```bash
npm install @behemoth/protocol
# or
bun add @behemoth/protocol
```

## Usage

```typescript
import {
  ResearchProposal,
  SlotSchema,
  BacktestJob,
  P2P_TOPICS,
} from '@behemoth/protocol';

// Create a proposal
const proposal: ResearchProposal = {
  proposalId: 'prop-123',
  researcher: 'pubkey...',
  timestamp: Date.now(),
  modifications: [
    { slotId: 'allocation_momentum_class', proposedValue: 0.35 },
  ],
  hypothesis: 'Increasing momentum weight improves trending markets',
};

// Subscribe to P2P topics
node.subscribe(P2P_TOPICS.PROPOSALS, handler);
```

## Exports

| Export | Description |
|--------|-------------|
| `types/*` | TypeScript interfaces for all network messages |
| `schemas/*` | Zod schemas for validation |
| `constants` | Network constants and P2P topics |
| `utils/*` | Signing, hashing, and utility functions |

## Types

- **Proposals**: `ResearchProposal`, `SlotModification`, `ProposalResult`
- **Jobs**: `BacktestJob`, `BacktestResult`, `JobAssignment`
- **Slots**: `SlotSchema`, `SlotDefinition`, `SlotCategory`
- **Rewards**: `ResearchImpact`, `EpochSummary`, `ContributionScore`
- **P2P**: `PeerInfo`, `MessageEnvelope`, topic constants

