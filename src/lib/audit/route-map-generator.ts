// ================================================================
// Route Map Generator - Generates complete API and UI route map
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface RouteMapEntry {
  screen: string;
  path: string;
  requiredRoles: string[];
  associatedAPIRoutes: {
    path: string;
    method: string;
    authRequired: boolean;
    rateLimit: boolean;
    status: 'active' | 'deprecated' | 'broken';
  }[];
  httpMethods: string[];
  isPublic: boolean;
  hasBreadcrumb: boolean;
  childRoutes: string[];
  status: 'active' | 'deprecated' | 'broken';
}

export interface RouteMapReport {
  totalScreens: number;
  publicScreens: number;
  protectedScreens: number;
  activeRoutes: number;
  deprecatedRoutes: number;
  brokenRoutes: number;
  routeMap: RouteMapEntry[];
  timestamp: string;
}

// Complete UI screen to route mapping
export const ROUTE_MAP: RouteMapEntry[] = [
  {
    screen: 'Login / Authentication',
    path: '/auth',
    requiredRoles: [],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-auth/login', method: 'POST', authRequired: false, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-auth/register', method: 'POST', authRequired: false, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['POST'],
    isPublic: true,
    hasBreadcrumb: false,
    childRoutes: [],
    status: 'active',
  },
  {
    screen: 'Super Admin Dashboard',
    path: '/super-admin',
    requiredRoles: ['boss_owner', 'ceo'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-admin/users', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-admin/roles', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/super-admin/users', '/super-admin/roles', '/super-admin/settings'],
    status: 'active',
  },
  {
    screen: 'Lead Manager Dashboard',
    path: '/leads',
    requiredRoles: ['lead_manager', 'franchise', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-leads', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-leads/create', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-leads/export', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/leads/pipeline', '/leads/analytics'],
    status: 'active',
  },
  {
    screen: 'Finance Manager Dashboard',
    path: '/finance',
    requiredRoles: ['finance_manager', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-wallet/ledger', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-wallet/payout', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/finance/wallets', '/finance/payouts', '/finance/reports'],
    status: 'active',
  },
  {
    screen: 'Demo Manager Dashboard',
    path: '/demos',
    requiredRoles: ['demo_manager', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-demo', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-demo/create', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/demos/products', '/demos/health'],
    status: 'active',
  },
  {
    screen: 'R&D Dashboard',
    path: '/rnd',
    requiredRoles: ['rnd_manager', 'r_and_d', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-rnd/approve', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-rnd/suggest', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/rnd/suggestions', '/rnd/roadmap'],
    status: 'active',
  },
  {
    screen: 'Franchise Dashboard',
    path: '/franchise',
    requiredRoles: ['franchise'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-leads', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-resellers', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/franchise/leads', '/franchise/resellers'],
    status: 'active',
  },
  {
    screen: 'Reseller Dashboard',
    path: '/reseller',
    requiredRoles: ['reseller'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-leads', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: [],
    status: 'active',
  },
  {
    screen: 'Developer Dashboard',
    path: '/developer',
    requiredRoles: ['developer'],
    associatedAPIRoutes: [],
    httpMethods: ['GET'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/developer/tasks'],
    status: 'active',
  },
  {
    screen: 'Support Dashboard',
    path: '/support',
    requiredRoles: ['support', 'client_success', 'prime', 'client'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-support/tickets', method: 'GET', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-support/ticket', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/support/tickets', '/support/knowledge'],
    status: 'active',
  },
  {
    screen: 'Legal Compliance Dashboard',
    path: '/legal',
    requiredRoles: ['legal_compliance', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-legal/case', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/legal/documents', '/legal/compliance'],
    status: 'active',
  },
  {
    screen: 'HR Dashboard',
    path: '/hr',
    requiredRoles: ['hr_manager', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-hr/job', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/hr/hiring', '/hr/onboarding'],
    status: 'active',
  },
  {
    screen: 'SEO Dashboard',
    path: '/seo',
    requiredRoles: ['seo_manager', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-seo/keyword', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/seo/keywords', '/seo/analytics'],
    status: 'active',
  },
  {
    screen: 'Performance Manager Dashboard',
    path: '/performance',
    requiredRoles: ['performance_manager', 'boss_owner'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-performance/escalate', method: 'POST', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'POST'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: ['/performance/developers', '/performance/escalations'],
    status: 'active',
  },
  {
    screen: 'Settings',
    path: '/settings',
    requiredRoles: ['authenticated'],
    associatedAPIRoutes: [
      { path: '/functions/v1/api-settings/update', method: 'PUT', authRequired: true, rateLimit: true, status: 'active' },
      { path: '/functions/v1/api-user/profile', method: 'PATCH', authRequired: true, rateLimit: true, status: 'active' },
    ],
    httpMethods: ['GET', 'PUT', 'PATCH'],
    isPublic: false,
    hasBreadcrumb: true,
    childRoutes: [],
    status: 'active',
  },
  {
    screen: 'Homepage / Landing',
    path: '/',
    requiredRoles: [],
    associatedAPIRoutes: [],
    httpMethods: ['GET'],
    isPublic: true,
    hasBreadcrumb: false,
    childRoutes: [],
    status: 'active',
  },
  {
    screen: '404 Not Found',
    path: '*',
    requiredRoles: [],
    associatedAPIRoutes: [],
    httpMethods: ['GET'],
    isPublic: true,
    hasBreadcrumb: false,
    childRoutes: [],
    status: 'active',
  },
];

export function generateRouteMap(): RouteMapReport {
  const publicScreens = ROUTE_MAP.filter(r => r.isPublic).length;
  const protectedScreens = ROUTE_MAP.filter(r => !r.isPublic).length;
  const activeRoutes = ROUTE_MAP.filter(r => r.status === 'active').length;
  const deprecatedRoutes = ROUTE_MAP.filter(r => r.status === 'deprecated').length;
  const brokenRoutes = ROUTE_MAP.filter(r => r.status === 'broken').length;

  return {
    totalScreens: ROUTE_MAP.length,
    publicScreens,
    protectedScreens,
    activeRoutes,
    deprecatedRoutes,
    brokenRoutes,
    routeMap: ROUTE_MAP,
    timestamp: new Date().toISOString(),
  };
}
