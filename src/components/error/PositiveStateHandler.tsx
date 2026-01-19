/**
 * POSITIVE STATE HANDLER
 * Converts all negative states into positive system responses
 * NO technical errors, NO red screens, NO failure messages
 */

import { motion } from "framer-motion";
import { Settings, Compass, RefreshCw, Loader2, CheckCircle } from "lucide-react";

export type PositiveStateType = 
  | "navigating"
  | "synchronizing" 
  | "optimizing"
  | "preparing"
  | "aligning";

interface PositiveStateConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  subMessage: string;
}

const positiveStates: Record<PositiveStateType, PositiveStateConfig> = {
  navigating: {
    icon: <Compass className="w-8 h-8" />,
    title: "Redirecting to Your Workspace",
    message: "We're navigating you to the correct section.",
    subMessage: "Please wait a moment.",
  },
  synchronizing: {
    icon: <RefreshCw className="w-8 h-8" />,
    title: "Synchronizing Data",
    message: "Data is being synchronized. It will appear shortly.",
    subMessage: "We're aligning things in the background.",
  },
  optimizing: {
    icon: <Settings className="w-8 h-8" />,
    title: "System Optimization in Progress",
    message: "Processing is taking a bit longer than expected.",
    subMessage: "No action required from you.",
  },
  preparing: {
    icon: <Loader2 className="w-8 h-8 animate-spin" />,
    title: "Preparing This Section",
    message: "We're setting things up for you.",
    subMessage: "This will only take a moment.",
  },
  aligning: {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Aligning Your Access",
    message: "This action is handled automatically at a higher level.",
    subMessage: "Your permissions are being configured.",
  },
};

interface PositiveStateUIProps {
  type: PositiveStateType;
  customMessage?: string;
  showSpinner?: boolean;
  autoHide?: boolean;
  onComplete?: () => void;
}

export const PositiveStateUI = ({
  type,
  customMessage,
  showSpinner = true,
  autoHide = false,
  onComplete,
}: PositiveStateUIProps) => {
  const config = positiveStates[type];

  return (
    <div className="min-h-[40vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center text-primary relative">
          {config.icon}
          {showSpinner && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary/20 border-t-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {config.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {customMessage || config.message}
        </p>
        <p className="text-xs text-muted-foreground/70">
          {config.subMessage}
        </p>
      </motion.div>
    </div>
  );
};

// Convenience exports
export const NavigatingUI = (props: Omit<PositiveStateUIProps, "type">) => (
  <PositiveStateUI type="navigating" {...props} />
);

export const SynchronizingUI = (props: Omit<PositiveStateUIProps, "type">) => (
  <PositiveStateUI type="synchronizing" {...props} />
);

export const OptimizingUI = (props: Omit<PositiveStateUIProps, "type">) => (
  <PositiveStateUI type="optimizing" {...props} />
);

export const PreparingUI = (props: Omit<PositiveStateUIProps, "type">) => (
  <PositiveStateUI type="preparing" {...props} />
);

export const AligningUI = (props: Omit<PositiveStateUIProps, "type">) => (
  <PositiveStateUI type="aligning" {...props} />
);

/**
 * Empty State - Positive version
 * Use when no data is available
 */
export const PositiveEmptyState = ({ 
  message = "Data will appear once available" 
}: { 
  message?: string 
}) => (
  <div className="text-center py-8 px-4">
    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/50 flex items-center justify-center">
      <RefreshCw className="w-6 h-6 text-muted-foreground" />
    </div>
    <p className="text-sm text-muted-foreground">{message}</p>
    <p className="text-xs text-muted-foreground/60 mt-1">
      Synchronization in progress
    </p>
  </div>
);

export default PositiveStateUI;
