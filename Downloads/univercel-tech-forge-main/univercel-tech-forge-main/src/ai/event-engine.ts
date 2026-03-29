export interface EventChannelPlan {
  realtime: boolean;
  notifications: string[];
  logs: string[];
}

export function generateEventPlan(systemType: string, modules: string[]) {
  const notifications = ['build_started', 'build_completed', 'deploy_ready', 'license_issued'];
  if (modules.includes('marketplace')) {
    notifications.push('purchase_confirmed');
  }

  return {
    realtime: true,
    notifications,
    logs: ['system_runtime', 'api_errors', `${systemType.toLowerCase()}_audit`],
  } satisfies EventChannelPlan;
}