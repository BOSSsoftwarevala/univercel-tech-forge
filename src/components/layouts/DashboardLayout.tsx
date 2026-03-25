/**
 * Dashboard Layout - Performance Optimized
 * Mobile-first, fast loading, responsive
 * Note: Legacy RoleSidebar removed - use /super-admin-system/role-switch for admin navigation
 */

import { ReactNode, memo } from 'react';
import { Loader2 } from 'lucide-react';
import CommandHeader from './CommandHeader';
import { useAuth } from '@/hooks/useAuth';
import { AppRole } from '@/types/roles';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  roleOverride?: AppRole;
  /** Show bottom navigation on mobile */
  showBottomNav?: boolean;
}

const DashboardLayout = memo(({ 
  children, 
  roleOverride,
  showBottomNav = true 
}: DashboardLayoutProps) => {
  const { userRole, loading } = useAuth();
  
  const activeRole = roleOverride || (userRole as AppRole) || 'client';

  // Fast loading state - no animations
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Global Header */}
      <CommandHeader />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content */}
        <main className={cn("flex-1 overflow-auto")}>
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
