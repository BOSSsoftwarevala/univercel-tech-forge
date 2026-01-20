/**
 * GlobalBackButton - Persistent back button for all module layouts
 * ZERO UI CHANGE: Navigation fix only - goes back to module home or previous screen
 */

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GlobalBackButtonProps {
  /** Custom back handler - if provided, overrides default navigation */
  onBack?: () => void;
  /** Current active screen within the module */
  activeScreen?: string;
  /** Default/home screen id for the module */
  homeScreen?: string;
  /** Handler to navigate to module home screen */
  onNavigateHome?: () => void;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'sidebar';
  /** Additional class names */
  className?: string;
  /** Show home button alongside back */
  showHome?: boolean;
}

export const GlobalBackButton = ({
  onBack,
  activeScreen,
  homeScreen = 'dashboard',
  onNavigateHome,
  variant = 'default',
  className,
  showHome = true,
}: GlobalBackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're at module home
  const isAtModuleHome = activeScreen === homeScreen || !activeScreen;

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onBack) {
      // Custom handler provided
      onBack();
      return;
    }

    if (!isAtModuleHome && onNavigateHome) {
      // Go to module home first
      onNavigateHome();
      return;
    }

    // Default: navigate to Control Panel
    navigate('/super-admin-system/role-switch?role=boss_owner');
  }, [onBack, isAtModuleHome, onNavigateHome, navigate]);

  // Handle home navigation (Control Panel)
  const handleHome = useCallback(() => {
    navigate('/super-admin-system/role-switch?role=boss_owner');
    toast.info('Returned to Control Panel');
  }, [navigate]);

  // Compact variant for sidebars
  if (variant === 'sidebar') {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-2", className)}>
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all group w-full"
          title={isAtModuleHome ? "Back to Control Panel" : "Back to Module Home"}
        >
          <ArrowLeft className="w-4 h-4 text-primary group-hover:text-primary" />
          <span className="text-sm font-medium text-primary">
            {isAtModuleHome ? 'Control Panel' : 'Back'}
          </span>
        </motion.button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className={cn(
          "w-8 h-8 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group",
          className
        )}
        title={isAtModuleHome ? "Back to Control Panel" : "Back to Module Home"}
      >
        <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
      </motion.button>
    );
  }

  // Default variant with optional home button
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showHome && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
          title="Home (Control Panel)"
        >
          <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
        </motion.button>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 flex items-center justify-center transition-all group"
        title={isAtModuleHome ? "Back to Control Panel" : "Back to Module Home"}
      >
        <ArrowLeft className="w-5 h-5 text-primary group-hover:text-primary" />
      </motion.button>
    </div>
  );
};

export default GlobalBackButton;
