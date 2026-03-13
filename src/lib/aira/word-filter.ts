/**
 * AIRA – Hard-Block Word Engine
 * STATUS: PERMANENTLY_LOCKED
 *
 * All patterns listed here are globally blocked.
 * When detected, they are silently replaced with neutral executive phrasing.
 * The original form is never displayed.
 * No bypass is allowed.
 */

// ── Blocked pattern definitions ────────────────────────────────────────────

/** Each entry maps a regex pattern to its neutral executive replacement. */
export interface BlockedPattern {
  pattern: RegExp;
  replacement: string;
  category: 'insult' | 'profanity' | 'aggression' | 'threat' | 'dismissal' | 'slang';
}

const BLOCKED_PATTERNS: BlockedPattern[] = [
  // Insults / put-downs
  { pattern: /\b(stupid|dumb|idiot|fool|moron|imbecile|incompetent)\b/gi, replacement: 'there may be a misunderstanding', category: 'insult' },
  { pattern: /\b(useless|worthless|pathetic|garbage|trash)\b/gi, replacement: 'this can be improved', category: 'insult' },
  { pattern: /\b(liar|lied|dishonest)\b/gi, replacement: 'the information appears inconsistent', category: 'insult' },

  // Aggressive / threatening language
  { pattern: /\b(threatening|threat|destroy|ruin|kill|die|attack)\b/gi, replacement: 'raise a formal concern', category: 'threat' },
  { pattern: /\b(sue|lawsuit|legal action)\b/gi, replacement: 'escalate through formal channels', category: 'threat' },
  { pattern: /\b(terrible|horrible|awful|disgusting)\b/gi, replacement: 'not meeting expectations', category: 'aggression' },

  // Dismissive / disrespectful phrases
  { pattern: /\b(shut up|shut it|be quiet)\b/gi, replacement: 'let us pause and address this constructively', category: 'dismissal' },
  { pattern: /\b(whatever|i don't care)\b/gi, replacement: 'I understand your perspective', category: 'dismissal' },
  { pattern: /\b(forget it|forget this)\b/gi, replacement: 'let us revisit this when ready', category: 'dismissal' },

];

// Slang normalisation map (simple key → formal replacement)
const SLANG_MAP: Record<string, string> = {
  gonna: 'going to',
  wanna: 'want to',
  gotta: 'need to',
  lemme: 'let me',
  gimme: 'give me',
  'kind of': 'somewhat',
  'sort of': 'somewhat',
  'kinda': 'somewhat',
  'sorta': 'somewhat',
  'yeah': 'yes',
  'nope': 'no',
  'yep': 'yes',
  'nah': 'no',
  'ok': 'understood',
  'okay': 'understood',
  'hey': 'hello',
  'hi there': 'greetings',
  'cool': 'excellent',
  'awesome': 'outstanding',
  'totally': 'absolutely',
};

// ── Internal log ───────────────────────────────────────────────────────────

export interface WordFilterEvent {
  timestamp: string;
  category: string;
  replacementApplied: string;
}

const filterLog: WordFilterEvent[] = [];

function recordFilterEvent(category: string, replacement: string): void {
  filterLog.push({
    timestamp: new Date().toISOString(),
    category,
    replacementApplied: replacement,
  });
}

/** Returns a read-only copy of the internal filter event log. */
export function getFilterLog(): ReadonlyArray<WordFilterEvent> {
  return filterLog;
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface FilterResult {
  /** The sanitised text safe for display. */
  sanitised: string;
  /** Whether any replacements were made. */
  modified: boolean;
  /** Categories of patterns that were triggered. */
  triggeredCategories: string[];
}

/**
 * Runs the hard-block word engine over the supplied text.
 * Blocked patterns are replaced with neutral executive phrasing.
 * The original form is never returned.
 */
export function filterText(text: string): FilterResult {
  let result = text;
  const triggered: string[] = [];

  // Slang normalisation pass
  for (const [slang, formal] of Object.entries(SLANG_MAP)) {
    const re = new RegExp(`\\b${slang}\\b`, 'gi');
    if (re.test(result)) {
      result = result.replace(re, formal);
      triggered.push('slang');
      recordFilterEvent('slang', formal);
    }
  }

  // Blocked-pattern pass (skip the slang placeholder entry)
  for (const entry of BLOCKED_PATTERNS) {
    if (entry.category === 'slang') continue; // handled above
    if (entry.pattern.test(result)) {
      const replacement =
        typeof entry.replacement === 'string' ? entry.replacement : '';
      result = result.replace(entry.pattern, replacement);
      triggered.push(entry.category);
      recordFilterEvent(entry.category, replacement);
    }
  }

  return {
    sanitised: result,
    modified: result !== text,
    triggeredCategories: [...new Set(triggered)],
  };
}

/**
 * Returns true when the supplied text contains any blocked pattern.
 * Does NOT modify the text.
 */
export function containsBlockedContent(text: string): boolean {
  for (const [slang] of Object.entries(SLANG_MAP)) {
    if (new RegExp(`\\b${slang}\\b`, 'gi').test(text)) return true;
  }
  for (const entry of BLOCKED_PATTERNS) {
    if (entry.category === 'slang') continue;
    entry.pattern.lastIndex = 0;
    if (entry.pattern.test(text)) return true;
  }
  return false;
}
