export interface SelfHealIssue {
  area: 'ui' | 'api' | 'db' | 'deploy' | 'license';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  fixAction: string;
}

export function analyzeSystemIssues(input: {
  routes: string[];
  buttonsHealthy: boolean;
  apiCount: number;
  dbTableCount: number;
  deploymentReady: boolean;
  licenseReady: boolean;
}) {
  const issues: SelfHealIssue[] = [];

  if (!input.buttonsHealthy || input.routes.length === 0) {
    issues.push({ area: 'ui', severity: 'high', message: 'Dead routes or buttons detected', fixAction: 'rerun_router_fixer' });
  }
  if (input.apiCount === 0) {
    issues.push({ area: 'api', severity: 'critical', message: 'No executable API plan generated', fixAction: 'regenerate_api_layer' });
  }
  if (input.dbTableCount === 0) {
    issues.push({ area: 'db', severity: 'critical', message: 'Database schema missing', fixAction: 'regenerate_db_plan' });
  }
  if (!input.deploymentReady) {
    issues.push({ area: 'deploy', severity: 'high', message: 'Deployment plan incomplete', fixAction: 'rebuild_deploy_plan' });
  }
  if (!input.licenseReady) {
    issues.push({ area: 'license', severity: 'high', message: 'License lock not configured', fixAction: 'rebuild_license_lock' });
  }

  return {
    issues,
    retryRecommended: issues.some((issue) => issue.severity === 'critical' || issue.severity === 'high'),
  };
}