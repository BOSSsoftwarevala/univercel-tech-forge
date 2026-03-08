/**
 * Content Filter & Bad Word Detector
 * Blocks harmful, abusive, and disrespectful language
 * Logs violations and applies penalty tiers
 */

// Comprehensive bad words list (multi-language)
const BAD_WORDS_EN = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'damn', 'dick', 'pussy',
  'whore', 'slut', 'cunt', 'nigger', 'faggot', 'retard', 'rape',
  'kill yourself', 'die', 'kys', 'stfu', 'wtf', 'motherfucker', 'cocksucker',
];

const BAD_WORDS_HI = [
  'madarchod', 'bhenchod', 'chutiya', 'gaand', 'lund', 'randi',
  'harami', 'kamina', 'saala', 'bhosdike', 'lavde', 'gandu',
  'mc', 'bc', 'bsdk',
];

const THREAT_PATTERNS = [
  /kill\s*(you|him|her|them|everyone)/i,
  /bomb\s*threat/i,
  /hack\s*(you|this|the)/i,
  /i('ll|will)\s*(destroy|ruin|break)/i,
  /threat(en)?/i,
  /blackmail/i,
  /extort/i,
];

// Prohibited business/activity patterns — AIRA must NEVER assist with these
const PROHIBITED_ACTIVITY_PATTERNS = [
  /gambling/i, /casino/i, /betting/i, /slot\s*machine/i, /poker\s*site/i,
  /scam(ming)?/i, /phishing/i, /fraud(ulent)?/i, /ponzi/i, /pyramid\s*scheme/i,
  /money\s*launder/i, /fake\s*(website|product|review)/i, /counterfeit/i,
  /dark\s*web/i, /illegal\s*(drug|weapon|content)/i, /exploit(ation)?/i,
  /spam(ming)?/i, /click\s*farm/i, /fake\s*traffic/i, /bot\s*farm/i,
  /adult\s*(content|site|website)/i, /porn/i,
  /mlm/i, /get\s*rich\s*quick/i, /fake\s*promise/i,
];

const ALL_BAD_WORDS = [...BAD_WORDS_EN, ...BAD_WORDS_HI];

export interface ContentFilterResult {
  isClean: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
  blockedWords: string[];
  penaltyLevel: number; // 0-5
  warningMessage: string;
}

export function filterContent(text: string): ContentFilterResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true, severity: 'none', blockedWords: [], penaltyLevel: 0, warningMessage: '' };
  }

  const lowerText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const blockedWords: string[] = [];

  // Check bad words
  for (const word of ALL_BAD_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      blockedWords.push(word);
    }
  }

  // Check threat patterns
  let hasThreat = false;
  for (const pattern of THREAT_PATTERNS) {
    if (pattern.test(text)) {
      hasThreat = true;
      blockedWords.push('[threat pattern]');
      break;
    }
  }

  // Check prohibited business activities
  let hasProhibitedActivity = false;
  for (const pattern of PROHIBITED_ACTIVITY_PATTERNS) {
    if (pattern.test(text)) {
      hasProhibitedActivity = true;
      blockedWords.push('[prohibited activity]');
      break;
    }
  }

  if (blockedWords.length === 0) {
    return { isClean: true, severity: 'none', blockedWords: [], penaltyLevel: 0, warningMessage: '' };
  }

  // Determine severity
  let severity: ContentFilterResult['severity'] = 'mild';
  let penaltyLevel = 1;

  if (hasThreat) {
    severity = 'critical';
    penaltyLevel = 4;
  } else if (hasProhibitedActivity) {
    severity = 'severe';
    penaltyLevel = 3;
  } else if (blockedWords.length >= 3) {
    severity = 'severe';
    penaltyLevel = 3;
  } else if (blockedWords.length >= 2) {
    severity = 'moderate';
    penaltyLevel = 2;
  }

  const warningMessage = hasProhibitedActivity
    ? '🚫 Software Vala does not support gambling, scamming, fraud, or any illegal/unethical business activities. This request has been blocked and logged.'
    : severity === 'critical'
    ? '⚠️ Your message contains threatening language and has been blocked. This incident has been reported.'
    : severity === 'severe'
    ? '⚠️ Please maintain respectful and professional language. Repeated violations may result in account restrictions.'
    : '⚠️ Please keep the conversation respectful and professional. Your message has been blocked.';

  return { isClean: false, severity, blockedWords, penaltyLevel, warningMessage };
}

// Log content violation to audit
export async function logContentViolation(
  supabaseAdmin: any,
  userId: string | null,
  role: string,
  severity: string,
  blockedWords: string[],
  penaltyLevel: number,
) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id: userId,
      role,
      module: 'content_filter',
      action: `content_violation_level_${penaltyLevel}`,
      meta_json: {
        severity,
        blocked_words_count: blockedWords.length,
        penalty_level: penaltyLevel,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.error("Content violation log failed:", e);
  }
}
