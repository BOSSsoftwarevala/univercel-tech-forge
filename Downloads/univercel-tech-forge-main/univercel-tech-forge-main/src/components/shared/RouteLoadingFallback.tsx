/**
 * Route Loading Fallback Components
 * Provides loading states and fallback UI to prevent blank screens
 */

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Rocket, Activity, AlertCircle, Construction } from "lucide-react";
import { cn } from "@/lib/utils";

// Loading skeleton for data fetching
export const LoadingSkeleton = ({ message = "Loading data..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-8"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  </div>
);

// Coming Soon screen for features under development
export const ComingSoonScreen = ({ 
  featureName,
  description = "This feature is currently under development."
}: { 
  featureName: string;
  description?: string;
}) => (
  <div className="min-h-full w-full flex items-center justify-center bg-background">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-12 max-w-md"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40">
        <Rocket className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Coming Soon
      </h2>
      <p className="text-base mb-6 text-muted-foreground">
        The <span className="font-semibold text-primary">{featureName}</span> {description}
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 border border-primary/30">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          Development in Progress
        </span>
      </div>
    </motion.div>
  </div>
);

// Module Loading screen - shown while module initializes
export const ModuleLoadingScreen = ({ moduleName }: { moduleName: string }) => (
  <div className="min-h-full w-full flex items-center justify-center bg-background">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-8"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-transparent border border-border/50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">
        Loading {moduleName}
      </h3>
      <p className="text-sm text-muted-foreground">
        Initializing module components...
      </p>
    </motion.div>
  </div>
);

// Under Configuration screen - for routes that exist but aren't fully set up
export const UnderConfigurationScreen = ({ 
  routeName,
  message = "This section is being configured."
}: { 
  routeName: string;
  message?: string;
}) => (
  <div className="min-h-full w-full flex items-center justify-center bg-background">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-12 max-w-md"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30">
        <Construction className="w-12 h-12 text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Under Configuration
      </h2>
      <p className="text-base mb-4 text-muted-foreground">
        <span className="font-semibold text-amber-400">{routeName}</span>
      </p>
      <p className="text-sm text-muted-foreground mb-6">{message}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30">
        <Activity className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-amber-400">
          Configuration in Progress
        </span>
      </div>
    </motion.div>
  </div>
);

// Route Redirect - Positive messaging for navigation
export const RouteNotFoundScreen = ({ 
  attemptedRoute,
  onGoBack
}: { 
  attemptedRoute?: string;
  onGoBack?: () => void;
}) => {
  const [isRedirecting, setIsRedirecting] = React.useState(true);

  // Auto-redirect after 2 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onGoBack) {
        onGoBack();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [onGoBack]);

  return (
    <div className="min-h-full w-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12 max-w-md"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Redirecting to Your Workspace
        </h2>
        <p className="text-base mb-4 text-muted-foreground">
          We're navigating you to the correct section.
        </p>
        <p className="text-sm text-muted-foreground/70 mb-6">
          Please wait a moment while we align your path.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 border border-primary/30">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Auto-navigation in progress
          </span>
        </div>
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:bg-muted transition-colors text-sm"
          >
            Go to Dashboard Now
          </button>
        )}
      </motion.div>
    </div>
  );
};

// Content area skeleton while loading
export const ContentSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    {/* Header skeleton */}
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-muted"></div>
      <div className="space-y-2">
        <div className="h-6 w-48 bg-muted rounded"></div>
        <div className="h-4 w-32 bg-muted rounded"></div>
      </div>
    </div>
    
    {/* KPI Grid skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-muted"></div>
      ))}
    </div>
    
    {/* Content skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-64 rounded-xl bg-muted"></div>
      <div className="h-64 rounded-xl bg-muted"></div>
    </div>
  </div>
);
