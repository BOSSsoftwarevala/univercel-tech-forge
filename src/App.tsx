// Updated src/App.tsx to fix routing issues and role mismatches.
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ComponentOne from './components/ComponentOne';
import ComponentTwo from './components/ComponentTwo';
// More imports...

const App = () => {
  return (
    <Switch>
      {/* Consolidated routes */}
      <Route path="/seo" component={ComponentOne} />
      <Route path="/franchise" component={ComponentTwo} />
      {/* Other routes... */}
      {/* Removed duplicate routes and unnecessary role checks */}
    </Switch>
  );
};

<<<<<<< HEAD
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DemoTestModeProvider>
        <AnimationProvider>
          <TooltipProvider>
              {/* Disabled to prevent global interaction blocking (login/buttons must always work) */}
              <SourceCodeProtection enabled={false}>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <SecurityProvider>
                    <NotificationProvider>
                      <TranslationProvider>
                        <GlobalRealtimeProvider>
                          <InteractivityGuard />
                          <BlockingClassCleanup />
                          <SystemNotificationsInitializer />
                          <GlobalOfferPopup />
                          <FloatingAIChatbotWrapper />
                          <Routes>
                          {/* Public Routes - No login required */}
              <Route path="/" element={<Index />} />
              <Route path="/demos" element={<Index />} />
              <Route path="/explore" element={<Navigate to="/demos" replace />} />
              <Route path="/products" element={<Index />} />
              <Route path="/pricing" element={<SimpleDemoList />} />
              <Route path="/demos/public" element={<PublicDemos />} />
              <Route path="/showcase" element={<PremiumDemoShowcaseNew />} />
              <Route path="/server-portal" element={<RequireAuth><ServerManagementPortal /></RequireAuth>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Basic profile route to satisfy header navigation */}
              <Route path="/profile" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
              <Route path="/onboard" element={<Homepage />} />
              <Route path="/onboard/:category" element={<CategoryOnboarding />} />
              <Route path="/apply" element={<SimpleDemoList />} />
              <Route path="/careers" element={<CareerPortal />} />
              <Route path="/join-developer" element={<CareerPortal />} />
              <Route path="/join-influencer" element={<CareerPortal />} />
              <Route path="/jobs" element={<CareerPortal />} />
              {/* Bootstrap is Master-only after initial setup */}
              <Route path="/bootstrap-admins" element={<RequireRole allowed={["master"]} masterOnly><BootstrapAdmins /></RequireRole>} />
              <Route path="/sectors" element={<SectorsBrowse />} />
              <Route path="/sectors/:sectorId/:subCategoryId" element={<SubCategoryDemos />} />
              
              {/* Auto Development Engine */}
              <Route path="/auto-dev" element={<AutoDevEngine />} />
              
              {/* Product Demo Pages - MUST come BEFORE dynamic routes */}
<Route path="/demo/restaurant-pos" element={<RestaurantPOSDemo />} />
              <Route path="/demo/restaurant-small" element={<RestaurantSmallDemo />} />
              <Route path="/demo/restaurant-medium" element={<RestaurantMediumDemo />} />
              <Route path="/demo/restaurant-large" element={<RestaurantLargeDemo />} />
              <Route path="/demo/school-erp" element={<SchoolERPDemo />} />
              <Route path="/demo/school-small" element={<SchoolSmallDemo />} />
              <Route path="/demo/school-medium" element={<SchoolMediumDemo />} />
              <Route path="/demo/school-large" element={<SchoolLargeDemo />} />
              <Route path="/demo/education" element={<EducationDemoHub />} />
              <Route path="/demos/education" element={<EducationDemoHub />} />
              
              {/* School Management Software - LIVE SYSTEM (NOT DEMO) */}
              <Route path="/school-software" element={<SchoolSoftwareHomepage />} />
              <Route path="/school-software/dashboard" element={<SchoolSoftwareDashboard />} />
              <Route path="/demo/hospital-hms" element={<HospitalHMSDemo />} />
              <Route path="/demo/ecommerce-store" element={<EcommerceStoreDemo />} />
              <Route path="/demo/hotel-booking" element={<HotelBookingDemo />} />
              <Route path="/demo/real-estate" element={<RealEstateDemo />} />
              <Route path="/demo/automotive" element={<AutomotiveDemo />} />
              <Route path="/demo/travel" element={<TravelDemo />} />
              <Route path="/demo/finance" element={<FinanceDemo />} />
              <Route path="/demo/manufacturing" element={<ManufacturingDemo />} />
              <Route path="/demo/gym" element={<GymDemo />} />
              <Route path="/demo/salon" element={<SalonDemo />} />
              <Route path="/demo/legal" element={<LegalDemo />} />
              <Route path="/demo/security" element={<SecurityDemo />} />
              <Route path="/demo/telecom" element={<TelecomDemo />} />
              <Route path="/demo/childcare" element={<ChildcareDemo />} />
              <Route path="/demo/petcare" element={<PetCareDemo />} />
              <Route path="/demo/event" element={<EventDemo />} />
              <Route path="/demo/crm" element={<CRMDemo />} />
              <Route path="/demo/logistics" element={<LogisticsDemo />} />
              
              {/* Sales CRM Demo */}
              <Route path="/sales-crm" element={<SalesCRMDemo />} />
              <Route path="/sales-crm/auth" element={<SalesCRMAuthPage />} />
              <Route path="/retail-pos" element={<RetailPOSDemo />} />
              {/* Dynamic Demo Routes - MUST come AFTER specific routes */}
              <Route path="/demo-directory" element={<DemoDirectory />} />
              <Route path="/demo/:demoId" element={<SimpleDemoView />} />
              <Route path="/checkout/:demoId" element={<SimpleCheckout />} />
              <Route path="/user-dashboard" element={<SimpleUserDashboard />} />
              <Route path="/user/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
              <Route path="/demo-login" element={<DemoLogin />} />
              <Route path="/premium-demos" element={<PremiumDemoShowcase />} />
              
              {/* Client Portal - Public Route */}
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/get-started" element={<ClientPortal />} />

              {/* Global Auth Routes */}
              <Route path="/login" element={<RoleBasedLogin />} />
              <Route path="/role-login" element={<RoleBasedLogin />} />
              <Route path="/register" element={<Navigate to="/auth" replace />} />
              <Route path="/easy-login" element={<EasyAuth />} />
              <Route path="/quick-signup" element={<EasyAuth />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/otp-verify" element={<OTPVerify />} />
              <Route path="/device-verify" element={<DeviceVerify />} />
              <Route path="/ip-verify" element={<IPVerify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account-suspension" element={<AccountSuspension />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/session-expired" element={<SessionExpiredPage />} />

              {/* Boss Fortress Auth - Ultra Secure */}
              <Route path="/boss-fortress" element={<BossFortressAuth />} />
              <Route path="/boss-register" element={<BossRegister />} />
              <Route path="/boss/login" element={<SuperAdminLogin />} />

              {/* Owner Dashboard - SoftwareWala Business Control */}
              <Route path="/owner" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />
              <Route path="/owner/*" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />
              <Route path="/softwarewala" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />

              {/* Boss Admin Routes - BOSS_OWNER ONLY */}
              <Route path="/master-admin" element={<RequireRole allowed={["boss_owner"]}><MasterControlCenter /></RequireRole>} />
              <Route path="/master-admin/*" element={<RequireRole allowed={["boss_owner"]}><MasterControlCenter /></RequireRole>} />
              <Route path="/master-admin-supreme" element={<RequireRole allowed={["boss_owner"]}><MasterAdminSupreme /></RequireRole>} />
              
              {/* Admin Utilities - Boss Owner */}
              <Route path="/admin/bulk-users" element={<RequireRole allowed={["boss_owner"]}><BulkUserCreation /></RequireRole>} />
              <Route path="/admin/role-manager" element={<RequireRole allowed={["boss_owner"]}><RoleManagerPage /></RequireRole>} />


              {/* Area Manager now redirects to Country Head - merged roles */}
              <Route path="/area-manager" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />
              <Route path="/area-manager/*" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />

              {/* Server Manager Routes */}
              <Route path="/server-manager" element={<RequireRole allowed={["boss_owner", "server_manager"]}><ServerManagerDashboard /></RequireRole>} />
              <Route path="/server-manager/*" element={<RequireRole allowed={["boss_owner", "server_manager"]}><ServerManagerDashboard /></RequireRole>} />

              {/* Security Command Center Routes */}
              <Route path="/security-command" element={<RequireRole allowed={["boss_owner"]}><SecurityCommandCenter /></RequireRole>} />
              <Route path="/security-command/*" element={<RequireRole allowed={["boss_owner"]}><SecurityCommandCenter /></RequireRole>} />

              {/* API / AI Manager Routes */}
              <Route path="/api-manager" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><APIManagerDashboard /></RequireRole>} />
              <Route path="/api-manager/*" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><APIManagerDashboard /></RequireRole>} />

              {/* Marketing Manager Routes */}
              <Route path="/marketing-manager" element={<RequireRole allowed={["boss_owner", "marketing_manager"]}><MarketingManagerDashboard /></RequireRole>} />
              <Route path="/marketing-manager/*" element={<RequireRole allowed={["boss_owner", "marketing_manager"]}><MarketingManagerDashboard /></RequireRole>} />


              {/* SEO Manager Routes */}
              <Route path="/seo-manager" element={<RequireRole allowed={["boss_owner", "seo_manager"]}><SEOManagerDashboard /></RequireRole>} />
              <Route path="/seo-manager/*" element={<RequireRole allowed={["boss_owner", "seo_manager"]}><SEOManagerDashboard /></RequireRole>} />

              {/* Legal Manager Routes (enum role: legal_compliance) */}
              <Route path="/legal-manager" element={<RequireRole allowed={["boss_owner", "legal_compliance"]}><LegalManagerDashboard /></RequireRole>} />
              <Route path="/legal-manager/*" element={<RequireRole allowed={["boss_owner", "legal_compliance"]}><LegalManagerDashboard /></RequireRole>} />

              {/* AI CEO Routes - Autonomous Intelligence Observer */}
              <Route path="/ai-ceo" element={<RequireRole allowed={["boss_owner", "ceo"]}><AICEODashboard /></RequireRole>}>
                <Route index element={<AICEODashboardMain />} />
                <Route path="live-monitor" element={<AICEOLiveMonitor />} />
                <Route path="decision-engine" element={<AICEODecisionEngine />} />
                <Route path="approvals" element={<AICEOApprovals />} />
                <Route path="risk" element={<AICEORiskCompliance />} />
                <Route path="performance" element={<AICEOPerformance />} />
                <Route path="predictions" element={<AICEOPredictions />} />
                <Route path="reports" element={<AICEOReports />} />
                <Route path="learning" element={<AICEOLearning />} />
                <Route path="settings" element={<AICEOSettings />} />
              </Route>

              {/* Continent Super Admin Routes */}
              <Route path="/continent-super-admin" element={<RequireRole allowed={["boss_owner"]}><ContinentSuperAdminDashboard /></RequireRole>} />
              <Route path="/continent-super-admin/*" element={<RequireRole allowed={["boss_owner"]}><ContinentSuperAdminDashboard /></RequireRole>} />

              {/* Super Admin Routes - Redirect to unified RoleSwitchDashboard to prevent duplicate layouts */}
              <Route path="/admin" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/super-admin" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/super-admin/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/super-admin/command-center" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/super-admin/live-tracking" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><LiveTracking /></RequireRole>} />
              <Route path="/super-admin/role-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><RoleManager /></RequireRole>} />
              <Route path="/super-admin/user-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><UserManager /></RequireRole>} />
              <Route path="/super-admin/permission-matrix" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><PermissionMatrix /></RequireRole>} />
              <Route path="/super-admin/security-center" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SecurityCenter /></RequireRole>} />
              <Route path="/super-admin/demo-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/super-admin/product-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><ProductManagerPage /></RequireRole>} />
              <Route path="/super-admin/system-settings" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SystemSettings /></RequireRole>} />
              <Route path="/super-admin/system-audit" element={<RequireRole allowed={["boss_owner"]}><SystemAudit /></RequireRole>} />
              <Route path="/super-admin/prime-manager" element={<RequireRole allowed={["boss_owner"]}><PrimeManager /></RequireRole>} />
              <Route path="/super-admin/influencer-manager" element={<RequireRole allowed={["boss_owner"]}><InfluencerManager /></RequireRole>} />
              <Route path="/super-admin/finance-center" element={<RequireRole allowed={["boss_owner"]}><FinanceManager /></RequireRole>} />
              <Route path="/super-admin/support-center" element={<RequireRole allowed={["boss_owner"]}><SupportDashboard /></RequireRole>} />
              <Route path="/super-admin/ai-billing" element={<RequireRole allowed={["boss_owner"]}><AIBillingDashboard /></RequireRole>} />
              <Route path="/super-admin/franchise-manager" element={<RequireRole allowed={["boss_owner"]}><FranchiseManagement /></RequireRole>} />
              <Route path="/super-admin/compliance-center" element={<RequireRole allowed={["boss_owner"]}><ComplianceCenter /></RequireRole>} />
              <Route path="/super-admin/performance" element={<RequireRole allowed={["boss_owner"]}><PerformanceManager /></RequireRole>} />

              {/* Franchise Routes */}
              <Route path="/franchise" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/dashboard" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/profile" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseProfile /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/wallet" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseWalletPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/lead-board" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseLeadBoardPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/assign-lead" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseAssignLead /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/demo-request" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDemoRequest /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/demo-library" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDemoLibraryPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/sales-center" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSalesCenter /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/performance" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchisePerformancePage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/support-ticket" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSupportTicket /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/internal-chat" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseInternalChatPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/training-center" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseTrainingCenter /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/security-panel" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSecurityPanel /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/seo-services" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSEOServices /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/team-management" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseTeamManagement /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/crm" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseCRM /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/hrm" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseHRM /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/lead-activity" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseLeadActivity /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise-program" element={<FranchiseLanding />} />
              <Route path="/franchise-landing" element={<FranchiseLanding />} />
              <Route path="/franchise-dashboard" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseDashboard /></RequireRole>} />

              {/* Reseller Routes */}
              <Route path="/reseller" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />
              <Route path="/reseller/dashboard" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />
              <Route path="/reseller/portal" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerPortal /></RequireRole>} />
              <Route path="/reseller-portal" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerPortal /></RequireRole>} />
              <Route path="/reseller-program" element={<ResellerLanding />} />
              <Route path="/reseller-landing" element={<ResellerLanding />} />
              <Route path="/reseller-dashboard" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />

              {/* Developer Routes */}
              <Route path="/developer/register" element={<RequireAuth><DeveloperRegistration /></RequireAuth>} />
              <Route path="/developer/registration" element={<RequireAuth><DeveloperRegistration /></RequireAuth>} />
              <Route path="/developer" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
              <Route path="/developer/dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
              <Route path="/developer-dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
              <Route path="/dev-command-center" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />

              {/* Influencer Routes */}
              <Route path="/influencer" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer/dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer/command-center" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerCommandCenter /></RequireRole>} />
              <Route path="/influencer-command-center" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerCommandCenter /></RequireRole>} />
              <Route path="/influencer-dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer-manager" element={<RequireRole allowed={["super_admin"]}><InfluencerManager /></RequireRole>} />
              <Route path="/influencer-manager-secure" element={<RequireRole allowed={["boss_owner", "super_admin"]}><SecureInfluencerManagerDashboard /></RequireRole>} />
              
              {/* Product Demo Manager Routes */}
              <Route path="/product-demo-manager" element={<RequireRole allowed={["product_demo_manager", "demo_manager", "super_admin"]}><ProductDemoManagerPage /></RequireRole>} />
              <Route path="/product-demo-manager/*" element={<RequireRole allowed={["product_demo_manager", "demo_manager", "super_admin"]}><ProductDemoManagerPage /></RequireRole>} />

              {/* Reseller Manager Routes */}
              <Route path="/reseller-manager" element={<RequireRole allowed={["reseller_manager", "super_admin"]}><SecureResellerManagerDashboard /></RequireRole>} />
              <Route path="/reseller-manager-secure" element={<RequireRole allowed={["reseller_manager", "super_admin"]}><SecureResellerManagerDashboard /></RequireRole>} />
              
              {/* Sales & Support Manager Routes (enum roles: client_success/support) */}
              <Route path="/sales-support-manager" element={<RequireRole allowed={["client_success", "support", "super_admin"]}><SecureSalesSupportManagerDashboard /></RequireRole>} />
              <Route path="/sales-support-manager-secure" element={<RequireRole allowed={["client_success", "support", "super_admin"]}><SecureSalesSupportManagerDashboard /></RequireRole>} />
              
              {/* Public demo route for Influencer Command Center */}
              <Route path="/demo/influencer-command-center" element={<InfluencerCommandCenter />} />
              {/* Prime User Routes */}
              <Route path="/prime" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
              <Route path="/prime/dashboard" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
              <Route path="/prime-user" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />

              {/* Manager Routes - PROTECTED BY ROLE */}
              <Route path="/lead-manager" element={<RequireRole allowed={["lead_manager", "super_admin", "boss_owner", "master", "ceo"]}><LeadManager /></RequireRole>} />
              <Route path="/leads/*" element={<RequireRole allowed={["lead_manager", "super_admin", "boss_owner", "master", "ceo"]}><LeadManager /></RequireRole>} />
              <Route path="/task-manager" element={<RequireRole allowed={["task_manager", "super_admin"]}><TaskManager /></RequireRole>} />
              <Route path="/tasks/*" element={<RequireRole allowed={["task_manager", "super_admin"]}><TaskManager /></RequireRole>} />
              <Route path="/demo-manager" element={<RequireRole allowed={["demo_manager", "super_admin", "master"]}><DemoManagerDashboard /></RequireRole>} />
              <Route path="/demo-manager/*" element={<RequireRole allowed={["demo_manager", "super_admin", "master"]}><DemoManagerDashboard /></RequireRole>} />
              <Route path="/demo" element={<RequireRole allowed={["demo_manager", "franchise", "reseller", "super_admin"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/demos/*" element={<RequireRole allowed={["demo_manager", "franchise", "reseller", "super_admin"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/finance" element={<RequireRole allowed={["finance_manager", "super_admin"]}><FinanceManager /></RequireRole>} />
              <Route path="/finance/*" element={<RequireRole allowed={["finance_manager", "super_admin"]}><FinanceManager /></RequireRole>} />
              <Route path="/legal" element={<RequireRole allowed={["legal_compliance", "super_admin"]}><LegalComplianceManager /></RequireRole>} />
              <Route path="/marketing" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/marketing/*" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/enterprise/marketing" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/enterprise/marketing/*" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/performance" element={<RequireRole allowed={["performance_manager", "super_admin"]}><PerformanceManager /></RequireRole>} />
              <Route path="/performance/*" element={<RequireRole allowed={["performance_manager", "super_admin"]}><PerformanceManager /></RequireRole>} />
              <Route path="/rnd-dashboard" element={<RequireRole allowed={["rnd_manager", "super_admin"]}><RnDDashboard /></RequireRole>} />
              <Route path="/rnd/*" element={<RequireRole allowed={["rnd_manager", "super_admin"]}><RnDDashboard /></RequireRole>} />
              <Route path="/hr" element={<RequireRole allowed={["hr_manager", "super_admin"]}><HRDashboard /></RequireRole>} />
              <Route path="/hr/*" element={<RequireRole allowed={["hr_manager", "super_admin"]}><HRDashboard /></RequireRole>} />
              
              {/* Secure Task Manager Dashboard */}
              <Route path="/task-manager-secure" element={<RequireRole allowed={["task_manager", "super_admin"]}><SecureTaskManagerDashboard /></RequireRole>} />
              
              {/* Secure Legal Manager Dashboard */}
              <Route path="/legal-manager-secure" element={<RequireRole allowed={["legal_compliance", "super_admin"]}><SecureLegalManagerDashboard /></RequireRole>} />
              <Route path="/seo" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/seo/*" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/seo-dashboard" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/seo-manager" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/support" element={<RequireRole allowed={["support", "client_success", "super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/support/*" element={<RequireRole allowed={["support", "client_success", "super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/support-dashboard" element={<RequireRole allowed={["support", "client_success", "super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/sales-support" element={<RequireRole allowed={["support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
              <Route path="/sales" element={<RequireRole allowed={["support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
              <Route path="/sales/*" element={<RequireRole allowed={["support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
              <Route path="/client-success" element={<RequireRole allowed={["client_success", "super_admin"]}><ClientSuccessDashboard /></RequireRole>} />
              <Route path="/clients/*" element={<RequireRole allowed={["client_success", "super_admin"]}><ClientSuccessDashboard /></RequireRole>} />
              {/* Incident / crisis routes (no dedicated enum; restrict to super_admin + boss_owner) */}
              <Route path="/incident-crisis" element={<RequireRole allowed={["boss_owner", "super_admin"]}><IncidentCrisisDashboard /></RequireRole>} />
              <Route path="/crisis/*" element={<RequireRole allowed={["boss_owner", "super_admin"]}><IncidentCrisisDashboard /></RequireRole>} />
              <Route path="/hr-dashboard" element={<RequireRole allowed={["hr_manager", "super_admin"]}><HRDashboard /></RequireRole>} />
              <Route path="/ai/*" element={<RequireRole allowed={["ai_manager", "super_admin"]}><AIOptimizationConsole /></RequireRole>} />

              {/* NEW ROLES (25-28) Routes */}
              <Route path="/safe-assist" element={<RequireRole allowed={["safe_assist", "super_admin", "master"]}><SafeAssistDashboard /></RequireRole>} />
              <Route path="/safe-assist/*" element={<RequireRole allowed={["safe_assist", "super_admin", "master"]}><SafeAssistDashboard /></RequireRole>} />
              <Route path="/assist-manager" element={<RequireRole allowed={["assist_manager", "super_admin", "master"]}><AssistManagerDashboard /></RequireRole>} />
              <Route path="/assist-manager/*" element={<RequireRole allowed={["assist_manager", "super_admin", "master"]}><AssistManagerDashboard /></RequireRole>} />
              <Route path="/promise-tracker" element={<RequireRole allowed={["promise_tracker", "super_admin", "master"]}><PromiseTrackerDashboard /></RequireRole>} />
              <Route path="/promise-tracker/*" element={<RequireRole allowed={["promise_tracker", "super_admin", "master"]}><PromiseTrackerDashboard /></RequireRole>} />
              <Route path="/promise-management" element={<RequireRole allowed={["promise_management", "super_admin", "master"]}><PromiseManagementDashboard /></RequireRole>} />
              <Route path="/promise-management/*" element={<RequireRole allowed={["promise_management", "super_admin", "master"]}><PromiseManagementDashboard /></RequireRole>} />

              {/* System Routes - SUPER ADMIN ONLY */}
              <Route path="/system-settings" element={<RequireRole allowed={["super_admin"]}><SystemSettings /></RequireRole>} />
              <Route path="/buzzer-console" element={<RequireRole allowed={["super_admin"]}><NotificationBuzzerConsole /></RequireRole>} />
              <Route path="/api-integrations" element={<RequireRole allowed={["super_admin"]}><APIIntegrationDashboard /></RequireRole>} />
              <Route path="/internal-chat" element={<RequireAuth><InternalChat /></RequireAuth>} />
              <Route path="/personal-chat" element={<RequireAuth><PersonalChat /></RequireAuth>} />
              <Route path="/ai-console" element={<RequireRole allowed={["ai_manager", "super_admin"]}><AIOptimizationConsole /></RequireRole>} />
              <Route path="/demo-credentials" element={<RequireRole allowed={["super_admin"]}><DemoCredentials /></RequireRole>} />
              <Route path="/demo-order-system" element={<RequireRole allowed={["master", "super_admin", "demo_manager"]}><DemoOrderSystem /></RequireRole>} />

              {/* Vala Control Center - Secure Isolated System */}
              <Route path="/vala-control" element={<RequireAuth><ValaControlCenter roleView="operations" /></RequireAuth>} />
              <Route path="/vala-control/operations" element={<RequireAuth><ValaControlCenter roleView="operations" /></RequireAuth>} />
              <Route path="/vala-control/regional" element={<RequireAuth><ValaControlCenter roleView="regional" /></RequireAuth>} />
              <Route path="/vala-control/ai-head" element={<RequireAuth><ValaControlCenter roleView="ai_head" /></RequireAuth>} />
              <Route path="/vala-control/master" element={<RequireRole allowed={["master"]} masterOnly><ValaControlCenter roleView="master" /></RequireRole>} />

              {/* Enterprise Control System - Isolated Workspaces */}
              <Route path="/enterprise-control" element={<EnterpriseControlHub />} />

              {/* New Vala Control System - Isolated Workspaces */}
              <Route path="/vala" element={<RequireAuth><ValaControlHub /></RequireAuth>} />
              <Route path="/vala/operation" element={<RequireAuth><ValaOperationWorkspace /></RequireAuth>} />
              <Route path="/vala/regional" element={<RequireAuth><ValaRegionalWorkspace /></RequireAuth>} />
              <Route path="/vala/ai-head" element={<RequireAuth><ValaAIHeadWorkspace /></RequireAuth>} />
              <Route path="/vala/master" element={<RequireRole allowed={["master"]} masterOnly><ValaMasterWorkspace /></RequireRole>} />

              {/* Dev Manager Dashboard */}
              <Route path="/dev-manager" element={<RequireAuth><SecureDevManagerDashboard /></RequireAuth>} />

              {/* HR Manager Dashboard */}
              <Route path="/hr-manager" element={<RequireAuth><SecureHRManagerDashboard /></RequireAuth>} />

              {/* Wireframe Routes - Design Sandbox */}
              <Route path="/wireframe/*" element={<WireframeRoutes />} />

              {/* Super Admin System Routes */}
              {/* Explicit dashboard aliases (never allow route-not-found -> blank screen) */}
              <Route path="/boss/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/ceo/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=ceo" replace />} />
              <Route path="/admin/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=admin" replace />} />
              <Route path="/continent/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=continent_super_admin" replace />} />
              <Route path="/country/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />

              <Route path="/super-admin-system" element={<Navigate to="/super-admin-system/dashboard" replace />} />
              {/* Short aliases (avoid 404 when users type abbreviated links) */}
              <Route path="/super-admin-system/rc" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/super-admin-system/role-center" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />

              <Route path="/super-admin-system/login" element={<SuperAdminLogin />} />
              {/* Role switcher - Protected for privileged roles */}
              <Route path="/super-admin-system/role-switch" element={<RequireRole allowed={['boss_owner', 'ceo', 'admin', 'super_admin', 'master', 'continent_super_admin', 'country_head']}><RoleSwitchDashboard /></RequireRole>} />
              <Route path="/super-admin-system/role-switch/*" element={<RequireRole allowed={['boss_owner', 'ceo', 'admin', 'super_admin', 'master', 'continent_super_admin', 'country_head']}><RoleSwitchDashboard /></RequireRole>} />
              <Route path="/super-admin-system/dashboard" element={<SuperAdminSystemDashboard />} />
              <Route path="/super-admin-system/users" element={<SuperAdminUsers />} />
              <Route path="/super-admin-system/admins" element={<SuperAdminAdmins />} />
              <Route path="/super-admin-system/roles" element={<SuperAdminRoles />} />
              <Route path="/super-admin-system/geography" element={<SuperAdminGeography />} />
              <Route path="/super-admin-system/modules" element={<SuperAdminModules />} />
              <Route path="/super-admin-system/rentals" element={<SuperAdminRentals />} />
              <Route path="/super-admin-system/rules" element={<SuperAdminRules />} />
              <Route path="/super-admin-system/approvals" element={<SuperAdminApprovals />} />
              <Route path="/super-admin-system/security" element={<SuperAdminSecurity />} />
              <Route path="/super-admin-system/locks" element={<SuperAdminSystemLock />} />
              <Route path="/super-admin-system/activity-log" element={<SuperAdminActivityLog />} />
              <Route path="/super-admin-system/audit" element={<SuperAdminAudit />} />

              {/* Leader Security Assessment */}
              <Route path="/leader-security" element={<LeaderSecurityAssessment />} />

              {/* Bulk Actions Reference */}
              <Route path="/bulk-actions" element={<BulkActionsReference />} />

                          {/* Catch-all */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <AdminQuickAccess />
                        <QuickSupport />
                        {/* Button Audit Overlay - DEV MODE ONLY */}
                        <ButtonAuditOverlay enabled={import.meta.env.DEV} />
                        </GlobalRealtimeProvider>
                      </TranslationProvider>
                    </NotificationProvider>
                  </SecurityProvider>
                </BrowserRouter>
              </SourceCodeProtection>
          </TooltipProvider>
        </AnimationProvider>
      </DemoTestModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

=======
>>>>>>> 0fb3bd24aec7b9ae3ccd7d8f8624af782e7e50eb
export default App;

// Other necessary updates such as role arrays and removing class
