/**
 * Protocol version negotiation utilities.
 *
 * These primitives allow peers to discover compatible protocol versions and
 * enable graceful migration between versions. During a v1→v2 migration window,
 * nodes subscribe to topics for all supported versions so no messages are lost.
 */

import { SUPPORTED_VERSIONS, topicForVersion } from './constants';

/**
 * Parse a semver-like version string into numeric components.
 * Returns null if the string is not a valid "major.minor.patch" version.
 */
function parseSemver(version: string): { major: number; minor: number; patch: number } | null {
  const parts = version.split('.');
  if (parts.length !== 3) return null;
  const [major, minor, patch] = parts.map(Number);
  if ([major, minor, patch].some((n) => !Number.isFinite(n) || n < 0)) return null;
  return { major, minor, patch };
}

/**
 * Compare two semver strings. Returns positive if a > b, negative if a < b, 0 if equal.
 * Invalid versions sort lower than valid ones.
 */
function compareSemver(a: string, b: string): number {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa && !pb) return 0;
  if (!pa) return -1;
  if (!pb) return 1;
  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  return pa.patch - pb.patch;
}

/**
 * Check whether a given version string is in the set of locally supported versions.
 */
export function isVersionSupported(version: string): boolean {
  return (SUPPORTED_VERSIONS as readonly string[]).includes(version);
}

/**
 * Given the version lists advertised by two peers, return the highest version
 * both support, or null if there is no overlap.
 *
 * This is used during capability negotiation: each peer advertises its
 * SUPPORTED_VERSIONS and the coordinator (or either peer in direct messaging)
 * calls this to pick the best common version.
 */
export function negotiateVersion(
  localVersions: readonly string[],
  remoteVersions: readonly string[],
): string | null {
  const remoteSet = new Set(remoteVersions);
  const common = localVersions.filter((v) => remoteSet.has(v));
  if (common.length === 0) return null;
  // Sort descending so the highest compatible version wins.
  common.sort((a, b) => compareSemver(b, a));
  return common[0];
}

/**
 * Return versioned topic strings for every supported protocol version.
 *
 * During a migration window a node should subscribe to all of these so it can
 * receive messages from peers that haven't upgraded yet as well as those that
 * already have.
 *
 * @param base - A base topic path, e.g. '/behemoth/proposals'
 */
export function migrationTopics(base: string): string[] {
  return SUPPORTED_VERSIONS.map((v) => topicForVersion(base, v));
}
