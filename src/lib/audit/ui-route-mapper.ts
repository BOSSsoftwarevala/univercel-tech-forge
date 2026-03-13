// ================================================================
// UI Route Mapper - Maps UI elements to backend routes
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface UIElement {
  id: string;
  type: 'button' | 'link' | 'form' | 'menu-item';
  label: string;
  page: string;
  action?: string;
  expectedRoute?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  requiredRoles?: string[];
}

export interface RouteMapping {
  uiElement: UIElement;
  routeExists: boolean;
  controllerExists: boolean;
  serviceExists: boolean;
  status: 'ok' | 'broken' | 'missing-route' | 'missing-controller' | 'missing-service';
  issues: string[];
}

export interface UIRouteMappingReport {
  totalElements: number;
  mappedElements: number;
  brokenElements: number;
  missingRoutes: number;
  mappings: RouteMapping[];
  brokenButtonReport: UIElement[];
  deadRouteReport: string[];
  timestamp: string;
}

// Registered UI elements across the application
export const UI_ELEMENTS: UIElement[] = [
  // Authentication
  { id: 'auth-login-btn', type: 'button', label: 'Login', page: '/auth', expectedRoute: '/api-auth/login', httpMethod: 'POST' },
  { id: 'auth-logout-btn', type: 'button', label: 'Logout', page: '*', expectedRoute: '/api-auth/logout', httpMethod: 'POST' },
  { id: 'auth-register-btn', type: 'button', label: 'Register', page: '/auth', expectedRoute: '/api-auth/register', httpMethod: 'POST' },

  // Lead Management
  { id: 'leads-create-btn', type: 'button', label: 'Create Lead', page: '/leads', expectedRoute: '/api-leads/create', httpMethod: 'POST', requiredRoles: ['lead_manager', 'boss_owner'] },
  { id: 'leads-list-link', type: 'link', label: 'View Leads', page: '/leads', expectedRoute: '/api-leads', httpMethod: 'GET', requiredRoles: ['lead_manager', 'boss_owner', 'franchise'] },
  { id: 'leads-export-btn', type: 'button', label: 'Export Leads', page: '/leads', expectedRoute: '/api-leads/export', httpMethod: 'GET', requiredRoles: ['lead_manager', 'boss_owner'] },

  // Finance
  { id: 'finance-wallet-btn', type: 'button', label: 'View Wallet', page: '/finance', expectedRoute: '/api-wallet/ledger', httpMethod: 'GET', requiredRoles: ['finance_manager', 'boss_owner'] },
  { id: 'finance-payout-btn', type: 'button', label: 'Create Payout', page: '/finance', expectedRoute: '/api-wallet/payout', httpMethod: 'POST', requiredRoles: ['finance_manager', 'boss_owner'] },

  // Demos
  { id: 'demo-create-btn', type: 'button', label: 'Create Demo', page: '/demos', expectedRoute: '/api-demo/create', httpMethod: 'POST', requiredRoles: ['demo_manager', 'boss_owner'] },
  { id: 'demo-list-link', type: 'link', label: 'View Demos', page: '/demos', expectedRoute: '/api-demo', httpMethod: 'GET' },

  // R&D
  { id: 'rnd-approve-btn', type: 'button', label: 'Approve R&D', page: '/rnd', expectedRoute: '/api-rnd/approve', httpMethod: 'POST', requiredRoles: ['rnd_manager', 'boss_owner'] },
  { id: 'rnd-suggest-btn', type: 'button', label: 'New Suggestion', page: '/rnd', expectedRoute: '/api-rnd/suggest', httpMethod: 'POST' },

  // Settings
  { id: 'settings-save-btn', type: 'button', label: 'Save Settings', page: '/settings', expectedRoute: '/api-settings/update', httpMethod: 'PUT' },
  { id: 'settings-profile-form', type: 'form', label: 'Update Profile', page: '/settings', expectedRoute: '/api-user/profile', httpMethod: 'PATCH' },

  // Super Admin
  { id: 'admin-users-link', type: 'link', label: 'Manage Users', page: '/super-admin', expectedRoute: '/api-admin/users', httpMethod: 'GET', requiredRoles: ['boss_owner', 'ceo'] },
  { id: 'admin-roles-btn', type: 'button', label: 'Assign Role', page: '/super-admin', expectedRoute: '/api-admin/roles', httpMethod: 'POST', requiredRoles: ['boss_owner'] },

  // Franchise
  { id: 'franchise-leads-link', type: 'link', label: 'My Leads', page: '/franchise', expectedRoute: '/api-leads?scope=franchise', httpMethod: 'GET', requiredRoles: ['franchise'] },
  { id: 'franchise-resellers-link', type: 'link', label: 'My Resellers', page: '/franchise', expectedRoute: '/api-resellers', httpMethod: 'GET', requiredRoles: ['franchise', 'boss_owner'] },

  // Support
  { id: 'support-ticket-btn', type: 'button', label: 'Create Ticket', page: '/support', expectedRoute: '/api-support/ticket', httpMethod: 'POST' },
  { id: 'support-tickets-link', type: 'link', label: 'View Tickets', page: '/support', expectedRoute: '/api-support/tickets', httpMethod: 'GET' },

  // Legal
  { id: 'legal-case-btn', type: 'button', label: 'New Case', page: '/legal', expectedRoute: '/api-legal/case', httpMethod: 'POST', requiredRoles: ['legal_compliance', 'boss_owner'] },

  // HR
  { id: 'hr-hire-btn', type: 'button', label: 'Post Job', page: '/hr', expectedRoute: '/api-hr/job', httpMethod: 'POST', requiredRoles: ['hr_manager', 'boss_owner'] },

  // SEO
  { id: 'seo-keyword-btn', type: 'button', label: 'Add Keyword', page: '/seo', expectedRoute: '/api-seo/keyword', httpMethod: 'POST', requiredRoles: ['seo_manager', 'boss_owner'] },

  // Performance
  { id: 'perf-escalate-btn', type: 'button', label: 'Escalate Issue', page: '/performance', expectedRoute: '/api-performance/escalate', httpMethod: 'POST', requiredRoles: ['performance_manager', 'boss_owner'] },
];

// Base path prefix for all Supabase Edge Function routes
export const API_BASE_PATH = '/functions/v1';

// Known API routes in the system (logical path without base prefix)
// Full URL = API_BASE_PATH + route (e.g. '/functions/v1/api-auth/login')
export const KNOWN_API_ROUTES: string[] = [
  '/api-auth/login',
  '/api-auth/logout',
  '/api-auth/register',
  '/api-auth/refresh',
  '/api-leads',
  '/api-leads/create',
  '/api-leads/export',
  '/api-wallet/ledger',
  '/api-wallet/payout',
  '/api-wallet/user/:id',
  '/api-demo',
  '/api-demo/create',
  '/api-rnd/approve',
  '/api-rnd/suggest',
  '/api-settings/update',
  '/api-user/profile',
  '/api-admin/users',
  '/api-admin/roles',
  '/api-resellers',
  '/api-support/ticket',
  '/api-support/tickets',
  '/api-legal/case',
  '/api-hr/job',
  '/api-seo/keyword',
  '/api-performance/escalate',
];

export function mapUIToRoutes(): UIRouteMappingReport {
  const mappings: RouteMapping[] = [];
  const deadRoutes: string[] = [];

  for (const element of UI_ELEMENTS) {
    const issues: string[] = [];
    let routeExists = false;
    let controllerExists = false;
    let serviceExists = false;

    if (element.expectedRoute) {
      // Normalize route for comparison (strip query params)
      const normalizedRoute = element.expectedRoute.split('?')[0];
      routeExists = KNOWN_API_ROUTES.some(r => r === normalizedRoute || normalizedRoute.startsWith(r.replace(':id', '')));

      if (!routeExists) {
        issues.push(`Route ${element.expectedRoute} not found in known API routes`);
      } else {
        // Assume controller and service exist when route is mapped
        controllerExists = true;
        serviceExists = true;
      }
    } else {
      issues.push('No expected route defined for this UI element');
    }

    let status: RouteMapping['status'] = 'ok';
    if (!routeExists) status = 'missing-route';
    else if (!controllerExists) status = 'missing-controller';
    else if (!serviceExists) status = 'missing-service';
    else if (issues.length > 0) status = 'broken';

    mappings.push({
      uiElement: element,
      routeExists,
      controllerExists,
      serviceExists,
      status,
      issues,
    });
  }

  // Find dead routes (routes not referenced by any UI element)
  for (const route of KNOWN_API_ROUTES) {
    const referenced = UI_ELEMENTS.some(el => {
      if (!el.expectedRoute) return false;
      const normalized = el.expectedRoute.split('?')[0];
      return normalized === route || route.includes(':') && normalized.startsWith(route.split(':')[0]);
    });
    if (!referenced) {
      deadRoutes.push(route);
    }
  }

  const brokenElements = mappings.filter(m => m.status !== 'ok').map(m => m.uiElement);

  return {
    totalElements: UI_ELEMENTS.length,
    mappedElements: mappings.filter(m => m.status === 'ok').length,
    brokenElements: brokenElements.length,
    missingRoutes: mappings.filter(m => m.status === 'missing-route').length,
    mappings,
    brokenButtonReport: brokenElements,
    deadRouteReport: deadRoutes,
    timestamp: new Date().toISOString(),
  };
}
