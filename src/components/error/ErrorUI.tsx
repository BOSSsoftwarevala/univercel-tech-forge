import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, FileX, Lock, AlertTriangle, ServerCrash, Clock, Home, ArrowLeft, RefreshCw, LogIn, HelpCircle } from "lucide-react";
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
  code: string;
  iconBgClass: string;
  iconColorClass: string;
}

const errorConfigs: Record<ErrorType, ErrorConfig> = {
  "access-denied": {
    icon: <ShieldX className="w-10 h-10" />,
    title: "Access Restricted",
    message: "You do not have permission to view this section.",
    code: "403-ACCESS-DENIED",
    iconBgClass: "from-amber-500/20 to-orange-500/20",
    iconColorClass: "text-amber-500",
  },
  "page-not-found": {
    icon: <FileX className="w-10 h-10" />,
    title: "Page Not Available",
    message: "The page you are trying to access does not exist or is disabled.",
    code: "404-PAGE-NOT-FOUND",
    iconBgClass: "from-slate-500/20 to-gray-500/20",
    iconColorClass: "text-slate-400",
  },
  "permission-blocked": {
    icon: <Lock className="w-10 h-10" />,
    title: "Action Not Allowed",
    message: "This action is restricted by system policy.",
    code: "401-PERMISSION-BLOCKED",
    iconBgClass: "from-red-500/20 to-rose-500/20",
    iconColorClass: "text-red-500",
  },
  "data-load-failed": {
    icon: <AlertTriangle className="w-10 h-10" />,
    title: "Data Failed to Load",
    message: "We could not load the required data. Please try again.",
    code: "502-DATA-LOAD-FAILED",
    iconBgClass: "from-yellow-500/20 to-amber-500/20",
    iconColorClass: "text-yellow-500",
  },
  "system-error": {
    icon: <ServerCrash className="w-10 h-10" />,
    title: "Something Went Wrong",
    message: "An unexpected system error occurred.",
    code: "500-SYSTEM-ERROR",
    iconBgClass: "from-violet-500/20 to-purple-500/20",
    iconColorClass: "text-violet-500",
  },
  "session-expired": {
    icon: <Clock className="w-10 h-10" />,
    title: "Session Expired",
    message: "Your session has expired. Please log in again.",
    code: "440-SESSION-EXPIRED",
    iconBgClass: "from-blue-500/20 to-cyan-500/20",
    iconColorClass: "text-blue-500",
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

  const handleRetry = () => {
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
              className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${config.iconBgClass} flex items-center justify-center`}
            >
              <div className={config.iconColorClass}>{config.icon}</div>
            </motion.div>
            <div>
              <CardTitle className="text-xl font-semibold">{config.title}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {customMessage || config.message}
              </p>
              <p className="mt-3 text-xs text-muted-foreground/60 font-mono">
                {config.code}
              </p>
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
