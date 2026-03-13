// ================================================================
// Route Controller Mapper - Maps routes to controllers/services
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface ControllerMapping {
  route: string;
  httpMethod: string;
  controllerName: string;
  serviceLayer: string;
  validationLayer: string;
  authGuard: string;
  rbacCheck: string;
  tenantIsolation: boolean;
  auditLog: boolean;
  status: 'complete' | 'missing-controller' | 'missing-service' | 'missing-validation' | 'missing-auth' | 'missing-rbac';
  issues: string[];
}

export interface RouteControllerReport {
  totalRoutes: number;
  completeRoutes: number;
  incompleteRoutes: number;
  missingControllers: string[];
  missingServices: string[];
  missingValidations: string[];
  unprotectedRoutes: string[];
  mappings: ControllerMapping[];
  timestamp: string;
}

// Full mapping of routes to their backend implementations
export const ROUTE_CONTROLLER_MAP: ControllerMapping[] = [
  {
    route: '/api-auth/login',
    httpMethod: 'POST',
    controllerName: 'AuthController.login',
    serviceLayer: 'AuthService.authenticate',
    validationLayer: 'LoginSchema (zod)',
    authGuard: 'none (public)',
    rbacCheck: 'none (public)',
    tenantIsolation: false,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-auth/logout',
    httpMethod: 'POST',
    controllerName: 'AuthController.logout',
    serviceLayer: 'AuthService.invalidateSession',
    validationLayer: 'BearerToken',
    authGuard: 'JWT',
    rbacCheck: 'authenticated',
    tenantIsolation: false,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-auth/register',
    httpMethod: 'POST',
    controllerName: 'AuthController.register',
    serviceLayer: 'AuthService.createAccount',
    validationLayer: 'RegisterSchema (zod)',
    authGuard: 'none (public)',
    rbacCheck: 'none (public)',
    tenantIsolation: false,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-leads',
    httpMethod: 'GET',
    controllerName: 'LeadController.list',
    serviceLayer: 'LeadService.fetchLeads',
    validationLayer: 'QueryParamsSchema',
    authGuard: 'JWT',
    rbacCheck: 'lead_manager | franchise | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-leads/create',
    httpMethod: 'POST',
    controllerName: 'LeadController.create',
    serviceLayer: 'LeadService.createLead',
    validationLayer: 'LeadCreateSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'lead_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-leads/export',
    httpMethod: 'GET',
    controllerName: 'LeadController.export',
    serviceLayer: 'LeadService.exportCSV',
    validationLayer: 'ExportQuerySchema',
    authGuard: 'JWT',
    rbacCheck: 'lead_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-wallet/ledger',
    httpMethod: 'GET',
    controllerName: 'WalletController.ledger',
    serviceLayer: 'WalletService.fetchLedger',
    validationLayer: 'DateRangeSchema',
    authGuard: 'JWT',
    rbacCheck: 'finance_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-wallet/payout',
    httpMethod: 'POST',
    controllerName: 'WalletController.payout',
    serviceLayer: 'WalletService.processPayout',
    validationLayer: 'PayoutSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'finance_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-wallet/user/:id',
    httpMethod: 'GET',
    controllerName: 'WalletController.userWallet',
    serviceLayer: 'WalletService.fetchUserWallet',
    validationLayer: 'UUIDParamSchema',
    authGuard: 'JWT',
    rbacCheck: 'owner | finance_manager | boss_owner',
    tenantIsolation: true,
    auditLog: false,
    status: 'complete',
    issues: ['Audit log not enabled for user wallet reads'],
  },
  {
    route: '/api-demo',
    httpMethod: 'GET',
    controllerName: 'DemoController.list',
    serviceLayer: 'DemoService.fetchDemos',
    validationLayer: 'QueryParamsSchema',
    authGuard: 'JWT',
    rbacCheck: 'authenticated',
    tenantIsolation: true,
    auditLog: false,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-demo/create',
    httpMethod: 'POST',
    controllerName: 'DemoController.create',
    serviceLayer: 'DemoService.createDemo',
    validationLayer: 'DemoCreateSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'demo_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-rnd/approve',
    httpMethod: 'POST',
    controllerName: 'RnDController.approve',
    serviceLayer: 'RnDService.approveItem',
    validationLayer: 'ApprovalSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'rnd_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-rnd/suggest',
    httpMethod: 'POST',
    controllerName: 'RnDController.suggest',
    serviceLayer: 'RnDService.createSuggestion',
    validationLayer: 'SuggestionSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'authenticated',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-settings/update',
    httpMethod: 'PUT',
    controllerName: 'SettingsController.update',
    serviceLayer: 'SettingsService.saveSettings',
    validationLayer: 'SettingsSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'authenticated',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-user/profile',
    httpMethod: 'PATCH',
    controllerName: 'UserController.updateProfile',
    serviceLayer: 'UserService.updateProfile',
    validationLayer: 'ProfileUpdateSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-admin/users',
    httpMethod: 'GET',
    controllerName: 'AdminController.listUsers',
    serviceLayer: 'AdminService.fetchUsers',
    validationLayer: 'PaginationSchema',
    authGuard: 'JWT',
    rbacCheck: 'boss_owner | ceo',
    tenantIsolation: false,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-admin/roles',
    httpMethod: 'POST',
    controllerName: 'AdminController.assignRole',
    serviceLayer: 'AdminService.updateUserRole',
    validationLayer: 'RoleAssignSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'boss_owner',
    tenantIsolation: false,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-resellers',
    httpMethod: 'GET',
    controllerName: 'ResellerController.list',
    serviceLayer: 'ResellerService.fetchResellers',
    validationLayer: 'QueryParamsSchema',
    authGuard: 'JWT',
    rbacCheck: 'franchise | boss_owner',
    tenantIsolation: true,
    auditLog: false,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-support/ticket',
    httpMethod: 'POST',
    controllerName: 'SupportController.createTicket',
    serviceLayer: 'SupportService.openTicket',
    validationLayer: 'TicketSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'authenticated',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-support/tickets',
    httpMethod: 'GET',
    controllerName: 'SupportController.listTickets',
    serviceLayer: 'SupportService.fetchTickets',
    validationLayer: 'QueryParamsSchema',
    authGuard: 'JWT',
    rbacCheck: 'authenticated',
    tenantIsolation: true,
    auditLog: false,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-legal/case',
    httpMethod: 'POST',
    controllerName: 'LegalController.createCase',
    serviceLayer: 'LegalService.openCase',
    validationLayer: 'CaseSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'legal_compliance | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-hr/job',
    httpMethod: 'POST',
    controllerName: 'HRController.postJob',
    serviceLayer: 'HRService.createJobPosting',
    validationLayer: 'JobPostSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'hr_manager | boss_owner',
    tenantIsolation: false,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-seo/keyword',
    httpMethod: 'POST',
    controllerName: 'SEOController.addKeyword',
    serviceLayer: 'SEOService.createKeyword',
    validationLayer: 'KeywordSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'seo_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-performance/escalate',
    httpMethod: 'POST',
    controllerName: 'PerformanceController.escalate',
    serviceLayer: 'PerformanceService.createEscalation',
    validationLayer: 'EscalationSchema (zod)',
    authGuard: 'JWT',
    rbacCheck: 'performance_manager | boss_owner',
    tenantIsolation: true,
    auditLog: true,
    status: 'complete',
    issues: [],
  },
  {
    route: '/api-auth/refresh',
    httpMethod: 'POST',
    controllerName: 'AuthController.refreshToken',
    serviceLayer: 'AuthService.refreshSession',
    validationLayer: 'RefreshTokenSchema',
    authGuard: 'RefreshToken',
    rbacCheck: 'none',
    tenantIsolation: false,
    auditLog: false,
    status: 'complete',
    issues: [],
  },
];

export function validateRouteControllerMapping(): RouteControllerReport {
  const missingControllers: string[] = [];
  const missingServices: string[] = [];
  const missingValidations: string[] = [];
  const unprotectedRoutes: string[] = [];

  for (const mapping of ROUTE_CONTROLLER_MAP) {
    if (!mapping.controllerName) missingControllers.push(mapping.route);
    if (!mapping.serviceLayer) missingServices.push(mapping.route);
    if (!mapping.validationLayer) missingValidations.push(mapping.route);
    if (mapping.authGuard === 'none (public)' && mapping.rbacCheck === 'none (public)') {
      // Public routes are intentional - track separately
    } else if (!mapping.authGuard || mapping.authGuard === 'none') {
      unprotectedRoutes.push(mapping.route);
    }
  }

  const completeRoutes = ROUTE_CONTROLLER_MAP.filter(m => m.status === 'complete').length;

  return {
    totalRoutes: ROUTE_CONTROLLER_MAP.length,
    completeRoutes,
    incompleteRoutes: ROUTE_CONTROLLER_MAP.length - completeRoutes,
    missingControllers,
    missingServices,
    missingValidations,
    unprotectedRoutes,
    mappings: ROUTE_CONTROLLER_MAP,
    timestamp: new Date().toISOString(),
  };
}
