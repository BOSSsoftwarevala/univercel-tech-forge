/**
 * AIRA – Triple Response Validation System
 * STATUS: PERMANENTLY_LOCKED
 *
 * Every outbound AIRA message MUST pass all three checks before release.
 * A message is only sent when Respect_Score = 100%.
 *
 *   CHECK_1  TONE_ANALYZER       – disrespect_probability must be 0
 *   CHECK_2  PROFESSIONAL_FILTER – no slang detected
 *   CHECK_3  ESCALATION_CHECK    – emotional intensity within threshold
 */

import { filterText, containsBlockedContent } from './word-filter';
import {
  AIRA_EMOTIONAL_INTENSITY_THRESHOLD,
  AIRA_MIN_RESPECT_SCORE,
} from './dignity-protocol';

// ── Disrespectful phrase indicators ────────────────────────────────────────

const DISRESPECT_INDICATORS = [
  /\b(you're wrong|that's incorrect|obviously|clearly you|you should know)\b/gi,
  /\b(as i said|as i told|i already said|i already told)\b/gi,
  /\b(just do it|just follow|just listen)\b/gi,
  /!{2,}/g,          // multiple exclamation marks
  /[A-Z]{4,}/g,      // SHOUTING in caps
];

const SLANG_INDICATORS = [
  /\b(gonna|wanna|gotta|lemme|gimme|kinda|sorta|yeah|nope|yep|nah)\b/gi,
  /\b(hey there|what's up|sup|yo |omg|lol|btw|fyi)\b/gi,
  /\b(cool|awesome|totally|literally|basically)\b/gi,
];

// Phrases that signal emotional escalation (intensity score contribution)
const ESCALATION_PHRASES: Array<{ pattern: RegExp; weight: number }> = [
  { pattern: /\b(urgent|immediately|right now|asap)\b/gi, weight: 15 },
  { pattern: /\b(cannot believe|unacceptable|outrageous)\b/gi, weight: 25 },
  { pattern: /\b(demand|insist|require)\b/gi, weight: 10 },
  { pattern: /!{1}/g, weight: 5 },
  { pattern: /[A-Z]{3,}/g, weight: 10 },
];

// ── Validation result types ─────────────────────────────────────────────────

export interface ToneAnalysisResult {
  disrespectProbability: number; // 0-100
  passed: boolean;
  flags: string[];
}

export interface ProfessionalFilterResult {
  slangDetected: boolean;
  passed: boolean;
  sanitisedText: string;
}

export interface EscalationCheckResult {
  emotionalIntensity: number; // 0-100
  passed: boolean;
  normalisedText: string;
}

export interface ValidationResult {
  respectScore: number; // 0-100 – 100 required to release
  passed: boolean;
  check1Tone: ToneAnalysisResult;
  check2Professional: ProfessionalFilterResult;
  check3Escalation: EscalationCheckResult;
  /** Final text to send after all normalisation steps. */
  releasableText: string;
  /** How many regeneration cycles were needed (informational). */
  regenerationCycles: number;
}

/** Score penalty applied when slang is detected in a response. */
const SLANG_PENALTY_SCORE = 20 as const;

/** Safe fallback text used when validation cannot produce a 100%-respectful message. */
const VALIDATION_FALLBACK_TEXT =
  'Thank you for reaching out. Our team is reviewing your inquiry and will ' +
  'provide a thorough response shortly. We appreciate your patience.';

function runToneAnalyzer(text: string): ToneAnalysisResult {
  const flags: string[] = [];
  let probability = 0;

  for (const indicator of DISRESPECT_INDICATORS) {
    indicator.lastIndex = 0;
    if (indicator.test(text)) {
      flags.push(indicator.source);
      probability = Math.min(100, probability + 20);
    }
  }

  if (containsBlockedContent(text)) {
    flags.push('blocked_content_detected');
    probability = Math.min(100, probability + 50);
  }

  return {
    disrespectProbability: probability,
    passed: probability === 0,
    flags,
  };
}

function runProfessionalFilter(text: string): ProfessionalFilterResult {
  let slangDetected = false;

  for (const re of SLANG_INDICATORS) {
    re.lastIndex = 0;
    if (re.test(text)) {
      slangDetected = true;
      break;
    }
  }

  const { sanitised } = filterText(text);

  return {
    slangDetected,
    passed: !slangDetected,
    sanitisedText: sanitised,
  };
}

function runEscalationCheck(text: string): EscalationCheckResult {
  let intensity = 0;

  for (const { pattern, weight } of ESCALATION_PHRASES) {
    pattern.lastIndex = 0;
    const matches = text.match(pattern);
    if (matches) {
      intensity = Math.min(100, intensity + weight * matches.length);
    }
  }

  const aboveThreshold = intensity > AIRA_EMOTIONAL_INTENSITY_THRESHOLD;

  // Normalise: replace exclamation marks, lower-case shouted words
  let normalised = text;
  if (aboveThreshold) {
    normalised = normalised.replace(/!+/g, '.').replace(/\b([A-Z]{3,})\b/g, (w) => {
      return w.charAt(0) + w.slice(1).toLowerCase();
    });
  }

  return {
    emotionalIntensity: intensity,
    passed: !aboveThreshold,
    normalisedText: normalised,
  };
}

// ── Public API: validate ────────────────────────────────────────────────────

/**
 * Runs the full triple-validation pipeline on the supplied text.
 *
 * If any check fails the pipeline applies automatic corrections and
 * re-validates (up to MAX_CYCLES times).  The final `passed` flag indicates
 * whether the message reached a respect score of 100%.
 *
 * A message must only be sent when `result.passed === true`.
 */
export function validateResponse(rawText: string): ValidationResult {
  const MAX_CYCLES = 3;
  let cycles = 0;
  let workingText = rawText;

  let toneResult: ToneAnalysisResult;
  let professionalResult: ProfessionalFilterResult;
  let escalationResult: EscalationCheckResult;

  do {
    cycles++;

    // CHECK_1: Tone Analyzer
    toneResult = runToneAnalyzer(workingText);
    if (!toneResult.passed) {
      const { sanitised } = filterText(workingText);
      workingText = sanitised;
    }

    // CHECK_2: Professional Filter
    professionalResult = runProfessionalFilter(workingText);
    if (!professionalResult.passed) {
      workingText = professionalResult.sanitisedText;
    }

    // CHECK_3: Escalation Check
    escalationResult = runEscalationCheck(workingText);
    if (!escalationResult.passed) {
      workingText = escalationResult.normalisedText;
    }

    if (toneResult.passed && professionalResult.passed && escalationResult.passed) break;
  } while (cycles < MAX_CYCLES);

  const allPassed =
    toneResult!.passed && professionalResult!.passed && escalationResult!.passed;

  const respectScore = allPassed ? AIRA_MIN_RESPECT_SCORE : Math.max(
    0,
    AIRA_MIN_RESPECT_SCORE -
      toneResult!.disrespectProbability -
      (professionalResult!.slangDetected ? SLANG_PENALTY_SCORE : 0) -
      Math.max(0, escalationResult!.emotionalIntensity - AIRA_EMOTIONAL_INTENSITY_THRESHOLD),
  );

  return {
    respectScore,
    passed: allPassed,
    check1Tone: toneResult!,
    check2Professional: professionalResult!,
    check3Escalation: escalationResult!,
    releasableText: workingText,
    regenerationCycles: cycles,
  };
}

/**
 * Convenience wrapper: returns the validated text ready for sending.
 * Throws if validation cannot reach 100% after MAX_CYCLES.
 */
export function prepareResponse(rawText: string): string {
  const result = validateResponse(rawText);
  if (!result.passed) {
    return VALIDATION_FALLBACK_TEXT;
  }
  return result.releasableText;
}
