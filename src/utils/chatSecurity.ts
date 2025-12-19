// Chat Security Utilities for Software Vala Internal Chat Hub

// Sentiment Analysis Types
export type SentimentScore = 'positive' | 'neutral' | 'negative' | 'aggressive';

// Channel Categories with allowed topics
export const channelCategories: Record<string, {
  allowedTopics: string[];
  blockedKeywords: string[];
  description: string;
}> = {
  developer: {
    allowedTopics: ['task', 'code', 'bug', 'feature', 'deployment', 'review', 'commit', 'branch', 'merge'],
    blockedKeywords: ['salary', 'personal', 'vacation', 'holiday'],
    description: 'Tasks & Code Only'
  },
  sales: {
    allowedTopics: ['lead', 'closure', 'demo', 'client', 'prospect', 'deal', 'pipeline', 'conversion'],
    blockedKeywords: ['personal', 'gossip'],
    description: 'Leads & Closures Only'
  },
  support: {
    allowedTopics: ['ticket', 'issue', 'bug', 'resolution', 'escalation', 'customer', 'query'],
    blockedKeywords: ['personal', 'gossip'],
    description: 'Tickets Only'
  },
  finance: {
    allowedTopics: ['payout', 'commission', 'invoice', 'payment', 'wallet', 'transaction', 'refund'],
    blockedKeywords: ['personal', 'gossip'],
    description: 'Payouts & Commissions Only'
  },
  general: {
    allowedTopics: [],
    blockedKeywords: ['personal', 'gossip', 'politics'],
    description: 'Work Discussion'
  }
};

// Mask phone numbers: 9991234567 -> 999****567
export const maskPhone = (text: string): string => {
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})/g;
  return text.replace(phoneRegex, (match, country, first, middle, last) => {
    return `${country || ''}${first}****${last?.slice(-2) || '**'}`;
  });
};

// Mask email: john.doe@example.com -> joh***@example.com
export const maskEmail = (text: string): string => {
  const emailRegex = /([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  return text.replace(emailRegex, (match, local, domain) => {
    const maskedLocal = local.slice(0, 3) + '***';
    return `${maskedLocal}@${domain}`;
  });
};

// Block URLs and links
export const blockLinks = (text: string): { text: string; blocked: boolean } => {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\b[a-zA-Z0-9-]+\.(com|net|org|io|co|in|uk|us|edu|gov|info|biz)\b)/gi;
  const hasLinks = urlRegex.test(text);
  const cleanedText = text.replace(urlRegex, '[🔒 LINK BLOCKED]');
  return { text: cleanedText, blocked: hasLinks };
};

// Block physical addresses (basic detection)
export const blockAddress = (text: string): { text: string; blocked: boolean } => {
  const addressPatterns = [
    /\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|highway|hwy|square|sq|trail|trl|drive|dr|court|ct|parkway|pkwy|circle|cir|boulevard|blvd)\b/gi,
    /\b(?:apt|apartment|suite|ste|unit|#)\s*\d+/gi,
    /\b\d{5,6}\b/g,
  ];
  
  let blocked = false;
  let processedText = text;
  
  addressPatterns.forEach(pattern => {
    if (pattern.test(processedText)) {
      blocked = true;
      processedText = processedText.replace(pattern, '[🔒 ADDRESS BLOCKED]');
    }
  });
  
  return { text: processedText, blocked };
};

// Enhanced profanity detection
const profanityList = ['damn', 'hell', 'crap', 'stupid', 'idiot', 'hate', 'fool', 'dumb'];
const aggressivePatterns = [
  /\b(kill|destroy|attack|threat|warn you|watch out)\b/gi,
  /(!{3,})/g,
  /\b(you will pay|revenge|punish)\b/gi,
];

export const detectProfanity = (text: string): { hasProfanity: boolean; words: string[] } => {
  const lowerText = text.toLowerCase();
  const foundWords = profanityList.filter(word => lowerText.includes(word));
  return { hasProfanity: foundWords.length > 0, words: foundWords };
};

export const detectAggression = (text: string): boolean => {
  return aggressivePatterns.some(pattern => pattern.test(text));
};

// Sentiment Analysis (simplified)
export const analyzeSentiment = (text: string): {
  score: SentimentScore;
  confidence: number;
  emoji: string;
} => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['great', 'good', 'excellent', 'thanks', 'appreciate', 'awesome', 'perfect', 'done', 'completed', 'success'];
  const negativeWords = ['bad', 'issue', 'problem', 'error', 'fail', 'wrong', 'delay', 'stuck', 'blocked'];
  const aggressiveWords = ['hate', 'angry', 'frustrated', 'terrible', 'worst', 'useless'];
  
  const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
  const aggressiveCount = aggressiveWords.filter(w => lowerText.includes(w)).length;
  
  if (aggressiveCount > 0 || detectAggression(text)) {
    return { score: 'aggressive', confidence: 0.8, emoji: '😠' };
  }
  if (positiveCount > negativeCount) {
    return { score: 'positive', confidence: 0.7, emoji: '😊' };
  }
  if (negativeCount > positiveCount) {
    return { score: 'negative', confidence: 0.6, emoji: '😟' };
  }
  return { score: 'neutral', confidence: 0.5, emoji: '😐' };
};

// Detect contact sharing attempts
export const detectContactSharing = (text: string): {
  hasPhone: boolean;
  hasEmail: boolean;
  hasLink: boolean;
  hasAddress: boolean;
} => {
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})/g;
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  const addressKeywords = /\b(street|avenue|road|highway|apt|apartment|suite|building|floor|block)\b/gi;

  return {
    hasPhone: phoneRegex.test(text),
    hasEmail: emailRegex.test(text),
    hasLink: urlRegex.test(text),
    hasAddress: addressKeywords.test(text),
  };
};

// Check if message is off-topic for channel
export const checkChannelCompliance = (text: string, channelCategory: string): {
  isCompliant: boolean;
  reason?: string;
} => {
  const category = channelCategories[channelCategory];
  if (!category) return { isCompliant: true };
  
  const lowerText = text.toLowerCase();
  
  // Check blocked keywords
  const hasBlocked = category.blockedKeywords.some(kw => lowerText.includes(kw));
  if (hasBlocked) {
    return { isCompliant: false, reason: 'Off-topic content detected' };
  }
  
  return { isCompliant: true };
};

// Process message with all security filters
export const processMessage = (text: string, channelCategory?: string): {
  processedText: string;
  violations: string[];
  isMasked: boolean;
  sentiment: { score: SentimentScore; confidence: number; emoji: string };
  isOffTopic: boolean;
} => {
  const violations: string[] = [];
  let processedText = text;
  let isMasked = false;
  let isOffTopic = false;

  // Check channel compliance
  if (channelCategory) {
    const compliance = checkChannelCompliance(text, channelCategory);
    if (!compliance.isCompliant) {
      violations.push('off_topic');
      isOffTopic = true;
    }
  }

  // Check for contact sharing
  const contactCheck = detectContactSharing(text);
  
  if (contactCheck.hasPhone) {
    processedText = maskPhone(processedText);
    violations.push('phone_detected');
    isMasked = true;
  }
  
  if (contactCheck.hasEmail) {
    processedText = maskEmail(processedText);
    violations.push('email_detected');
    isMasked = true;
  }
  
  if (contactCheck.hasLink) {
    const linkResult = blockLinks(processedText);
    processedText = linkResult.text;
    violations.push('link_blocked');
    isMasked = true;
  }
  
  if (contactCheck.hasAddress) {
    const addressResult = blockAddress(processedText);
    processedText = addressResult.text;
    if (addressResult.blocked) {
      violations.push('address_blocked');
      isMasked = true;
    }
  }

  // Check for profanity
  const profanityCheck = detectProfanity(text);
  if (profanityCheck.hasProfanity) {
    violations.push('profanity_detected');
  }

  // Check for aggression
  if (detectAggression(text)) {
    violations.push('aggression_detected');
  }

  // Analyze sentiment
  const sentiment = analyzeSentiment(text);

  return { processedText, violations, isMasked, sentiment, isOffTopic };
};

// Mask user name: John -> J***
export const maskUserName = (name: string): string => {
  if (!name || name.length <= 1) return name;
  return name.charAt(0).toUpperCase() + '***';
};

// Role icons mapping
export const getRoleIcon = (role: string): string => {
  const iconMap: Record<string, string> = {
    super_admin: 'Crown',
    developer: 'Code',
    sales: 'Target',
    support: 'LifeBuoy',
    franchise: 'Building',
    reseller: 'Share2',
    influencer: 'Star',
    seo: 'Globe',
    finance: 'Wallet',
    client_success: 'Heart',
    task_manager: 'ClipboardList',
    performance: 'TrendingUp',
    marketing: 'Megaphone',
    hr: 'Users',
    legal: 'Scale',
    rnd: 'Lightbulb',
    demo_manager: 'Monitor',
    prime_user: 'Crown',
  };
  return iconMap[role] || 'User';
};

// Message bubble color based on role
export const getMessageBubbleClass = (role: string): string => {
  if (role === 'super_admin') {
    return 'bg-cyan-500/20 border-cyan-500/50';
  }
  const managerRoles = ['task_manager', 'performance', 'finance', 'hr', 'legal', 'demo_manager'];
  if (managerRoles.includes(role)) {
    return 'bg-blue-500/20 border-blue-500/50';
  }
  return 'bg-slate-700/50 border-slate-600/50';
};

// Violation level actions
export const getViolationAction = (violationCount: number): {
  level: number;
  action: string;
  message: string;
  duration?: number;
} => {
  if (violationCount >= 3) {
    return {
      level: 3,
      action: 'force_logout',
      message: 'Your account has been suspended due to repeated policy violations. This incident has been reported to Super Admin and logged for legal review.',
    };
  }
  if (violationCount === 2) {
    return {
      level: 2,
      action: 'temporary_mute',
      message: 'You have been muted for 30 minutes due to policy violations. Further violations will result in account suspension.',
      duration: 30,
    };
  }
  return {
    level: 1,
    action: 'warning',
    message: '⚠️ Warning: Sharing contact details or off-topic content is prohibited. This is logged permanently.',
  };
};

// Generate secure watermark
export const generateWatermark = (userId: string): string => {
  const timestamp = Date.now();
  const hash = btoa(`${userId}-${timestamp}`).slice(0, 12);
  return `SV-SECURE-${hash}`;
};

// Get sentiment color
export const getSentimentColor = (score: SentimentScore): string => {
  const colors: Record<SentimentScore, string> = {
    positive: 'text-emerald-400',
    neutral: 'text-slate-400',
    negative: 'text-amber-400',
    aggressive: 'text-red-400',
  };
  return colors[score];
};

// Get sentiment bg
export const getSentimentBg = (score: SentimentScore): string => {
  const colors: Record<SentimentScore, string> = {
    positive: 'bg-emerald-500/10 border-emerald-500/30',
    neutral: 'bg-slate-500/10 border-slate-500/30',
    negative: 'bg-amber-500/10 border-amber-500/30',
    aggressive: 'bg-red-500/10 border-red-500/30',
  };
  return colors[score];
};

// Role access permissions
export const roleChannelAccess: Record<string, string[]> = {
  super_admin: ['*'], // Access to all
  developer: ['developer', 'general', 'support'],
  sales: ['sales', 'general', 'leads'],
  support: ['support', 'general', 'tickets'],
  finance: ['finance', 'general', 'payouts'],
  franchise: ['franchise', 'general', 'leads', 'sales'],
  reseller: ['reseller', 'general', 'leads'],
  influencer: ['influencer', 'general', 'marketing'],
  seo: ['seo', 'general', 'marketing'],
  hr: ['hr', 'general'],
  legal: ['legal', 'general', 'compliance'],
  demo_manager: ['demo', 'general', 'developer'],
  marketing: ['marketing', 'general', 'influencer'],
};