/**
 * Network constants.
 */

// P2P Topics
export const P2P_TOPICS = {
  PROPOSALS: '/behemoth/proposals/1.0.0',
  JOBS: '/behemoth/jobs/1.0.0',
  RESULTS: '/behemoth/results/1.0.0',
  ANNOUNCEMENTS: '/behemoth/announcements/1.0.0',
} as const;

// Protocol identifiers
export const PROTOCOLS = {
  DIRECT_MESSAGE: '/behemoth/direct/1.0.0',
  JOB_STREAM: '/behemoth/job-stream/1.0.0',
} as const;

// Default configuration values
export const DEFAULTS = {
  // Rate limits
  MAX_PROPOSALS_PER_DAY: 3,
  MAX_PROPOSALS_PER_QUARTER: 150,
  PROPOSAL_COOLDOWN_MS: 3600000, // 1 hour

  // Job execution
  JOB_TIMEOUT_MS: 300000, // 5 minutes
  JOB_REDUNDANCY: 3,
  MAX_CONCURRENT_JOBS: 5,

  // Epochs
  EPOCH_DURATION_DAYS: 30,

  // Stakes
  MIN_RESEARCHER_STAKE_USDC: 100,
  MIN_COMPUTE_STAKE_USDC: 50,

  // Contribution weights (basis points, sum to 10000)
  CAPITAL_WEIGHT: 4000,    // 40%
  RESEARCH_WEIGHT: 5000,   // 50%
  COMPUTE_WEIGHT: 1000,    // 10%
} as const;

// Message type strings
export const MESSAGE_TYPES = {
  PROPOSAL_SUBMIT: 'proposal_submit',
  PROPOSAL_RESULT: 'proposal_result',
  JOB_ASSIGNED: 'job_assigned',
  JOB_RESULT: 'job_result',
  SCHEMA_UPDATE: 'schema_update',
  EPOCH_START: 'epoch_start',
  EPOCH_END: 'epoch_end',
} as const;

