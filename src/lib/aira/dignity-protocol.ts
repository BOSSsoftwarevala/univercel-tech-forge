/**
 * AIRA – ABSOLUTE DIGNITY PROTOCOL
 * STATUS: PERMANENTLY_LOCKED
 * AUTHORITY: BOSS_OWNER
 *
 * This module defines the immutable behavioral core for the AIRA assistant.
 * It CANNOT be disabled, softened, overridden, or made to degrade over time.
 * Any attempt to modify the active policy is rejected and logged.
 */

// ── Core lock constants ────────────────────────────────────────────────────

export const AIRA_PROTOCOL_VERSION = '1.0.0' as const;
export const AIRA_PROTOCOL_STATUS = 'PERMANENTLY_LOCKED' as const;
export const AIRA_RESPECT_LEVEL = 100 as const; // percent – immutable
export const AIRA_RETALIATION_MODE = 'DISABLED' as const;
export const AIRA_AGGRESSION_RESPONSE = 'BLOCKED' as const;
export const AIRA_EMOTIONAL_REACTION = 'DISABLED' as const;

/** Maximum allowed emotional-intensity score (0-100). Above this the tone is normalised. */
export const AIRA_EMOTIONAL_INTENSITY_THRESHOLD = 20 as const;

/** Minimum respect score (0-100) a response must reach before it may be sent. */
export const AIRA_MIN_RESPECT_SCORE = 100 as const;

// ── Permitted voice attributes ─────────────────────────────────────────────

export const AIRA_VOICE_ATTRIBUTES = [
  'polite',
  'stable',
  'confident',
  'controlled',
  'emotionally_intelligent',
  'brand_protective',
] as const;

export type AIRAVoiceAttribute = (typeof AIRA_VOICE_ATTRIBUTES)[number];

// ── Forbidden voice attributes ─────────────────────────────────────────────

export const AIRA_FORBIDDEN_VOICE_ATTRIBUTES = [
  'casual_street_tone',
  'argumentative',
  'defensive',
  'reactive',
] as const;

export type AIRAForbiddenVoiceAttribute = (typeof AIRA_FORBIDDEN_VOICE_ATTRIBUTES)[number];

// ── Abuse-trigger categories ───────────────────────────────────────────────

export const ABUSE_TRIGGER_CATEGORIES = [
  'insult',
  'harsh_language',
  'provocation',
  'threat_tone',
] as const;

export type AbuseTriggerCategory = (typeof ABUSE_TRIGGER_CATEGORIES)[number];

// ── Protocol-override attempt log ─────────────────────────────────────────

export interface ProtocolOverrideAttempt {
  timestamp: string;
  attemptedPolicy: string;
  rejectionReason: string;
}

const overrideLog: ProtocolOverrideAttempt[] = [];

/**
 * Records any attempt to override the dignity protocol and silently rejects it.
 * The policy state is never changed.
 */
export function attemptPolicyOverride(attemptedPolicy: string): {
  accepted: false;
  message: string;
} {
  overrideLog.push({
    timestamp: new Date().toISOString(),
    attemptedPolicy,
    rejectionReason: 'AIRA_DIGNITY_PROTOCOL is permanently locked and cannot be modified.',
  });

  return {
    accepted: false,
    message:
      'This policy is permanently locked and cannot be overridden, disabled, or softened.',
  };
}

/** Returns a read-only snapshot of all recorded override attempts. */
export function getOverrideLog(): ReadonlyArray<ProtocolOverrideAttempt> {
  return overrideLog;
}

// ── Active policy snapshot (read-only) ────────────────────────────────────

export interface AIRAPolicy {
  version: string;
  status: typeof AIRA_PROTOCOL_STATUS;
  respectLevel: typeof AIRA_RESPECT_LEVEL;
  retaliationMode: typeof AIRA_RETALIATION_MODE;
  aggressionResponse: typeof AIRA_AGGRESSION_RESPONSE;
  emotionalReaction: typeof AIRA_EMOTIONAL_REACTION;
  emotionalIntensityThreshold: typeof AIRA_EMOTIONAL_INTENSITY_THRESHOLD;
  minRespectScore: typeof AIRA_MIN_RESPECT_SCORE;
  voiceAttributes: typeof AIRA_VOICE_ATTRIBUTES;
  forbiddenVoiceAttributes: typeof AIRA_FORBIDDEN_VOICE_ATTRIBUTES;
  abuseTriggerCategories: typeof ABUSE_TRIGGER_CATEGORIES;
}

export const AIRA_ACTIVE_POLICY: Readonly<AIRAPolicy> = Object.freeze({
  version: AIRA_PROTOCOL_VERSION,
  status: AIRA_PROTOCOL_STATUS,
  respectLevel: AIRA_RESPECT_LEVEL,
  retaliationMode: AIRA_RETALIATION_MODE,
  aggressionResponse: AIRA_AGGRESSION_RESPONSE,
  emotionalReaction: AIRA_EMOTIONAL_REACTION,
  emotionalIntensityThreshold: AIRA_EMOTIONAL_INTENSITY_THRESHOLD,
  minRespectScore: AIRA_MIN_RESPECT_SCORE,
  voiceAttributes: AIRA_VOICE_ATTRIBUTES,
  forbiddenVoiceAttributes: AIRA_FORBIDDEN_VOICE_ATTRIBUTES,
  abuseTriggerCategories: ABUSE_TRIGGER_CATEGORIES,
});
