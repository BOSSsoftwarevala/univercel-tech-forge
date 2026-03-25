export interface ScalingPlan {
  autoscale: boolean;
  cacheLayers: string[];
  queryOptimization: boolean;
  splitServices: boolean;
}

export function generateScalingPlan(systemType: string, modules: string[]) {
  const highTraffic = ['marketplace', 'crm', 'erp'].includes(systemType.toLowerCase()) || modules.length >= 4;
  return {
    autoscale: true,
    cacheLayers: highTraffic ? ['edge-cache', 'query-cache', 'session-cache'] : ['query-cache'],
    queryOptimization: true,
    splitServices: highTraffic,
  } satisfies ScalingPlan;
}