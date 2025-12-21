import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSidebar2035 from './GlobalSidebar2035';
import GlobalHeader2035 from './GlobalHeader2035';
import GlobalFooter2035 from './GlobalFooter2035';
import InternalChatWidget from '../chat/InternalChatWidget';
import { cn } from '@/lib/utils';

interface GlobalLayout2035Props {
  children: ReactNode;
  roleName?: string;
  maskedId?: string;
}

const GlobalLayout2035 = ({ children, roleName = 'Super Admin', maskedId = 'SA-****-7842' }: GlobalLayout2035Props) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lowDataMode, setLowDataMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Check network conditions for low-data mode
  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const checkConnection = () => {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          setLowDataMode(true);
        }
      };
      checkConnection();
      connection.addEventListener('change', checkConnection);
      return () => connection.removeEventListener('change', checkConnection);
    }
  }, []);

  return (
    <div className={cn(
      "min-h-screen w-full flex",
      lowDataMode 
        ? "bg-background" 
        : "bg-gradient-to-br from-[#0a0a1a] via-[#0d1025] to-[#0a0a1a]"
    )}>
      {/* Holographic overlay effect */}
      {!lowDataMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-[150px]" />
        </div>
      )}

      {/* Fixed Left Sidebar */}
      <GlobalSidebar2035 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        lowDataMode={lowDataMode}
      />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Fixed Top Header */}
        <GlobalHeader2035 
          roleName={roleName}
          maskedId={maskedId}
          lowDataMode={lowDataMode}
          onChatToggle={() => setChatOpen(!chatOpen)}
        />

        {/* Central Workspace */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: lowDataMode ? 0 : 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Fixed Global Footer */}
        <GlobalFooter2035 
          lowDataMode={lowDataMode}
          onDataModeToggle={() => setLowDataMode(!lowDataMode)}
        />
      </div>

      {/* Internal Chat Widget - Right Docked */}
      <InternalChatWidget 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)}
        lowDataMode={lowDataMode}
      />
    </div>
  );
};

export default GlobalLayout2035;
