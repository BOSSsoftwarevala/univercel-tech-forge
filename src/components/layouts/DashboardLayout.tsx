import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import CommandHeader from './CommandHeader';
import RoleSidebar from './RoleSidebar';
import { useAuth } from '@/hooks/useAuth';
import { AppRole } from '@/types/roles';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  roleOverride?: AppRole;
}

const DashboardLayout = ({ children, roleOverride }: DashboardLayoutProps) => {
  const { userRole, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const activeRole = roleOverride || (userRole as AppRole) || 'client';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Global Header */}
      <CommandHeader />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-based Sidebar */}
        <RoleSidebar
          role={activeRole}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
