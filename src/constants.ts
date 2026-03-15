/**
 * Network constants.
 */

// Protocol versioning
export const PROTOCOL_VERSION = '1.0.0';
export const SUPPORTED_VERSIONS = ['1.0.0'] as const;
export type SupportedVersion = (typeof SUPPORTED_VERSIONS)[number];

/**
 * Generate a versioned topic string from a base topic path and version.
 * Example: topicForVersion('/behemoth/proposals', '1.0.0') => '/behemoth/proposals/1.0.0'
 */
export function topicForVersion(base: string, version: string): string {
  return `${base}/${version}`;
}

// Base topic paths (without version suffix)
export const P2P_TOPIC_BASES = {
  PROPOSALS: '/behemoth/proposals',
  JOBS: '/behemoth/jobs',
  RESULTS: '/behemoth/results',
  ANNOUNCEMENTS: '/behemoth/announcements',
} as const;

// P2P Topics (versioned with current PROTOCOL_VERSION for backwards compat)
export const P2P_TOPICS = {
  PROPOSALS: topicForVersion(P2P_TOPIC_BASES.PROPOSALS, PROTOCOL_VERSION),
  JOBS: topicForVersion(P2P_TOPIC_BASES.JOBS, PROTOCOL_VERSION),
  RESULTS: topicForVersion(P2P_TOPIC_BASES.RESULTS, PROTOCOL_VERSION),
  ANNOUNCEMENTS: topicForVersion(P2P_TOPIC_BASES.ANNOUNCEMENTS, PROTOCOL_VERSION),
} as const;

// Base protocol paths (without version suffix)
export const PROTOCOL_BASES = {
  DIRECT_MESSAGE: '/behemoth/direct',
  JOB_STREAM: '/behemoth/job-stream',
} as const;

// Protocol identifiers (versioned with current PROTOCOL_VERSION for backwards compat)
export const PROTOCOLS = {
  DIRECT_MESSAGE: topicForVersion(PROTOCOL_BASES.DIRECT_MESSAGE, PROTOCOL_VERSION),
  JOB_STREAM: topicForVersion(PROTOCOL_BASES.JOB_STREAM, PROTOCOL_VERSION),
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

// Message type strings - aligned with BehemothMessage discriminated union
export const MESSAGE_TYPES = {
  PROPOSAL: 'proposal',
  JOB_ASSIGNMENT: 'job_assignment',
  JOB_RESULT: 'job_result',
  HEARTBEAT: 'heartbeat',
} as const;

