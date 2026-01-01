/**
 * Dashboard Layout - Performance Optimized
 * Mobile-first, fast loading, responsive
 * Note: Legacy RoleSidebar removed - use /super-admin-system/role-switch for admin navigation
 */

import { ReactNode, useState, memo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import CommandHeader from './CommandHeader';
import { useAuth } from '@/hooks/useAuth';
import { AppRole } from '@/types/roles';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import BottomNavigation from '@/components/layout/BottomNavigation';
import MobileOptimizedSidebar from '@/components/layout/MobileOptimizedSidebar';

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
  const isMobile = useIsMobile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const activeRole = roleOverride || (userRole as AppRole) || 'client';

  const handleOpenSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setMobileSidebarOpen(false), []);

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
        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileOptimizedSidebar
            isOpen={mobileSidebarOpen}
            onOpen={handleOpenSidebar}
            onClose={handleCloseSidebar}
            userRole={userRole}
          />
        )}
        
        {/* Content */}
        <main className={cn(
          "flex-1 overflow-auto",
          isMobile && showBottomNav && "pb-20" // Space for bottom nav
        )}>
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Bottom Navigation - Mobile only */}
      {isMobile && showBottomNav && (
        <BottomNavigation onMenuClick={handleOpenSidebar} />
      )}
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
