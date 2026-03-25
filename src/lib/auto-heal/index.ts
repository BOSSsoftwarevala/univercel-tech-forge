/**
 * Auto-Healing System Core
 * Central module for self-healing, monitoring, and optimization
 */

// ============================================================================
// HEALTH THRESHOLDS
// ============================================================================

export const HEALTH_THRESHOLDS = {
  // Chat
  chat: {
    maxLatency: 500, // ms
    maxPendingMessages: 1000,
    maxConnectionsPerUser: 3,
    staleSessionHours: 2,
  },

  // Buzzer
  buzzer: {
    maxPendingAlerts: 50,
    maxEscalationTimeMinutes: 30,
    criticalQueueSize: 100,
  },

  // Demo
  demo: {
    maxLoadTimeMs: 3000,
    maxConcurrentUsers: 500,
    uptimeThreshold: 0.995, // 99.5%
  },

  // Wallet
  wallet: {
    maxPendingTransactions: 100,
    maxProcessingTimeSeconds: 30,
    failureRateThreshold: 0.02, // 2%
  },

  // API
  api: {
    maxLatencyMs: 1000,
    errorRateThreshold: 0.01, // 1%
    requestsPerMinuteThreshold: 10000,
  },

  // WebSocket
  websocket: {
    maxConnections: 5000,
    reconnectDelayMs: 5000,
    heartbeatIntervalMs: 30000,
  },
};

// ============================================================================
// HEALING ACTIONS
// ============================================================================

export type HealingActionType =
  | 'restart_module'
  | 'reassign_task'
  | 'retry_transaction'
  | 'escalate_alert'
  | 'block_threat'
  | 'reroute_demo'
  | 'scale_service'
  | 'clear_cache'
  | 'cleanup_sessions';

export interface HealingAction {
  type: HealingActionType;
  target: string;
  reason: string;
  timestamp: string;
  success: boolean;
  result?: any;
}

// ============================================================================
// MONITORING INTERVALS
// ============================================================================

export const MONITORING_INTERVALS = {
  healthCheck: 2 * 60 * 1000,        // 2 minutes
  metricsCollection: 1 * 60 * 1000,   // 1 minute
  securityScan: 5 * 60 * 1000,        // 5 minutes
  selfHealing: 15 * 60 * 1000,        // 15 minutes
  optimization: 60 * 60 * 1000,       // 1 hour
  slaPrioritization: 10 * 60 * 1000,  // 10 minutes
};

// ============================================================================
// SEVERITY LEVELS
// ============================================================================

export const SEVERITY = {
  INFO: 0,
  WARNING: 1,
  ERROR: 2,
  CRITICAL: 3,
  EMERGENCY: 4,
} as const;

export type SeverityLevel = typeof SEVERITY[keyof typeof SEVERITY];

export function getSeverityLabel(level: SeverityLevel): string {
  const labels: Record<SeverityLevel, string> = {
    [SEVERITY.INFO]: 'Info',
    [SEVERITY.WARNING]: 'Warning',
    [SEVERITY.ERROR]: 'Error',
    [SEVERITY.CRITICAL]: 'Critical',
    [SEVERITY.EMERGENCY]: 'Emergency',
  };
  return labels[level] || 'Unknown';
}

export function getSeverityColor(level: SeverityLevel): string {
  const colors: Record<SeverityLevel, string> = {
    [SEVERITY.INFO]: 'text-blue-500',
    [SEVERITY.WARNING]: 'text-yellow-500',
    [SEVERITY.ERROR]: 'text-orange-500',
    [SEVERITY.CRITICAL]: 'text-red-500',
    [SEVERITY.EMERGENCY]: 'text-red-700',
  };
  return colors[level] || 'text-muted-foreground';
}

// ============================================================================
// FAILURE DETECTION PATTERNS
// ============================================================================

export const FAILURE_PATTERNS = {
  // Task stuck patterns
  taskStuck: {
    noUpdateHours: 4,
    maxRetries: 3,
    escalationPath: ['task_manager', 'performance_manager', 'admin', 'super_admin'],
  },

  // Transaction failure patterns
  transactionFailure: {
    maxRetries: 3,
    retryDelayMs: [5000, 30000, 120000], // Exponential backoff
    alertThreshold: 5, // Alert after 5 failures
  },

  // Session anomalies
  sessionAnomaly: {
    maxIPChanges: 3,
    maxDeviceChanges: 2,
    suspiciousLoginWindow: 60 * 60 * 1000, // 1 hour
  },

  // Rate limit violations
  rateLimit: {
    warningThreshold: 0.8, // 80% of limit
    blockThreshold: 1.2,   // 120% of limit
    blockDurationMinutes: 15,
  },
};

// ============================================================================
// OPTIMIZATION STRATEGIES
// ============================================================================

export const OPTIMIZATION_STRATEGIES = {
  // Log optimization
  logs: {
    retentionDays: 90,
    archiveAfterDays: 30,
    compressionEnabled: true,
    batchSize: 1000,
  },

  // Cache optimization
  cache: {
    ttlSeconds: 300,
    maxSize: 10000,
    evictionPolicy: 'lru',
  },

  // Connection pooling
  connections: {
    minPoolSize: 10,
    maxPoolSize: 100,
    idleTimeoutMs: 30000,
    maxWaitMs: 5000,
  },

  // Query optimization
  queries: {
    timeoutMs: 10000,
    maxRows: 1000,
    indexHints: true,
  },
};

// ============================================================================
// DEVELOPER SKILL MATCHING
// ============================================================================

export const SKILL_CATEGORIES = {
  backend: ['node', 'nodejs', 'express', 'php', 'laravel', 'python', 'django', 'ruby', 'rails', 'java', 'spring', 'go', 'rust'],
  frontend: ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'sass'],
  mobile: ['react-native', 'flutter', 'swift', 'kotlin', 'android', 'ios', 'xamarin'],
  database: ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'supabase', 'firebase'],
  devops: ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci-cd', 'terraform', 'ansible'],
  ai: ['machine-learning', 'tensorflow', 'pytorch', 'nlp', 'computer-vision', 'openai', 'llm'],
};

export function categorizeSkill(skill: string): string {
  const lowerSkill = skill.toLowerCase();
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    if (skills.some(s => lowerSkill.includes(s))) {
      return category;
    }
  }
  return 'general';
}

export function calculateSkillMatch(developerSkills: string[], taskTechStack: string[]): number {
  if (!taskTechStack.length) return 0.5; // Default match for unspecified tech

  const matches = taskTechStack.filter(tech =>
    developerSkills.some(skill =>
      skill.toLowerCase().includes(tech.toLowerCase()) ||
      tech.toLowerCase().includes(skill.toLowerCase())
    )
  );

  return matches.length / taskTechStack.length;
}

// ============================================================================
// SLA PRIORITIZATION
// ============================================================================

export interface SLAConfig {
  criticalHours: number;
  highHours: number;
  mediumHours: number;
  lowHours: number;
}

export const DEFAULT_SLA: SLAConfig = {
  criticalHours: 2,
  highHours: 8,
  mediumHours: 24,
  lowHours: 72,
};

export function calculateSLAPriority(
  deadline: Date,
  currentPriority: string,
  slaConfig: SLAConfig = DEFAULT_SLA
): string {
  const hoursUntil = (deadline.getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntil < slaConfig.criticalHours) return 'critical';
  if (hoursUntil < slaConfig.highHours) return 'high';
  if (hoursUntil < slaConfig.mediumHours) return 'medium';
  return 'low';
}

// ============================================================================
// PREDICTIVE SCALING
// ============================================================================

export interface ScalingPrediction {
  needsScaling: boolean;
  recommendedCapacity: number;
  confidence: number;
  reason: string;
}

export function predictScalingNeed(
  currentLoad: number,
  historicalPeakLoad: number,
  currentCapacity: number,
  peakHours: number[],
  currentHour: number
): ScalingPrediction {
  const isPeakHour = peakHours.includes(currentHour);
  const utilizationRate = currentLoad / currentCapacity;

  if (utilizationRate > 0.8) {
    return {
      needsScaling: true,
      recommendedCapacity: Math.ceil(currentCapacity * 1.5),
      confidence: 0.9,
      reason: 'High current utilization',
    };
  }

  if (isPeakHour && utilizationRate > 0.5) {
    return {
      needsScaling: true,
      recommendedCapacity: Math.ceil(historicalPeakLoad * 1.2),
      confidence: 0.75,
      reason: 'Peak hour approaching with moderate load',
    };
  }

  return {
    needsScaling: false,
    recommendedCapacity: currentCapacity,
    confidence: 0.8,
    reason: 'Current capacity sufficient',
  };
}

// ============================================================================
// FRAUD DETECTION PATTERNS
// ============================================================================

export const FRAUD_INDICATORS = {
  commission: {
    unusuallyHighAmount: 10000,
    rapidClaims: 5, // claims per hour
    suspiciousPatternScore: 0.7,
  },

  wallet: {
    rapidTransactions: 20, // per hour
    unusualAmountThreshold: 50000,
    roundAmountPattern: true,
  },

  login: {
    failedAttemptsThreshold: 5,
    unusualTimeWindow: true,
    vpnDetection: true,
  },

  behavior: {
    automatedPatternScore: 0.8,
    unusualNavigationPattern: true,
    impossibleTravelAlert: true,
  },
};

export function calculateFraudScore(indicators: Partial<typeof FRAUD_INDICATORS>): number {
  let score = 0;
  let factors = 0;

  if (indicators.commission) {
    factors++;
    // Add scoring logic
  }

  if (indicators.wallet) {
    factors++;
    // Add scoring logic
  }

  if (indicators.login) {
    factors++;
    // Add scoring logic
  }

  return factors > 0 ? score / factors : 0;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  HEALTH_THRESHOLDS,
  MONITORING_INTERVALS,
  SEVERITY,
  FAILURE_PATTERNS,
  OPTIMIZATION_STRATEGIES,
  SKILL_CATEGORIES,
  FRAUD_INDICATORS,
  getSeverityLabel,
  getSeverityColor,
  categorizeSkill,
  calculateSkillMatch,
  calculateSLAPriority,
  predictScalingNeed,
  calculateFraudScore,
};
