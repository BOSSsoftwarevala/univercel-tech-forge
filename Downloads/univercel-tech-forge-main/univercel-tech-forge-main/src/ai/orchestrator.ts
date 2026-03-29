import { getAIProviderFallbackChain, getProviderByCapability } from '@/config/ai-providers';
import { generateDatabasePlan } from '@/ai/db-generator';
import { generateRoutePlan } from '@/ai/router-fixer';
import { analyzeSystemIssues } from '@/ai/self-heal';
import { generateDeploymentPlan } from '@/ai/deployer';
import { buildLicenseLock } from '@/ai/license-engine';
import { generateScalingPlan } from '@/ai/scaling';
import { generateEventPlan } from '@/ai/event-engine';

export interface ValaBuildRequest {
  prompt: string;
  productId?: string | null;
  userId?: string | null;
  orderId?: string | null;
  systemType?: string | null;
  modules?: string[];
  targetPlatform?: 'web' | 'apk' | 'pwa' | 'local';
}

export interface ValaBuildPlan {
  systemType: string;
  modules: string[];
  pipeline: string[];
  providers: {
    reasoning: string;
    architecture: string;
    ui: string;
    fallback: string[];
  };
  database: ReturnType<typeof generateDatabasePlan>;
  routing: ReturnType<typeof generateRoutePlan>;
  deployment: ReturnType<typeof generateDeploymentPlan>;
  license: ReturnType<typeof buildLicenseLock>;
  scaling: ReturnType<typeof generateScalingPlan>;
  events: ReturnType<typeof generateEventPlan>;
  selfHeal: ReturnType<typeof analyzeSystemIssues>;
}

const SYSTEM_KEYWORDS: Record<string, string[]> = {
  erp: ['erp', 'inventory', 'procurement', 'finance'],
  crm: ['crm', 'leads', 'sales', 'pipeline'],
  school: ['school', 'student', 'attendance', 'exam'],
  hospital: ['hospital', 'patient', 'doctor', 'clinic'],
  marketplace: ['marketplace', 'catalog', 'seller', 'checkout'],
  transport: ['transport', 'fleet', 'trip', 'dispatch'],
};

function detectSystemType(prompt: string, explicitType?: string | null) {
  if (explicitType) {
    return explicitType.toLowerCase();
  }

  const lower = prompt.toLowerCase();
  for (const [systemType, keywords] of Object.entries(SYSTEM_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return systemType;
    }
  }

  return 'custom';
}

function detectModules(prompt: string, explicitModules?: string[]) {
  if (explicitModules && explicitModules.length > 0) {
    return Array.from(new Set(explicitModules.map((module) => module.toLowerCase())));
  }

  const lower = prompt.toLowerCase();
  const modules = ['auth', 'dashboard'];
  Object.entries(SYSTEM_KEYWORDS).forEach(([moduleKey, keywords]) => {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      modules.push(moduleKey);
    }
  });
  if (lower.includes('offline')) {
    modules.push('offline');
  }
  if (lower.includes('notification')) {
    modules.push('notifications');
  }
  return Array.from(new Set(modules));
}

export const VALA_PIPELINE_STEPS = [
  'Understanding Prompt',
  'Requirement Analysis',
  'Feature Mapping',
  'Screen Generation',
  'API Generation',
  'DB Design',
  'Flow Creation',
  'Build Packaging',
  'Deploy',
  'Verify',
  'Auto Fix',
];

export function createValaBuildPlan(request: ValaBuildRequest): ValaBuildPlan {
  const systemType = detectSystemType(request.prompt, request.systemType);
  const modules = detectModules(request.prompt, request.modules);
  const routing = generateRoutePlan(systemType, modules);
  const database = generateDatabasePlan(systemType, modules);
  const deployment = generateDeploymentPlan(request.targetPlatform || (request.prompt.toLowerCase().includes('apk') ? 'apk' : 'web'));
  const license = buildLicenseLock({ userId: request.userId, orderId: request.orderId, productId: request.productId });
  const scaling = generateScalingPlan(systemType, modules);
  const events = generateEventPlan(systemType, modules);
  const selfHeal = analyzeSystemIssues({
    routes: routing.routes,
    buttonsHealthy: routing.deadRoutes.length === 0,
    apiCount: Math.max(modules.length, 1),
    dbTableCount: database.tables.length,
    deploymentReady: deployment.steps.length > 0,
    licenseReady: license.encrypted,
  });

  return {
    systemType,
    modules,
    pipeline: VALA_PIPELINE_STEPS,
    providers: {
      reasoning: getProviderByCapability('reasoning')?.name || 'Fallback Local Planner',
      architecture: getProviderByCapability('architecture')?.name || 'Fallback Architecture Planner',
      ui: getProviderByCapability('ui')?.name || 'Fallback UI Planner',
      fallback: getAIProviderFallbackChain().map((provider) => provider.name),
    },
    database,
    routing,
    deployment,
    license,
    scaling,
    events,
    selfHeal,
  };
}