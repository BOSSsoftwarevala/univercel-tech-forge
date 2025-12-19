// Chat Security Utilities for Software Vala Internal Chat Hub

// Mask phone numbers: 9991234567 -> 999****567
export const maskPhone = (text: string): string => {
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})/g;
  return text.replace(phoneRegex, (match, country, first, middle, last) => {
    return `${country || ''}${first}****${last.slice(-2)}`;
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
  const cleanedText = text.replace(urlRegex, '[LINK BLOCKED]');
  return { text: cleanedText, blocked: hasLinks };
};

// Block physical addresses (basic detection)
export const blockAddress = (text: string): { text: string; blocked: boolean } => {
  // Detect common address patterns
  const addressPatterns = [
    /\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|highway|hwy|square|sq|trail|trl|drive|dr|court|ct|parkway|pkwy|circle|cir|boulevard|blvd)\b/gi,
    /\b(?:apt|apartment|suite|ste|unit|#)\s*\d+/gi,
    /\b\d{5,6}\b/g, // ZIP/PIN codes
  ];
  
  let blocked = false;
  let processedText = text;
  
  addressPatterns.forEach(pattern => {
    if (pattern.test(processedText)) {
      blocked = true;
      processedText = processedText.replace(pattern, '[ADDRESS BLOCKED]');
    }
  });
  
  return { text: processedText, blocked };
};

// Detect profanity (basic list - extend as needed)
const profanityList = ['damn', 'hell', 'crap', 'stupid', 'idiot', 'hate'];

export const detectProfanity = (text: string): { hasProfanity: boolean; words: string[] } => {
  const lowerText = text.toLowerCase();
  const foundWords = profanityList.filter(word => lowerText.includes(word));
  return { hasProfanity: foundWords.length > 0, words: foundWords };
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

// Process message with all security filters
export const processMessage = (text: string): {
  processedText: string;
  violations: string[];
  isMasked: boolean;
} => {
  const violations: string[] = [];
  let processedText = text;
  let isMasked = false;

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

  return { processedText, violations, isMasked };
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
    return 'bg-primary/20 border-primary/50'; // neon cyan
  }
  const managerRoles = ['task_manager', 'performance', 'finance', 'hr', 'legal'];
  if (managerRoles.includes(role)) {
    return 'bg-neon-blue/20 border-neon-blue/50'; // neon blue
  }
  return 'bg-secondary/50 border-border/50'; // muted blue
};

// Violation level actions
export const getViolationAction = (violationCount: number): {
  level: number;
  action: string;
  message: string;
} => {
  if (violationCount >= 3) {
    return {
      level: 3,
      action: 'force_logout',
      message: 'You have been logged out due to repeated policy violations. This incident has been reported to Super Admin.',
    };
  }
  if (violationCount === 2) {
    return {
      level: 2,
      action: 'temporary_mute',
      message: 'You have been temporarily muted for 30 minutes due to policy violations.',
    };
  }
  return {
    level: 1,
    action: 'warning',
    message: 'Warning: Sharing contact details is prohibited. Continued violations may lead to account restrictions.',
  };
};

// Anti-leak protection CSS
export const antiLeakStyles = `
  .secure-chat-container {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .secure-chat-container * {
    -webkit-touch-callout: none;
  }
  
  @media print {
    .secure-chat-container {
      display: none !important;
    }
  }
`;

// Watermark for screen recording detection
export const generateWatermark = (userId: string): string => {
  const timestamp = Date.now();
  return `SV-${userId.slice(0, 8)}-${timestamp}`;
};
