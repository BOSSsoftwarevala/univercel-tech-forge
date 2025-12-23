/**
 * Fast Dashboard Layout - Performance Optimized
 * Mobile-first, lazy-loaded, with bottom navigation
 */

import { ReactNode, useState, memo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import MobileOptimizedSidebar from './MobileOptimizedSidebar';
import BottomNavigation from './BottomNavigation';
import CommandHeader from '@/components/layouts/CommandHeader';
import { ResponsiveContainer } from './ResponsiveContainer';

interface FastDashboardLayoutProps {
  children: ReactNode;
  /** Hide header on scroll */
  hideHeaderOnScroll?: boolean;
  /** Show bottom navigation */
  showBottomNav?: boolean;
  /** Custom header */
  header?: ReactNode;
  /** Full width content */
  fluid?: boolean;
}

const FastDashboardLayout = memo(({
  children,
  hideHeaderOnScroll = false,
  showBottomNav = true,
  header,
  fluid = false
}: FastDashboardLayoutProps) => {
  const { loading, userRole } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleOpenSidebar = useCallback(() => setSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  // Simple loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop always visible, Mobile on demand */}
      <MobileOptimizedSidebar
        isOpen={sidebarOpen}
        onOpen={handleOpenSidebar}
        onClose={handleCloseSidebar}
        userRole={userRole}
      />
      
      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-200",
        !isMobile && "ml-64" // Desktop sidebar offset
      )}>
        {/* Header */}
        {header || <CommandHeader />}
        
        {/* Content */}
        <main className={cn(
          "flex-1 overflow-x-hidden",
          isMobile && showBottomNav && "pb-20" // Space for bottom nav
        )}>
          <ResponsiveContainer fluid={fluid} className="py-4 sm:py-6">
            {children}
          </ResponsiveContainer>
        </main>
      </div>
      
      {/* Bottom Navigation - Mobile only */}
      {showBottomNav && (
        <BottomNavigation onMenuClick={handleOpenSidebar} />
      )}
    </div>
  );
});

FastDashboardLayout.displayName = 'FastDashboardLayout';

export default FastDashboardLayout;
