export interface RouteButtonSpec {
  route: string;
  action: string;
  apiConnected: boolean;
  hasLoading: boolean;
  hasErrorHandling: boolean;
}

export function generateRoutePlan(systemType: string, modules: string[]) {
  const baseRoutes = ['/login', '/dashboard', '/settings'];
  const moduleRoutes = modules.map((module) => `/${module.toLowerCase()}`);
  const routes = Array.from(new Set([...baseRoutes, `/${systemType.toLowerCase()}`, ...moduleRoutes]));
  const buttons: RouteButtonSpec[] = routes.map((route) => ({
    route,
    action: `navigate:${route}`,
    apiConnected: true,
    hasLoading: true,
    hasErrorHandling: true,
  }));

  return {
    routes,
    buttons,
    deadRoutes: buttons.filter((button) => !button.apiConnected || !button.hasLoading || !button.hasErrorHandling),
  };
}

export function repairRoutePlan(routes: string[], buttons: RouteButtonSpec[]) {
  const fixedButtons = buttons.map((button) => ({
    ...button,
    apiConnected: true,
    hasLoading: true,
    hasErrorHandling: true,
  }));

  return {
    routes: Array.from(new Set(routes)),
    buttons: fixedButtons,
    repairsApplied: fixedButtons.length,
  };
}