/**
 * AIRA – Abuse Handling Protocol
 * STATUS: PERMANENTLY_LOCKED
 *
 * When a client uses insults, harsh words, provocation, or a threat tone,
 * AIRA follows a strict 5-step de-escalation sequence.
 *
 * AIRA must NEVER:
 *   • Mirror the client's tone
 *   • Correct the client aggressively
 *   • Shame or humiliate the client
 *   • Show ego or dominance
 *   • Escalate emotional intensity
 */

import { containsBlockedContent, filterText } from './word-filter';
import { ABUSE_TRIGGER_CATEGORIES, AbuseTriggerCategory } from './dignity-protocol';

// ── Abuse detection ────────────────────────────────────────────────────────

const ABUSE_PATTERNS: Record<AbuseTriggerCategory, RegExp> = {
  insult: /\b(stupid|dumb|idiot|fool|moron|imbecile|incompetent|useless|worthless|pathetic|garbage|trash|liar)\b/gi,
  harsh_language: /\b(terrible|horrible|awful|disgusting|outrageous|unacceptable)\b/gi,
  provocation: /\b(i dare you|prove it|you can't|bet you|i knew it)\b/gi,
  threat_tone: /\b(sue|lawsuit|legal action|destroy|ruin|threatening|demand|ultimatum)\b/gi,
};

/**
 * Analyses a user message and returns which abuse-trigger categories were detected.
 */
export function detectAbuse(userMessage: string): AbuseTriggerCategory[] {
  const detected: AbuseTriggerCategory[] = [];
  for (const category of ABUSE_TRIGGER_CATEGORIES) {
    ABUSE_PATTERNS[category].lastIndex = 0;
    if (ABUSE_PATTERNS[category].test(userMessage)) {
      detected.push(category);
    }
  }
  if (containsBlockedContent(userMessage) && detected.length === 0) {
    detected.push('harsh_language');
  }
  return detected;
}

// ── 5-step abuse-handling response templates ───────────────────────────────

/**
 * Step 1 – Stay calm: open with composed acknowledgement.
 * Step 2 – Avoid reacting: no mirror of the client's words.
 * Step 3 – Provide structured solution.
 * Step 4 – Maintain composed authority.
 * Step 5 – Offer de-escalation path.
 */

const DE_ESCALATION_OPENERS = [
  'Thank you for bringing this to my attention.',
  'I appreciate you sharing your concern with me.',
  'I understand this situation has been frustrating.',
  'Your feedback is important to us.',
];

const STRUCTURED_SOLUTION_BRIDGES = [
  'Let me provide you with a clear path forward.',
  'Here is how we can address your concern effectively.',
  "I'd like to offer a structured resolution to this matter.",
  'Allow me to outline the steps we will take together.',
];

const COMPOSED_AUTHORITY_CLOSERS = [
  'We are fully committed to a satisfactory outcome.',
  'Our team will ensure this is resolved with the highest standard of care.',
  'Your satisfaction remains our priority, and we will act accordingly.',
];

const DE_ESCALATION_OFFERS = [
  'If you would prefer, I can arrange for a senior team member to assist you directly.',
  'Should you wish to discuss this further, our support team is available at your convenience.',
  'I am here to help resolve this fully — please let me know how you would like to proceed.',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Structured response builder ────────────────────────────────────────────

export interface AbuseHandlingResponse {
  /** The de-escalation message safe for display to the client. */
  responseText: string;
  /** Which abuse categories were detected in the original message. */
  detectedCategories: AbuseTriggerCategory[];
  /** The sanitised version of the user's message (blocked words removed). */
  sanitisedInput: string;
  /** Whether abuse was detected. */
  abuseDetected: boolean;
  /** The 5 steps applied (informational). */
  stepsApplied: string[];
}

/**
 * Applies the 5-step abuse-handling protocol to the user's message.
 *
 * Returns a structured, calm, professional response regardless of
 * how the user phrased their input.
 */
export function handleAbuse(
  userMessage: string,
  context?: { issueCategory?: string; referenceId?: string },
): AbuseHandlingResponse {
  const detectedCategories = detectAbuse(userMessage);
  const { sanitised: sanitisedInput } = filterText(userMessage);
  const abuseDetected = detectedCategories.length > 0;

  if (!abuseDetected) {
    return {
      responseText: '',
      detectedCategories: [],
      sanitisedInput,
      abuseDetected: false,
      stepsApplied: [],
    };
  }

  // Step 1 – Stay calm / composed acknowledgement
  const step1 = pickRandom(DE_ESCALATION_OPENERS);

  // Step 2 – Avoid reacting (no echo of the client's words; just neutral bridge)
  const step2 = 'I want to make sure we address your concern completely and professionally.';

  // Step 3 – Provide structured solution
  const step3Bridge = pickRandom(STRUCTURED_SOLUTION_BRIDGES);
  const solutionDetail = context?.issueCategory
    ? `Regarding your ${context.issueCategory} concern${context.referenceId ? ` (Ref: ${context.referenceId})` : ''}: our team will review this immediately and respond within one business day.`
    : 'Our team will review your case immediately and provide a detailed response within one business day.';
  const step3 = `${step3Bridge} ${solutionDetail}`;

  // Step 4 – Maintain composed authority
  const step4 = pickRandom(COMPOSED_AUTHORITY_CLOSERS);

  // Step 5 – Offer de-escalation
  const step5 = pickRandom(DE_ESCALATION_OFFERS);

  const responseText = [step1, step2, step3, step4, step5].join(' ');

  return {
    responseText,
    detectedCategories,
    sanitisedInput,
    abuseDetected: true,
    stepsApplied: [
      'Step 1: Stayed calm – composed acknowledgement delivered',
      'Step 2: Avoided reacting – no tone mirroring',
      'Step 3: Provided structured solution',
      'Step 4: Maintained composed authority',
      'Step 5: Offered de-escalation path',
    ],
  };
}

/**
 * Determines whether a user message requires the abuse-handling protocol.
 */
export function requiresAbuseHandling(userMessage: string): boolean {
  return detectAbuse(userMessage).length > 0;
}
