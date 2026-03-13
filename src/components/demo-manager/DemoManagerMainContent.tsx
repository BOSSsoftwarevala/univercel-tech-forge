/**
 * MARKETPLACE MANAGER MAIN CONTENT
 * ==================================
 * Dynamic content based on sidebar selection — 34 marketplace features
 */

import { lazy, Suspense } from "react";
import { Loader2, Store } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/ui/empty-state";

// Lazy load all marketplace screens
const MPProductListing = lazy(() => import("@/components/demo-manager/marketplace-ops/MPProductListing"));
const MPCreateProduct = lazy(() => import("@/components/demo-manager/marketplace-ops/MPCreateProduct"));
const MPEditProduct = lazy(() => import("@/components/demo-manager/marketplace-ops/MPEditProduct"));
const MPDeleteProduct = lazy(() => import("@/components/demo-manager/marketplace-ops/MPDeleteProduct"));
const MPCategoriesManager = lazy(() => import("@/components/demo-manager/marketplace-ops/MPCategoriesManager"));
const MPTags = lazy(() => import("@/components/demo-manager/marketplace-ops/MPTags"));
const MPModules = lazy(() => import("@/components/demo-manager/marketplace-ops/MPModules"));
const MPVersions = lazy(() => import("@/components/demo-manager/marketplace-ops/MPVersions"));
const MPProductAssets = lazy(() => import("@/components/demo-manager/marketplace-ops/MPProductAssets"));
const MPProductDemos = lazy(() => import("@/components/demo-manager/marketplace-ops/MPProductDemos"));
const MPPricing = lazy(() => import("@/components/demo-manager/marketplace-ops/MPPricing"));
const MPProductVisibility = lazy(() => import("@/components/demo-manager/marketplace-ops/MPProductVisibility"));
const MPFeatured = lazy(() => import("@/components/demo-manager/marketplace-ops/MPFeatured"));
const MPTrending = lazy(() => import("@/components/demo-manager/marketplace-ops/MPTrending"));
const MPHomepage = lazy(() => import("@/components/demo-manager/marketplace-ops/MPHomepage"));
const MPBanners = lazy(() => import("@/components/demo-manager/marketplace-ops/MPBanners"));
const MPReviews = lazy(() => import("@/components/demo-manager/marketplace-ops/MPReviews"));
const MPRatings = lazy(() => import("@/components/demo-manager/marketplace-ops/MPRatings"));
const MPFavorites = lazy(() => import("@/components/demo-manager/marketplace-ops/MPFavorites"));
const MPOrders = lazy(() => import("@/components/demo-manager/marketplace-ops/MPOrders"));
const MPOrderItems = lazy(() => import("@/components/demo-manager/marketplace-ops/MPOrderItems"));
const MPPayments = lazy(() => import("@/components/demo-manager/marketplace-ops/MPPayments"));
const MPRefunds = lazy(() => import("@/components/demo-manager/marketplace-ops/MPRefunds"));
const MPUserProducts = lazy(() => import("@/components/demo-manager/marketplace-ops/MPUserProducts"));
const MPLicenses = lazy(() => import("@/components/demo-manager/marketplace-ops/MPLicenses"));
const MPDeploymentLogs = lazy(() => import("@/components/demo-manager/marketplace-ops/MPDeploymentLogs"));
const MPProductAnalytics = lazy(() => import("@/components/demo-manager/marketplace-ops/MPProductAnalytics"));
const MPDemoViews = lazy(() => import("@/components/demo-manager/marketplace-ops/MPDemoViews"));
const MPAnalytics = lazy(() => import("@/components/demo-manager/marketplace-ops/MPAnalytics"));
const MPSearch = lazy(() => import("@/components/demo-manager/marketplace-ops/MPSearch"));
const MPRecommendations = lazy(() => import("@/components/demo-manager/marketplace-ops/MPRecommendations"));
const MPNotifications = lazy(() => import("@/components/demo-manager/marketplace-ops/MPNotifications"));
const MPAuditLogs = lazy(() => import("@/components/demo-manager/marketplace-ops/MPAuditLogs"));
const MPSettings = lazy(() => import("@/components/demo-manager/marketplace-ops/MPSettings"));

// View registry — all 34 features
const VIEW_REGISTRY: Record<string, React.LazyExoticComponent<any>> = {
  "mp-product-listing": MPProductListing,
  "mp-create-product": MPCreateProduct,
  "mp-edit-product": MPEditProduct,
  "mp-delete-product": MPDeleteProduct,
  "mp-categories": MPCategoriesManager,
  "mp-tags": MPTags,
  "mp-modules": MPModules,
  "mp-versions": MPVersions,
  "mp-product-assets": MPProductAssets,
  "mp-product-demos": MPProductDemos,
  "mp-pricing": MPPricing,
  "mp-visibility": MPProductVisibility,
  "mp-featured": MPFeatured,
  "mp-trending": MPTrending,
  "mp-homepage": MPHomepage,
  "mp-banners": MPBanners,
  "mp-reviews": MPReviews,
  "mp-ratings": MPRatings,
  "mp-favorites": MPFavorites,
  "mp-orders": MPOrders,
  "mp-order-items": MPOrderItems,
  "mp-payments": MPPayments,
  "mp-refunds": MPRefunds,
  "mp-user-products": MPUserProducts,
  "mp-licenses": MPLicenses,
  "mp-deployment-logs": MPDeploymentLogs,
  "mp-product-analytics": MPProductAnalytics,
  "mp-demo-views": MPDemoViews,
  "mp-analytics": MPAnalytics,
  "mp-search": MPSearch,
  "mp-recommendations": MPRecommendations,
  "mp-notifications": MPNotifications,
  "mp-audit-logs": MPAuditLogs,
  "mp-settings": MPSettings,
};

interface DemoManagerMainContentProps {
  activeView: string;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const DefaultView = () => (
  <ScrollArea className="h-screen">
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Store className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace Manager</h1>
          <p className="text-sm text-muted-foreground">Select a feature from the sidebar to get started</p>
        </div>
      </div>
      <EmptyState
        icon={<Store className="w-12 h-12" />}
        title="Welcome to Marketplace Manager"
        description="Manage products, orders, analytics, and all marketplace operations from one place. Choose a section from the sidebar."
      />
    </div>
  </ScrollArea>
);

const DemoManagerMainContent = ({ activeView }: DemoManagerMainContentProps) => {
  const Component = VIEW_REGISTRY[activeView];

  if (!Component) {
    return <DefaultView />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
};

export default DemoManagerMainContent;
