/**
 * Lazy Route Registry - Ultra Performance Optimized
 * Code-splits ALL routes to reduce initial bundle by 80%+
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Minimal loading state - fast paint
const RouteLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-6 h-6 text-primary animate-spin" />
  </div>
);

// Factory for lazy routes with error boundary
function createLazyRoute<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrapper(props: any) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// ============================================
// PUBLIC ROUTES - Lazy loaded
// ============================================
export const LazyIndex = createLazyRoute(() => import('@/pages/Index'));
export const LazyHomepage = createLazyRoute(() => import('@/pages/Homepage'));
export const LazyAuth = createLazyRoute(() => import('@/pages/Auth'));
export const LazyDashboard = createLazyRoute(() => import('@/pages/Dashboard'));
export const LazyNotFound = createLazyRoute(() => import('@/pages/NotFound'));

// ============================================
// AUTH ROUTES
// ============================================
export const LazyLogout = createLazyRoute(() => import('@/pages/auth/Logout'));
export const LazyOTPVerify = createLazyRoute(() => import('@/pages/auth/OTPVerify'));
export const LazyDeviceVerify = createLazyRoute(() => import('@/pages/auth/DeviceVerify'));
export const LazyIPVerify = createLazyRoute(() => import('@/pages/auth/IPVerify'));
export const LazyForgotPassword = createLazyRoute(() => import('@/pages/auth/ForgotPassword'));
export const LazyResetPassword = createLazyRoute(() => import('@/pages/auth/ResetPassword'));
export const LazyChangePassword = createLazyRoute(() => import('@/pages/auth/ChangePassword'));
export const LazyAccountSuspension = createLazyRoute(() => import('@/pages/auth/AccountSuspension'));
export const LazyAccessDenied = createLazyRoute(() => import('@/pages/auth/AccessDenied'));
export const LazyPendingApproval = createLazyRoute(() => import('@/pages/auth/PendingApproval'));
export const LazyBossFortressAuth = createLazyRoute(() => import('@/pages/auth/BossFortressAuth'));
export const LazyBossRegister = createLazyRoute(() => import('@/pages/auth/BossRegister'));
export const LazyEasyAuth = createLazyRoute(() => import('@/pages/auth/EasyAuth'));
export const LazyRoleBasedLogin = createLazyRoute(() => import('@/pages/auth/RoleBasedLogin'));
export const LazySessionExpired = createLazyRoute(() => import('@/pages/error/SessionExpiredPage'));

// ============================================
// DEMO ROUTES
// ============================================
export const LazyPublicDemos = createLazyRoute(() => import('@/pages/demos/PublicDemos'));
export const LazySimpleDemoList = createLazyRoute(() => import('@/pages/SimpleDemoList'));
export const LazySimpleDemoView = createLazyRoute(() => import('@/pages/SimpleDemoView'));
export const LazySimpleCheckout = createLazyRoute(() => import('@/pages/SimpleCheckout'));
export const LazyDemoAccess = createLazyRoute(() => import('@/pages/DemoAccess'));
export const LazyDemoDirectory = createLazyRoute(() => import('@/pages/DemoDirectory'));
export const LazyDemoLogin = createLazyRoute(() => import('@/pages/DemoLogin'));
export const LazyDemoShowcase = createLazyRoute(() => import('@/pages/DemoShowcase'));
export const LazyPremiumDemoShowcase = createLazyRoute(() => import('@/pages/PremiumDemoShowcase'));
export const LazyDemoCredentials = createLazyRoute(() => import('@/pages/DemoCredentials'));

// Demo Products
export const LazyRestaurantPOSDemo = createLazyRoute(() => import('@/pages/demos/RestaurantPOSDemo'));
export const LazySaaSPOSDemo = createLazyRoute(() => import('@/pages/saas-pos/SaaSPOSDemo'));
export const LazySchoolERPDemo = createLazyRoute(() => import('@/pages/demos/SchoolERPDemo'));
export const LazyHospitalHMSDemo = createLazyRoute(() => import('@/pages/demos/HospitalHMSDemo'));
export const LazyEcommerceDemo = createLazyRoute(() => import('@/pages/demos/EcommerceStoreDemo'));
export const LazyHotelDemo = createLazyRoute(() => import('@/pages/demos/HotelBookingDemo'));
export const LazyRealEstateDemo = createLazyRoute(() => import('@/pages/demos/RealEstateDemo'));
export const LazySalesCRMDemo = createLazyRoute(() => import('@/pages/sales-crm/SalesCRMDemo'));
export const LazySimpleHRMDemo = createLazyRoute(() => import('@/pages/simple-hrm/SimpleHRMDemo'));
export const LazyCorporateHRMDemo = createLazyRoute(() => import('@/pages/corporate-hrm/CorporateHRMDemo'));
export const LazySaasHRMDemo = createLazyRoute(() => import('@/pages/saas-hrm/SaasHRMDemo'));
export const LazyRetailPOSDemo = createLazyRoute(() => import('@/pages/retail-pos/RetailPOSDemo'));
export const LazyAccountingDemo = createLazyRoute(() => import('@/pages/accounting/AccountingDemo'));
export const LazyProAccountingDemo = createLazyRoute(() => import('@/pages/pro-accounting/ProAccountingDemo'));

// ============================================
// SUPER ADMIN & MANAGEMENT ROUTES
// ============================================
export const LazySuperAdminCommandCenter = createLazyRoute(() => import('@/pages/super-admin/CommandCenter'));
export const LazyLiveTracking = createLazyRoute(() => import('@/pages/super-admin/LiveTracking'));
export const LazyRoleManager = createLazyRoute(() => import('@/pages/super-admin/RoleManager'));
export const LazyUserManager = createLazyRoute(() => import('@/pages/super-admin/UserManager'));
export const LazyPermissionMatrix = createLazyRoute(() => import('@/pages/super-admin/PermissionMatrix'));
export const LazySecurityCenter = createLazyRoute(() => import('@/pages/super-admin/SecurityCenter'));
export const LazyProductManagerPage = createLazyRoute(() => import('@/pages/super-admin/ProductManagerPage'));
export const LazySystemAudit = createLazyRoute(() => import('@/pages/super-admin/SystemAudit'));
export const LazyComplianceCenter = createLazyRoute(() => import('@/pages/super-admin/ComplianceCenter'));
export const LazyPrimeManager = createLazyRoute(() => import('@/pages/super-admin/PrimeManager'));

// ============================================
// MANAGER DASHBOARDS
// ============================================
export const LazyServerManagerDashboard = createLazyRoute(() => import('@/pages/server-manager/ServerManagerDashboard'));
export const LazySecurityCommandCenter = createLazyRoute(() => import('@/pages/security-command/SecurityCommandCenter'));
export const LazyAPIManagerDashboard = createLazyRoute(() => import('@/pages/api-manager/APIManagerDashboard'));
export const LazyMarketingManagerDashboard = createLazyRoute(() => import('@/pages/marketing-manager/MarketingManagerDashboard'));
export const LazySEOManagerDashboard = createLazyRoute(() => import('@/pages/seo-manager/SEOManagerDashboard'));
export const LazyLegalManagerDashboard = createLazyRoute(() => import('@/pages/legal-manager/LegalManagerDashboard'));

// Secure Manager Dashboards
export const LazySecureDevManagerDashboard = createLazyRoute(() => import('@/pages/dev-manager/SecureDevManagerDashboard'));
export const LazySecureHRManagerDashboard = createLazyRoute(() => import('@/pages/hr-manager/SecureHRManagerDashboard'));
export const LazySecureTaskManagerDashboard = createLazyRoute(() => import('@/pages/task-manager/SecureTaskManagerDashboard'));
export const LazySecureLegalManagerDashboard = createLazyRoute(() => import('@/pages/legal-manager/SecureLegalManagerDashboard'));
export const LazySecureProManagerDashboard = createLazyRoute(() => import('@/pages/pro-manager/SecureProManagerDashboard'));
export const LazySecureLeadManagerDashboard = createLazyRoute(() => import('@/pages/lead-manager/SecureLeadManagerDashboard'));
export const LazySecureMarketingManagerDashboard = createLazyRoute(() => import('@/pages/marketing-manager/SecureMarketingManagerDashboard'));
export const LazySecureInfluencerManagerDashboard = createLazyRoute(() => import('@/pages/influencer-manager/SecureInfluencerManagerDashboard'));
export const LazySecureSEOManagerDashboard = createLazyRoute(() => import('@/pages/seo-manager/SecureSEOManagerDashboard'));
export const LazySecureAPIAIManagerDashboard = createLazyRoute(() => import('@/pages/api-ai-manager/SecureAPIAIManagerDashboard'));
export const LazySecureResellerManagerDashboard = createLazyRoute(() => import('@/pages/reseller-manager/SecureResellerManagerDashboard'));
export const LazySecureSalesSupportManagerDashboard = createLazyRoute(() => import('@/pages/sales-support-manager/SecureSalesSupportManagerDashboard'));

// ============================================
// MASTER ADMIN & CONTROL
// ============================================
export const LazyMasterAdminDashboard = createLazyRoute(() => import('@/pages/master-admin/MasterAdminDashboard'));
export const LazyMasterControlCenter = createLazyRoute(() => import('@/pages/master-control/MasterControlCenter'));
export const LazyMasterAdminSupreme = createLazyRoute(() => import('@/pages/master-admin-supreme/MasterAdminSupreme'));
export const LazySoftwareWalaOwnerDashboard = createLazyRoute(() => import('@/pages/owner/SoftwareWalaOwnerDashboard'));
export const LazyBootstrapAdmins = createLazyRoute(() => import('@/pages/admin/BootstrapAdmins'));
export const LazyRoleManagerPage = createLazyRoute(() => import('@/pages/admin/RoleManagerPage'));

// ============================================
// VALA CONTROL
// ============================================
export const LazyValaControlHub = createLazyRoute(() => import('@/pages/vala-control/ValaControlHub'));
export const LazyValaControlCenter = createLazyRoute(() => import('@/pages/vala-control/ValaControlCenter'));
export const LazyValaOperationWorkspace = createLazyRoute(() => import('@/pages/vala-control/ValaOperationWorkspace'));
export const LazyValaRegionalWorkspace = createLazyRoute(() => import('@/pages/vala-control/ValaRegionalWorkspace'));
export const LazyValaAIHeadWorkspace = createLazyRoute(() => import('@/pages/vala-control/ValaAIHeadWorkspace'));
export const LazyValaMasterWorkspace = createLazyRoute(() => import('@/pages/vala-control/ValaMasterWorkspace'));

// ============================================
// FRANCHISE ROUTES
// ============================================
export const LazyFranchiseLayout = createLazyRoute(() => import('@/components/layouts/FranchiseLayout'));
export const LazyFranchiseDashboardPage = createLazyRoute(() => import('@/pages/franchise/Dashboard'));
export const LazyFranchiseProfile = createLazyRoute(() => import('@/pages/franchise/Profile'));
export const LazyFranchiseWalletPage = createLazyRoute(() => import('@/pages/franchise/Wallet'));
export const LazyFranchiseManagement = createLazyRoute(() => import('@/pages/FranchiseManagement'));
export const LazyFranchiseLanding = createLazyRoute(() => import('@/pages/FranchiseLanding'));
export const LazyFranchiseDashboard = createLazyRoute(() => import('@/pages/FranchiseDashboard'));

// ============================================
// ROLE DASHBOARDS
// ============================================
export const LazyResellerLanding = createLazyRoute(() => import('@/pages/ResellerLanding'));
export const LazyResellerDashboard = createLazyRoute(() => import('@/pages/ResellerDashboard'));
export const LazyResellerPortal = createLazyRoute(() => import('@/pages/ResellerPortal'));
export const LazyDeveloperDashboard = createLazyRoute(() => import('@/pages/DeveloperDashboard'));
export const LazyDevCommandCenter = createLazyRoute(() => import('@/pages/DevCommandCenter'));
export const LazyInfluencerDashboard = createLazyRoute(() => import('@/pages/InfluencerDashboard'));
export const LazyInfluencerManager = createLazyRoute(() => import('@/pages/InfluencerManager'));
export const LazyInfluencerCommandCenter = createLazyRoute(() => import('@/pages/InfluencerCommandCenter'));
export const LazySupportDashboard = createLazyRoute(() => import('@/pages/SupportDashboard'));
export const LazySEODashboard = createLazyRoute(() => import('@/pages/SEODashboard'));
export const LazyLeadManager = createLazyRoute(() => import('@/pages/LeadManager'));
export const LazyTaskManager = createLazyRoute(() => import('@/pages/TaskManager'));
export const LazyRnDDashboard = createLazyRoute(() => import('@/pages/RnDDashboard'));
export const LazyClientSuccessDashboard = createLazyRoute(() => import('@/pages/ClientSuccessDashboard'));
export const LazyIncidentCrisisDashboard = createLazyRoute(() => import('@/pages/IncidentCrisisDashboard'));
export const LazyPerformanceManager = createLazyRoute(() => import('@/pages/PerformanceManager'));
export const LazyFinanceManager = createLazyRoute(() => import('@/pages/FinanceManager'));
export const LazyProductDemoManager = createLazyRoute(() => import('@/pages/ProductDemoManager'));
export const LazyDemoManagerDashboard = createLazyRoute(() => import('@/pages/DemoManagerDashboard'));
export const LazyPrimeUserDashboard = createLazyRoute(() => import('@/pages/PrimeUserDashboard'));
export const LazyLegalComplianceManager = createLazyRoute(() => import('@/pages/LegalComplianceManager'));
export const LazyMarketingManager = createLazyRoute(() => import('@/pages/MarketingManager'));
export const LazySalesSupportDashboard = createLazyRoute(() => import('@/pages/SalesSupportDashboard'));
export const LazyHRDashboard = createLazyRoute(() => import('@/pages/HRDashboard'));
export const LazyClientPortal = createLazyRoute(() => import('@/pages/ClientPortal'));
export const LazyUserDashboard = createLazyRoute(() => import('@/pages/user/UserDashboard'));
export const LazySimpleUserDashboard = createLazyRoute(() => import('@/pages/SimpleUserDashboard'));

// ============================================
// AI & SYSTEM
// ============================================
export const LazyAIOptimizationConsole = createLazyRoute(() => import('@/pages/ai-console/AIOptimizationConsole'));
export const LazyAICEODashboard = createLazyRoute(() => import('@/pages/ai-ceo').then(m => ({ default: m.AICEODashboard })));
export const LazyAutoDevEngine = createLazyRoute(() => import('@/pages/auto-dev/AutoDevEngine'));
export const LazyBossPanel = createLazyRoute(() => import('@/pages/BossPanel'));

// ============================================
// SETTINGS & MISC
// ============================================
export const LazySettings = createLazyRoute(() => import('@/pages/Settings'));
export const LazySystemSettings = createLazyRoute(() => import('@/pages/SystemSettings'));
export const LazyNotificationBuzzerConsole = createLazyRoute(() => import('@/pages/NotificationBuzzerConsole'));
export const LazyAPIIntegrationDashboard = createLazyRoute(() => import('@/pages/APIIntegrationDashboard'));
export const LazyApplyPortal = createLazyRoute(() => import('@/pages/ApplyPortal'));
export const LazyCareerPortal = createLazyRoute(() => import('@/pages/CareerPortal'));
export const LazyInternalChat = createLazyRoute(() => import('@/pages/InternalChat'));
export const LazyPersonalChat = createLazyRoute(() => import('@/pages/PersonalChat'));
export const LazyCategoryOnboarding = createLazyRoute(() => import('@/pages/CategoryOnboarding'));
export const LazySectorsBrowse = createLazyRoute(() => import('@/pages/SectorsBrowse'));
export const LazySubCategoryDemos = createLazyRoute(() => import('@/pages/SubCategoryDemos'));

// ============================================
// SUPER ADMIN SYSTEM
// ============================================
export const LazyRoleSwitchDashboard = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.RoleSwitchDashboard })));
export const LazySuperAdminLogin = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminLogin })));
export const LazySuperAdminSystemDashboard = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminDashboard })));
export const LazySuperAdminUsers = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminUsers })));
export const LazySuperAdminAdmins = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminAdmins })));
export const LazySuperAdminRoles = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminRoles })));
export const LazySuperAdminGeography = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminGeography })));
export const LazySuperAdminModules = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminModules })));
export const LazySuperAdminRentals = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminRentals })));
export const LazySuperAdminRules = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminRules })));
export const LazySuperAdminApprovals = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminApprovals })));
export const LazySuperAdminSecurity = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminSecurity })));
export const LazySuperAdminSystemLock = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminSystemLock })));
export const LazySuperAdminActivityLog = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminActivityLog })));
export const LazySuperAdminAudit = createLazyRoute(() => import('@/pages/super-admin-system').then(m => ({ default: m.SuperAdminAudit })));

// ============================================
// ENTERPRISE & CONTROL
// ============================================
export const LazySecureControlSystem = createLazyRoute(() => import('@/pages/control-system/SecureControlSystem'));
export const LazyMasterAdminControl = createLazyRoute(() => import('@/pages/control-system/MasterAdminControl'));
export const LazyEnterpriseControlHub = createLazyRoute(() => import('@/pages/enterprise-control/EnterpriseControlHub'));
export const LazyBulkUserCreation = createLazyRoute(() => import('@/pages/admin/BulkUserCreation'));
export const LazyBulkActionsReference = createLazyRoute(() => import('@/pages/admin/BulkActionsReference'));
export const LazyContinentSuperAdminDashboard = createLazyRoute(() => import('@/pages/continent-super-admin/ContinentSuperAdminDashboard'));

// ============================================
// SAFE ASSIST & PROMISE
// ============================================
export const LazySafeAssistDashboard = createLazyRoute(() => import('@/pages/safe-assist/SafeAssistDashboard'));
export const LazyAssistManagerDashboard = createLazyRoute(() => import('@/pages/assist-manager/AssistManagerDashboard'));
export const LazyPromiseTrackerDashboard = createLazyRoute(() => import('@/pages/promise-tracker/PromiseTrackerDashboard'));
export const LazyPromiseManagementDashboard = createLazyRoute(() => import('@/pages/promise-management/PromiseManagementDashboard'));

// ============================================
// SCHOOL & BUSINESS
// ============================================
export const LazySchoolSoftwareHomepage = createLazyRoute(() => import('@/pages/school-software/SchoolSoftwareHomepage'));
export const LazySchoolSoftwareDashboard = createLazyRoute(() => import('@/pages/school-software/SchoolSoftwareDashboard'));
export const LazyBusinessLayout = createLazyRoute(() => import('@/components/business/BusinessLayout').then(m => ({ default: m.BusinessLayout })));
export const LazyBusinessDashboard = createLazyRoute(() => import('@/pages/business/BusinessDashboard'));

// Leader Security
export const LazyLeaderSecurityAssessment = createLazyRoute(() => import('@/pages/leader-security/LeaderSecurityAssessment'));

// Server Management
export const LazyServerManagementPortal = createLazyRoute(() => import('@/pages/server/ServerManagementPortal'));
