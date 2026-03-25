import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Compass, Shield, RefreshCw as Sync, Zap, Clock, Home, ArrowLeft, RefreshCw, LogIn, HelpCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export type ErrorType = 
  | "access-denied" 
  | "page-not-found" 
  | "permission-blocked" 
  | "data-load-failed" 
  | "system-error" 
  | "session-expired";

interface ErrorConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  subMessage: string;
  iconBgClass: string;
  iconColorClass: string;
  autoRetry: boolean;
}

// POSITIVE SYSTEM RESPONSE TEMPLATES - No technical errors shown to users
const errorConfigs: Record<ErrorType, ErrorConfig> = {
  "access-denied": {
    icon: <Shield className="w-10 h-10" />,
    title: "Redirecting to Your Workspace",
    message: "We're aligning your access permissions.",
    subMessage: "This action is handled automatically at a higher level.",
    iconBgClass: "from-blue-500/20 to-cyan-500/20",
    iconColorClass: "text-blue-500",
    autoRetry: true,
  },
  "page-not-found": {
    icon: <Compass className="w-10 h-10" />,
    title: "Navigating to Correct Section",
    message: "Redirecting you to the correct workspace.",
    subMessage: "The system is finding the best path for you.",
    iconBgClass: "from-primary/20 to-primary/10",
    iconColorClass: "text-primary",
    autoRetry: true,
  },
  "permission-blocked": {
    icon: <Shield className="w-10 h-10" />,
    title: "Access Being Configured",
    message: "This action is handled automatically at a higher level.",
    subMessage: "Your permissions are being aligned.",
    iconBgClass: "from-blue-500/20 to-indigo-500/20",
    iconColorClass: "text-blue-500",
    autoRetry: false,
  },
  "data-load-failed": {
    icon: <Sync className="w-10 h-10" />,
    title: "Synchronizing Data",
    message: "Data is being synchronized. It will appear shortly.",
    subMessage: "We're aligning things in the background.",
    iconBgClass: "from-primary/20 to-primary/10",
    iconColorClass: "text-primary",
    autoRetry: true,
  },
  "system-error": {
    icon: <Settings className="w-10 h-10" />,
    title: "System Optimization in Progress",
    message: "We're aligning things in the background.",
    subMessage: "Processing is taking a bit longer than expected.",
    iconBgClass: "from-primary/20 to-primary/10",
    iconColorClass: "text-primary",
    autoRetry: true,
  },
  "session-expired": {
    icon: <Clock className="w-10 h-10" />,
    title: "Session Refresh Required",
    message: "Your session needs a quick refresh.",
    subMessage: "Please log in to continue your work.",
    iconBgClass: "from-blue-500/20 to-cyan-500/20",
    iconColorClass: "text-blue-500",
    autoRetry: false,
  },
};

interface ErrorUIProps {
  type: ErrorType;
  customMessage?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
  showLoginButton?: boolean;
  showSupportButton?: boolean;
  onRetry?: () => void;
  dashboardPath?: string;
}

export const ErrorUI = ({
  type,
  customMessage,
  showBackButton = true,
  showHomeButton = true,
  showRetryButton = false,
  showLoginButton = false,
  showSupportButton = false,
  onRetry,
  dashboardPath = "/dashboard",
}: ErrorUIProps) => {
  const navigate = useNavigate();
  const config = errorConfigs[type];
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-retry logic for recoverable errors
  useEffect(() => {
    if (config.autoRetry && retryCount < maxRetries) {
      setIsRetrying(true);
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (onRetry) {
          onRetry();
        } else {
          window.location.reload();
        }
      }, 3000); // Silent retry after 3 seconds
    }
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [config.autoRetry, retryCount, onRetry]);

  const handleRetry = () => {
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${config.iconBgClass} flex items-center justify-center relative`}
            >
              <div className={config.iconColorClass}>{config.icon}</div>
              {isRetrying && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            <div>
              <CardTitle className="text-xl font-semibold">{config.title}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {customMessage || config.message}
              </p>
              <p className="mt-2 text-xs text-muted-foreground/70">
                {config.subMessage}
              </p>
              {isRetrying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex items-center justify-center gap-2 text-xs text-primary"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Auto-recovery in progress...</span>
                </motion.div>
              )}
            </div>
          </CardHeader>

          <CardContent />

          <CardFooter className="flex flex-col gap-3">
            {/* Primary Actions */}
            <div className="flex gap-2 w-full">
              {showRetryButton && (
                <Button onClick={handleRetry} className="flex-1 gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              )}
              {showLoginButton && (
                <Button onClick={() => navigate("/auth")} className="flex-1 gap-2">
                  <LogIn className="w-4 h-4" />
                  Login Again
                </Button>
              )}
              {showHomeButton && !showLoginButton && (
                <Button onClick={() => navigate(dashboardPath)} className="flex-1 gap-2">
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              )}
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-2 w-full">
              {showBackButton && (
                <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
              )}
              {showSupportButton && (
                <Button variant="ghost" onClick={() => navigate("/support")} className="flex-1 gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Contact Admin
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

// Convenience exports for specific error types
export const AccessDeniedUI = (props: Omit<ErrorUIProps, "type">) => (
  <ErrorUI type="access-denied" showSupportButton {...props} />
);

export const PageNotFoundUI = (props: Omit<ErrorUIProps, "type">) => (
  <ErrorUI type="page-not-found" {...props} />
);

export const PermissionBlockedUI = (props: Omit<ErrorUIProps, "type">) => (
  <ErrorUI type="permission-blocked" showSupportButton {...props} />
);

export const DataLoadFailedUI = (props: Omit<ErrorUIProps, "type">) => (
  <ErrorUI type="data-load-failed" showRetryButton {...props} />
);

export const SystemErrorUI = (props: Omit<ErrorUIProps, "type">) => (
  <ErrorUI type="system-error" showRetryButton {...props} />
);

export const SessionExpiredUI = (props: Omit<ErrorUIProps, "type">) => (
  <ErrorUI type="session-expired" showLoginButton showHomeButton={false} showBackButton={false} {...props} />
);

export default ErrorUI;
